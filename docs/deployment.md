# Deployment

## Frontend

- Build the static site with `npm run build`.
- Serve the generated `frontend/dist/` directory through Vercel, Netlify, Nginx, or another static host.
- Set `VITE_API_URL` to the deployed backend API base, for example `https://your-api.example.com/api/v1`.

## Backend

- Run FastAPI with Uvicorn behind a reverse proxy.
- Configure at least these environment variables:
  - `PORTFOLIO_DATABASE_URL`
  - `PORTFOLIO_FRONTEND_ORIGIN`
  - `PORTFOLIO_ADMIN_USERNAME`
  - `PORTFOLIO_ADMIN_PASSWORD`
- Expose `/health` for uptime checks and `/api/v1/*` for application traffic.
- Provision PostgreSQL separately and point `PORTFOLIO_DATABASE_URL` at it before starting the API.

## Containers

- The repository includes Dockerfiles for both apps.
- For a simple local container run with PostgreSQL included, use `docker-compose up --build` from the project root.
