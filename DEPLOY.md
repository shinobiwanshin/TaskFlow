# Deployment Guide

This project is configured to be deployed as a single Node.js application (Monorepo style). The backend serves the frontend static files.

## Prerequisites

- A hosting provider that supports Node.js (e.g., Render, Railway, Heroku, DigitalOcean App Platform).
- **Note:** Since this project uses **SQLite** (a file-based database), you need a hosting provider that supports **persistent disk storage** (like Render's Disk, Railway's Volume, or a VPS). If you deploy to a serverless platform (like Vercel or Netlify), your database will be reset every time the server restarts.

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
    - `PORT`: The port the server should listen on (usually provided by the host).

## Example: Deploying to Render.com

1.  Create a new **Web Service** on Render.
2.  Connect your GitHub repository.
3.  **Build Command:** `npm run build`
4.  **Start Command:** `npm start`
5.  **Disk (Important):**
    - Add a **Disk** to your service.
    - Mount path: `/opt/render/project/src/backend` (or wherever your app lives, usually the root or backend folder).
    - This ensures `database.sqlite` is preserved across restarts.

## Local Production Test

To test the production build locally:

1.  Build the project:
    ```bash
    npm run build
    ```
2.  Start the server:
    ```bash
    npm start
    ```
3.  Open `http://localhost:3000`.
