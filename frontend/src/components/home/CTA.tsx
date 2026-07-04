import { Button } from "../common/Button";
import { useContentValue } from "../../hooks/useContentValue";

export function CTA() {
  const copy = useContentValue("siteCopy");

  return (
    <section className="section cta-panel">
      <p className="eyebrow">{copy.home.ctaEyebrow}</p>
      <h2>{copy.home.ctaTitle}</h2>
      <p>{copy.home.ctaDescription}</p>
      <Button to="/contact">{copy.home.ctaButton}</Button>
    </section>
  );
}
