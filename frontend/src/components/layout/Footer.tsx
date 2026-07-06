import { useContentValue } from "../../hooks/useContentValue";

export function Footer() {
  const copy = useContentValue("siteCopy");
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <p className="site-footer__title">{copy.footer.title}</p>
      <p className="site-footer__copyright">
        &copy; {year} {copy.footer.title}. {copy.footer.copyright}
      </p>
    </footer>
  );
}
