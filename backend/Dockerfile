FROM golang:1.24.1-alpine3.21

WORKDIR /app

COPY ./backend .

RUN go mod download

COPY ./scripts/docker-entrypoint.sh .
COPY ./scripts/wait-for-it.sh .

RUN chmod +x wait-for-it.sh docker-entrypoint.sh
RUN apk update && apk add --no-cache bash
RUN go build -o main ./cmd/api

EXPOSE 4000

ENTRYPOINT [ "./docker-entrypoint.sh" ]
CMD ["/app/main", "-port", "4000"]