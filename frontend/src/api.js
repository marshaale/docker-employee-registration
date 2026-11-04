const BASE = `${import.meta.env.VITE_API_URL}/employees`;

async function request(url, options) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || "Something went wrong");
    err.fields = data.errors || {};
    throw err;
  }
  return data;
}

export const getEmployees = (search = "") =>
  request(`${BASE}?search=${encodeURIComponent(search)}`);
export const createEmployee = (body) =>
  request(BASE, { method: "POST", body: JSON.stringify(body) });
export const updateEmployee = (id, body) =>
  request(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteEmployee = (id) =>
  request(`${BASE}/${id}`, { method: "DELETE" });
