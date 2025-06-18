package main

import (
	"database/sql"
	"errors"
	"net/http"
	"time"

	"github.com/deferet/exam-crack/internal/data"
	"github.com/deferet/exam-crack/internal/validator"
	"github.com/google/uuid"
)

func (app *application) createTestHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		CreatorId   uuid.UUID `json:"creatorId"`
		Name        string    `json:"name"`
		Description string    `json:"description"`
		Categories  []string  `json:"categories"`
	}

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	description := sql.NullString{String: input.Description, Valid: input.Description != ""}

	test := &data.Test{
		ID:             uuid.New(),
		CreatorId:      input.CreatorId,
		Name:           input.Name,
		Description:    description,
		TimesStarted:   0,
		TimesCompleted: 0,
		CreatedAt:      time.Now().UTC(),
		UpdatedAt:      time.Now().UTC(),
		Categories:     input.Categories,
	}

	v := validator.New()

	if data.ValidateTest(v, test); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Tests.Insert(test)
	if err != nil {
		if err == data.ErrDuplicateName {
			v.AddError("name", "a test with this name already exists")
			app.failedValidationResponse(w, r, v.Errors)
		} else {
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	headers := make(http.Header)
	headers.Set("Location", "/v1/tests/"+test.ID.String())

	err = app.writeJSON(w, http.StatusCreated, envelope{"test": test}, headers)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) showTestHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.badRequestResponse(w, r, err)
	}

	test, err := app.models.Tests.GetById(id)
	if err != nil {
		if errors.Is(err, data.ErrRecordNotFound) {
			app.badRequestResponse(w, r, err)
		} else {
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"test": test}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) listTestsHandler(w http.ResponseWriter, r *http.Request) {
	tests, err := app.models.Tests.GetAll()
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"tests": tests}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
