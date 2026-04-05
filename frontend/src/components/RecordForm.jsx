import { useState } from "react";
import { createRecord } from "../api";

const defaultFormState = { amount: "", type: "income", category: "", date: "", notes: "" };

function RecordForm({ userId, role, onRecordAdded }) {
  const [formData, setFormData] = useState(defaultFormState);
  const [statusMsg, setStatusMsg] = useState("");

  // TODO: maybe allow analyst too later, for now keeping it admin-only as per requirement
  const canSubmit = role === "admin";

  const handleFieldChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg("");
    try {
      const result = await createRecord(userId, formData);
      console.log("create record response:", result);
      if (result.record) {
        setStatusMsg("Record added!");
        setFormData(defaultFormState);
        onRecordAdded();
      } else {
        setStatusMsg(result.message || "Something went wrong");
      }
    } catch (err) {
      setStatusMsg("Request failed");
    }
  };

  if (!canSubmit) {
    return (
      <div style={{ border: "1px solid #ddd", padding: "16px", marginBottom: "20px" }}>
        <h3>Add Record</h3>
        <p style={{ color: "#888" }}>
          Only admins can add records. You are logged in as <strong>{role}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid #ddd", padding: "16px", marginBottom: "20px" }}>
      <h3>Add New Record</h3>
      <form onSubmit={handleFormSubmit}>
        <div style={{ marginBottom: "8px" }}>
          <label>Amount: </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleFieldChange}
            required
            min="0"
          />
        </div>
        <div style={{ marginBottom: "8px" }}>
          <label>Type: </label>
          <select name="type" value={formData.type} onChange={handleFieldChange}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div style={{ marginBottom: "8px" }}>
          <label>Category: </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleFieldChange}
            placeholder="e.g. salary, rent"
            required
          />
        </div>
        <div style={{ marginBottom: "8px" }}>
          <label>Date: </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleFieldChange}
            required
          />
        </div>
        <div style={{ marginBottom: "8px" }}>
          <label>Notes: </label>
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleFieldChange}
            placeholder="optional"
          />
        </div>
        <button type="submit">Add Record</button>
      </form>
      {statusMsg && <p style={{ marginTop: "8px" }}>{statusMsg}</p>}
    </div>
  );
}

export default RecordForm;
