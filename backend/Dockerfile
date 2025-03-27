# Use official Golang image
FROM golang:1.24.1-alpine3.21

# Set working directory
WORKDIR /app

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the Go app
RUN go build -o main ./cmd/api

# Expose port 4000 (matching your Go server)
EXPOSE 4000

# Start the app
CMD ["/app/main", "-port", "4000"]