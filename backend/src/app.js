const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");

dotenv.config();

const userRoutes = require("./routes/userRoutes");
const recordRoutes = require("./routes/recordRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

const initDB = async () => {
  console.log("starting db connect")
  await connectDB();
  console.log("db connected")
  const User = require("./models/User");
  const Record = require("./models/Record");

  const existingUsers = await User.countDocuments();
  if (existingUsers === 0) {
    console.log("No users found, seeding test data...");
    const hashed = await bcrypt.hash("password123", 10);

    const adminUser = await User.create({ name: "Admin User", email: "admin@example.com", password: hashed, role: "admin" });
    const analystUser = await User.create({ name: "Analyst User", email: "analyst@example.com", password: hashed, role: "analyst" });
    const viewerUser = await User.create({ name: "Viewer User", email: "viewer@example.com", password: hashed, role: "viewer" });

    const sampleRecords = [
      { amount: 50000, type: "income", category: "salary", date: new Date("2024-01-01"), notes: "January salary", createdBy: adminUser._id },
      { amount: 1200, type: "expense", category: "rent", date: new Date("2024-01-05"), notes: "Monthly rent", createdBy: adminUser._id },
      { amount: 300, type: "expense", category: "food", date: new Date("2024-01-10"), notes: "Groceries", createdBy: adminUser._id },
      { amount: 50000, type: "income", category: "salary", date: new Date("2024-02-01"), notes: "February salary", createdBy: adminUser._id },
      { amount: 1200, type: "expense", category: "rent", date: new Date("2024-02-05"), notes: "Monthly rent", createdBy: adminUser._id },
      { amount: 150, type: "expense", category: "utilities", date: new Date("2024-02-15"), notes: "Electricity bill", createdBy: adminUser._id },
      { amount: 50000, type: "income", category: "salary", date: new Date("2024-03-01"), notes: "March salary", createdBy: adminUser._id },
      { amount: 5000, type: "income", category: "freelance", date: new Date("2024-03-10"), notes: "Freelance project", createdBy: adminUser._id },
      { amount: 1200, type: "expense", category: "rent", date: new Date("2024-03-05"), notes: "Monthly rent", createdBy: adminUser._id },
      { amount: 500, type: "expense", category: "food", date: new Date("2024-03-20"), notes: "Eating out this month", createdBy: adminUser._id },
    ];
    await Record.insertMany(sampleRecords);

    console.log("Test User IDs (use as x-user-id header)");
    console.log(`Admin    ID: ${adminUser._id}`);
    console.log(`Analyst  ID: ${analystUser._id}`);
    console.log(`Viewer   ID: ${viewerUser._id}`);
  }
};

initDB();

app.use(cors({ origin: [process.env.FRONTEND_URL] }));
app.use(express.json());

app.get("/api/auth/roles", async (req, res) => {
  try {
    const User = require("./models/User");
    const userList = await User.find({}, "_id name role status");
    res.json(userList);
  } catch (err) {
    res.status(500).json({ message: "Could not load users" });
  }
});

app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Finance Dashboard API is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on server", error: err.message });
});

module.exports = app;
