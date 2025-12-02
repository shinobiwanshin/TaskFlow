import React, { useState, useEffect, useMemo } from "react";
import { Card, Badge, Avatar, Modal, ProgressBar } from "../Components/ui";
import Button from "../Components/Button";
import SearchIcon from "@mui/icons-material/Search";
import WorkIcon from "@mui/icons-material/Work";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import GroupsIcon from "@mui/icons-material/Groups";
import { api } from "../services/api";

const statusLabels = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [emps, tsks] = await Promise.all([
          api.fetchEmployees(),
          api.fetchTasks(),
        ]);
        setEmployees(emps);
        setTasks(tsks);
      } catch (err) {
        console.error("Failed to load data", err);
        setError("Failed to load data. Please ensure backend is running.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const departments = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set((employees || []).map((e) => e.department).filter(Boolean))
      ),
    ],
    [employees]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    position: "",
    department: "Engineering",
    email: "",
    phone: "",
  });

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      departmentFilter === "All" || employee.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const getEmployeeTasks = (employeeId) =>
    tasks.filter((t) => t.assigned_to === employeeId);
  const getEmployeeStats = (employeeId) => {
    const empTasks = getEmployeeTasks(employeeId);
    const completed = empTasks.filter((t) => t.status === "completed").length;
    const total = empTasks.length;
    return {
      completed,
      total,
      rate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  const handleAddEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email) return;
    try {
      const created = await api.createEmployee(newEmployee);
      setEmployees([...employees, created]);
      setNewEmployee({
        name: "",
        position: "",
        department: "Engineering",
        email: "",
        phone: "",
      });
      setShowAddEmployee(false);
    } catch (err) {
      console.error("Failed to create employee", err);
      alert("Failed to create employee");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">
            Manage your team members and their assignments
          </p>
        </div>
        <Button
          className="btn btn-primary"
          onClick={() => setShowAddEmployee(true)}
        >
          + Add Employee
        </Button>
      </div>

      <div className="filter-bar mb-6">
        <div className="input-wrapper" style={{ maxWidth: "300px" }}>
          <span className="input-icon">
            <SearchIcon fontSize="small" />
          </span>
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input has-icon"
          />
        </div>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="select"
          style={{ width: "180px" }}
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {filteredEmployees.length > 0 ? (
        <div className="grid-cards">
          {filteredEmployees.map((employee) => {
            const stats = getEmployeeStats(employee.id);
            const empTasks = getEmployeeTasks(employee.id);
            return (
              <Card
                key={employee.id}
                className="employee-card card-clickable"
                onClick={() => setSelectedEmployee(employee)}
              >
                <div className="employee-card-header">
                  <Avatar fallback={getInitials(employee.name)} size="lg" />
                  <div className="employee-card-info">
                    <h3 className="employee-card-name">{employee.name}</h3>
                    <p className="employee-card-position">
                      <WorkIcon fontSize="small" /> {employee.position}
                    </p>
                    <p className="employee-card-email">
                      <EmailIcon fontSize="small" /> {employee.email}
                    </p>
                    <div className="employee-card-badges">
                      <Badge
                        className={`badge-${employee.department.toLowerCase()}`}
                      >
                        {employee.department}
                      </Badge>
                      <Badge variant="outline">{stats.total} tasks</Badge>
                    </div>
                  </div>
                </div>
                <div className="employee-card-progress">
                  <div className="employee-card-progress-header">
                    <span className="employee-card-progress-label">
                      Progress
                    </span>
                    <span className="employee-card-progress-value">
                      {stats.rate}%
                    </span>
                  </div>
                  <ProgressBar value={stats.rate} />
                </div>
                <div className="mt-4">
                  {empTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className="recent-task-item"
                      style={{ marginBottom: "8px" }}
                    >
                      <span className="truncate" style={{ flex: 1 }}>
                        {task.title}
                      </span>
                      <Badge
                        className={`badge-${task.status.replace("_", "-")}`}
                        style={{ fontSize: "0.7rem" }}
                      >
                        {statusLabels[task.status]}
                      </Badge>
                    </div>
                  ))}
                  {empTasks.length === 0 && (
                    <p className="text-muted" style={{ fontSize: "0.875rem" }}>
                      No tasks assigned
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="empty-state">
          <div className="empty-state-icon">
            <GroupsIcon sx={{ fontSize: 48 }} />
          </div>
          <h3 className="empty-state-title">No employees found</h3>
          <p className="empty-state-text">
            Try adjusting your search or filter
          </p>
        </Card>
      )}

      {/* Add Employee Modal */}
      <Modal
        open={showAddEmployee}
        onClose={() => setShowAddEmployee(false)}
        title="Add New Employee"
        footer={
          <>
            <Button
              className="btn btn-outline"
              onClick={() => setShowAddEmployee(false)}
            >
              Cancel
            </Button>
            <Button
              className="btn btn-primary"
              onClick={handleAddEmployee}
              disabled={!newEmployee.name || !newEmployee.email}
            >
              + Add Employee
            </Button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            placeholder="Enter full name..."
            value={newEmployee.name}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, name: e.target.value })
            }
            className="input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Position</label>
          <input
            type="text"
            placeholder="Enter position..."
            value={newEmployee.position}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, position: e.target.value })
            }
            className="input"
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Department</label>
            <select
              value={newEmployee.department}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, department: e.target.value })
              }
              className="select"
            >
              {departments
                .filter((d) => d !== "All")
                .map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              placeholder="+1 555-0100"
              value={newEmployee.phone}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, phone: e.target.value })
              }
              className="input"
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Email *</label>
          <input
            type="email"
            placeholder="email@company.com"
            value={newEmployee.email}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, email: e.target.value })
            }
            className="input"
          />
        </div>
      </Modal>

      {/* Employee Detail Modal */}
      <Modal
        open={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        title="Employee Details"
        size="lg"
      >
        {selectedEmployee && (
          <div>
            <div
              className="employee-detail-header"
              style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem" }}
            >
              <Avatar fallback={getInitials(selectedEmployee.name)} size="xl" />
              <div>
                <h2
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                  }}
                >
                  {selectedEmployee.name}
                </h2>
                <p
                  style={{
                    color: "var(--color-text-muted)",
                    marginBottom: "0.25rem",
                  }}
                >
                  <WorkIcon fontSize="small" /> {selectedEmployee.position}
                </p>
                <p
                  style={{
                    color: "var(--color-text-muted)",
                    marginBottom: "0.25rem",
                  }}
                >
                  <EmailIcon fontSize="small" /> {selectedEmployee.email}
                </p>
                {selectedEmployee.phone && (
                  <p style={{ color: "var(--color-text-muted)" }}>
                    <PhoneIcon fontSize="small" /> {selectedEmployee.phone}
                  </p>
                )}
                <div style={{ marginTop: "0.75rem" }}>
                  <Badge
                    className={`badge-${selectedEmployee.department.toLowerCase()}`}
                  >
                    {selectedEmployee.department}
                  </Badge>
                </div>
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid var(--color-border)",
                paddingTop: "1.5rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                }}
              >
                Assigned Tasks
              </h3>
              {getEmployeeTasks(selectedEmployee.id).length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {getEmployeeTasks(selectedEmployee.id).map((task) => (
                    <div key={task.id} className="recent-task-item">
                      <span style={{ flex: 1 }}>{task.title}</span>
                      <Badge
                        className={`badge-${task.status.replace("_", "-")}`}
                      >
                        {statusLabels[task.status]}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No tasks assigned to this employee</p>
              )}
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <div className="employee-card-progress">
                <div className="employee-card-progress-header">
                  <span className="employee-card-progress-label">
                    Overall Progress
                  </span>
                  <span className="employee-card-progress-value">
                    {getEmployeeStats(selectedEmployee.id).rate}%
                  </span>
                </div>
                <ProgressBar
                  value={getEmployeeStats(selectedEmployee.id).rate}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
