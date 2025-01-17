package data

import (
	"database/sql"
	"time"

	"github.com/deferet/exam-crack/internal/validator"
	"github.com/google/uuid"
)

type Test struct {
	ID             uuid.UUID `json:"id"`
	CreatorId      uuid.UUID `json:"creatorId"`
	Name           string    `json:"name"`
	Description    string    `json:"description"`
	TimesStarted   int       `json:"timesStarted"`
	TimesCompleted int       `json:"timesCompleted"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}

func ValidateTest(v *validator.Validator, test *Test) {
	v.Check(test.CreatorId.String() != "", "creatorId", "must be provided")

	v.Check(test.Name != "", "name", "must be provided")
	v.Check(len(test.Name) <= 50, "name", "must not be more than 50 characters long")
	v.Check(len(test.Name) >= 3, "name", "must be at least 3 characters long")

	v.Check(len(test.Description) <= 500, "description", "must not be more than 500 characters long")

	v.Check(test.TimesStarted >= 0, "timesStarted", "must be a positive integer")

	v.Check(test.TimesCompleted >= 0, "timesCompleted", "must be a positive integer")
	v.Check(test.TimesCompleted >= test.TimesStarted, "timesCompleted", "must be greater than or equal to timesStarted")

	v.Check(!test.CreatedAt.IsZero(), "createdAt", "must be provided")

	v.Check(!test.UpdatedAt.IsZero(), "updatedAt", "must be provided")
	v.Check(test.UpdatedAt.Before(test.CreatedAt), "updatedAt", "must be after createdAt")
}

type TestModel struct {
	DB *sql.DB
}
