# TaskFlow - Employee Task Tracker

TaskFlow is a full-stack application designed to manage employees and track their tasks efficiently. It features a modern React frontend and a robust Node.js/Express backend with a PostgreSQL database.

## 🚀 Features

- **Dashboard**: Visual statistics using charts (Recharts) and summary cards.
- **Employee Management**: View, search, and filter employees by department.
- **Task Management**: Create, update, delete, and filter tasks by status or priority.
- **PostgreSQL Database**: Uses PostgreSQL for robust and scalable data storage.
- **Auto-Seeding**: Automatically populates the database with sample data on the first run.
- **Responsive Design**: Fully responsive UI built with CSS and Material UI icons.

## 🛠️ Tech Stack

### Frontend

- **React** (Vite)
- **Material UI Icons**
- **Recharts** (Data Visualization)
- **CSS Modules** (Custom Styling)

### Backend

- **Node.js & Express**
- **PostgreSQL** (Database)
- **Sequelize** (ORM)
- **Dotenv** (Environment Management)

---

## 📦 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ProU_front
   ```

2. **Install Dependencies**
   ```bash
   npm run install:all
   ```

## 🏃‍♂️ Running Locally

### Option 1: Using Docker (Recommended for Database)

1. **Start the PostgreSQL Database**

   ```bash
   docker-compose up -d
   ```

   This starts a local Postgres instance on port `5434`.

2. **Start the Application**
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3000`

### Option 2: Manual Setup

1. Ensure you have PostgreSQL installed and running.
2. Create a `.env` file in the `backend` folder (see `backend/.env.example`).
3. Update `DATABASE_URL` in `.env` to point to your local Postgres instance.
4. Start the app:
   ```bash
   npm run dev
   ```

## 🐳 Docker Support

You can containerize the entire application:

```bash
# Build the image
docker build -t taskflow-app .

# Run the container
docker run -p 3000:3000 -e DATABASE_URL="postgres://user:pass@host.docker.internal:5434/prou_db" -e NODE_ENV=development taskflow-app
```

## ☁️ Deployment

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions to platforms like Render, Railway, or Heroku.
