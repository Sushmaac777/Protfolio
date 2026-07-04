import { Link } from "react-router-dom";

import { useContentValue } from "../../hooks/useContentValue";
import { SectionTitle } from "../common/SectionTitle";

export function BrowseDeck() {
  const copy = useContentValue("siteCopy");

  return (
    <section className="section browse-deck">
      <div className="browse-deck__intro">
        <SectionTitle
          eyebrow={copy.home.exploreEyebrow}
          title={copy.home.exploreTitle}
          description={copy.home.exploreDescription}
        />
      </div>
      <div className="browse-deck__grid">
        {copy.home.exploreCards.map((card) => (
          <Link className="browse-card" key={card.title} to={card.to}>
            <p className="browse-card__kicker">{card.kicker}</p>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <span className="browse-card__cta">Open</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
