require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(body) {
  const errors = {};
  if (!body.full_name?.trim()) errors.full_name = "Full name is required";
  if (!body.email?.trim()) errors.email = "Email is required";
  else if (!EMAIL_RE.test(body.email))
    errors.email = "Enter a valid email address";
  if (!body.department?.trim()) errors.department = "Department is required";
  if (!body.position?.trim()) errors.position = "Position is required";
  if (body.salary !== "" && body.salary != null && Number(body.salary) < 0)
    errors.salary = "Salary cannot be negative";
  return errors;
}

// List (with optional ?search=)
app.get("/api/employees", async (req, res) => {
  try {
    const search = `%${req.query.search || ""}%`;
    const { rows } = await pool.query(
      `SELECT * FROM employees
       WHERE full_name ILIKE $1 OR email ILIKE $1 OR department ILIKE $1
       ORDER BY created_at DESC`,
      [search],
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load employees" });
  }
});

// Create
app.post("/api/employees", async (req, res) => {
  const errors = validate(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  const { full_name, email, phone, department, position, salary, hire_date } =
    req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO employees (full_name, email, phone, department, position, salary, hire_date)
       VALUES ($1,$2,$3,$4,$5,$6,COALESCE($7, CURRENT_DATE)) RETURNING *`,
      [
        full_name.trim(),
        email.trim().toLowerCase(),
        phone || null,
        department.trim(),
        position.trim(),
        salary === "" ? null : salary,
        hire_date || null,
      ],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === "23505")
      return res
        .status(409)
        .json({ errors: { email: "This email is already registered" } });
    console.error(err);
    res.status(500).json({ message: "Could not register employee" });
  }
});

// Update
app.put("/api/employees/:id", async (req, res) => {
  const errors = validate(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  const { full_name, email, phone, department, position, salary, hire_date } =
    req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE employees SET full_name=$1, email=$2, phone=$3, department=$4,
         position=$5, salary=$6, hire_date=COALESCE($7, hire_date)
       WHERE id=$8 RETURNING *`,
      [
        full_name.trim(),
        email.trim().toLowerCase(),
        phone || null,
        department.trim(),
        position.trim(),
        salary === "" ? null : salary,
        hire_date || null,
        req.params.id,
      ],
    );
    if (!rows.length)
      return res.status(404).json({ message: "Employee not found" });
    res.json(rows[0]);
  } catch (err) {
    if (err.code === "23505")
      return res
        .status(409)
        .json({ errors: { email: "This email is already registered" } });
    console.error(err);
    res.status(500).json({ message: "Could not update employee" });
  }
});

// Delete
app.delete("/api/employees/:id", async (req, res) => {
  try {
    const { rowCount } = await pool.query("DELETE FROM employees WHERE id=$1", [
      req.params.id,
    ]);
    if (!rowCount)
      return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not remove employee" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
