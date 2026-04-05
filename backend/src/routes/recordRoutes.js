const express = require("express");
const router = express.Router();

const {
  getRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
} = require("../controllers/recordController");

const authenticate = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const { validateRecord } = require("../middleware/validationMiddleware");

// all record routes need a valid user
router.use(authenticate);

// read – everyone can see records
router.get("/", allowRoles("viewer", "analyst", "admin"), getRecords);
router.get("/:id", allowRoles("viewer", "analyst", "admin"), getRecordById);

// write – only analyst and admin
router.post("/", allowRoles("analyst", "admin"), validateRecord, createRecord);
router.put("/:id", allowRoles("analyst", "admin"), updateRecord);

// delete – admin only
router.delete("/:id", allowRoles("admin"), deleteRecord);

module.exports = router;
