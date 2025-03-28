FROM golang:1.24.1-alpine3.21

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o main ./cmd/api

EXPOSE 4000

CMD ["/app/main", "-port", "4000"]