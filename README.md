# Exam Crack

## Project Overview

Exam Crack is a learning application designed to help users create custom flashcards, quizzes, and other study materials. Users can register, log in, and track their progress as they learn. The app allows for both personalized quiz creation and the use of premade exams/quizzes, providing a flexible study experience that adapts to individual learning styles.

## Tech Stack

* **Frontend:** ReactJS
* **Backend:** Go
* **Database:** PostgreSQL
* **Migration Tool:** Migrate

## Installation

### General Setup

* Install [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* Install [Go](https://go.dev/doc/install)
* Install [PostgreSQL](https://www.postgresql.org/download/)
* Clone the repository:

    ```bash
    git clone https://github.com/deferet/exam-crack.git
    cd exam-crack
    ```

### Frontend Setup

* Navigate to the frontend directory

    ```bash
    cd frontend
    ```

* Install dependencies:

    ```bash
    npm install
    ```

* Start the development server:

    ```bash
    npm run dev
    ```

* (optional) Run the JSON Server mock backend:

    ```bash
    json-server --watch json-server/mock.json
    ```

### Database Setup

* Ensure PostgreSQL is running
* Create a new database for the project
* Setup the environment:
  * Open either your .profile or .bashrc file:

    ```bash
    nano ~/.bashrc
    ```
  
  * Add the following line with your database DSN at the end of the file, exit, and save the file:

    ```bash
    export EXAMCRACK_DB_DSN='postgres://[username[:password]@][host[:port]]/[database_name]'
    ```
  
  * For example, for a database user `examcrack_user` with a password of `pswd` connecting to a database `examcrack` hosted on `localhost`, the URI would look as follows:
    * `postgres://examcrack_user:pswd@localhost/examcrack`

* Apply migrations

### Backend Setup

* Navigate to the backend directory

    ```bash
    cd backend
    ```

* Install dependencies

    ```bash
    go mod download
    ```

* Start the backend server:

    ```bash
    go run ./cmd/api
    ```

---

## API Documentation

### Health Check

#### Description

This endpoint checks the health status of the API.

#### Route

**GET** `/v1/healthcheck`

#### Response Body

```json
{
  "status": "available",
  "environment": "development",
  "version": "1.0.0"
}
```

#### Response Code

* **200 OK**

---

### Create User

#### Description

Creates a new user in the system.

#### Route

**POST** `/v1/users`

#### Request Body

```json
{
  "user_type": "string",
  "email": "string",
  "password": "string",
  "username": "string",
  "name": "string",
  "surname": "string"
}
```

#### Response Body

```json

{
  "id": "uuid",
  "user_type": "string",
  "email": "string",
  "username": "string",
  "name": "string",
  "surname": "string",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

#### Response Codes

* **201 Created**
* **400 Bad Request** (e.g., `{"errors": ["Invalid input"]}`)

---

### Get User

#### Description

Fetches details of a specific user by ID.

#### Route

**GET** `/v1/users/:id`

#### Response Body

```json
{
  "id": "uuid",
  "user_type": "string",
  "email": "string",
  "username": "string",
  "name": "string",
  "surname": "string",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

#### Response Codes

* **200 OK**
* **404 Not Found** (e.g., `{"errors": ["User not found"]}`)

---

### Create Test

#### Description

Creates a new test in the system.

#### Route

**POST** `/v1/tests`

#### Request Body

```json
{
  "creator_id": "uuid",
  "name": "string",
  "description": "string",
  "categories": ["string"]
}
```

#### Response Body

```json
{
  "id": "uuid",
  "creator_id": "uuid",
  "name": "string",
  "description": "string",
  "categories": ["string"],
  "times_started": 0,
  "times_completed": 0,
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

#### Response Code

* **201 Created**
* **400 Bad Request** (e.g., `{"errors": ["Invalid input"]}`)

---

### Get Test

#### Description

Fetches details of a specific test by ID.

#### Route

**GET** `/v1/tests/:id`

#### Response Body

```json
{
  "id": "uuid",
  "creator_id": "uuid",
  "name": "string",
  "description": "string",
  "categories": ["string"],
  "times_started": 0,
  "times_completed": 0,
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

#### Response Code

* **200 OK**
* **404 Not Found** (e.g., `{"errors": ["Test not found"]}`)

---

### Create Question

#### Description

Creates a new question for a specific test.

#### Route

**POST** `/v1/questions`

#### Request Body

```json
{
  "test_id": "uuid",
  "question": "string",
  "type": "string"
}
```

#### Response Body

```json
{
  "id": "uuid",
  "test_id": "uuid",
  "question": "string",
  "type": "string",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

#### Response Code

* **201 Created**
* **400 Bad Request** (e.g., `{"errors": ["Invalid input"]}`)

---

### Get Question

#### Description

Fetches details of a specific question by ID.

#### Route

**GET** `/v1/questions/:id`

#### Response Body

```json
{
  "id": "uuid",
  "test_id": "uuid",
  "question": "string",
  "type": "string",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

#### response code

* **200 OK**
* **404 Not Found** (e.g., `{"errors": ["Question not found"]}`)

---

### Create Answer

#### Description

Creates a new answer for a specific question.

#### Route

**POST** `/v1/answers`

#### Request Body

```json
{
  "question_id": "uuid",
  "content": "string",
  "correct": true
}
```

#### Response Body

```json
{
  "id": "uuid",
  "question_id": "uuid",
  "content": "string",
  "correct": true,
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

#### Response Codes

* **201 Created**
* **400 Bad Request** (e.g., `{"errors": ["Invalid input"]}`)

---

### Get Answer

#### Description

Fetches details of a specific answer by ID.

#### Route

**GET** `/v1/answers/:id`

#### Response Body

```json
{
  "id": "uuid",
  "question_id": "uuid",
  "content": "string",
  "correct": true,
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

#### Response Codes

* **200 OK**
* **404 Not Found** (e.g., `{"errors": ["Answer not found"]}`)

---

### Create Authentication Token

#### Description

Generates an authentication token for a user.

#### Route

**POST** `/v1/tokens/authentication`

#### Request Body

```json
{
  "email": "string",
  "password": "string"
}
```

#### Response Body

```json
{
  "token": "string",
  "expiry": "timestamp"
}
```

#### Response Codes

* **201 Created**
* **400 Bad Request** (e.g., `{"errors": ["Invalid credentials"]}`)
