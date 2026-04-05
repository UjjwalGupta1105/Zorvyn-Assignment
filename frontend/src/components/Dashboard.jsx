import { useEffect, useState } from "react";
import { getDashboardSummary } from "../api";

function Dashboard({ userId, role }) {
  const [summaryData, setSummaryData] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  function loadSummary() {
    getDashboardSummary(userId)
      .then((res) => {
        if (res.message) {
          setErrMsg(res.message);
        } else {
          setSummaryData(res);
          setErrMsg("");
        }
      })
      .catch(() => setErrMsg("Failed to fetch summary"));
  }

  useEffect(() => {
    if (userId) loadSummary();
  }, [userId]);

  // viewers don't have access to summary stats
  if (role === "viewer") {
    return (
      <div style={{ border: "1px solid #ddd", padding: "16px", marginBottom: "20px" }}>
        <h3>Dashboard Summary</h3>
        <p style={{ color: "#888" }}>Viewers cannot access summary data.</p>
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid #ddd", padding: "16px", marginBottom: "20px" }}>
      <h3>Dashboard Summary</h3>
      {errMsg && <p style={{ color: "red" }}>{errMsg}</p>}
      {!summaryData && !errMsg && <p>Loading...</p>}
      {summaryData && (
        <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: "#555", fontSize: "13px" }}>Total Income</p>
            <p style={{ margin: 0, fontSize: "20px", color: "green" }}>₹{summaryData.totalIncome.toLocaleString()}</p>
          </div>
          <div>
            <p style={{ margin: 0, color: "#555", fontSize: "13px" }}>Total Expenses</p>
            <p style={{ margin: 0, fontSize: "20px", color: "red" }}>₹{summaryData.totalExpenses.toLocaleString()}</p>
          </div>
          <div>
            <p style={{ margin: 0, color: "#555", fontSize: "13px" }}>Net Balance</p>
            <p style={{ margin: 0, fontSize: "20px" }}>₹{summaryData.netBalance.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
