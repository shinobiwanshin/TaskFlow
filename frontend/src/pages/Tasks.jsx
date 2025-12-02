import React, { useState, useEffect } from "react";
import { Card, Badge, Avatar, Modal } from "../Components/ui";
import Button from "../Components/Button";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
import WarningIcon from "@mui/icons-material/Warning";
import { api } from "../services/api";

const statusLabels = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};
const priorityLabels = { low: "Low", medium: "Medium", high: "High" };
const statusFilters = [
  { value: "all", label: "All Tasks" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export default function Tasks() {
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assigned_to: "",
    status: "pending",
    priority: "medium",
    due_date: "",
  });

  const getEmployee = (id) => employees.find((e) => e.id === id);
  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const filteredTasks = tasks.filter((task) => {
    const employee = getEmployee(task.assigned_to);
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.assigned_to) return;
    try {
      const created = await api.createTask(newTask);
      setTasks([created, ...tasks]);
      setNewTask({
        title: "",
        description: "",
        assigned_to: "",
        status: "pending",
        priority: "medium",
        due_date: "",
      });
      setShowAddTask(false);
    } catch (err) {
      console.error("Failed to create task", err);
      alert("Failed to create task");
    }
  };

  /* Removed saveTasks effect */

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const updated = await api.updateTask(taskId, { status: newStatus });
      setTasks(tasks.map((t) => (t.id === taskId ? updated : t)));
      if (selectedTask?.id === taskId) {
        setSelectedTask(updated);
      }
    } catch (err) {
      console.error("Failed to update task", err);
      alert("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.deleteTask(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
      setSelectedTask(null);
    } catch (err) {
      console.error("Failed to delete task", err);
      alert("Failed to delete task");
    }
  };

  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">Manage and track all project tasks</p>
        </div>
        <Button
          className="btn btn-primary"
          onClick={() => setShowAddTask(true)}
        >
          + New Task
        </Button>
      </div>

      {/* Status Filter Tabs */}
      <div className="task-filter-tabs mb-6">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            className={`task-filter-tab ${
              statusFilter === filter.value ? "active" : ""
            }`}
            onClick={() => setStatusFilter(filter.value)}
          >
            {filter.label}
            <span className="task-filter-count">
              {taskCounts[filter.value]}
            </span>
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="filter-bar mb-6">
        <div className="input-wrapper" style={{ maxWidth: "300px" }}>
          <span className="input-icon">
            <SearchIcon fontSize="small" />
          </span>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input has-icon"
          />
        </div>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="select"
          style={{ width: "150px" }}
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Tasks Grid */}
      {sortedTasks.length > 0 ? (
        <div className="grid-cards">
          {sortedTasks.map((task) => {
            const employee = getEmployee(task.assigned_to);
            const isOverdue =
              new Date(task.due_date) < new Date() &&
              task.status !== "completed";
            return (
              <Card
                key={task.id}
                className={`task-card card-clickable ${
                  isOverdue ? "overdue" : ""
                }`}
                onClick={() => setSelectedTask(task)}
              >
                <div className="task-card-header">
                  <Badge className={`badge-${task.status.replace("_", "-")}`}>
                    {statusLabels[task.status]}
                  </Badge>
                  <span
                    className={`priority-indicator priority-${task.priority}`}
                  >
                    ● {priorityLabels[task.priority]}
                  </span>
                </div>
                <h3 className="task-card-title">{task.title}</h3>
                {task.description && (
                  <p className="task-card-description">{task.description}</p>
                )}
                <div className="task-card-footer">
                  <div className="task-card-meta">
                    <span
                      className={`task-card-meta-item ${
                        isOverdue ? "overdue-text" : ""
                      }`}
                    >
                      <CalendarTodayIcon fontSize="small" /> {task.due_date}{" "}
                      {isOverdue && "(Overdue)"}
                    </span>
                  </div>
                  {employee && (
                    <div className="task-card-assignee">
                      <Avatar fallback={getInitials(employee.name)} size="sm" />
                      <span className="task-card-assignee-name">
                        {employee.name.split(" ")[0]}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="empty-state">
          <div className="empty-state-icon">
            <AssignmentIcon sx={{ fontSize: 48 }} />
          </div>
          <h3 className="empty-state-title">No tasks found</h3>
          <p className="empty-state-text">
            Try adjusting your search or filters
          </p>
          <Button
            className="btn btn-primary mt-4"
            onClick={() => setShowAddTask(true)}
          >
            + Create First Task
          </Button>
        </Card>
      )}

      {/* Add Task Modal */}
      <Modal
        open={showAddTask}
        onClose={() => setShowAddTask(false)}
        title="Create New Task"
        footer={
          <>
            <Button
              className="btn btn-outline"
              onClick={() => setShowAddTask(false)}
            >
              Cancel
            </Button>
            <Button
              className="btn btn-primary"
              onClick={handleAddTask}
              disabled={!newTask.title || !newTask.assigned_to}
            >
              + Create Task
            </Button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Task Title *</label>
          <input
            type="text"
            placeholder="Enter task title..."
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            placeholder="Add a description..."
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className="input"
            rows={3}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Assign To *</label>
            <select
              value={newTask.assigned_to}
              onChange={(e) =>
                setNewTask({ ...newTask, assigned_to: e.target.value })
              }
              className="select"
            >
              <option value="">Select employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              value={newTask.due_date}
              onChange={(e) =>
                setNewTask({ ...newTask, due_date: e.target.value })
              }
              className="input"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({ ...newTask, priority: e.target.value })
              }
              className="select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              value={newTask.status}
              onChange={(e) =>
                setNewTask({ ...newTask, status: e.target.value })
              }
              className="select"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Task Detail Modal */}
      <Modal
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title="Task Details"
        size="lg"
        footer={
          selectedTask && (
            <>
              <Button
                className="btn btn-danger"
                onClick={() => handleDeleteTask(selectedTask.id)}
              >
                <DeleteIcon fontSize="small" /> Delete
              </Button>
              <Button
                className="btn btn-outline"
                onClick={() => setSelectedTask(null)}
              >
                Close
              </Button>
            </>
          )
        }
      >
        {selectedTask && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ flex: 1 }}>
                <h2
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                  }}
                >
                  {selectedTask.title}
                </h2>
                <div
                  style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
                >
                  <Badge
                    className={`badge-${selectedTask.status.replace("_", "-")}`}
                  >
                    {statusLabels[selectedTask.status]}
                  </Badge>
                  <span
                    className={`priority-indicator priority-${selectedTask.priority}`}
                  >
                    ● {priorityLabels[selectedTask.priority]} Priority
                  </span>
                </div>
              </div>
            </div>

            {selectedTask.description && (
              <div style={{ marginBottom: "1.5rem" }}>
                <h4
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "var(--color-text-muted)",
                    marginBottom: "0.5rem",
                  }}
                >
                  Description
                </h4>
                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    lineHeight: "1.6",
                  }}
                >
                  {selectedTask.description}
                </p>
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <h4
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "var(--color-text-muted)",
                    marginBottom: "0.5rem",
                  }}
                >
                  Assignee
                </h4>
                {getEmployee(selectedTask.assigned_to) && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <Avatar
                      fallback={getInitials(
                        getEmployee(selectedTask.assigned_to).name
                      )}
                      size="md"
                    />
                    <div>
                      <p style={{ fontWeight: "500" }}>
                        {getEmployee(selectedTask.assigned_to).name}
                      </p>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--color-text-muted)",
                        }}
                      >
                        {getEmployee(selectedTask.assigned_to).position}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h4
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "var(--color-text-muted)",
                    marginBottom: "0.5rem",
                  }}
                >
                  Due Date
                </h4>
                <p
                  style={{
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <CalendarTodayIcon fontSize="small" /> {selectedTask.due_date}
                </p>
                {new Date(selectedTask.due_date) < new Date() &&
                  selectedTask.status !== "completed" && (
                    <p
                      style={{
                        color: "var(--color-error)",
                        fontSize: "0.875rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <WarningIcon fontSize="small" /> This task is overdue
                    </p>
                  )}
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid var(--color-border)",
                paddingTop: "1.5rem",
              }}
            >
              <h4
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "var(--color-text-muted)",
                  marginBottom: "1rem",
                }}
              >
                Update Status
              </h4>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <Button
                  className={`btn ${
                    selectedTask.status === "pending"
                      ? "btn-warning"
                      : "btn-outline"
                  }`}
                  onClick={() => handleUpdateStatus(selectedTask.id, "pending")}
                >
                  Pending
                </Button>
                <Button
                  className={`btn ${
                    selectedTask.status === "in_progress"
                      ? "btn-primary"
                      : "btn-outline"
                  }`}
                  onClick={() =>
                    handleUpdateStatus(selectedTask.id, "in_progress")
                  }
                >
                  In Progress
                </Button>
                <Button
                  className={`btn ${
                    selectedTask.status === "completed"
                      ? "btn-success"
                      : "btn-outline"
                  }`}
                  onClick={() =>
                    handleUpdateStatus(selectedTask.id, "completed")
                  }
                >
                  Completed
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
