import { type FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
import type { PortfolioContentKey, PortfolioContentMap } from "../types/content";
import {
  clearContentOverrides,
  getContentValue,
  getDefaultContent,
  readContentOverride,
  removeContentOverride,
  writeContentOverride,
} from "../utils/contentOverrides";

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
    description: "Homepage headings, about-page text blocks, CTA copy, footer text, and shared page labels.",
  },
];

function formatDraft<K extends PortfolioContentKey>(value: PortfolioContentMap[K]) {
  return JSON.stringify(value, null, 2);
}

function createDefaultDrafts(): Record<PortfolioContentKey, string> {
  return {
    profile: formatDraft(getDefaultContent("profile")),
    aboutPage: formatDraft(getDefaultContent("aboutPage")),
    projects: formatDraft(getDefaultContent("projects")),
    experience: formatDraft(getDefaultContent("experience")),
    skills: formatDraft(getDefaultContent("skills")),
    publications: formatDraft(getDefaultContent("publications")),
    blogs: formatDraft(getDefaultContent("blogs")),
    achievements: formatDraft(getDefaultContent("achievements")),
    siteCopy: formatDraft(getDefaultContent("siteCopy")),
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeRemovedFields<T>(defaults: T, value: unknown, preserveUnknown = true): T {
  if (Array.isArray(defaults)) {
    if (!Array.isArray(value)) {
      return [] as T;
    }

    const itemShape = defaults[0];

    if (itemShape === undefined) {
      return value as T;
    }

    return value.map((item) => normalizeRemovedFields(itemShape, item, preserveUnknown)) as T;
  }

  if (isPlainObject(defaults)) {
    const source = isPlainObject(value) ? value : {};
    const result: Record<string, unknown> = {};

    Object.entries(defaults).forEach(([key, defaultValue]) => {
      result[key] = normalizeRemovedFields(defaultValue, source[key], preserveUnknown);
    });

    if (preserveUnknown) {
      Object.entries(source).forEach(([key, sourceValue]) => {
        if (!(key in result)) {
          result[key] = sourceValue;
        }
      });
    }

    return result as T;
  }

  if (typeof defaults === "string") {
    return (typeof value === "string" ? value : "") as T;
  }

  if (typeof defaults === "number") {
    return (typeof value === "number" ? value : 0) as T;
  }

  if (typeof defaults === "boolean") {
    return (typeof value === "boolean" ? value : false) as T;
  }

  return (value === undefined ? defaults : value) as T;
}

function normalizeSectionForSave<K extends PortfolioContentKey>(key: K, value: PortfolioContentMap[K]): PortfolioContentMap[K] {
  if (key === "siteCopy") {
    return normalizeRemovedFields(getDefaultContent("siteCopy"), value, false) as PortfolioContentMap[K];
  }

  if (key === "achievements") {
    return normalizeRemovedFields(getDefaultContent("achievements"), value, false) as PortfolioContentMap[K];
  }

  return value;
}

function getSectionHint(key: PortfolioContentKey) {
  switch (key) {
    case "profile":
      return "Profile updates are split across the public site: name, title, summary, location, and availability show on Home, highlights show on About, and email shows on Contact. The small header subtitle is edited in Site Copy under navigation.brandMeta.";
    case "siteCopy":
      return "Site Copy controls the header subtitle, page headings, CTA labels, and footer text across the site.";
    case "achievements":
      return "Achievements now has its own dedicated editor section, so Site Copy changes will not overwrite this page anymore.";
    case "aboutPage":
      return "About Page now has its own editor section for the intro story, education journey, and strengths, so it can evolve without depending on generic site copy.";
    default:
      return "Save applies locally in this browser, then the matching public page should reflect the new content.";
  }
}

export function Admin({ dashboard = false }: { dashboard?: boolean }) {
  const { login, logout, token, loading } = useAuth();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("portfolio123");
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<PortfolioContentKey>("profile");
  const [drafts, setDrafts] = useState<Record<PortfolioContentKey, string>>(createDefaultDrafts);
  const [loadingContent, setLoadingContent] = useState(false);
  const [editorMessage, setEditorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!dashboard || !token) {
      return;
    }

    let active = true;

    async function loadContent() {
      setLoadingContent(true);

      try {
        const [profile, projects, experience, skills, publications, blogs] = await Promise.all([
          getProfile(),
          getProjects(),
          getExperience(),
          getSkills(),
          getPublications(),
          getBlogs(),
        ]);

        if (!active) {
          return;
        }

        setDrafts({
          profile: formatDraft(profile),
          aboutPage: formatDraft(
            normalizeSectionForSave(
              "aboutPage",
              readContentOverride("aboutPage") ?? getContentValue("aboutPage"),
            ),
          ),
          projects: formatDraft(projects),
          experience: formatDraft(experience),
          skills: formatDraft(skills),
          publications: formatDraft(publications),
          blogs: formatDraft(blogs),
          achievements: formatDraft(
            normalizeSectionForSave(
              "achievements",
              readContentOverride("achievements") ?? getContentValue("achievements"),
            ),
          ),
          siteCopy: formatDraft(
            normalizeSectionForSave(
              "siteCopy",
              readContentOverride("siteCopy") ?? getContentValue("siteCopy"),
            ),
          ),
        });
      } catch {
        if (active) {
          setEditorMessage("Could not load admin content. The default portfolio content is shown instead.");
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

  function saveSection() {
    try {
      const parsed = JSON.parse(drafts[activeSection]) as PortfolioContentMap[typeof activeSection];
      const normalized = normalizeSectionForSave(activeSection, parsed);
      writeContentOverride(activeSection, normalized);
      const savedValue = readContentOverride(activeSection);

      if (JSON.stringify(savedValue) !== JSON.stringify(normalized)) {
        setEditorMessage("The section could not be confirmed after saving. Try again and check whether browser storage is blocked.");
        return;
      }

      updateDraft(activeSection, formatDraft(normalized));
      setEditorMessage(
        `${sectionConfig.find((section) => section.key === activeSection)?.label} saved locally in this browser. ${getSectionHint(activeSection)}`,
      );
    } catch (error) {
      if (error instanceof SyntaxError) {
        setEditorMessage("That JSON is not valid yet. Fix the syntax and save again.");
        return;
      }

      setEditorMessage("The section could not be saved to browser storage. Check whether your browser is blocking local storage and try again.");
    }
  }

  function resetSection() {
    removeContentOverride(activeSection);
    updateDraft(activeSection, formatDraft(getDefaultContent(activeSection)));
    setEditorMessage(`${sectionConfig.find((section) => section.key === activeSection)?.label} reset to the default portfolio content.`);
  }

  function resetAllSections() {
    clearContentOverrides();
    setDrafts(createDefaultDrafts());
    setEditorMessage("All admin overrides were cleared. The site is back to the default portfolio content.");
  }

  if (dashboard && token) {
    const currentSection = sectionConfig.find((section) => section.key === activeSection) ?? sectionConfig[0];

    return (
      <div className="page">
        <section className="section">
          <SectionTitle
            eyebrow="Admin"
            title="Portfolio content editor"
            description="This dashboard lets you edit the live portfolio copy in this browser. Changes are saved locally for now, so this works like a practical CMS prototype rather than a shared production admin."
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
              Edit the JSON for each section, save it, then revisit the public pages to confirm the update.
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
            description="Sign in with the admin credentials to open the local portfolio content editor."
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
