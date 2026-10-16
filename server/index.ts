import "dotenv/config";
import express from "express";
import cors from "cors";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "MealMap server is running" });
});

app.get("/api/db-check", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "ok", time: result.rows[0].now });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Database connection failed" });
  }
});

app.get("/api/recipes", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM recipes ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch recipes" });
  }
});

app.post("/api/recipes", async (req, res) => {
  const { title, servings, steps } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO recipes (title, servings, steps) VALUES ($1, $2, $3) RETURNING *",
      [title, servings ?? 1, steps ?? ""]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not save recipe" });
  }
});

app.delete("/api/recipes/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid recipe id" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM recipes WHERE id = $1 RETURNING id",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json({ deleted: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete recipe" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});