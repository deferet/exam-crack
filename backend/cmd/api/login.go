package main

import (
    "database/sql"
    "encoding/json"
    "errors"
    "net/http"

    "golang.org/x/crypto/bcrypt"
)

func (app *application) loginHandler(w http.ResponseWriter, r *http.Request) {
    var input struct {
        Email    string `json:"email"`
        Password string `json:"password"`
    }

    // Dekoduj dane JSON z żądania
    err := json.NewDecoder(r.Body).Decode(&input)
    if err != nil {
        app.writeJSON(w, http.StatusBadRequest, envelope{"error": "Invalid request payload"}, nil)
        return
    }

    // Pobierz użytkownika z bazy danych
    var hashedPassword []byte
    var username string

    query := `SELECT hashed_password, username FROM users WHERE email = $1`
    err = app.db.QueryRow(query, input.Email).Scan(&hashedPassword, &username)
    if err != nil {
        if errors.Is(err, sql.ErrNoRows) {
            app.writeJSON(w, http.StatusUnauthorized, envelope{"error": "Invalid credentials"}, nil)
        } else {
            app.writeJSON(w, http.StatusInternalServerError, envelope{"error": "Server error"}, nil)
        }
        return
    }

    // Porównaj hasło
    err = bcrypt.CompareHashAndPassword(hashedPassword, []byte(input.Password))
    if err != nil {
        app.writeJSON(w, http.StatusUnauthorized, envelope{"error": "Invalid credentials"}, nil)
        return
    }

    // Sukces: odpowiedz danymi użytkownika
    data := envelope{"message": "Login successful", "username": username}
    err = app.writeJSON(w, http.StatusOK, data, nil)
    if err != nil {
        app.logger.Error(err.Error())
        http.Error(w, "Failed to send response", http.StatusInternalServerError)
    }
}
