CREATE TABLE IF NOT EXISTS employees (
  id          SERIAL PRIMARY KEY,
  full_name   VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  phone       VARCHAR(30),
  department  VARCHAR(60)  NOT NULL,
  position    VARCHAR(80)  NOT NULL,
  salary      NUMERIC(12,2) CHECK (salary >= 0),
  hire_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
