# TaskFlow (ProU Frontend)

TaskFlow is a lightweight React + Vite front-end application for managing tasks and employees. It was built as an assessment/sample application and contains a dashboard with task analytics, employee management pages, and task management pages. The app uses modern UI patterns and components, and includes support for Recharts and Material UI icons.

---

## Key Features

- Dashboard with task statistics and Recharts bar chart
- Employee list, employee detail modal, and simple CRUD actions (in-memory)
- Tasks view with filters, search, and task details modal
- Responsive layout with a collapsible sidebar (desktop + mobile)
- Material UI icons for consistent iconography
- Minimal UI component library (Card, Avatar, Badge, Input, Select, Modal, Tabs, ProgressBar)

---

## Tech Stack

- React 19 + Vite
- Recharts for charts/visualization
- Material UI (MUI) icons for consistent iconography
- Custom CSS (App.css) and a small UI component library in `src/Components/ui`

---

## Prerequisites

- Node.js 18+ (or a recent LTS version recommended)
- npm (or yarn/pnpm if you prefer; scripts assume npm by default)

---

## Quick Start (Frontend only)

Open a terminal and run the following commands to start the app locally:

```bash
cd frontend
npm install
npm run dev
```

Vite runs on a port starting at 5173 and will select the next available port if it's occupied (e.g., 5174, 5175...). The dev server prints the URL and port when it's ready. Visit `http://localhost:5173/` (or whichever port appears) in your browser.

Build for production:

```bash
cd frontend
npm run build
```

Preview production build:

```bash
cd frontend
npm run preview
```

---

## Project Structure

Top-level:

```
frontend/
  ├─ public/                # static assets (favicons, images)
  ├─ src/                   # source files
  │   ├─ Components/        # UI components and page components
  │   ├─ App.css            # global CSS
  │   ├─ main.jsx           # app entry
  │   ├─ Layout.jsx         # layout with collapsible sidebar
  │   ├─ pages/             # Dashboard, Employees, Tasks pages
  ├─ package.json
  └─ vite.config.js
```

Notable directories:

- `src/Components/ui` - shared UI components (Card, Avatar, Modal, Tabs, etc.)
- `src/Components/Employees` - Employee card components
- `src/Components/Tasks` - Task card and task related components
- `src/pages` - top-level pages

---

## Icons & Graphics

- Material UI icons are used for nav and controls to ensure visual consistency. You may find some lucide-react icons in legacy components; these were replaced with MUI icons in many files.
- Avatar components now default to initials fallback to avoid layout issues when images are missing; you can change this in `src/Components/ui/Avatar.jsx`.

---

## Important Notes & Known Issues

- CSS linter warns about `-webkit-line-clamp` usage in `src/App.css`. The standard `line-clamp` property can be added in parallel for better compatibility.
- The dev server automatically uses the next available port if 5173 is occupied. Check console output for the actual URL.
- The app uses in-memory data for demo purposes; it does not persist state to a backend.

---

## Development Tips

- Recharts: To modify charts, edit `src/pages/Dashboard.jsx` and `src/components/Dashboard` components.
- Icons: Use MUI icons from `@mui/icons-material`. We already installed `@mui/material`, `@mui/icons-material`, `@emotion/react`, and `@emotion/styled`.
- Styles: Global styles are in `src/App.css`. There are utility-sized classes for avatars (`avatar-sm`, `avatar-md`, `avatar-lg`, `avatar-xl`).

---

## Tests & Linting

- There are no automated tests set up in this repo. If you'd like, I can add a test setup using Jest/React Testing Library or Vite test runner.

---

## Contributing

If you'd like to extend the project:

1. Create an issue or feature request describing the change
2. Create a branch for your work
3. Follow the existing component and CSS patterns
4. Update the README with any new setup notes or decisions

---

## Contact

If you need help or have questions about this repository, share a message in the code review or open an issue.

---

Happy coding! ✨
