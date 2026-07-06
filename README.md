# Portfolio Website

A full-stack portfolio starter built from the provided blueprint. The project includes:

- `frontend/`: React + Vite + TypeScript portfolio UI
- `backend/`: FastAPI portfolio API with PostgreSQL-backed content and starter tests
- `docs/`: architecture and deployment notes

## Project Notes

- Public UI routes include `/`, `/about`, `/journey`, `/projects`, `/research`, `/skills`, `/blog`, `/contact`, and `/admin`.
- The admin login screen is at `/admin`, and the protected content editor is at `/admin/dashboard`.
- The site now reads its shared copy and editable sections from the backend, so the frontend no longer owns those content blocks as a separate source of truth.
- The backend persists editable portfolio content in PostgreSQL, and API reads now come from that database on each request.
- The footer now renders a left-aligned site title plus a centered copyright line from `siteCopy.footer`.

## New Here?

Start with the beginner-friendly setup guide:

- [docs/setup-guide.md](docs/setup-guide.md)

You can also jump directly to:

- [docs/api-spec.md](docs/api-spec.md)
- [docs/system-design.md](docs/system-design.md)
- [docs/database-design.md](docs/database-design.md)
- [docs/deployment.md](docs/deployment.md)

## Run locally

### Quick start

Backend:

```bash
docker compose up -d postgres
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173` and backend runs on `http://localhost:8000`.
The backend health check is available at `http://localhost:8000/health`.
The backend expects PostgreSQL at `postgresql://postgres:postgres@localhost:5432/portfolio` unless you override `PORTFOLIO_DATABASE_URL`.
If you are upgrading from the earlier SQLite-backed version, the first PostgreSQL startup imports missing content rows from `backend/data/portfolio.db` when that file exists.

If you want the full first-time setup walkthrough, troubleshooting tips, and local admin credentials, use [docs/setup-guide.md](docs/setup-guide.md).

## Included API routes

- `GET /health`
- `GET /api/v1/profile`
- `GET /api/v1/projects`
- `GET /api/v1/projects/{slug}`
- `GET /api/v1/publications`
- `GET /api/v1/experience`
- `GET /api/v1/skills`
- `GET /api/v1/blogs`
- `GET /api/v1/blogs/{slug}`
- `GET /api/v1/content`
- `POST /api/v1/contact`
- `POST /api/v1/auth/login`
- `GET /api/v1/admin/health`
- `GET /api/v1/admin/content`
- `PUT /api/v1/admin/content/{section}`
- `POST /api/v1/admin/content/{section}/reset`
- `POST /api/v1/admin/content/reset-all`
