export function normalizeNestedEmployeesData(data) {
  if (!data || !Array.isArray(data.employees))
    return { employees: [], tasks: [] };

  const employees = data.employees.map((emp) => ({
    id: String(emp.id),
    name: emp.name || "",
    position: emp.role || emp.position || "",
    department: emp.department || "Engineering",
    email: emp.email || "",
    phone: emp.phone || "",
    avatar_url: emp.avatar_url || null,
  }));

  const tasks = [];
  data.employees.forEach((emp) => {
    (emp.tasks || []).forEach((t) => {
      let status = (t.status || "pending").toString().trim();
      // normalize statuses
      if (/^in\s*progress$/i.test(status)) status = "in_progress";
      else if (/^pending$/i.test(status)) status = "pending";
      else if (/^completed$/i.test(status)) status = "completed";
      else status = status.toLowerCase().replace(/\s+/g, "_");

      let priority = (t.priority || "medium").toString().trim().toLowerCase();
      if (!["low", "medium", "high"].includes(priority)) priority = "medium";

      tasks.push({
        id: String(t.id || Date.now() + Math.floor(Math.random() * 1000)),
        title: t.title || t.name || "",
        description: t.description || "",
        status,
        priority,
        assigned_to: String(emp.id),
        due_date: t.due_date || null,
      });
    });
  });

  return { employees, tasks };
}

export default normalizeNestedEmployeesData;
