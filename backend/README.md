# Task Management API

This is the backend API for the Task Management application. It provides RESTful endpoints to manage employees and tasks.

## Tech Stack

- **Node.js**: Runtime environment
- **Express**: Web framework
- **SQLite**: Database (stored in `database.sqlite`)
- **Sequelize**: ORM for database interaction

## Setup and Run

1.  Navigate to the `backend` directory:

    ```bash
    cd backend
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Start the server:
    ```bash
    npm start
    ```
    The server will run on `http://localhost:3000`.

## API Endpoints

### Employees

- **GET /employees**
  - List all employees (includes their tasks).
- **POST /employees**
  - Create a new employee.
  - Body: `{ "name": "John Doe", "role": "Developer", "department": "IT", "email": "john@example.com" }`
- **GET /employees/:id**
  - Get details of a specific employee.

### Tasks

- **GET /tasks**
  - List all tasks.
  - Query Params: `status` (e.g., `?status=In Progress`), `employeeId`.
- **POST /tasks**
  - Create a new task.
  - Body: `{ "title": "Fix bug", "status": "Pending", "priority": "high", "due_date": "2025-12-31", "employeeId": 1 }`
- **PUT /tasks/:id**
  - Update a task.
- **DELETE /tasks/:id**
  - Delete a task.

## Assumptions

- The database is SQLite for simplicity and ease of setup.
- The initial data is seeded from the frontend's `sampleNestedEmployees.json` if the database is empty.
