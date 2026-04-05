const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

// builds the headers with the userId — used for all authenticated requests
function buildHeaders(userId) {
  return {
    "Content-Type": "application/json",
    "x-user-id": userId,
  };
}

export async function getRoleUsers() {
  const response = await fetch(`${API_BASE}/api/auth/roles`);
  return response.json();
}

export async function getDashboardSummary(userId) {
  const response = await fetch(`${API_BASE}/api/dashboard/summary`, {
    headers: buildHeaders(userId),
  });
  return response.json();
}

export async function getRecords(userId) {
  const response = await fetch(`${API_BASE}/api/records`, {
    headers: buildHeaders(userId),
  });
  return response.json();
}

export async function createRecord(userId, recordData) {
  const response = await fetch(`${API_BASE}/api/records`, {
    method: "POST",
    headers: buildHeaders(userId),
    body: JSON.stringify(recordData),
  });
  return response.json();
}

export async function deleteRecord(userId, recordId) {
  const response = await fetch(`${API_BASE}/api/records/${recordId}`, {
    method: "DELETE",
    headers: buildHeaders(userId),
  });
  return response.json();
}
