import { useEffect, useState } from "react";
import { getRecords, deleteRecord } from "../api";

function RecordList({ userId, role, refreshKey }) {
  const [recordsList, setRecordsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // client-side filter state
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const loadRecords = () => {
    setIsLoading(true);
    getRecords(userId)
      .then((data) => {
        if (Array.isArray(data)) {
          setRecordsList(data);
          setFetchError("");
        } else {
          setFetchError(data.message || "Failed to load records");
        }
        setIsLoading(false);
      })
      .catch(() => {
        setFetchError("Request failed");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (userId) loadRecords();
  }, [userId, refreshKey]);

  const handleDeleteRecord = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    await deleteRecord(userId, id);
    loadRecords(); // re-fetch after delete
  };

  // apply the filters on the client side
  const filteredRecords = recordsList.filter((r) => {
    if (typeFilter && r.type !== typeFilter) return false;
    if (categoryFilter && !r.category.toLowerCase().includes(categoryFilter.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ border: "1px solid #ddd", padding: "16px" }}>
      <h3>Records ({filteredRecords.length})</h3>

      <div style={{ marginBottom: "12px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="text"
          placeholder="Filter by category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        />
      </div>

      {isLoading && <p>Loading records...</p>}
      {fetchError && <p style={{ color: "red" }}>{fetchError}</p>}

      {!isLoading && filteredRecords.length === 0 && <p>No records found.</p>}

      {!isLoading && filteredRecords.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5", textAlign: "left" }}>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Notes</th>
              <th style={thStyle}>Created By</th>
              {role === "admin" && <th style={thStyle}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((r) => (
              <tr key={r._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>{new Date(r.date).toLocaleDateString()}</td>
                <td style={tdStyle}>
                  <span style={{ color: r.type === "income" ? "green" : "red" }}>{r.type}</span>
                </td>
                <td style={tdStyle}>{r.category}</td>
                <td style={tdStyle}>₹{r.amount.toLocaleString()}</td>
                <td style={tdStyle}>{r.notes || "-"}</td>
                <td style={tdStyle}>{r.createdBy?.name || "—"}</td>
                {role === "admin" && (
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleDeleteRecord(r._id)}
                      style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// keeping styles as simple objects at the bottom
const thStyle = { padding: "8px", borderBottom: "2px solid #ddd" };
const tdStyle = { padding: "8px" };

export default RecordList;
