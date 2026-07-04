import { useContentValue } from "../../hooks/useContentValue";

export function Footer() {
  const copy = useContentValue("siteCopy");

  return (
    <footer className="site-footer">
      <div>
        <p className="site-footer__title">{copy.footer.title}</p>
        <p>{copy.footer.description}</p>
      </div>
      <p>{new Date().getFullYear()} {copy.footer.tagline}</p>
    </footer>
  );
}
