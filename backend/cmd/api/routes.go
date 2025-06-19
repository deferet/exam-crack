package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

// routes builds the whole routing table and returns http.Handler
func (app *application) routes() http.Handler {
	router := httprouter.New()

	// ------------------------------------------------------------
	// 1) Public endpoints (no authentication required)
	// ------------------------------------------------------------

	// Basic health-check
	router.HandlerFunc(http.MethodGet, "/v1/healthcheck", app.healthcheckHandler)

	// Register new user
	router.HandlerFunc(http.MethodPost, "/v1/users", app.registerUserHandler)

	// Account activation (token in JSON)
	router.HandlerFunc(http.MethodPut, "/v1/users/activated", app.activateUserHandler)

	// JWT authentication token
	router.HandlerFunc(http.MethodPost, "/v1/tokens/authentication", app.createAutheticationTokenHandler)

	// ------------------------------------------------------------
	// 2) Endpoints that require a logged-in *and activated* user
	// ------------------------------------------------------------

	// Create a new test
	router.Handler(http.MethodPost,
		"/v1/tests",
		app.authenticate(app.requireActivatedUser(http.HandlerFunc(app.createTestHandler))),
	)

	// List all tests of the current user
	router.Handler(http.MethodGet,
		"/v1/tests",
		app.authenticate(app.requireActivatedUser(http.HandlerFunc(app.listTestsHandler))),
	)

	// Get single test with questions/answers
	router.Handler(http.MethodGet,
		"/v1/tests/:id",
		app.authenticate(app.requireActivatedUser(http.HandlerFunc(app.showTestHandler))),
	)

	// Update test meta-data
	router.Handler(http.MethodPut,
		"/v1/tests/:id",
		app.authenticate(app.requireActivatedUser(http.HandlerFunc(app.updateTestHandler))),
	)

	// Delete a test
	router.Handler(http.MethodDelete,
		"/v1/tests/:id",
		app.authenticate(app.requireActivatedUser(http.HandlerFunc(app.deleteTestHandler))),
	)

	// Replace all questions in a test
	router.Handler(http.MethodPut,
		"/v1/tests/:id/questions",
		app.authenticate(app.requireActivatedUser(http.HandlerFunc(app.replaceQuestionsHandler))),
	)

	// Change own password (current + new)
	router.Handler(http.MethodPut,
		"/v1/users/password",
		app.authenticate(app.requireActivatedUser(http.HandlerFunc(app.changeOwnPasswordHandler))),
	)

	// Get current user profile
	router.Handler(http.MethodGet,
		"/v1/users/me",
		app.authenticate(http.HandlerFunc(app.showCurrentUserHandler)),
	)

	// ------------------------------------------------------------
	// 3) Password reset (no login, token comes from e-mail link)
	// ------------------------------------------------------------

	router.Handler(http.MethodPut,
		"/v1/users/password/reset",
		http.HandlerFunc(app.updateUserPasswordHandler), // no authenticate
	)

	// ------------------------------------------------------------
	// 4) Global middleware
	// ------------------------------------------------------------
	// Apply CORS and a *second* authenticate to also cover OPTIONS
	return app.corsEnabled(app.authenticate(router))
}
