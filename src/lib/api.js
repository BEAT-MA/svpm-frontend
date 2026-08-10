const BASE = import.meta.env.VITE_API_URL || "";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    let message = "Something went wrong";
    try {
      const body = await res.json();
      message = body.error || message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

const get = (path, options) => request(path, options);
const post = (path, body) => request(path, { method: "POST", body: JSON.stringify(body) });
const postForm = (path, body) => request(path, { method: "POST", body });

export const api = {
  getPage: (slug, options) => get(`/api/pages/${slug}`, options),
  list: (path, query = "", options) => get(`/api/${path}${query}`, options),
  settings: (options) => get("/api/settings", options),
  submitTour: (data) => post("/api/tour-bookings", data),
  submitContact: (data) => post("/api/contact", data),
  submitApplication: (data) =>
    data instanceof FormData
      ? postForm("/api/applications", data)
      : post("/api/applications", data),
  newsletter: (email) => post("/api/newsletter", { email }),
};
