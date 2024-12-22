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
