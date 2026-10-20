# Sushma Acharya — Portfolio and Admin

The public portfolio is static **HTML and CSS**, with local images and Times New Roman throughout. The separate admin dashboard uses JavaScript, and a small Python renderer generates the public pages. GitHub Pages does not need a running backend or database.

## Run the website and admin locally

From this project folder, with Python 3.9 or later:

```sh
python3 -m pip install -r cms/requirements.txt
python3 cms/server.py
```

- Website: <http://localhost:8000/>
- Admin: <http://localhost:8000/admin/>

On your first visit, create your own username and password (at least 12 characters). Subsequent visits use that account. There is no default password. The server accepts connections only from this computer.

Use `--port 8001` if another server is using port 8000. Stop the old `python3 -m http.server` preview before starting this server; that static preview cannot handle admin login or saves.

## What you can manage

The sidebar provides editors for:

- Site identity and footer; profile, contact details, photo, and social links.
- Home text, highlights, services, and calls to action.
- About text, education, capabilities, and next steps.
- Page titles and descriptions.
- Projects, research/publications, experience, skills, journey, and achievements.
- Blog posts and additional custom pages.

Repeatable items have **Add**, **Delete**, and reorder controls. Projects have a Published checkbox. Blog posts and custom pages support drafts, preview, publishing, and moving back to draft. Custom pages can appear in the footer navigation.

Choose **Blog posts → Add blog post**, enter a title, unique URL name, excerpt, date, and article text. Save as a draft, or use **Publish**. Publishing also saves your other pending edits. Published pages and their listing cards update together. Renaming a URL removes the old page; no redirect is created.

Article text is plain text: separate paragraphs with blank lines. HTML is escaped rather than executed. Publication dates control display and sorting; they do not schedule future publication.

Images can be uploaded as PNG, JPEG, or WebP (up to 5 MB), or supplied through HTTPS URLs. Removing an image reference leaves the uploaded asset available for reuse; the editor does not provide a file deletion library.

**Save changes** writes local content and regenerates localhost immediately. It does not push to GitHub. **Export backup** downloads the current editor content; **Import backup** loads it for review before saving. Concurrent edits are detected rather than silently overwritten.

To change your local password, use the editor footer. If you forget it, stop the server and run:

```sh
python3 cms/server.py --reset-password
python3 cms/server.py
```

## Host on GitHub Pages

This version uses a GitHub Actions build so drafts and local account files are excluded from the published website.

1. Commit and push this project, including `cms/`, `admin/`, assets, and `.github/workflows/pages.yml`, to your repository's `main` branch.
2. In **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**.
3. Run the **Publish portfolio** workflow from the Actions tab, or push a new commit.
4. Wait for the deployment to succeed. The Pages settings show the actual website URL.

The current configuration targets `Sushmaac777/Personal-build` on `main`. Its expected address is <https://sushmaac777.github.io/Personal-build/>; adding the workflow does not itself enable or confirm hosting. Keep the repository's existing visibility. GitHub Pages availability for a private repository depends on your GitHub plan.

Use the included Actions workflow instead of publishing the repository root directly. Only its `_site` artifact is deployed. See [GitHub's custom workflow instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Use the admin on the hosted website

Open the hosted website's `/admin/` page. Because GitHub Pages cannot run a password server, this page connects directly to GitHub using a repository access token.

1. Create a **fine-grained personal access token** under GitHub **Settings → Developer settings → Personal access tokens**.
2. Limit its repository access to this portfolio repository. Set **Repository permissions → Contents → Read and write** and choose an expiration.
3. Enter `Sushmaac777/Personal-build`, branch `main`, and the token in the hosted admin.
4. Edit and save. Each save commits the content to GitHub; the Pages workflow then rebuilds and deploys the website. Follow **View progress** to check the deployment.

The token is held in memory, cleared on sign-out, and never put into local storage or committed. Closing or refreshing the tab requires connecting again. Do not enter your GitHub password. Restricted or protected branches may reject direct commits; use a branch on which your account and token can write, and align the workflow's branch trigger.

GitHub saves use the file revision to detect conflicts. If someone else changes content, export your unsaved work, reload, and reconcile it before saving again.

Draft text is excluded from the public HTML and deployment artifact. Its source remains in `cms/site.json` in the repository and its history. It is readable by anyone who can read that repository, including everyone if the repository is public. Uploaded images are public assets even when used in a draft.

When switching between local and hosted editing, pull the latest GitHub changes before starting local work. Commit and push local changes to publish them. The local password and GitHub token are separate sign-in methods; neither is uploaded with the site.

## Files and development

| Path | Purpose |
| --- | --- |
| `cms/site.json` | Canonical content edited by the dashboard |
| `admin/` | Login screen, content editor, schema, repository configuration |
| `cms/build.py` | Validates content and generates static pages |
| `cms/server.py` | Local password authentication, saves, uploads, and preview |
| `cms/templates/` | Shared page structure and retained visual layouts |
| `cms/test_admin.py` | HTTP authentication and publishing regression tests |
| `assets/css/style.css` | Shared public design, typography, responsive and print styles |
| `assets/css/filters.css` | Generated CSS category filters |
| `assets/images/`, `assets/uploads/` | Public images |
| `.github/workflows/pages.yml` | Builds and deploys the public artifact |
| `.local-admin/` | Ignored local account hash, build manifests, previous saved content |
| `_site/` | Ignored deployment output |
| `_legacy/` | Ignored original React/FastAPI app and migration backups |

Generated HTML should not be edited directly: the next admin save replaces it. Change content in the editor or `cms/site.json`; change layout in the templates/renderer and design in `assets/css/style.css`.

Build the deployment artifact or regenerate local pages:

```sh
python3 cms/build.py --output _site
python3 cms/build.py
```

Run checks:

```sh
python3 -m unittest discover -s cms -p 'test_*.py' -v
node --check admin/admin.js
```

The public navigation, mobile menu, and category filters work with JavaScript disabled. Contact links open an email app; the site does not store contact submissions. The résumé is printable using the browser's **Print → Save as PDF**.

Local passwords are salted PBKDF2 hashes; sessions use HttpOnly, SameSite cookies and CSRF checks. `.local-admin/`, `cms/`, hidden files, and backups are blocked by the local preview server. Do not publish or serve the raw repository directory with an unrestricted server.

## Original content and backups

The earlier request to replace QA content with research-only content was undone. This version preserves the restored QA, AI, engineering, and research content, with Times New Roman.

The original public content was migrated from the existing SQLite snapshot and page source. **Confirm `hello@sushma.dev` in Profile is your preferred working email.** Existing placeholder project/publication links use email enquiries until real URLs are added.

The old React/FastAPI project and its uncommitted edits remain in `_legacy/`. That folder may contain local environment configuration and must not be uploaded. Old tracked application file deletions belong to the earlier static-site migration; commit those removals alongside the replacement project when you are ready.
