const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./database");
const employeeRoutes = require("./routes/employees");
const taskRoutes = require("./routes/tasks");
const Employee = require("./models/Employee");
const Task = require("./models/Task");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/employees", employeeRoutes);
app.use("/tasks", taskRoutes);

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Anything that doesn't match the above, send back index.html
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Sync Database and Seed Data
const seedData = async () => {
  try {
    const count = await Employee.count();
    if (count === 0) {
      console.log("Seeding data...");
      // Read sample data from frontend
      const sampleDataPath = path.join(
        __dirname,
        "../frontend/src/Entities/sampleNestedEmployees.json"
      );
      if (fs.existsSync(sampleDataPath)) {
        const rawData = fs.readFileSync(sampleDataPath);
        const data = JSON.parse(rawData);

        for (const empData of data.employees) {
          const employee = await Employee.create({
            name: empData.name,
            role: empData.role,
            department: empData.department,
            email: empData.email,
          });

          if (empData.tasks && empData.tasks.length > 0) {
            for (const taskData of empData.tasks) {
              await Task.create({
                title: taskData.title,
                status: taskData.status,
                priority: taskData.priority,
                due_date: taskData.due_date,
                employeeId: employee.id,
              });
            }
          }
        }
        console.log("Data seeded successfully.");
      } else {
        console.log("Sample data file not found, skipping seed.");
      }
    }
  } catch (err) {
    console.error("Error seeding data:", err);
  }
};

sequelize
  .sync({ force: false })
  .then(async () => {
    console.log("Database connected and synced.");
    await seedData();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
