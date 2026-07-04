import { useEffect, useState } from "react";

import { useContentValue } from "../hooks/useContentValue";

function ArrowUpRightIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="22" viewBox="0 0 24 24" width="22">
      <path d="M7 17 17 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M9 7h8v8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function AchievementIcon({ name }: { name: string }) {
  switch (name) {
    case "cap":
      return (
        <svg aria-hidden="true" fill="none" height="30" viewBox="0 0 24 24" width="30">
          <path d="m2 9 10-5 10 5-10 5L2 9Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.9" />
          <path d="M6 11v4.5c0 .9 2.7 2.5 6 2.5s6-1.6 6-2.5V11" stroke="currentColor" strokeLinecap="round" strokeWidth="1.9" />
        </svg>
      );
    case "book":
      return (
        <svg aria-hidden="true" fill="none" height="30" viewBox="0 0 24 24" width="30">
          <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21.5v-16Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.9" />
          <path d="M9 7h6M9 11h6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.9" />
        </svg>
      );
    case "mic":
      return (
        <svg aria-hidden="true" fill="none" height="30" viewBox="0 0 24 24" width="30">
          <rect height="10" rx="4" stroke="currentColor" strokeWidth="1.9" width="8" x="8" y="3" />
          <path d="M6 10a6 6 0 1 0 12 0M12 19v3M8.5 22h7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" />
        </svg>
      );
    case "trophy":
      return (
        <svg aria-hidden="true" fill="none" height="30" viewBox="0 0 24 24" width="30">
          <path d="M8 4h8v3a4 4 0 1 1-8 0V4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.9" />
          <path d="M16 5h3a2 2 0 0 1-2 2h-1M8 5H5a2 2 0 0 0 2 2h1M12 11v4M9 19h6M8 22h8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" />
        </svg>
      );
    case "star":
      return (
        <svg aria-hidden="true" fill="none" height="30" viewBox="0 0 24 24" width="30">
          <path d="m12 3.8 2.5 5.2 5.7.8-4.1 4 1 5.7L12 16.8 6.9 19.5l1-5.7-4.1-4 5.7-.8L12 3.8Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.9" />
        </svg>
      );
    case "people":
      return (
        <svg aria-hidden="true" fill="none" height="30" viewBox="0 0 24 24" width="30">
          <circle cx="8" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.9" />
          <circle cx="16" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.9" />
          <path d="M3.5 18a4.5 4.5 0 0 1 9 0M12.5 18a4 4 0 0 1 8 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.9" />
        </svg>
      );
    case "medal":
    default:
      return (
        <svg aria-hidden="true" fill="none" height="30" viewBox="0 0 24 24" width="30">
          <path d="m8 3 4 6 4-6M8.5 14.5A3.5 3.5 0 1 0 15.5 14.5A3.5 3.5 0 1 0 8.5 14.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.9" />
          <path d="m10.7 14.6.8.8 1.8-2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" />
        </svg>
      );
  }
}

export function Achievements() {
  const achievements = useContentValue("achievements");
  const defaultFilter = achievements.filters[0] ?? "All Achievements";
  const [activeFilter, setActiveFilter] = useState(defaultFilter);
  const filtersKey = achievements.filters.join("::");

  useEffect(() => {
    setActiveFilter((current) => (achievements.filters.includes(current) ? current : defaultFilter));
  }, [defaultFilter, filtersKey]);

  const visibleEntries =
    activeFilter === defaultFilter
      ? achievements.entries
      : achievements.entries.filter((entry) => entry.filters.includes(activeFilter));
  const columnCount = Math.min(Math.max(visibleEntries.length, 1), 3);

  return (
    <div className="page">
      <section className="section achievements-section">
        <div className="achievements-layout">
          <div className="achievements-hero">
            <div className="achievements-intro">
              <h1>{achievements.title}</h1>
              <p>{achievements.description}</p>
            </div>

            <div className="achievements-stats">
              {achievements.stats.map((stat) => (
                <article className="achievements-stat" key={stat.label}>
                  <span className="achievements-stat__icon">
                    <AchievementIcon name={stat.icon} />
                  </span>
                  <strong className="achievements-stat__value">{stat.value}</strong>
                  <span className="achievements-stat__label">{stat.label}</span>
                </article>
              ))}
            </div>
          </div>

          <div aria-label="Achievement filters" className="achievements-filters" role="toolbar">
            {achievements.filters.map((filter) => (
              <button
                aria-pressed={activeFilter === filter}
                className={`achievements-filter${activeFilter === filter ? " achievements-filter--active" : ""}`}
                key={filter}
                onClick={() => setActiveFilter(filter)}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="achievements-grid-wrap">
            <div className="achievements-grid" style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}>
              {visibleEntries.map((entry, index) => (
                <article
                  className={`achievement-card achievement-card--${entry.tone} achievement-card--col-${(index % columnCount) + 1}`}
                  key={`${entry.year}-${entry.title}`}
                >
                  <span className="achievement-card__arrow">
                    <ArrowUpRightIcon />
                  </span>

                  <span className="achievement-card__icon">
                    <AchievementIcon name={entry.icon} />
                  </span>

                  <div className="achievement-card__content">
                    <span className="achievement-card__year">{entry.year}</span>
                    <h3>{entry.title}</h3>
                    <p>{entry.description}</p>
                    <span className="achievement-card__tag">{entry.tag}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <blockquote className="achievements-quote">
            <span className="achievements-quote__mark">“</span>
            <p>{achievements.quote}</p>

            <div aria-hidden="true" className="achievements-quote__art">
              <span className="achievements-quote__mountain achievements-quote__mountain--back" />
              <span className="achievements-quote__mountain achievements-quote__mountain--mid" />
              <span className="achievements-quote__mountain achievements-quote__mountain--front" />
              <span className="achievements-quote__trail" />
              <span className="achievements-quote__flag-pole" />
              <span className="achievements-quote__flag" />
            </div>
          </blockquote>
        </div>
      </section>
    </div>
  );
}
