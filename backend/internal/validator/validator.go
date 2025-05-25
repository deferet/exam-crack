// Package validator provides utility functions for validating data, checking permitted values,
// matching regular expressions, and ensuring uniqueness of values in slices.
// It includes a Validator struct to collect validation errors and methods to check conditions
// and add errors to the Validator. It also provides a regular expression for validating email addresses.
package validator

import (
	"regexp"
	"slices"
)

var (
	EmailRX = regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
)

// Validator is a struct that holds validation errors.
// It contains a map where keys are error identifiers and values are error messages.
type Validator struct {
	Errors map[string]string
}

// New creates a new Validator instance with an empty Errors map.

func New() *Validator {
	return &Validator{Errors: make(map[string]string)}
}

// Valid checks if the Validator has any errors.
// It returns true if there are no errors, false otherwise.
func (v *Validator) Valid() bool {
	return len(v.Errors) == 0
}

// AddError adds a new error to the Validator's Errors map.
// It only adds the error if the key does not already exist in the map.
func (v *Validator) AddError(key, message string) {
	if _, exists := v.Errors[key]; !exists {
		v.Errors[key] = message
	}
}

// Check checks a condition and adds an error to the Validator if the condition is false.
// It takes a boolean ok, a key for the error, and a message to describe the error.
// If ok is false, it calls AddError with the provided key and message.
func (v *Validator) Check(ok bool, key, message string) {
	if !ok {
		v.AddError(key, message)
	}
}

// PermittedValue checks if a given value is in the list of permitted values.
// It returns true if the value is found in the permittedValues slice, false otherwise.
func PermittedValue[T comparable](value T, permittedValues ...T) bool {
	return slices.Contains(permittedValues, value)
}

// Matches checks if a given value matches a regular expression.
// It returns true if the value matches the regular expression, false otherwise.
func Matches(value string, rx *regexp.Regexp) bool {
	return rx.MatchString(value)
}

// Unique checks if all values in a slice are unique.
// It return true if all values are unique, false if there are duplicates.
func Unique[T comparable](values []T) bool {
	uniqueValues := make(map[T]bool)

	for _, value := range values {
		uniqueValues[value] = true
	}

	return len(values) == len(uniqueValues)
}
