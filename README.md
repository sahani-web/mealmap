# MealMap

A full-stack meal planner. Right now it manages recipes (create, read, update, delete). A weekly planner, a merged grocery list and nutrition totals are coming next.

## Tech stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (hosted on Neon)

## Features so far

- Add, view, edit and delete recipes
- REST API with input validation
- Parameterized SQL queries to prevent SQL injection
- Loading, error and empty states on the UI

## Planned features

- Ingredients per recipe
- Weekly meal planner
- Grocery list that merges duplicate ingredients
- Nutrition totals from a third-party API
- AI recipe parser with output validation
- User login

## API

| Method | Route | What it does |
|---|---|---|
| GET | /api/health | Check the server is running |
| GET | /api/db-check | Check the database connection |
| GET | /api/recipes | List all recipes |
| POST | /api/recipes | Create a recipe |
| PUT | /api/recipes/:id | Update a recipe |
| DELETE | /api/recipes/:id | Delete a recipe |

## Run it locally

**1. Database.** Create a free PostgreSQL database on [Neon](https://neon.tech), then run this in its SQL Editor:

```sql
CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  servings INTEGER NOT NULL DEFAULT 1,
  steps TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**2. Server.** Create `server/.env` containing your connection string:

```
DATABASE_URL=your-neon-connection-string
```

Then run:

```
cd server
npm install
npm run dev
```

The API runs at http://localhost:5000.

**3. Client.**

```
cd client
npm install
npm run dev
```

The app runs at http://localhost:3000.

## What I learned

- How a Next.js frontend, an Express API and a PostgreSQL database fit together
- Keeping secrets in `.env` and out of Git
- Using parameterized queries and validating input on the server