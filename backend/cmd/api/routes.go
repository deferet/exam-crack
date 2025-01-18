package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)



// Function routes is used to define the application routes.
// It returns an http.Handler interface which the server can use to listen for incoming HTTP requests.

func (app *application) routes() http.Handler {
    router := httprouter.New()

    router.HandlerFunc("GET", "/v1/healthcheck", app.healthcheckHandler)
    router.HandlerFunc("POST", "/v1/login", app.loginHandler)

    // Zastosuj middleware CORS
    corsHandler := app.enableCORS(router)
    return corsHandler
}


func (app *application) enableCORS(next http.Handler) http.Handler {
    corsHandler := cors.New(cors.Options{
        AllowedOrigins:   []string{"http://localhost:5173"}, // Frontend URL
        AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowedHeaders:   []string{"Authorization", "Content-Type"},
        AllowCredentials: true,
    })

    return corsHandler.Handler(next)