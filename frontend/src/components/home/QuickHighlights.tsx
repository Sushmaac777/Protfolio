import type { Experience } from "../../types/experience";
import type { Project } from "../../types/project";
import type { Publication } from "../../types/publication";

function PublicationIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
      <circle cx="12" cy="8.5" r="4.5" stroke="currentColor" strokeWidth="2" />
      <path d="M9 14.5V19l3-1.8 3 1.8v-4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function ConferenceIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
      <rect height="8" rx="3.5" stroke="currentColor" strokeWidth="2" width="7" x="8.5" y="3" />
      <path d="M12 11v5" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <path d="M8.5 20h7" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
      <path d="m8 8-4 4 4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="m16 8 4 4-4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="m14 4-4 16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
      <rect height="13" rx="2.5" stroke="currentColor" strokeWidth="2" width="18" x="3" y="7" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function formatCount(value: number, withPlus = false) {
  return `${String(value).padStart(2, "0")}${withPlus ? "+" : ""}`;
}

export function QuickHighlights({
  experience,
  projects,
  publications,
}: {
  experience: Experience[];
  projects: Project[];
  publications: Publication[];
}) {
  const publicationCount = publications.filter((item) => /peer-reviewed|published/i.test(item.venue)).length || 1;
  const conferenceCount = publications.filter((item) => /conference/i.test(item.venue)).length || 1;
  const stats = [
    {
      icon: <PublicationIcon />,
      label: "Research Publication",
      value: formatCount(publicationCount),
      note: "Published Paper",
    },
    {
      icon: <ConferenceIcon />,
      label: "Conference",
      value: formatCount(conferenceCount),
      note: "International Presentation",
    },
    {
      icon: <CodeIcon />,
      label: "Projects",
      value: formatCount(projects.length, true),
      note: "End-to-End Projects",
    },
    {
      icon: <BriefcaseIcon />,
      label: "Experience",
      value: `${Math.max(2, Math.floor(experience.length / 2))}+`,
      note: "Years in Tech",
    },
    {
      icon: <TargetIcon />,
      label: "Current Focus",
      value: "QA &",
      note: "Test Automation",
      accent: true,
    },
  ];

  return (
    <section className="landing-stats">
      {stats.map((item) => (
        <article className="landing-stat" key={item.label}>
          <span className="landing-stat__icon">{item.icon}</span>
          <div className="landing-stat__copy">
            <p className="landing-stat__label">{item.label}</p>
            <p className={`landing-stat__value ${item.accent ? "landing-stat__value--accent" : ""}`}>{item.value}</p>
            <p className={`landing-stat__note ${item.accent ? "landing-stat__note--accent" : ""}`}>{item.note}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
