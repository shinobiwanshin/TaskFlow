const EMPLOYEES_KEY = "taskflow_employees";
const TASKS_KEY = "taskflow_tasks";

export function loadEmployees() {
  try {
    const raw = localStorage.getItem(EMPLOYEES_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn("loadEmployees error", err);
    return null;
  }
}

export function saveEmployees(employees) {
  try {
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
  } catch (err) {
    console.warn("saveEmployees error", err);
  }
}

export function loadTasks() {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn("loadTasks error", err);
    return null;
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.warn("saveTasks error", err);
  }
}

export function seedInitialDataIfNeeded(initialEmployees, initialTasks) {
  try {
    if (!localStorage.getItem(EMPLOYEES_KEY)) {
      localStorage.setItem(
        EMPLOYEES_KEY,
        JSON.stringify(initialEmployees || [])
      );
    }
    if (!localStorage.getItem(TASKS_KEY)) {
      localStorage.setItem(TASKS_KEY, JSON.stringify(initialTasks || []));
    }
  } catch (err) {
    console.warn("seedInitialDataIfNeeded error", err);
  }
}

export default {
  loadEmployees,
  saveEmployees,
  loadTasks,
  saveTasks,
  seedInitialDataIfNeeded,
};
