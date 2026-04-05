const Record = require("../models/Record");

// GET /api/records — supports type, category, date range filters
const getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    let filterObj = {};

    if (type) filterObj.type = type;
    if (category) filterObj.category = category;

    if (startDate || endDate) {
      filterObj.date = {};
      if (startDate) filterObj.date.$gte = new Date(startDate);
      if (endDate) filterObj.date.$lte = new Date(endDate);
    }

    const recordsData = await Record.find(filterObj)
      .populate("createdBy", "name email role")
      .sort({ date: -1 });

    res.json(recordsData);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong on server", error: err.message });
  }
};

// GET /api/records/:id
const getRecordById = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id).populate("createdBy", "name email role");

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong on server", error: err.message });
  }
};

// POST /api/records
const createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    const newRecord = await Record.create({
      amount,
      type,
      category,
      date: new Date(date),
      notes: notes || "",
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Record created", record: newRecord });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong on server", error: err.message });
  }
};

// PUT /api/records/:id
const updateRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    // only update fields that were actually sent
    const fieldsToUpdate = {};
    if (amount !== undefined) fieldsToUpdate.amount = amount;
    if (type) fieldsToUpdate.type = type;
    if (category) fieldsToUpdate.category = category;
    if (date) fieldsToUpdate.date = new Date(date);
    if (notes !== undefined) fieldsToUpdate.notes = notes;

    const updatedRecord = await Record.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Record updated", record: updatedRecord });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong on server", error: err.message });
  }
};

// DELETE /api/records/:id — admin only
const deleteRecord = async (req, res) => {
  try {
    const deletedRecord = await Record.findByIdAndDelete(req.params.id);

    if (!deletedRecord) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong on server", error: err.message });
  }
};

module.exports = {
  getRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
};
