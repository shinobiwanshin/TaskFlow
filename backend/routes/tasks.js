const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Employee = require("../models/Employee");

// GET /tasks - List all tasks (with optional filtering)
router.get("/", async (req, res) => {
  try {
    const { status, employeeId } = req.query;
    const where = {};
    if (status) where.status = status;
    if (employeeId) where.employeeId = employeeId;

    const tasks = await Task.findAll({ where, include: Employee });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /tasks - Create a new task
router.post("/", async (req, res) => {
  try {
    const { title, status, priority, due_date, employeeId } = req.body;
    const task = await Task.create({
      title,
      status,
      priority,
      due_date,
      employeeId,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /tasks/:id - Update a task
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    await task.update(req.body);
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /tasks/:id - Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    await task.destroy();
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
