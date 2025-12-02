const API_BASE_URL = import.meta.env.PROD ? "" : "http://localhost:3000";

// Helper to normalize status
const normalizeStatus = (status) => {
  if (!status) return "pending";
  const s = status.toString().trim();
  if (/^in\s*progress$/i.test(s)) return "in_progress";
  if (/^pending$/i.test(s)) return "pending";
  if (/^completed$/i.test(s)) return "completed";
  return s.toLowerCase().replace(/\s+/g, "_");
};

// Helper to denormalize status for backend
const denormalizeStatus = (status) => {
  if (status === "in_progress") return "In Progress";
  if (status === "pending") return "Pending";
  if (status === "completed") return "Completed";
  return status;
};

export const api = {
  async fetchEmployees() {
    const res = await fetch(`${API_BASE_URL}/employees`);
    if (!res.ok) throw new Error("Failed to fetch employees");
    const data = await res.json();

    // Transform to frontend shape
    return data.map((emp) => ({
      id: String(emp.id),
      name: emp.name,
      position: emp.role, // Map role to position
      department: emp.department,
      email: emp.email,
      phone: emp.phone || "",
      // We could also extract tasks here if needed, but we fetch tasks separately
    }));
  },

  async createEmployee(employee) {
    const payload = {
      name: employee.name,
      role: employee.position, // Map position to role
      department: employee.department,
      email: employee.email,
    };

    const res = await fetch(`${API_BASE_URL}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to create employee");
    const emp = await res.json();

    return {
      id: String(emp.id),
      name: emp.name,
      position: emp.role,
      department: emp.department,
      email: emp.email,
      phone: "",
    };
  },

  async fetchTasks() {
    const res = await fetch(`${API_BASE_URL}/tasks`);
    if (!res.ok) throw new Error("Failed to fetch tasks");
    const data = await res.json();

    return data.map((task) => ({
      id: String(task.id),
      title: task.title,
      status: normalizeStatus(task.status),
      priority: task.priority.toLowerCase(),
      assigned_to: String(task.employeeId), // Map employeeId to assigned_to
      due_date: task.due_date,
    }));
  },

  async createTask(task) {
    const payload = {
      title: task.title,
      status: denormalizeStatus(task.status),
      priority: task.priority,
      due_date: task.due_date,
      employeeId: parseInt(task.assigned_to), // Map assigned_to to employeeId
    };

    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to create task");
    const newTask = await res.json();

    return {
      id: String(newTask.id),
      title: newTask.title,
      status: normalizeStatus(newTask.status),
      priority: newTask.priority.toLowerCase(),
      assigned_to: String(newTask.employeeId),
      due_date: newTask.due_date,
    };
  },

  async updateTask(id, updates) {
    const payload = {};
    if (updates.title) payload.title = updates.title;
    if (updates.status) payload.status = denormalizeStatus(updates.status);
    if (updates.priority) payload.priority = updates.priority;
    if (updates.due_date) payload.due_date = updates.due_date;
    if (updates.assigned_to) payload.employeeId = parseInt(updates.assigned_to);

    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to update task");
    const updatedTask = await res.json();

    return {
      id: String(updatedTask.id),
      title: updatedTask.title,
      status: normalizeStatus(updatedTask.status),
      priority: updatedTask.priority.toLowerCase(),
      assigned_to: String(updatedTask.employeeId),
      due_date: updatedTask.due_date,
    };
  },

  async deleteTask(id) {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete task");
    return true;
  },
};
