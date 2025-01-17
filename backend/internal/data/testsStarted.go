package data

import (
	"database/sql"
	"time"

	"github.com/deferet/exam-crack/internal/validator"
	"github.com/google/uuid"
)

type TestStarted struct {
	ID        uuid.UUID `json:"id"`
	UserId    uuid.UUID `json:"userId"`
	TestId    uuid.UUID `json:"testId"`
	Progress  int       `json:"progress"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// TODO: Add a Validate method to validate the data before it is saved to the database.
func ValidateMovie(v *validator.Validator, testStarted *TestStarted) {
	v.Check(testStarted.UserId.String() != "", "id", "must be provided")
}

type TestStartedModel struct {
	DB *sql.DB
}
