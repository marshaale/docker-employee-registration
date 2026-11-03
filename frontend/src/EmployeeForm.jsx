import { useEffect, useState } from "react";

const empty = {
  full_name: "", email: "", phone: "", department: "",
  position: "", salary: "", hire_date: "",
};

export default function EmployeeForm({ editing, onSubmit, onCancel, serverErrors, saving }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(
      editing
        ? {
            ...empty,
            ...editing,
            hire_date: editing.hire_date?.slice(0, 10) ?? "",
            salary: editing.salary ?? "",
            phone: editing.phone ?? "",
          }
        : empty
    );
    setErrors({});
  }, [editing]);

  useEffect(() => setErrors(serverErrors || {}), [serverErrors]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.full_name.trim()) errs.full_name = "Full name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address";
    if (!form.department.trim()) errs.department = "Department is required";
    if (!form.position.trim()) errs.position = "Position is required";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSubmit(form, () => setForm(empty));
  };

  // Rendered as a function (not a component) so inputs keep focus while typing
  const field = (name, label, type = "text", extra = {}) => (
    <label className={errors[name] ? "field has-error" : "field"}>
      <span>{label}</span>
      <input name={name} type={type} value={form[name]} onChange={change} {...extra} />
      {errors[name] && <small>{errors[name]}</small>}
    </label>
  );

  return (
    <form className="panel form" onSubmit={submit} noValidate>
      <h2>{editing ? "Edit employee" : "Register employee"}</h2>
      {field("full_name", "Full name", "text", { autoComplete: "off" })}
      {field("email", "Work email", "email")}
      <div className="row">
        {field("phone", "Phone", "tel")}
        {field("hire_date", "Hire date", "date")}
      </div>
      <div className="row">
        {field("department", "Department")}
        {field("position", "Position")}
      </div>
      {field("salary", "Monthly salary", "number", { min: "0", step: "0.01" })}
      <div className="actions">
        <button className="btn primary" disabled={saving}>
          {saving ? "Saving…" : editing ? "Save changes" : "Register employee"}
        </button>
        {editing && (
          <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}
