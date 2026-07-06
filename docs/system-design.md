# System Design

The frontend is a Vite React SPA that consumes a FastAPI backend.

- React handles routing, layout, and presentation.
- FastAPI exposes typed REST endpoints for portfolio content.
- The backend keeps editable content in an in-memory content store for quick iteration.
- Services isolate business logic so the data layer can later move to a database.
- The frontend includes a protected admin dashboard route that edits content sections such as `aboutPage`, `achievements`, and `siteCopy`.
- Admin edits are saved through protected backend routes, so the backend is the active source of truth while the server is running.
- Shared UI copy, including the footer title and copyright line, is driven by `siteCopy`.
