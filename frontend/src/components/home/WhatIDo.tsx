function QaIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="26" viewBox="0 0 24 24" width="26">
      <path d="m8 8-4 4 4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="m16 8 4 4-4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="m14 4-4 16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function BackendIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="26" viewBox="0 0 24 24" width="26">
      <path d="m8 8-4 4 4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="m16 8 4 4-4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="m14 4-4 16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="26" viewBox="0 0 24 24" width="26">
      <path d="M4 18h16" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <path d="M7 18v-5" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <path d="M12 18V8" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <path d="M17 18v-9" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <path d="m6 9 4-4 3 3 5-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function ResearchIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="26" viewBox="0 0 24 24" width="26">
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v15.5A2.5 2.5 0 0 0 17.5 17H4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
      <path d="M6.5 20A2.5 2.5 0 0 1 4 17.5V6.5" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <path d="M9 8h7" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <path d="M9 12h7" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

const services = [
  {
    icon: <QaIcon />,
    title: "Quality Assurance",
    description: "Ensuring software quality through manual, automated, and API testing.",
    modifier: "what-i-do__card--blue",
  },
  {
    icon: <BackendIcon />,
    title: "Backend Development",
    description: "Building scalable APIs and robust backend services with Python.",
    modifier: "what-i-do__card--teal",
  },
  {
    icon: <AnalyticsIcon />,
    title: "AI & Data Analytics",
    description: "Applying machine learning and analytics to solve real-world problems.",
    modifier: "what-i-do__card--violet",
  },
  {
    icon: <ResearchIcon />,
    title: "Research",
    description: "Exploring AI, social media, wellbeing, and disaster prediction.",
    modifier: "what-i-do__card--amber",
  },
];

export function WhatIDo() {
  return (
    <section className="what-i-do" id="what-i-do">
      <div className="what-i-do__heading">
        <h2>What I Do</h2>
        <span aria-hidden="true" className="what-i-do__underline" />
        <p>I combine engineering, research, and quality assurance to build better, smarter, and more reliable software.</p>
      </div>

      <div className="what-i-do__grid">
        {services.map((service) => (
          <article className={`what-i-do__card ${service.modifier}`} key={service.title}>
            <span className="what-i-do__card-icon">{service.icon}</span>
            <div className="what-i-do__card-copy">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
