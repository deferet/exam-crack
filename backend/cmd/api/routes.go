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
	router.HandlerFunc("POST", "/v1/tests", app.createTestHandler)
	// TODO - Add panic recovery middleware
	return router
}
