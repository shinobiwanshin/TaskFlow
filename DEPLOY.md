# Deployment Guide

This project is configured to be deployed as a single Node.js application (Monorepo style). The backend serves the frontend static files.

## Prerequisites

- A hosting provider that supports Node.js (e.g., Render, Railway, Heroku, DigitalOcean App Platform).
- **PostgreSQL Database:** You will need a connection string (URL) for a PostgreSQL database. Many providers (like Render, Railway, Neon, Supabase) offer managed Postgres databases.

## Deployment Steps (General)

1.  **Build Command:**
    The root `package.json` has a `build` script that installs dependencies for both frontend and backend, and builds the frontend.

    ```bash
    npm run build
    ```

2.  **Start Command:**
    The root `package.json` has a `start` script that starts the backend server.

    ```bash
    npm start
    ```

3.  **Environment Variables:**
    Set the following environment variables in your hosting provider's dashboard:
    - `PORT`: The port the server should listen on (usually provided by the host).
    - `DATABASE_URL`: The connection string for your PostgreSQL database (e.g., `postgres://user:pass@host:5432/dbname`).

## Docker Deployment

This project includes a `Dockerfile` for containerized deployment.

1.  **Build the Docker Image:**

    ```bash
    docker build -t taskflow-app .
    ```

    _Note for Mac users (M1/M2/M3): If deploying to a cloud provider like Render, you must build for the correct platform:_

    ```bash
    docker build --platform linux/amd64 -t taskflow-app .
    ```

2.  **Run the Container:**
    You need to provide the `DATABASE_URL` environment variable. If you are running the Postgres container locally (from `docker-compose.yml`), you can link them or use the host network, but for simplicity, here is how to run it standalone if you have a database URL:

    ```bash
    docker run -p 3000:3000 -e DATABASE_URL="postgres://user:password@host.docker.internal:5434/prou_db" taskflow-app
    ```

    _(Note: `host.docker.internal` allows the container to access the host's localhost on Windows/Mac. On Linux, use `--network="host"` or the IP address)._

3.  **Deploy to Cloud (e.g., Render, Railway, Fly.io):**
    - Most platforms will automatically detect the `Dockerfile` and build it.
    - Just ensure you set the `DATABASE_URL` environment variable in the platform's dashboard.

## Example: Deploying to Render.com

1.  Create a new **PostgreSQL** database on Render. Copy the "Internal Database URL" (if deploying the web service on Render too) or "External Database URL".
2.  Create a new **Web Service** on Render.
3.  Connect your GitHub repository.
4.  **Build Command:** `npm run build`
5.  **Start Command:** `npm start`
6.  **Environment Variables:**
    - Add `DATABASE_URL` and paste the connection string from step 1.
    - Add `NODE_ENV` = `production`.

## Local Production Test

To test the production build locally:

1.  Ensure you have a local Postgres database running and `DATABASE_URL` set in `backend/.env`.
2.  Build the project:
    ```bash
    npm run build
    ```
3.  Start the server:
    ```bash
    npm start
    ```
4.  Open `http://localhost:3000`.
