import { useContentValue } from "../../hooks/useContentValue";
import { AboutMountainScene } from "./AboutVisuals";

export function AboutQuote() {
  const about = useContentValue("aboutPage");

  return (
    <section className="about-quote-banner">
      <div className="about-quote-banner__copy">
        <span className="about-quote-banner__mark" aria-hidden="true">
          “
        </span>
        <p>
          <span>{about.quoteLead}</span>
          <strong>{about.quoteAccent}</strong>
        </p>
      </div>
      <AboutMountainScene className="about-quote-banner__scene" compact />
    </section>
  );
}
