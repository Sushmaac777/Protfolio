import type { CSSProperties } from "react";

import type { Experience } from "../../types/experience";
import { Badge } from "../common/Badge";

const journeyPalette = [
  { accent: "#4ea8d9", glow: "rgba(78, 168, 217, 0.2)" },
  { accent: "#ef8b5c", glow: "rgba(239, 139, 92, 0.2)" },
  { accent: "#45b7b1", glow: "rgba(69, 183, 177, 0.2)" },
  { accent: "#93b93d", glow: "rgba(147, 185, 61, 0.2)" },
  { accent: "#c17ad6", glow: "rgba(193, 122, 214, 0.2)" },
];

const ignoredMarkerWords = new Set(["and", "of", "the", "for", "to", "a", "an"]);

function getMarkerLabel(role: string) {
  const marker = role
    .split(" ")
    .filter((part) => part && !ignoredMarkerWords.has(part.toLowerCase()))
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return marker || role[0]?.toUpperCase() || "E";
}

export function ExperienceTimeline({ experience }: { experience: Experience[] }) {
  return (
    <div className="experience-journey">
      {experience.map((item, index) => {
        const palette = journeyPalette[index % journeyPalette.length];
        const style = {
          "--journey-accent": palette.accent,
          "--journey-glow": palette.glow,
        } as CSSProperties;

        return (
          <article className="experience-journey__step" key={`${item.company}-${item.role}`} style={style}>
            <div className="experience-journey__label">
              <span className="experience-journey__count">{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.role}</h3>
              <p className="experience-journey__period">{item.period}</p>
            </div>

            <div className="experience-journey__marker-wrap" aria-hidden="true">
              <span className="experience-journey__marker">
                <span className="experience-journey__marker-core">{getMarkerLabel(item.role)}</span>
              </span>
            </div>

            <div className="experience-journey__card">
              <p className="experience-journey__company">{item.company}</p>
              <p className="experience-journey__summary">{item.summary}</p>

              <ul className="experience-journey__highlights">
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>

              <div className="badge-row">
                {item.technologies.map((technology) => (
                  <Badge key={technology}>{technology}</Badge>
                ))}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
