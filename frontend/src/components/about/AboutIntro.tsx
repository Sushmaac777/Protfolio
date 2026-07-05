import type { Profile } from "../../types/profile";
import { useContentValue } from "../../hooks/useContentValue";
import { Button } from "../common/Button";

export function AboutIntro({ profile }: { profile: Profile }) {
  const about = useContentValue("aboutPage");

  return (
    <section className="section about-story">
      <div className="about-story__grid">
        <div className="about-story__copy">
          <h1>{about.introTitle}</h1>
          <p className="about-story__lead">{about.introDescription}</p>
          <p className="about-story__support">{profile.summary}</p>

          <div className="about-story__direction">
            <p className="eyebrow">{about.currentDirectionLabel}</p>
            <p>{about.currentDirectionText}</p>
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
        </div>
      </div>
    </section>
  );
}
