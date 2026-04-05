const bcrypt = require("bcryptjs");
const User = require("../models/User");

// GET /api/users — admin only
const getAllUsers = async (req, res) => {
  try {
    // don't send passwords back
    const allUsers = await User.find().select("-password");
    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong on server", error: err.message });
  }
};

// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong on server", error: err.message });
  }
};

// POST /api/users — create new user (admin)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // make sure email isn't already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "viewer",
    });

    // strip password from response
    const userObj = newUser.toObject();
    delete userObj.password;

    res.status(201).json({ message: "User created successfully", user: userObj });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong on server", error: err.message });
  }
};

// PATCH /api/users/:id/role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !["viewer", "analyst", "admin"].includes(role)) {
      return res.status(400).json({ message: "Valid role is required (viewer, analyst, admin)" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Role updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong on server", error: err.message });
  }
};

// PATCH /api/users/:id/status
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Status must be active or inactive" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Status updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong on server", error: err.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUserRole,
  updateUserStatus,
  getUserById,
};
