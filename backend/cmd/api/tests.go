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
    // struktura wejściowa z pytaniami i odpowiedziami
    var input struct {
        Name         string   `json:"name"`
        Description  string   `json:"description"`
        Categories   []string `json:"categories"`
        Questions    []struct {
        Question      string   `json:"question"`
        CorrectAnswer string   `json:"answer"`
        WrongAnswers  []string `json:"wrongAnswers"`
        } `json:"questions"`
    }

    if err := app.readJSON(w, r, &input); err != nil {
        app.badRequestResponse(w, r, err)
        return
    }

    // budujemy główny obiekt Test
    description := sql.NullString{String: input.Description, Valid: input.Description != ""}
    test := &data.Test{
        ID:             uuid.New(),
        CreatorId:      app.contextGetUser(r).ID,
        Name:           input.Name,
        Description:    description,
        Categories:     input.Categories,
        TimesStarted:   0,
        TimesCompleted: 0,
        CreatedAt:      time.Now().UTC(),
        UpdatedAt:      time.Now().UTC(),
    }

    // walidacja testu bez pytań
    v := validator.New()
    data.ValidateTest(v, test)
    if !v.Valid() {
        app.failedValidationResponse(w, r, v.Errors)
        return
    }

    // zapisujemy test
    if err := app.models.Tests.Insert(test); err != nil {
        if errors.Is(err, data.ErrDuplicateName) {
            v.AddError("name", "a test with this name already exists")
            app.failedValidationResponse(w, r, v.Errors)
        } else {
            app.serverErrorResponse(w, r, err)
        }
        return
    }

    // teraz zapisz pytania i odpowiedzi
    for _, q := range input.Questions {
        question := &data.Question{
            ID:        uuid.New(),
            TestID:    test.ID,
            Question:  q.Question,
			Type:      "multiple-choice",
            CreatedAt: time.Now().UTC(),
            UpdatedAt:      time.Now().UTC().Add(1 * time.Nanosecond),
        }
        if err := app.models.Questions.Insert(question); err != nil {
            app.serverErrorResponse(w, r, err)
            return
        }
        // poprawna odpowiedź
        correctAns := &data.Answer{
            ID:         uuid.New(),
            QuestionID: question.ID,
            Content:    q.CorrectAnswer,
            Correct:    true,
            CreatedAt:  time.Now().UTC(),
            UpdatedAt:  time.Now().UTC(),
        }
        if err := app.models.Answers.Insert(correctAns); err != nil {
            app.serverErrorResponse(w, r, err)
            return
        }
        // niepoprawne odpowiedzi
        for _, wa := range q.WrongAnswers {
            wrong := &data.Answer{
                ID:         uuid.New(),
                QuestionID: question.ID,
                Content:    wa,
                Correct:    false,
                CreatedAt:  time.Now().UTC(),
                UpdatedAt:  time.Now().UTC(),
            }
            if err := app.models.Answers.Insert(wrong); err != nil {
                app.serverErrorResponse(w, r, err)
                return
            }
        }
    }

    // zwracamy cały test (meta + pytania z inputu)
    headers := make(http.Header)
    headers.Set("Location", "/v1/tests/"+test.ID.String())
    app.writeJSON(w, http.StatusCreated, envelope{
        "test":      test,
        "questions": input.Questions,
    }, headers)
}

func (app *application) listTestsHandler(w http.ResponseWriter, r *http.Request) {
    user := app.contextGetUser(r)
    tests, err := app.models.Tests.GetAllByCreator(user.ID)
    if err != nil {
        app.serverErrorResponse(w, r, err)
        return
    }

    type fullTest struct {
        *data.Test
        Questions []struct {
            data.Question
            Answers []*data.Answer `json:"answers"`
        } `json:"questions"`
    }
    var resp []fullTest

    for _, t := range tests {
        qlist, err := app.models.Questions.GetAllByTestID(t.ID)
        if err != nil {
            app.serverErrorResponse(w, r, err)
            return
        }
        fq := []struct {
            data.Question
            Answers []*data.Answer `json:"answers"`
        }{}
        for _, q := range qlist {
            alist, err := app.models.Answers.GetAllByQuestionID(q.ID)
            if err != nil {
                app.serverErrorResponse(w, r, err)
                return
            }
            fq = append(fq, struct {
                data.Question
                Answers []*data.Answer `json:"answers"`
            }{Question: *q, Answers: alist})
        }
        resp = append(resp, fullTest{Test: t, Questions: fq})
    }

    app.writeJSON(w, http.StatusOK, envelope{"tests": resp}, nil)
}

func (app *application) showTestHandler(w http.ResponseWriter, r *http.Request) {
    id, err := app.readIDParam(r)
    if err != nil {
        app.badRequestResponse(w, r, err)
        return
    }
    t, err := app.models.Tests.GetById(id)
    if err != nil {
        if errors.Is(err, data.ErrRecordNotFound) {
            app.notFoundResponse(w, r)
        } else {
            app.serverErrorResponse(w, r, err)
        }
        return
    }

    qlist, _ := app.models.Questions.GetAllByTestID(t.ID)
    type fullTest struct {
        *data.Test
        Questions []struct {
            data.Question
            Answers []*data.Answer `json:"answers"`
        } `json:"questions"`
    }
    fq := []struct {
        data.Question
        Answers []*data.Answer `json:"answers"`
    }{}
    for _, q := range qlist {
        alist, _ := app.models.Answers.GetAllByQuestionID(q.ID)
        fq = append(fq, struct {
            data.Question
            Answers []*data.Answer `json:"answers"`
        }{Question: *q, Answers: alist})
    }

    app.writeJSON(w, http.StatusOK, envelope{"test": fullTest{Test: t, Questions: fq}}, nil)
}

// ----------------------
// Dodane metody update i delete
// ----------------------

func (app *application) updateTestHandler(w http.ResponseWriter, r *http.Request) {
    id, err := app.readIDParam(r)
    if err != nil {
        app.badRequestResponse(w, r, err)
        return
    }

    var input struct {
        Name        *string   `json:"name"`
        Description *string   `json:"description"`
        Categories  *[]string `json:"categories"`
    }
    if err := app.readJSON(w, r, &input); err != nil {
        app.badRequestResponse(w, r, err)
        return
    }

    test, err := app.models.Tests.GetById(id)
    if err != nil {
        if errors.Is(err, data.ErrRecordNotFound) {
            app.notFoundResponse(w, r)
        } else {
            app.serverErrorResponse(w, r, err)
        }
        return
    }

    if input.Name != nil {
        test.Name = *input.Name
    }
    if input.Description != nil {
        test.Description = sql.NullString{String: *input.Description, Valid: *input.Description != ""}
    }
    if input.Categories != nil {
        test.Categories = *input.Categories
    }
    test.UpdatedAt = time.Now().UTC()

    v := validator.New()
    data.ValidateTest(v, test)
    if !v.Valid() {
        app.failedValidationResponse(w, r, v.Errors)
        return
    }

    if err := app.models.Tests.Update(test); err != nil {
        switch {
        case errors.Is(err, data.ErrDuplicateName):
            v.AddError("name", "a test with this name already exists")
            app.failedValidationResponse(w, r, v.Errors)
        case errors.Is(err, data.ErrEditConflict):
            app.editConflictResponse(w, r)
        default:
            app.serverErrorResponse(w, r, err)
        }
        return
    }

    app.writeJSON(w, http.StatusOK, envelope{"test": test}, nil)
}

func (app *application) deleteTestHandler(w http.ResponseWriter, r *http.Request) {
    id, err := app.readIDParam(r)
    if err != nil {
        app.badRequestResponse(w, r, err)
        return
    }

    if err := app.models.Tests.Delete(id); err != nil {
        if errors.Is(err, data.ErrRecordNotFound) {
            app.notFoundResponse(w, r)
        } else {
            app.serverErrorResponse(w, r, err)
        }
        return
    }

    w.WriteHeader(http.StatusNoContent)
}


func (app *application) replaceQuestionsHandler(w http.ResponseWriter, r *http.Request) {
    testID, err := app.readIDParam(r)
    if err != nil {
        app.badRequestResponse(w, r, err)
        return
    }

    // ---------- odczyt JSON ----------
    var input struct {
        Questions []struct {
            Question     string   `json:"question"`
            Answer       string   `json:"answer"`
            WrongAnswers []string `json:"wrongAnswers"`
        } `json:"questions"`
    }
    if err := app.readJSON(w, r, &input); err != nil {
        app.badRequestResponse(w, r, err)
        return
    }

    // ---------- transakcja ----------
    tx, err := app.models.Tests.DB.Begin()
    if err != nil {
        app.serverErrorResponse(w, r, err)
        return
    }
    defer tx.Rollback()

    // 1) usuń stare pytania (answers znikną dzięki ON DELETE CASCADE)
    if _, err := tx.Exec(`DELETE FROM questions WHERE test_id = $1`, testID); err != nil {
        app.serverErrorResponse(w, r, err)
        return
    }

    // 2) dodaj nowe pytania + odpowiedzi
    now := time.Now().UTC()

    for _, q := range input.Questions {
        qID := uuid.New()

        // pytanie
        if _, err := tx.Exec(
            `INSERT INTO questions (id, test_id, question, type, created_at, updated_at)
             VALUES ($1,$2,$3,$4,$5,$6)`,
            qID, testID, q.Question, "multiple-choice", now, now,
        ); err != nil {
            app.serverErrorResponse(w, r, err)
            return
        }

        // poprawna odpowiedź
        if _, err := tx.Exec(
            `INSERT INTO answers (id, question_id, content, correct, created_at, updated_at)
             VALUES ($1,$2,$3,$4,$5,$6)`,
            uuid.New(), qID, q.Answer, true, now, now,
        ); err != nil {
            app.serverErrorResponse(w, r, err)
            return
        }

        // błędne odpowiedzi
        for _, wa := range q.WrongAnswers {
            if _, err := tx.Exec(
                `INSERT INTO answers (id, question_id, content, correct, created_at, updated_at)
                 VALUES ($1,$2,$3,$4,$5,$6)`,
                uuid.New(), qID, wa, false, now, now,
            ); err != nil {
                app.serverErrorResponse(w, r, err)
                return
            }
        }
    }

    // ---------- commit ----------
    if err := tx.Commit(); err != nil {
        app.serverErrorResponse(w, r, err)
        return
    }

    app.writeJSON(w, http.StatusOK, envelope{"status": "questions updated"}, nil)
}
