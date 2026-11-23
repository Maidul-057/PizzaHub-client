import { authClient } from "./auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

let cache = { token: null, expires: 0 };
export const clearToken = () => {
  cache = { token: null, expires: 0 };
};

// Better Auth issues a short-lived JWT; we keep it in memory only (never localStorage)
async function getToken() {
  if (cache.token && Date.now() < cache.expires) return cache.token;
  const { data, error } = await authClient.token();
  if (error || !data?.token) throw new ApiError("Your session has expired. Please sign in again.", 401);
  cache = { token: data.token, expires: Date.now() + 10 * 60 * 1000 };
  return data.token;
}

const toQuery = (params = {}) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "" && v !== "all") qs.set(k, v);
  });
  const s = qs.toString();
  return s ? `?${s}` : "";
};

export async function api(path, { method = "GET", body, auth = true, params } = {}, retried = false) {
  const headers = { "Content-Type": "application/json" };
  if (auth) headers.Authorization = `Bearer ${await getToken()}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}${toQuery(params)}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Cannot reach the server. Please check your connection and try again.", 0);
  }

  if (res.status === 401 && auth && !retried) {
    clearToken();
    return api(path, { method, body, auth, params }, true);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.message || "Something went wrong", res.status);
  return data;
}
