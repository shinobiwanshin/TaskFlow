import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Card,
  Badge,
  Avatar,
  Modal,
  Tabs,
  ProgressBar,
} from "../Components/ui";
import Button from "../Components/Button";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupsIcon from "@mui/icons-material/Groups";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SearchIcon from "@mui/icons-material/Search";
import WorkIcon from "@mui/icons-material/Work";
import EmailIcon from "@mui/icons-material/Email";
import { api } from "../services/api";

const statusLabels = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};
const priorityLabels = { low: "Low", medium: "Medium", high: "High" };

const COLORS = {
  pending: "#f59e0b",
  in_progress: "#3b82f6",
  completed: "#10b981",
};

function TaskBarChart({ pending, inProgress, completed }) {
  const data = [
    { name: "Pending", value: pending, color: COLORS.pending },
    { name: "In Progress", value: inProgress, color: COLORS.in_progress },
    { name: "Completed", value: completed, color: COLORS.completed },
  ];

  const total = pending + inProgress + completed;
  if (total === 0) {
    return (
      <div className="chart-placeholder">
        <p>No tasks to display</p>
      </div>
    );
  }

  return (
    <div className="chart-placeholder">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={{ stroke: "#e2e8f0" }}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={{ stroke: "#e2e8f0" }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            labelStyle={{ color: "#0f172a", fontWeight: 600 }}
          />
          <Legend />
          <Bar dataKey="value" name="Tasks" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Dashboard() {
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
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddTask, setShowAddTask] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assigned_to: "",
    status: "pending",
    priority: "medium",
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "in_progress"
  ).length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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
      employee?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.assigned_to) return;
    try {
      const created = await api.createTask(newTask);
      setTasks([...tasks, created]);
      setNewTask({
        title: "",
        description: "",
        assigned_to: "",
        status: "pending",
        priority: "medium",
      });
      setShowAddTask(false);
    } catch (err) {
      console.error("Failed to create task", err);
      alert("Failed to create task");
    }
  };

  /* Removed saveTasks effect */

  const tabs = [
    { value: "overview", label: "Overview" },
    { value: "tasks", label: "Tasks" },
    { value: "employees", label: "Employees" },
  ];

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Employee Task Tracker</h1>
          <p className="page-subtitle">
            Manage your team's tasks and track progress
          </p>
        </div>
        <Button
          className="btn btn-primary"
          onClick={() => setShowAddTask(true)}
        >
          + New Task
        </Button>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === "overview" && (
          <div>
            <div className="grid-stats mb-6">
              <Card className="stat-card">
                <div className="stat-card-header">
                  <div className="stat-card-content">
                    <p className="stat-card-label">Total Tasks</p>
                    <p className="stat-card-value">{totalTasks}</p>
                  </div>
                  <div className="stat-card-icon slate">
                    <AssignmentIcon />
                  </div>
                </div>
              </Card>
              <Card className="stat-card">
                <div className="stat-card-header">
                  <div className="stat-card-content">
                    <p className="stat-card-label">Completed</p>
                    <p className="stat-card-value">{completedTasks}</p>
                    <p
                      className="stat-card-subtitle"
                      style={{ color: "#10b981" }}
                    >
                      {completionRate}% completion
                    </p>
                  </div>
                  <div className="stat-card-icon green">
                    <CheckCircleIcon />
                  </div>
                </div>
              </Card>
              <Card className="stat-card">
                <div className="stat-card-header">
                  <div className="stat-card-content">
                    <p className="stat-card-label">In Progress</p>
                    <p className="stat-card-value">{inProgressTasks}</p>
                  </div>
                  <div className="stat-card-icon blue">
                    <TrendingUpIcon />
                  </div>
                </div>
              </Card>
              <Card className="stat-card">
                <div className="stat-card-header">
                  <div className="stat-card-content">
                    <p className="stat-card-label">Team Members</p>
                    <p className="stat-card-value">{employees.length}</p>
                  </div>
                  <div className="stat-card-icon purple">
                    <GroupsIcon />
                  </div>
                </div>
              </Card>
            </div>
            <div className="grid-two">
              <Card className="chart-container">
                <h3 className="chart-title">Task Distribution</h3>
                <TaskBarChart
                  pending={pendingTasks}
                  inProgress={inProgressTasks}
                  completed={completedTasks}
                />
              </Card>
              <Card className="recent-tasks-list">
                <h3 className="recent-tasks-title">Recent Tasks</h3>
                {tasks.slice(0, 5).map((task) => {
                  const employee = getEmployee(task.assigned_to);
                  return (
                    <div key={task.id} className="recent-task-item">
                      <div className="recent-task-info">
                        <p className="recent-task-title">{task.title}</p>
                        <p className="recent-task-assignee">{employee?.name}</p>
                      </div>
                      <Badge
                        className={`badge-${task.status.replace("_", "-")}`}
                      >
                        {statusLabels[task.status]}
                      </Badge>
                    </div>
                  );
                })}
              </Card>
            </div>
          </div>
        )}

        {activeTab === "tasks" && (
          <div>
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="select"
                style={{ width: "180px" }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            {filteredTasks.length > 0 ? (
              <div className="grid-cards">
                {filteredTasks.map((task) => {
                  const employee = getEmployee(task.assigned_to);
                  return (
                    <Card key={task.id} className="task-card card-clickable">
                      <div className="task-card-header">
                        <Badge
                          className={`badge-${task.status.replace("_", "-")}`}
                        >
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
                        <p className="task-card-description">
                          {task.description}
                        </p>
                      )}
                      <div className="task-card-footer">
                        <div className="task-card-meta">
                          <span className="task-card-meta-item">
                            <CalendarTodayIcon fontSize="small" />{" "}
                            {task.due_date}
                          </span>
                        </div>
                        {employee && (
                          <div className="task-card-assignee">
                            <Avatar
                              fallback={getInitials(employee.name)}
                              size="sm"
                            />
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
                  Try adjusting your search or filter
                </p>
              </Card>
            )}
          </div>
        )}

        {activeTab === "employees" && (
          <div className="grid-cards">
            {employees.map((employee) => {
              const employeeTasks = tasks.filter(
                (t) => t.assigned_to === employee.id
              );
              const completed = employeeTasks.filter(
                (t) => t.status === "completed"
              ).length;
              const total = employeeTasks.length;
              const rate =
                total > 0 ? Math.round((completed / total) * 100) : 0;
              return (
                <Card
                  key={employee.id}
                  className="employee-card card-clickable"
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
                        <Badge variant="outline">{total} tasks</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="employee-card-progress">
                    <div className="employee-card-progress-header">
                      <span className="employee-card-progress-label">
                        Progress
                      </span>
                      <span className="employee-card-progress-value">
                        {rate}%
                      </span>
                    </div>
                    <ProgressBar value={rate} />
                  </div>
                  <div className="mt-4">
                    {employeeTasks.slice(0, 3).map((task) => (
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
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Tabs>

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
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
            className="select"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </Modal>
    </div>
  );
}
