// simple comments service (Express + pg)
const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");

const port = process.env.PORT || 3020;
const pool = new Pool({
  host: process.env.PGHOST || "127.0.0.1",
  user: process.env.PGUSER || "bloguser",
  password: process.env.PGPASSWORD || "blogpassword",
  database: process.env.PGDATABASE || "blogdb",
  port: process.env.PGPORT || 5432,
});

const app = express();
app.use(bodyParser.json());

app.post("/:slug", async (req, res) => {
  const { slug } = req.params;
  if (!slug) return res.status(400).json({ error: "slug required" });

  await pool.query(`INSERT INTO likes (slug) VALUES ($1)`, [slug]);
  res.status(201).json({ response: "like added!!!" });
});

app.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  if (!slug) return res.status(400).json({ error: "slug required" });

  const q = `SELECT COUNT(id) FROM likes WHERE slug = $1`;
  const result = await pool.query(q, [slug]);
  res.json({ count: result.rows[0].count });
});

app.listen(port, () => console.log(`likes service listening ${port}`));
