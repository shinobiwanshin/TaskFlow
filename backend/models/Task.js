const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Employee = require("./Employee");

const Task = sequelize.define("Task", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Pending",
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: "medium",
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
});

// Define relationships
Employee.hasMany(Task, { as: "tasks", foreignKey: "employeeId" });
Task.belongsTo(Employee, { foreignKey: "employeeId" });

module.exports = Task;
