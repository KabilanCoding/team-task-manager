const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("ttm_token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const authApi = {
  signup: (payload) => apiRequest("/auth/signup", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => apiRequest("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  me: () => apiRequest("/auth/me")
};

export const dataApi = {
  dashboard: () => apiRequest("/tasks/dashboard"),
  users: () => apiRequest("/users"),
  projects: () => apiRequest("/projects"),
  tasks: () => apiRequest("/tasks"),
  createProject: (payload) => apiRequest("/projects", { method: "POST", body: JSON.stringify(payload) }),
  createTask: (payload) => apiRequest("/tasks", { method: "POST", body: JSON.stringify(payload) }),
  updateTaskStatus: (id, status) =>
    apiRequest(`/tasks/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) })
};
