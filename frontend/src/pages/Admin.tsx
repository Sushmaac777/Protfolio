import { type FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getAdminContent,
  resetAdminContentSection,
  resetAllAdminContent,
  updateAdminContentSection,
} from "../api/content";
import { getBlogs } from "../api/blogs";
import { getExperience } from "../api/experience";
import { getProfile } from "../api/profile";
import { getProjects } from "../api/projects";
import { getPublications } from "../api/publications";
import { getSkills } from "../api/skills";
import { Loader } from "../components/common/Loader";
import { Button } from "../components/common/Button";
import { SectionTitle } from "../components/common/SectionTitle";
import { useAuth } from "../context/AuthContext";
import { useContent } from "../context/ContentContext";
import type { PortfolioContentKey, PortfolioContentMap } from "../types/content";

const sectionConfig: Array<{
  key: PortfolioContentKey;
  label: string;
  description: string;
}> = [
  {
    key: "profile",
    label: "Profile",
    description: "Hero text, title, availability, highlights, and social links.",
  },
  {
    key: "aboutPage",
    label: "About Page",
    description: "About-page intro, education journey, and technical plus non-technical skills.",
  },
  {
    key: "projects",
    label: "Projects",
    description: "Project cards and detail-page content, including featured flags.",
  },
  {
    key: "experience",
    label: "Experience",
    description: "Timeline entries, summaries, highlights, and technologies.",
  },
  {
    key: "skills",
    label: "Skills",
    description: "Skill categories and proficiency values used across the site.",
  },
  {
    key: "publications",
    label: "Publications",
    description: "Research papers, conference presentations, and publication summaries.",
  },
  {
    key: "blogs",
    label: "Blogs",
    description: "Blog cards and detail pages, including slugs and article content.",
  },
  {
    key: "achievements",
    label: "Achievements",
    description: "Achievements page intro, stats, filters, cards, and closing quote.",
  },
  {
    key: "siteCopy",
    label: "Site Copy",
    description: "Homepage headings, about-page text blocks, CTA copy, footer title and copyright, and shared page labels.",
  },
];

function formatDraft<K extends PortfolioContentKey>(value: PortfolioContentMap[K]) {
  return JSON.stringify(value, null, 2);
}

function createEmptyDrafts(): Record<PortfolioContentKey, string> {
  return {
    profile: "",
    aboutPage: "",
    projects: "",
    experience: "",
    skills: "",
    publications: "",
    blogs: "",
    achievements: "",
    siteCopy: "",
  };
}

function createDraftsFromContent(content: PortfolioContentMap): Record<PortfolioContentKey, string> {
  return {
    profile: formatDraft(content.profile),
    aboutPage: formatDraft(content.aboutPage),
    projects: formatDraft(content.projects),
    experience: formatDraft(content.experience),
    skills: formatDraft(content.skills),
    publications: formatDraft(content.publications),
    blogs: formatDraft(content.blogs),
    achievements: formatDraft(content.achievements),
    siteCopy: formatDraft(content.siteCopy),
  };
}

function getSectionHint(key: PortfolioContentKey) {
  switch (key) {
    case "profile":
      return "Profile updates are split across the public site: name, title, summary, location, and availability show on Home, highlights show on About, and email shows on Contact. The small header subtitle is edited in Site Copy under navigation.brandMeta.";
    case "siteCopy":
      return "Site Copy controls the header subtitle, page headings, CTA labels, and the footer title plus copyright line across the site.";
    case "achievements":
      return "Achievements now has its own dedicated editor section, so Site Copy changes will not overwrite this page anymore.";
    case "aboutPage":
      return "About Page now has its own editor section for the intro story, education journey, and strengths, so it can evolve without depending on generic site copy.";
    default:
      return "Save writes to the backend content store, then the matching public page should reflect the new content.";
  }
}

export function Admin({ dashboard = false }: { dashboard?: boolean }) {
  const { login, logout, token, loading } = useAuth();
  const { refreshContent } = useContent();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("portfolio123");
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<PortfolioContentKey>("profile");
  const [drafts, setDrafts] = useState<Record<PortfolioContentKey, string>>(createEmptyDrafts);
  const [loadingContent, setLoadingContent] = useState(false);
  const [editorMessage, setEditorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!dashboard || !token) {
      return;
    }

    const authToken = token;
    let active = true;

    async function loadContent() {
      setLoadingContent(true);

      try {
        const content = await getAdminContent(authToken);

        if (!active) {
          return;
        }

        setDrafts(createDraftsFromContent(content));
      } catch {
        if (active) {
          setEditorMessage("Could not load admin content from the backend.");
        }
      } finally {
        if (active) {
          setLoadingContent(false);
        }
      }
    }

    void loadContent();

    return () => {
      active = false;
    };
  }, [dashboard, token]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      await login(username, password);
    } catch {
      setError("Login failed. Check the backend credentials and try again.");
    }
  }

  function updateDraft(key: PortfolioContentKey, value: string) {
    setDrafts((current) => ({ ...current, [key]: value }));
  }

  async function saveSection() {
    if (!token) {
      setEditorMessage("Admin authentication is required before saving.");
      return;
    }

    try {
      const parsed = JSON.parse(drafts[activeSection]) as PortfolioContentMap[typeof activeSection];
      const savedValue = await updateAdminContentSection(token, activeSection, parsed);
      updateDraft(activeSection, formatDraft(savedValue));
      await refreshContent();
      setEditorMessage(
        `${sectionConfig.find((section) => section.key === activeSection)?.label} saved to the backend content store. ${getSectionHint(activeSection)}`,
      );
    } catch (error) {
      if (error instanceof SyntaxError) {
        setEditorMessage("That JSON is not valid yet. Fix the syntax and save again.");
        return;
      }

      setEditorMessage("The section could not be saved to the backend. Check the API response and try again.");
    }
  }

  async function resetSection() {
    if (!token) {
      setEditorMessage("Admin authentication is required before resetting.");
      return;
    }

    try {
      const resetValue = await resetAdminContentSection(token, activeSection);
      updateDraft(activeSection, formatDraft(resetValue));
      await refreshContent();
      setEditorMessage(`${sectionConfig.find((section) => section.key === activeSection)?.label} reset to the backend default content.`);
    } catch {
      setEditorMessage("The section could not be reset on the backend. Try again.");
    }
  }

  async function resetAllSections() {
    if (!token) {
      setEditorMessage("Admin authentication is required before resetting.");
      return;
    }

    try {
      const resetContent = await resetAllAdminContent(token);
      setDrafts(createDraftsFromContent(resetContent));
      await refreshContent();
      setEditorMessage("All backend content sections were reset to their default values.");
    } catch {
      setEditorMessage("The backend content store could not be reset. Try again.");
    }
  }

  if (dashboard && token) {
    const currentSection = sectionConfig.find((section) => section.key === activeSection) ?? sectionConfig[0];

    return (
      <div className="page">
        <section className="section">
          <SectionTitle
            eyebrow="Admin"
            title="Portfolio content editor"
            description="This dashboard edits the live portfolio content through the backend API, so changes apply from a single backend source of truth while the server is running."
          />
          <div className="admin-toolbar">
            <div className="admin-toolbar__actions">
              <Button to="/" variant="outline">
                View Site
              </Button>
              <Button onClick={resetAllSections} type="button" variant="outline">
                Reset All
              </Button>
              <Button onClick={logout} type="button" variant="ghost">
                Log out
              </Button>
            </div>
            <p className="admin-note">
              Edit the JSON for each section, save it to the backend, then revisit the public pages to confirm the update.
            </p>
          </div>
        </section>

        {loadingContent ? <Loader label="Loading admin content" /> : null}

        {!loadingContent ? (
          <section className="section admin-dashboard">
            <aside className="admin-sidebar">
              {sectionConfig.map((section) => (
                <button
                  className={`admin-tab ${section.key === activeSection ? "admin-tab--active" : ""}`}
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  type="button"
                >
                  <strong>{section.label}</strong>
                  <span>{section.description}</span>
                </button>
              ))}
            </aside>

            <div className="admin-editor">
              <div className="admin-editor__header">
                <div>
                  <p className="eyebrow">Editing</p>
                  <h2>{currentSection.label}</h2>
                  <p>{currentSection.description}</p>
                </div>
                <div className="button-row">
                  <Button onClick={saveSection} type="button">
                    Save Section
                  </Button>
                  <Button onClick={resetSection} type="button" variant="outline">
                    Reset Section
                  </Button>
                </div>
              </div>

              <label className="admin-editor__label" htmlFor={`editor-${activeSection}`}>
                JSON content
              </label>
              <textarea
                className="code-input"
                id={`editor-${activeSection}`}
                onChange={(event) => updateDraft(activeSection, event.target.value)}
                spellCheck={false}
                value={drafts[activeSection]}
              />

              <p className="admin-note">
                Tip: keep valid JSON structure intact. For arrays, use square brackets. For objects, use curly braces. Slugs should stay unique.
              </p>
              <p className="admin-note">{getSectionHint(activeSection)}</p>
              {editorMessage ? <p className="form-status">{editorMessage}</p> : null}
            </div>
          </section>
        ) : null}
      </div>
    );
  }

  return (
    <div className="page">
      <section className="section admin-layout">
        <div>
          <SectionTitle
            eyebrow="Admin"
            title="Content editor access"
            description="Sign in with the admin credentials to open the backend-driven portfolio content editor."
          />
          <p>Default credentials: `admin` / `portfolio123`</p>
          {token ? (
            <div className="button-row">
              <Button to="/admin/dashboard">Open dashboard</Button>
              <Button onClick={logout} variant="outline">
                Log out
              </Button>
            </div>
          ) : (
            <p>
              Sign in below, then open the <Link className="text-link" to="/admin/dashboard">dashboard route</Link>.
            </p>
          )}
        </div>
        <form className="form-card" onSubmit={handleSubmit}>
          <label>
            <span>Username</span>
            <input className="input" onChange={(event) => setUsername(event.target.value)} value={username} />
          </label>
          <label>
            <span>Password</span>
            <input
              className="input"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
          </label>
          <Button disabled={loading} type="submit">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          {error ? <p className="form-status">{error}</p> : null}
        </form>
      </section>
    </div>
  );
}
