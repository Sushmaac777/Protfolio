# System Design

The frontend is a Vite React SPA that consumes a FastAPI backend.

- React handles routing, layout, and presentation.
- FastAPI exposes typed REST endpoints for portfolio content.
- Repositories currently serve in-memory mock data for quick iteration.
- Services isolate business logic so the data layer can later move to a database.

