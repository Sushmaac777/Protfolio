# Database Design

The current implementation does not use a production database yet.

- Backend portfolio data is served from in-memory repositories for fast iteration.
- Frontend admin edits are stored locally in browser storage under the `portfolio-content-overrides` key.

A production migration can map these resources to tables such as:

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

Depending on the final CMS direction, the content-heavy sections could also live in a smaller number of JSON/JSONB-backed tables instead of many highly normalized tables.
