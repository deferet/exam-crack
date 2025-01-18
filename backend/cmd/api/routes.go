package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/rs/cors" // Import for CORS middleware
)

// routes defines application routes and middleware.
func (app *application) routes() http.Handler {
	router := httprouter.New()

	// Define routes.
	router.HandlerFunc("GET", "/v1/healthcheck", app.healthcheckHandler)
	router.HandlerFunc("POST", "/v1/login", app.loginHandler)

	// Apply CORS middleware.
	return app.enableCORS(router)
}

// enableCORS sets up CORS for the application.
func (app *application) enableCORS(next http.Handler) http.Handler {
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"}, // Frontend URL
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})
	return corsHandler.Handler(next)
}
