import { Link, NavLink } from "react-router-dom";

import { getProfile } from "../../api/profile";
import { useFetch } from "../../hooks/useFetch";
import { useTheme } from "../../hooks/useTheme";
import { useContentValue } from "../../hooks/useContentValue";
import { navigationLinks } from "../../utils/constants";
import { cn } from "../../utils/helpers";

function getInitials(name?: string) {
  if (!name) {
    return "SA";
  }

  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  return parts[0].slice(0, 2).toUpperCase();
}

function PaperPlaneIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
      <path d="m21 3-9.5 9.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M21 3 14 21l-3.5-8.5L2 9l19-6Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
      <path
        d="M20 15.2A7.9 7.9 0 0 1 8.8 4 8.9 8.9 0 1 0 20 15.2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function Navbar() {
  const copy = useContentValue("siteCopy");
  const { data: profile } = useFetch(getProfile);
  const { toggleTheme } = useTheme();
  const brandName = profile?.name ?? "Sushma Acharya";
  const brandMeta = copy.navigation.brandMeta.trim() || "Engineer • Researcher • QA";

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" to="/">
          <span className="brand__avatar">{getInitials(brandName)}</span>
          <span className="brand__copy">
            <span className="brand__name">{brandName}</span>
            <span className="brand__meta">{brandMeta}</span>
          </span>
        </Link>

        <nav className="nav" aria-label="Primary">
          {navigationLinks.map((link) => (
            <NavLink
              key={link.to}
              end={link.to === "/"}
              className={({ isActive }) => cn("nav__link", isActive && "nav__link--active")}
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          <Link className="nav-cta" to="/contact">
            <PaperPlaneIcon />
            <span>Connect</span>
          </Link>
          <button aria-label="Toggle theme" className="nav-theme" onClick={toggleTheme} type="button">
            <MoonIcon />
          </button>
        </div>
      </div>
    </header>
  );
}
