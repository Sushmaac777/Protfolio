# System Design

The frontend is a Vite React SPA that consumes a FastAPI backend.

- React handles routing, layout, and presentation.
- FastAPI exposes typed REST endpoints for portfolio content.
- The backend persists editable content in PostgreSQL and reads from that database on each request.
- Services isolate business logic so the section-based content store can later expand into more normalized tables if needed.
- The frontend includes a protected admin dashboard route that edits content sections such as `aboutPage`, `achievements`, and `siteCopy`.
- Admin edits are saved through protected backend routes, and direct database edits are also reflected because the API no longer caches content in memory.
- Shared UI copy, including the footer title and copyright line, is driven by `siteCopy`.
