# Database Design

The portfolio content is now persisted in PostgreSQL.

- The backend stores editable site sections in a `content_sections` table.
- Each row uses the section key, such as `profile`, `aboutPage`, or `siteCopy`, plus a `JSONB` payload and `updated_at` timestamp.
- API requests read directly from the database, so admin edits and direct DB edits become the active source of truth on the next request.
- On first startup, the backend seeds missing sections from the code defaults without overwriting existing rows.
- When upgrading from the prior SQLite-backed setup, the first PostgreSQL startup also imports missing sections from `backend/data/portfolio.db` if that file is present.

Current content table:

- `content_sections(section TEXT PRIMARY KEY, content JSONB, updated_at TIMESTAMPTZ)`

The current JSON-backed structure keeps the migration simple while still using a real PostgreSQL database. A future migration can map these resources to more normalized tables such as:

- `profiles`
- `projects`
- `publications`
- `experiences`
- `skill_categories`
- `skills`
- `blogs`
- `contact_messages`
- `admin_users`
- `site_copy`
- `about_pages`
- `achievements`

Depending on the final CMS direction, the content-heavy sections could also remain in JSONB-backed tables instead of many highly normalized tables.
