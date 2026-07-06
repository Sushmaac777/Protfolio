# API Spec

Public health endpoint: `/health`

API base URL: `/api/v1`

## Public routes

- `GET /profile`: portfolio owner bio and social links
- `GET /projects`: all projects
- `GET /projects/{slug}`: one project by slug
- `GET /publications`: publication list
- `GET /experience`: experience timeline
- `GET /skills`: grouped skill categories
- `GET /blogs`: blog summaries
- `GET /blogs/{slug}`: full blog post
- `GET /content`: shared frontend-managed content now served by the backend, including `aboutPage`, `achievements`, and `siteCopy`
- `POST /contact`: submit a contact message
- `POST /auth/login`: receive a mock admin token

## Protected admin route

- `GET /admin/health`: requires the mock admin token and returns an authenticated health response
- `GET /admin/content`: returns the full editable content map
- `PUT /admin/content/{section}`: replaces one content section
- `POST /admin/content/{section}/reset`: resets one content section to backend defaults
- `POST /admin/content/reset-all`: resets the full content store to backend defaults

## Notes

- The frontend posts admin credentials to `/api/v1/auth/login`.
- Public site content is served from the backend PostgreSQL database.
- By default the backend expects `postgresql://postgres:postgres@localhost:5432/portfolio`, configurable with `PORTFOLIO_DATABASE_URL`.
