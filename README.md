# Portfolio Website

A full-stack portfolio starter built from the provided blueprint. The project includes:

- `frontend/`: React + Vite + TypeScript portfolio UI
- `backend/`: FastAPI portfolio API with mock content and starter tests
- `docs/`: architecture and deployment notes

## New Here?

Start with the beginner-friendly setup guide:

- [docs/setup-guide.md](docs/setup-guide.md)

## Run locally

### Quick start

Backend:

```bash
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

If you want the full first-time setup walkthrough, troubleshooting tips, and local admin credentials, use [docs/setup-guide.md](docs/setup-guide.md).

## Included API routes

- `GET /api/v1/profile`
- `GET /api/v1/projects`
- `GET /api/v1/projects/{slug}`
- `GET /api/v1/publications`
- `GET /api/v1/experience`
- `GET /api/v1/skills`
- `GET /api/v1/blogs`
- `GET /api/v1/blogs/{slug}`
- `POST /api/v1/contact`
- `POST /api/v1/auth/login`
