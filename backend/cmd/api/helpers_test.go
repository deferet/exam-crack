package main

import (
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestWriteJson(t *testing.T) {
	app := &application{}

	tests := []struct {
		name    string
		w       *httptest.ResponseRecorder
		status  int
		data    envelope
		headers http.Header
		want    string
	}{
		{
			name:   "Valid",
			w:      httptest.NewRecorder(),
			status: http.StatusOK,
			data: envelope{
				"status":  "success",
				"message": "Test message",
			},
			headers: http.Header{
				"X-Test": []string{"test"},
			},
			want: "{\n\t\"message\": \"Test message\",\n\t\"status\": \"success\"\n}\n",
		},
		{
			name:    "Empty",
			w:       httptest.NewRecorder(),
			status:  http.StatusOK,
			data:    envelope{},
			headers: http.Header{},
			want:    "{}\n",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := app.writeJSON(tt.w, tt.status, tt.data, tt.headers)
			if err != nil {
				t.Errorf("want: nil; got: %v", err)
			}

			if tt.w.Code != tt.status {
				t.Errorf("want: %d; got: %d", tt.status, tt.w.Code)
			}

			if tt.w.Body.String() != tt.want {
				t.Errorf("want: %s; got: %s", tt.want, tt.w.Body.String())
			}

			for key, values := range tt.headers {
				if tt.w.Header().Get(key) != values[0] {
					t.Errorf("want: %s; got: %s", values[0], tt.w.Header().Get(key))
				}
			}
		})
	}
}

func TestReadJSON(t *testing.T) {
	app := &application{}

	type user struct {
		Name    string `json:"name"`
		Surname string `json:"surname"`
		Age     int    `json:"age"`
	}
	type userTestCase struct {
		user user
		err  error
	}

	tests := []struct {
		name string
		body string
		dst  any
		want userTestCase
	}{
		{
			name: "Valid body",
			body: `{"name":"John","surname":"Doe","age":21}`,
			dst:  &user{},
			want: userTestCase{
				user: user{
					Name:    "John",
					Surname: "Doe",
					Age:     21,
				},
				err: nil,
			},
		},
		{
			name: "Empty body",
			body: `{}`,
			dst:  &user{},
			want: userTestCase{
				user: user{},
				err:  errors.New("request body must not be empty"),
			},
		},
		{
			name: "Incorrect JSON syntax (unexpected EOF)",
			body: `{"name":"John","surname":"Doe","age":21`,
			dst:  &user{},
			want: userTestCase{
				user: user{},
				err:  errors.New("request body contains badly-formed JSON"),
			},
		},
		{
			name: "Incorrect JSON syntax (invalid character)",
			body: `{"name":"John","surname":"Doe","age":21,}`,
			dst:  &user{},
			want: userTestCase{
				user: user{},
				err:  errors.New("request body contains badly-formed JSON (at character 41)"),
			},
		},
		{
			name: "Incorrect JSON type (known field)",
			body: `{"name":"John","surname":"Doe","age":"21"}`,
			dst:  &user{},
			want: userTestCase{
				user: user{},
				err:  errors.New("request body contains an invalid JSON type for the \"age\" field"),
			},
		},
		{
			name: "Unknown field",
			body: `{"name":"John","surname":"Doe","age":21,"unknown":true}`,
			dst:  &user{},
			want: userTestCase{
				user: user{},
				err:  errors.New("request body contains unknown field \"unknown\""),
			},
		},
		{
			name: "Too big request",
			body: fmt.Sprintf(`{"name":"%s","surname":"%s","age":%d}`, strings.Repeat("a", 1_048_576), strings.Repeat("a", 1_048_576), 1_048_576),
			dst:  &user{},
			want: userTestCase{
				user: user{},
				err:  errors.New("request is too big (max 1048576 bytes)"),
			},
		},
		{
			name: "Sending multiple JSON values",
			body: `{"name":"John","surname":"Doe","age":21}{"name":"Jane","surname":"Doe","age":22}`,
			dst:  &user{},
			want: userTestCase{
				user: user{},
				err:  errors.New("body must only contain a single JSON value"),
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(tt.body))

			err := app.readJSON(httptest.NewRecorder(), r, tt.dst)
			if err != nil {
				if err.Error() != tt.want.err.Error() {
					t.Errorf("want: %v; got: %v", tt.want.err, err)
				}
			}

			if tt.want.err == nil {
				got := tt.dst.(*user)
				if *got != tt.want.user {
					t.Errorf("want: %v; got: %v", tt.want.user, *got)
				}
			}
		})
	}
}
