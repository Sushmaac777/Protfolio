import type { Profile } from "../../types/profile";
import { useContentValue } from "../../hooks/useContentValue";
import { Button } from "../common/Button";
import { SectionTitle } from "../common/SectionTitle";

export function AboutIntro({ profile }: { profile: Profile }) {
  const copy = useContentValue("siteCopy");

  return (
    <section className="section about-preview">
      <SectionTitle
        eyebrow={copy.home.aboutEyebrow}
        title={copy.home.aboutTitle}
        description={profile.summary}
      />
      <div className="about-preview__layout">
        <div className="about-preview__note">
          <p className="eyebrow">{copy.home.aboutNoteLabel}</p>
          <p>{profile.availability}</p>
        </div>
        <div className="copy-grid about-preview__grid">
          {profile.highlights.map((highlight) => (
            <div className="note" key={highlight}>
              <p>{highlight}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="button-row about-preview__actions">
        <Button to="/journey" variant="outline">
          View Journey
        </Button>
        <Button to="/research" variant="outline">
          Research
        </Button>
        <Button to="/achievements" variant="outline">
          Achievements
        </Button>
      </div>
    </section>
  );
}
