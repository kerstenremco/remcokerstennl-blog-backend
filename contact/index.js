const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");

const port = process.env.PORT || 3030;
const pool = new Pool({
  host: process.env.PGHOST || "127.0.0.1",
  user: process.env.PGUSER || "bloguser",
  password: process.env.PGPASSWORD || "blogpassword",
  database: process.env.PGDATABASE || "blogdb",
  port: process.env.PGPORT || 5432,
});

const app = express();
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  const { name, subject, body } = req.body;
  if (!body) return res.status(400).json({ error: "body required" });
  await pool.query(`INSERT INTO contact (name, subject, body) VALUES ($1, $2, $3)`, [name, subject, body]);
  res.status(201).json({ response: "Sent" });
});

app.listen(port, () => console.log(`Contact service listening ${port}`));
