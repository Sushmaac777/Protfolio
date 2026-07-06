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
- `POST /contact`: submit a contact message
- `POST /auth/login`: receive a mock admin token

## Protected admin route

- `GET /admin/health`: requires the mock admin token and returns an authenticated health response

## Notes

- The frontend posts admin credentials to `/api/v1/auth/login`.
- Public site content is currently served from mock/in-memory repositories plus optional browser-local content overrides on the frontend.
