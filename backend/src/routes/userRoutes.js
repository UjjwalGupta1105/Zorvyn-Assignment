const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  createUser,
  updateUserRole,
  updateUserStatus,
  getUserById,
} = require("../controllers/userController");

const authenticate = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const { validateUser } = require("../middleware/validationMiddleware");

// everything under /api/users is admin-only
router.use(authenticate);
router.use(allowRoles("admin"));

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", validateUser, createUser);
router.patch("/:id/role", updateUserRole);
router.patch("/:id/status", updateUserStatus);

module.exports = router;
