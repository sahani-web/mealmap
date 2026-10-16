"use client";

import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

type Recipe = {
  id: number;
  title: string;
  servings: number;
  steps: string;
};

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [title, setTitle] = useState("");
  const [servings, setServings] = useState(1);
  const [steps, setSteps] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRecipes() {
    try {
      const res = await fetch(`${API_URL}/api/recipes`);
      if (!res.ok) throw new Error("Failed to load");
      setRecipes(await res.json());
      setError("");
    } catch {
      setError("Could not load recipes. Is the server running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecipes();
  }, []);

  function resetForm() {
    setTitle("");
    setServings(1);
    setSteps("");
    setEditingId(null);
  }

  function startEdit(r: Recipe) {
    setEditingId(r.id);
    setTitle(r.title);
    setServings(r.servings);
    setSteps(r.steps);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const url =
      editingId === null
        ? `${API_URL}/api/recipes`
        : `${API_URL}/api/recipes/${editingId}`;
    const method = editingId === null ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, servings, steps }),
      });
      if (!res.ok) throw new Error("Failed to save");
      resetForm();
      loadRecipes();
    } catch {
      setError("Could not save the recipe.");
    }
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`${API_URL}/api/recipes/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      if (editingId === id) resetForm();
      loadRecipes();
    } catch {
      setError("Could not delete the recipe.");
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold mb-6">MealMap</h1>

      <form onSubmit={handleSubmit} className="mb-8 space-y-3">
        <input
          className="w-full border rounded p-2"
          placeholder="Recipe title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full border rounded p-2"
          type="number"
          min={1}
          value={servings}
          onChange={(e) => setServings(Number(e.target.value))}
        />
        <textarea
          className="w-full border rounded p-2"
          placeholder="Steps"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
        />
        <div className="flex gap-3">
          <button className="bg-black text-white rounded px-4 py-2" type="submit">
            {editingId === null ? "Add recipe" : "Save changes"}
          </button>
          {editingId !== null && (
            <button
              type="button"
              className="border rounded px-4 py-2"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && recipes.length === 0 && <p>No recipes yet.</p>}

      <ul className="space-y-4">
        {recipes.map((r) => (
          <li key={r.id} className="border rounded p-4">
            <h2 className="text-xl font-semibold">{r.title}</h2>
            <p className="text-sm text-gray-600">Serves {r.servings}</p>
            <p className="mt-2">{r.steps}</p>
            <div className="mt-3 flex gap-4 text-sm">
              <button className="underline" onClick={() => startEdit(r)}>
                Edit
              </button>
              <button
                className="text-red-600 underline"
                onClick={() => handleDelete(r.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}