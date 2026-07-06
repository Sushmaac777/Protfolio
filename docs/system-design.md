# System Design

The frontend is a Vite React SPA that consumes a FastAPI backend.

- React handles routing, layout, and presentation.
- FastAPI exposes typed REST endpoints for portfolio content.
- Repositories currently serve in-memory mock data for quick iteration.
- Services isolate business logic so the data layer can later move to a database.
- The frontend includes a protected admin dashboard route that edits content sections such as `aboutPage`, `achievements`, and `siteCopy`.
- Admin edits are persisted in browser local storage on the frontend, so the current CMS behavior is local to the browser session/profile rather than shared server state.
- Shared UI copy, including the footer title and copyright line, is driven by `siteCopy`.
