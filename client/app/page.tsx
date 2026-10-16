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

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch(`${API_URL}/api/recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, servings, steps }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setTitle("");
      setServings(1);
      setSteps("");
      loadRecipes();
    } catch {
      setError("Could not save the recipe.");
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
        <button className="bg-black text-white rounded px-4 py-2" type="submit">
          Add recipe
        </button>
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
          </li>
        ))}
      </ul>
    </main>
  );
}