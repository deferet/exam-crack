package data

import (
    "context"
    "database/sql"
    "time"

    "github.com/google/uuid"
)

type Question struct {
    ID        uuid.UUID `json:"id"`
    TestID    uuid.UUID `json:"testId"`
    Question  string    `json:"question"`
    Type      string    `json:"type"`
    CreatedAt time.Time `json:"createdAt"`
    UpdatedAt time.Time `json:"updatedAt"`
}

type QuestionModel struct {
    DB *sql.DB
}

func (m QuestionModel) Insert(q *Question) error {
    query := `
      INSERT INTO questions (id, test_id, question, type, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6)`
    args := []any{
        q.ID, q.TestID, q.Question, q.Type, q.CreatedAt, q.UpdatedAt,
    }

    ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
    defer cancel()

    return m.DB.QueryRowContext(ctx, query, args...).Err()
}

func (m QuestionModel) GetAllByTestID(testID uuid.UUID) ([]*Question, error) {
    query := `
      SELECT id, test_id, question, type, created_at, updated_at
      FROM questions
      WHERE test_id = $1
      ORDER BY created_at`
    ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
    defer cancel()

    rows, err := m.DB.QueryContext(ctx, query, testID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var qs []*Question
    for rows.Next() {
        q := &Question{}
        if err := rows.Scan(
            &q.ID, &q.TestID, &q.Question, &q.Type, &q.CreatedAt, &q.UpdatedAt,
        ); err != nil {
            return nil, err
        }
        qs = append(qs, q)
    }
    return qs, rows.Err()
}
