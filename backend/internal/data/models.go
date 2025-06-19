package data

import (
	"database/sql"
	"errors"

)

var (
	ErrRecordNotFound = errors.New("record not found")
	ErrEditConflict   = errors.New("edit conflict")
)

type Models struct {
	Tests TestModel
    Questions QuestionModel
    Answers AnswerModel
	Users  UserModel
	Tokens TokenModel
}

func NewModels(db *sql.DB) Models {
	return Models{
		Tests:      TestModel{DB: db},
        Questions:  QuestionModel{DB: db},
        Answers:    AnswerModel{DB: db},
		Users:  UserModel{DB: db},
		Tokens: TokenModel{DB: db},
	}
}
