# Employee Registration

React (Vite) + Node/Express + PostgreSQL.

## 1. Database

```bash
psql -U postgres -c "CREATE DATABASE employee_db;"
psql -U postgres -d employee_db -f backend/schema.sql
```

## 2. Backend (http://localhost:3000)

```bash
cd backend
cp .env.example .env      # then put your PostgreSQL password in .env
npm install
npm run dev
```

## 3. Frontend (http://localhost:5173)

```bash
cd frontend
npm install
npm run dev
```

## API

| Method | Endpoint           | Purpose                  |
| ------ | ------------------ | ------------------------ |
| GET    | /api/employees     | List (optional ?search=) |
| POST   | /api/employees     | Register an employee     |
| PUT    | /api/employees/:id | Update an employee       |
| DELETE | /api/employees/:id | Remove an employee       |
