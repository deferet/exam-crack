package main

import (
	"net/http"

	"github.com/deferet/exam-crack/internal/data"
	"github.com/deferet/exam-crack/internal/validator"
	"github.com/google/uuid"
)

func (app *application) createTestHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		CreatorId   uuid.UUID `json:"creatorId"`
		Name        string    `json:"name"`
		Description string    `json:"description"`
	}

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	test := &data.Test{
		CreatorId:   input.CreatorId,
		Name:        input.Name,
		Description: input.Description,
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
