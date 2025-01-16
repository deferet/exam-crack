package data

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
)

type Test struct {
	ID        uuid.UUID `json:"id"`
	UserId    uuid.UUID `json:"userId"`
	TestId    uuid.UUID `json:"testId"`
	Progress  int       `json:"progress"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type TestModel struct {
	DB *sql.DB
}
