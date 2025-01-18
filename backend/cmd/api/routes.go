package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

// Function routes is used to define the application routes.
// It returns an http.Handler interface which the server can use to listen for incoming HTTP requests.
func (app *application) routes() http.Handler {
	router := httprouter.New()

	router.HandlerFunc(http.MethodGet, "/v1/healthcheck", app.healthcheckHandler)

	router.HandlerFunc(http.MethodPost, "/v1/tests", app.createTestHandler)
	router.HandlerFunc(http.MethodGet, "/v1/tests/:id", app.showTestHandler)
	router.HandlerFunc(http.MethodGet, "/v1/tests", app.listTestsHandler)

	router.HandlerFunc(http.MethodPost, "/v1/users", app.registerUserHandler)
	router.HandlerFunc(http.MethodPut, "/v1/users/:id", app.updateUserPasswordHandler)

	// TODO - Add panic recovery middleware
	return router
}
