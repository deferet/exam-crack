package data

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/deferet/exam-crack/internal/validator"
	"github.com/google/uuid"
	"github.com/lib/pq"
)

var (
	ErrDuplicateName = errors.New("duplicate name")
)

type Test struct {
	ID             uuid.UUID      `json:"id"`
	CreatorId      uuid.UUID      `json:"creatorId"`
	Name           string         `json:"name"`
	Description    sql.NullString `json:"description"`
	TimesStarted   int            `json:"timesStarted"`
	TimesCompleted int            `json:"timesCompleted"`
	Categories     []string       `json:"categories"`
	CreatedAt      time.Time      `json:"createdAt"`
	UpdatedAt      time.Time      `json:"updatedAt"`
}

func ValidateTest(v *validator.Validator, test *Test) {
	v.Check(test.CreatorId.String() != "", "creatorId", "must be provided")

	v.Check(test.Name != "", "name", "must be provided")
	v.Check(len(test.Name) <= 50, "name", "must not be more than 50 characters long")
	v.Check(len(test.Name) >= 3, "name", "must be at least 3 characters long")

	v.Check(len(test.Description.String) <= 500, "description", "must not be more than 500 characters long")

	v.Check(test.TimesStarted >= 0, "timesStarted", "must be a positive integer")

	v.Check(test.TimesCompleted >= 0, "timesCompleted", "must be a positive integer")
	v.Check(test.TimesCompleted >= test.TimesStarted, "timesCompleted", "must be greater than or equal to timesStarted")

	v.Check(!test.CreatedAt.IsZero(), "createdAt", "must be provided")

	v.Check(!test.UpdatedAt.IsZero(), "updatedAt", "must be provided")
	v.Check(test.UpdatedAt.After(test.CreatedAt), "updatedAt", "must be after createdAt")

	v.Check(len(test.Categories) > 0, "categories", "must contain at least one category")
	v.Check(len(test.Categories) <= 5, "categories", "must not contain more than 5 categories")
}

type TestModel struct {
	DB *sql.DB
}

func (m TestModel) Insert(test *Test) error {
	query := `
		INSERT INTO tests (creator_id, name, description, times_started, times_completed, categories, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`

	args := []any{
		test.CreatorId,
		test.Name,
		test.Description,
		test.TimesStarted,
		test.TimesCompleted,
		pq.Array(test.Categories),
		test.CreatedAt,
		test.UpdatedAt,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, args...).Err()
	if err != nil {
		if err.Error() == "pq: duplicate key value violates unique constraint \"tests_name_key\"" {
			return ErrDuplicateName
		}
		return err
	}

	return nil
}

func (m TestModel) GetById(id uuid.UUID) (*Test, error) {
	test := &Test{}

	query := `
		SELECT id, creator_id, name, description, times_started, times_completed, categories, created_at, updated_at
		FROM tests
		WHERE id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, id).Scan(
		&test.ID,
		&test.CreatorId,
		&test.Name,
		&test.Description,
		&test.TimesCompleted,
		&test.TimesStarted,
		pq.Array(&test.Categories),
		&test.CreatedAt,
		&test.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrRecordNotFound
		}

		return nil, err
	}

	return test, nil
}

func (m TestModel) GetAll() ([]*Test, error) {
	tests := []*Test{}

	query := `
		SELECT id, creator_id, name, description, times_started, times_completed, categories, created_at, updated_at
		FROM tests`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		test := &Test{}

		err := rows.Scan(
			&test.ID,
			&test.CreatorId,
			&test.Name,
			&test.Description,
			&test.TimesStarted,
			&test.TimesCompleted,
			pq.Array(&test.Categories),
			&test.CreatedAt,
			&test.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		tests = append(tests, test)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return tests, nil
}

func (m TestModel) Update(test *Test) error {
	query := `
		UPDATE tests
		SET name = $1, description = $2, times_started = $3, times_completed = $4, categories = $5, updated_at = $6
		WHERE id = $6
		RETURNING updated_at`

	args := []any{
		test.Name,
		test.Description,
		test.TimesStarted,
		test.TimesCompleted,
		pq.Array(&test.Categories),
		test.UpdatedAt,
		test.ID,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, args...).Scan(&test.UpdatedAt)
	if err != nil {
		if err.Error() == "pq: duplicate key value violates unique constraint \"tests_name_key\"" {
			return ErrDuplicateName
		} else if err.Error() == "sql: no rows in result set" {
			return ErrEditConflict
		}
		return err
	}

	return nil
}

func (m TestModel) Delete(id uuid.UUID) error {
	query := `
        DELETE FROM movies
        WHERE id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	result, err := m.DB.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return ErrRecordNotFound
	}

	return nil
}
