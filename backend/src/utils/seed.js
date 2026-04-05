// seed script — run with: node src/utils/seed.js
// only works if you have a real MongoDB connection (not in-memory)

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const User = require("../models/User");
const Record = require("../models/Record");

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // wipe existing data first
    await User.deleteMany({});
    await Record.deleteMany({});
    console.log("Cleared existing data");

    const hashed = await bcrypt.hash("password123", 10);

    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: hashed,
      role: "admin",
      status: "active",
    });

    const analystUser = await User.create({
      name: "Analyst User",
      email: "analyst@example.com",
      password: hashed,
      role: "analyst",
      status: "active",
    });

    const viewerUser = await User.create({
      name: "Viewer User",
      email: "viewer@example.com",
      password: hashed,
      role: "viewer",
      status: "active",
    });

    console.log("Users created");

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
    console.log("Records created");

    console.log("\n--- Test User IDs ---");
    console.log("Admin ID:", adminUser._id.toString());
    console.log("Analyst ID:", analystUser._id.toString());
    console.log("Viewer ID:", viewerUser._id.toString());
    console.log("\nUse these IDs in the x-user-id header to test the API");

    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
}

seedData();
