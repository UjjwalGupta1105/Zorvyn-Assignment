import { useState } from "react";
import RoleSelector from "./components/RoleSelector.jsx";
import Dashboard from "./components/Dashboard.jsx";
import RecordForm from "./components/RecordForm.jsx";
import RecordList from "./components/RecordList.jsx";
import "./App.css";

function App() {
  const [activeUser, setActiveUser] = useState(null);
  // bump this to force RecordList to re-fetch after a new record is added
  const [listRefreshKey, setListRefreshKey] = useState(0);

  const handleUserSelect = (user) => {
    setActiveUser(user);
    setListRefreshKey(0);
  };

  const handleNewRecord = () => {
    setListRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="app-container">
      <h1>Finance Dashboard</h1>
      <p style={{ color: "#666", marginTop: "-10px" }}>Backend testing UI</p>
      <hr />

      <RoleSelector onSelect={handleUserSelect} />

      {!activeUser && (
        <p style={{ color: "#888" }}>Please select a role above to continue.</p>
      )}

      {activeUser && (
        <>
          <Dashboard userId={activeUser._id} role={activeUser.role} />
          <RecordForm
            userId={activeUser._id}
            role={activeUser.role}
            onRecordAdded={handleNewRecord}
          />
          <RecordList
            userId={activeUser._id}
            role={activeUser.role}
            refreshKey={listRefreshKey}
          />
        </>
      )}
    </div>
  );
}

export default App;
