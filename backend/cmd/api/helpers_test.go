package main

import (
	"net/http"
	"net/http/httptest"
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
				t.Errorf("want nil; got %v", err)
			}

			if tt.w.Code != tt.status {
				t.Errorf("want %d; got %d", tt.status, tt.w.Code)
			}

			if tt.w.Body.String() != tt.want {
				t.Errorf("want %s; got %s", tt.want, tt.w.Body.String())
			}

			for key, values := range tt.headers {
				if tt.w.Header().Get(key) != values[0] {
					t.Errorf("want %s; got %s", values[0], tt.w.Header().Get(key))
				}
			}
		})
	}
}
