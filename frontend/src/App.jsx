import { useCallback, useEffect, useState } from "react";
import EmployeeForm from "./EmployeeForm.jsx";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from "./api.js";

const initials = (name) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [serverErrors, setServerErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    try {
      setEmployees(await getEmployees(search));
    } catch (e) {
      setNotice(e.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 250); // debounce search
    return () => clearTimeout(t);
  }, [load]);

  const flash = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3000);
  };

  const handleSubmit = async (form, reset) => {
    setSaving(true);
    setServerErrors({});
    try {
      if (editing) {
        await updateEmployee(editing.id, form);
        setEditing(null);
        flash("Changes saved");
      } else {
        await createEmployee(form);
        reset();
        flash("Employee registered");
      }
      await load();
    } catch (e) {
      if (Object.keys(e.fields).length) setServerErrors(e.fields);
      else flash(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (emp) => {
    if (!window.confirm(`Remove ${emp.full_name} from the register?`)) return;
    try {
      await deleteEmployee(emp.id);
      if (editing?.id === emp.id) setEditing(null);
      flash("Employee removed");
      await load();
    } catch (e) {
      flash(e.message);
    }
  };

  return (
    <div className="shell">
      <header>
        <h1>Employee register</h1>
        <p>{employees.length} {employees.length === 1 ? "person" : "people"} on file</p>
      </header>

      {notice && <div className="notice" role="status">{notice}</div>}

      <main>
        <EmployeeForm
          editing={editing}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
          serverErrors={serverErrors}
          saving={saving}
        />

        <section className="panel list">
          <input
            className="search"
            type="search"
            placeholder="Search by name, email or department"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search employees"
          />

          {loading ? (
            <p className="empty">Loading employees…</p>
          ) : employees.length === 0 ? (
            <p className="empty">
              {search ? "No employees match your search." : "No employees yet. Register the first one using the form."}
            </p>
          ) : (
            <ul>
              {employees.map((emp) => (
                <li key={emp.id} className={editing?.id === emp.id ? "active" : ""}>
                  <div className="avatar" aria-hidden="true">{initials(emp.full_name)}</div>
                  <div className="info">
                    <strong>{emp.full_name}</strong>
                    <span>{emp.position}, {emp.department}</span>
                    <span className="muted">{emp.email}{emp.phone ? ` · ${emp.phone}` : ""}</span>
                  </div>
                  <div className="meta">
                    <span>Hired {new Date(emp.hire_date).toLocaleDateString()}</span>
                    {emp.salary != null && <span>${Number(emp.salary).toLocaleString()}/mo</span>}
                  </div>
                  <div className="row-actions">
                    <button className="btn small" onClick={() => setEditing(emp)}>Edit</button>
                    <button className="btn small danger" onClick={() => handleDelete(emp)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
