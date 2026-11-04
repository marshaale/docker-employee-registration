const fs = require("node:fs/promises");
const path = require("node:path");
const pool = require("./db");

async function migrate() {
  const schema = await fs.readFile(path.join(__dirname, "schema.sql"), "utf8");
  await pool.query(schema);
}

module.exports = migrate;

if (require.main === module) {
  migrate()
    .then(() => console.log("Database schema is up to date"))
    .catch((error) => {
      console.error("Database migration failed:", error);
      process.exitCode = 1;
    })
    .finally(() => pool.end());
}