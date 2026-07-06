# Setup Guide

This guide is for someone opening the project for the first time and wanting to run it locally.

## What You Are Running

This project has two parts:

- `frontend/`: React + Vite + TypeScript
- `backend/`: FastAPI

You need both running at the same time during local development.

## Prerequisites

Install these first:

- Node.js and `npm`
- Python 3

You can quickly check them with:

```bash
node -v
npm -v
python3 --version
```

## Project Structure

From the project root:

```text
frontend/   React app
backend/    FastAPI app
docs/       project notes
```

## 1. Set Up The Frontend

Open a terminal in the project root, then run:

```bash
cd frontend
npm install
cp .env.example .env
```

The frontend `.env` file points the UI to the backend API:

```bash
VITE_API_URL=http://localhost:8000/api/v1
```

If you skip the `.env` file, the frontend still falls back to `http://localhost:8000/api/v1`, but keeping the file makes the setup clearer for new contributors.

## 2. Set Up The Backend

In a second terminal, start from the project root and run:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

The backend `.env` file contains the local development settings:

```bash
PORTFOLIO_ENVIRONMENT=development
PORTFOLIO_DEBUG=true
PORTFOLIO_FRONTEND_ORIGIN=http://localhost:5173
PORTFOLIO_ADMIN_USERNAME=admin
PORTFOLIO_ADMIN_PASSWORD=portfolio123
```

## 3. Start The Backend

From `backend/` with the virtual environment activated:

```bash
uvicorn app.main:app --reload
```

The backend should be available at:

- `http://localhost:8000`
- `http://localhost:8000/health`
- `http://localhost:8000/api/v1`

## 4. Start The Frontend

In another terminal, from `frontend/`:

```bash
npm run dev
```

The frontend should be available at:

- `http://localhost:5173`

## 5. Open The App

Once both services are running:

- Open `http://localhost:5173` in your browser
- The frontend will call the backend at `http://localhost:8000/api/v1`
- You can verify the backend separately at `http://localhost:8000/health`

## Admin Login

If you use the admin login flow locally, the default credentials are:

- Username: `admin`
- Password: `portfolio123`

You can change them in `backend/.env`.

## Admin Content Editor

The portfolio includes a local admin editor:

- Visit `http://localhost:5173/admin` to sign in
- Open `http://localhost:5173/admin/dashboard` after signing in

Important behavior:

- Admin content edits are stored locally in the browser, not in the backend database
- The `Site Copy` section controls shared labels plus the footer title and copyright line
- Clearing browser overrides or using the dashboard reset actions returns the site to the default bundled content

## Common Commands

Frontend:

```bash
cd frontend
npm run dev
npm run build
```

Backend:

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload
pytest
```

## Troubleshooting

### `npm` or `node` command not found

Install Node.js, then restart your terminal and run:

```bash
node -v
npm -v
```

### `python3` command not found

Install Python 3, then verify with:

```bash
python3 --version
```

### Frontend loads, but no data appears

Check these first:

- The backend terminal is still running
- The backend is available at `http://localhost:8000/health`
- `frontend/.env` contains the correct `VITE_API_URL`

### CORS errors in the browser

Make sure the backend `.env` has:

```bash
PORTFOLIO_FRONTEND_ORIGIN=http://localhost:5173
```

Then restart the backend.

### Port `5173` or `8000` is already in use

You can run on different ports, but update both apps so they still match.

Example:

- Start the backend on another port with `uvicorn app.main:app --reload --port 8001`
- Change `frontend/.env` to `VITE_API_URL=http://localhost:8001/api/v1`
- If needed, change `PORTFOLIO_FRONTEND_ORIGIN` in `backend/.env`

### `--reload` does not work in a restricted environment

Some sandboxes or managed terminals block file watching. If that happens, run:

```bash
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

That starts the backend without hot reload.

## Quick Start Summary

If you just want the shortest path:

Terminal 1:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Terminal 2:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
