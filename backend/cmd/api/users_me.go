package main

import "net/http"

func (app *application) showCurrentUserHandler(w http.ResponseWriter, r *http.Request) {
    user := app.contextGetUser(r)      
    app.writeJSON(w, http.StatusOK, envelope{
        "user": user,
    }, nil)
}
