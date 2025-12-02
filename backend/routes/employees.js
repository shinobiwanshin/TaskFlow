const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const Task = require("../models/Task");

router.get("/", async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: { model: Task, as: "tasks" },
    });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /employees - Create a new employee
router.post("/", async (req, res) => {
  try {
    const { name, role, department, email } = req.body;
    const employee = await Employee.create({ name, role, department, email });
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /employees/:id - Get a specific employee
router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id, {
      include: { model: Task, as: "tasks" },
    });
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
