package data

import (
    "context"
    "database/sql"
    "time"

    "github.com/google/uuid"
)

type Answer struct {
    ID         uuid.UUID `json:"id"`
    QuestionID uuid.UUID `json:"questionId"`
    Content    string    `json:"content"`
    Correct    bool      `json:"correct"`
    CreatedAt  time.Time `json:"createdAt"`
    UpdatedAt  time.Time `json:"updatedAt"`
}

type AnswerModel struct {
    DB *sql.DB
}

func (m AnswerModel) Insert(a *Answer) error {
    query := `
      INSERT INTO answers (id, question_id, content, correct, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6)`
    args := []any{
        a.ID, a.QuestionID, a.Content, a.Correct, a.CreatedAt, a.UpdatedAt,
    }

    ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
    defer cancel()

    return m.DB.QueryRowContext(ctx, query, args...).Err()
}

func (m AnswerModel) GetAllByQuestionID(questionID uuid.UUID) ([]*Answer, error) {
    query := `
      SELECT id, question_id, content, correct, created_at, updated_at
      FROM answers
      WHERE question_id = $1
      ORDER BY created_at`
    ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
    defer cancel()

    rows, err := m.DB.QueryContext(ctx, query, questionID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var list []*Answer
    for rows.Next() {
        a := &Answer{}
        if err := rows.Scan(
            &a.ID, &a.QuestionID, &a.Content, &a.Correct, &a.CreatedAt, &a.UpdatedAt,
        ); err != nil {
            return nil, err
        }
        list = append(list, a)
    }
    return list, rows.Err()
}
