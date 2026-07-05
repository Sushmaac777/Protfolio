import { AboutCapabilities } from "../components/about/AboutCapabilities";
import { AboutHero } from "../components/about/AboutHero";
import { AboutJourney } from "../components/about/AboutJourney";
import { AboutLessons } from "../components/about/AboutLessons";
import { AboutNext } from "../components/about/AboutNext";
import { AboutQuote } from "../components/about/AboutQuote";

export function About() {
  return (
    <div className="page about-page">
      <AboutHero />

      <section className="section about-page__body">
        <AboutJourney />
        <AboutLessons />
        <AboutCapabilities />
        <AboutNext />
        <AboutQuote />
      </section>
    </div>
  );
}
