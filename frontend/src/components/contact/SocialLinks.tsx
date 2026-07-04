import type { SocialLink } from "../../types/profile";

export function SocialLinks({ links }: { links: SocialLink[] }) {
  return (
    <div className="social-links">
      {links.map((link) => (
        <a href={link.url} key={link.label} target="_blank" rel="noreferrer">
          {link.label}
        </a>
      ))}
    </div>
  );
}

