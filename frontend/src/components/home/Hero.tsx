import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useContentValue } from "../../hooks/useContentValue";
import type { Profile } from "../../types/profile";

function ArrowRightIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
      <path d="M5 12h14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="m13 6 6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
      <path d="M12 3v11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="m7 11 5 5 5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M5 21h14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="22" viewBox="0 0 24 24" width="22">
      <path
        d="M12 21s7-4.6 7-11a7 7 0 1 0-14 0c0 6.4 7 11 7 11Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function GraduationIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="22" viewBox="0 0 24 24" width="22">
      <path d="m2 9 10-5 10 5-10 5L2 9Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
      <path d="M6 11v4.5c0 .9 2.7 2.5 6 2.5s6-1.6 6-2.5V11" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 26 26" width="23">
      <path
        d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function FlaskIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="22" viewBox="0 0 24 24" width="22">
      <path d="M10 3v5l-5.5 9.2A2 2 0 0 0 6.2 20h11.6a2 2 0 0 0 1.7-2.8L14 8V3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M9 13h6" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="22" viewBox="0 0 24 24" width="22">
      <path d="m8 8-4 4 4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="m16 8 4 4-4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="m14 4-4 16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" height="22" viewBox="0 0 24 24" width="22">
      <path d="M6.94 8.5a1.56 1.56 0 1 1 0-3.12 1.56 1.56 0 0 1 0 3.12ZM5.56 9.94h2.76V18H5.56V9.94Zm4.5 0h2.64v1.1h.04c.37-.7 1.27-1.44 2.6-1.44 2.78 0 3.3 1.83 3.3 4.2V18h-2.76v-3.74c0-.9-.01-2.05-1.25-2.05-1.26 0-1.45.98-1.45 1.98V18h-2.76V9.94Z" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

const HERO_ORBIT_DURATION_MS = 34_000;
const HERO_INNER_RING_INSET_PX = 26;
const HERO_CALL_OUT_GAP_PX = 1;

function getRectangleDistanceFromOrigin(
  orbitDistance: number,
  cosAngleAbs: number,
  sinAngleAbs: number,
  halfWidth: number,
  halfHeight: number,
) {
  const dx = Math.max(orbitDistance * cosAngleAbs - halfWidth, 0);
  const dy = Math.max(orbitDistance * sinAngleAbs - halfHeight, 0);
  return Math.hypot(dx, dy);
}

function getTangentOrbitPoint(
  angleRadians: number,
  cardWidth: number,
  cardHeight: number,
  innerRadiusX: number,
  innerRadiusY: number,
) {
  const safeInnerRadiusY = Math.max(innerRadiusY + HERO_CALL_OUT_GAP_PX, 1);
  const ellipseScaleX = innerRadiusX / safeInnerRadiusY;
  const halfWidth = cardWidth / (2 * ellipseScaleX);
  const halfHeight = cardHeight / 2;
  const cosAngleAbs = Math.abs(Math.cos(angleRadians));
  const sinAngleAbs = Math.abs(Math.sin(angleRadians));
  const targetRadius = safeInnerRadiusY;

  let low = 0;
  let high = targetRadius + halfWidth + halfHeight + 400;

  while (
    getRectangleDistanceFromOrigin(high, cosAngleAbs, sinAngleAbs, halfWidth, halfHeight) < targetRadius
  ) {
    high *= 1.5;
  }

  for (let iteration = 0; iteration < 32; iteration += 1) {
    const midpoint = (low + high) / 2;
    const distance = getRectangleDistanceFromOrigin(
      midpoint,
      cosAngleAbs,
      sinAngleAbs,
      halfWidth,
      halfHeight,
    );

    if (distance < targetRadius) {
      low = midpoint;
    } else {
      high = midpoint;
    }
  }

  const resolvedOrbitDistance = high;

  return {
    x: ellipseScaleX * resolvedOrbitDistance * Math.cos(angleRadians),
    y: resolvedOrbitDistance * Math.sin(angleRadians),
  };
}

export function Hero({ profile }: { profile: Profile }) {
  const copy = useContentValue("siteCopy");
  const [showImageFallback, setShowImageFallback] = useState(false);
  const haloRef = useRef<HTMLDivElement | null>(null);
  const orbitItemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const calloutRefs = useRef<Record<string, HTMLElement | null>>({});
  const heroPill = copy.home.heroPill.trim() || "Open to collaborations";
  const linkedInLink = profile.social_links.find((link) => link.label.toLowerCase().includes("linkedin"))?.url;
  const heroCards = [
    {
      angleDegrees: 304.8,
      icon: <GraduationIcon />,
      key: "computer-engineer",
      subtitle: "B.E. (2024)",
      title: "Computer Engineer",
    },
    {
      angleDegrees: 16.8,
      icon: <LocationIcon />,
      key: "based-in",
      subtitle: profile.location,
      title: "Based in",
    },
    {
      angleDegrees: 232.8,
      icon: <ShieldIcon />,
      key: "qa-engineer",
      subtitle: "Quality Driven",
      title: "QA Engineer",
    },
    {
      angleDegrees: 88.8,
      icon: <FlaskIcon />,
      key: "researcher",
      subtitle: "Published Author",
      title: "Researcher",
    },
    {
      angleDegrees: 160.8,
      icon: <CodeIcon />,
      key: "developer",
      subtitle: "Backend Focused",
      title: "Developer",
    },
  ];

  useEffect(() => {
    let frameId = 0;
    const mobileMedia = window.matchMedia("(max-width: 900px)");

    const updateOrbit = (timestamp: number) => {
      const haloElement = haloRef.current;

      if (haloElement && !mobileMedia.matches) {
        const haloRect = haloElement.getBoundingClientRect();
        const innerRadiusX = Math.max(haloRect.width / 2 - HERO_INNER_RING_INSET_PX, 0);
        const innerRadiusY = Math.max(haloRect.height / 2 - HERO_INNER_RING_INSET_PX, 0);
        const rotationProgress = (timestamp % HERO_ORBIT_DURATION_MS) / HERO_ORBIT_DURATION_MS;

        if (innerRadiusX > 0 && innerRadiusY > 0) {
          heroCards.forEach((card) => {
            const orbitItemElement = orbitItemRefs.current[card.key];
            const calloutElement = calloutRefs.current[card.key];

            if (!orbitItemElement || !calloutElement) {
              return;
            }

            const calloutRect = calloutElement.getBoundingClientRect();

            if (!calloutRect.width || !calloutRect.height) {
              return;
            }

            const angleRadians = (card.angleDegrees * Math.PI) / 180 + rotationProgress * Math.PI * 2;
            const point = getTangentOrbitPoint(
              angleRadians,
              calloutRect.width,
              calloutRect.height,
              innerRadiusX,
              innerRadiusY,
            );

            orbitItemElement.style.setProperty("--orbit-x", `${point.x.toFixed(2)}px`);
            orbitItemElement.style.setProperty("--orbit-y", `${point.y.toFixed(2)}px`);
          });
        }
      }

      frameId = window.requestAnimationFrame(updateOrbit);
    };

    frameId = window.requestAnimationFrame(updateOrbit);

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return (
    <section className="landing-hero">
      <div className="landing-hero__copy">
        <h1 className="landing-hero__title">
          <span className="landing-hero__title-line">
            Hi, I&apos;m <span className="landing-hero__title-accent">{profile.name}.</span>
          </span>
          <span className="landing-hero__title-line">
            I build <span className="landing-hero__title-underline">reliable software</span>
          </span>
          <span className="landing-hero__title-line">
            and explore <span className="landing-hero__title-accent">AI for impact.</span>
          </span>
        </h1>

        <p className="landing-hero__summary">{profile.summary}</p>

        <div className="landing-hero__actions">
          <Link className="landing-hero__primary" to="/projects">
            <span>Explore My Work</span>
            <ArrowRightIcon />
          </Link>

          <a className="landing-hero__secondary" download href="/resume.pdf">
            <span>Download Resume</span>
            <DownloadIcon />
          </a>
        </div>

        <div className="landing-hero__status">
          <Link className="landing-hero__pill" to="/contact">
            <span aria-hidden="true" className="landing-hero__pill-dot" />
            {heroPill}
          </Link>

          {linkedInLink ? (
            <a
              aria-label="Visit LinkedIn"
              className="landing-hero__social"
              href={linkedInLink}
              rel="noreferrer"
              target="_blank"
            >
              <LinkedInIcon />
            </a>
          ) : null}
        </div>

        <a className="landing-hero__scroll" href="#what-i-do">
          <span className="landing-hero__scroll-indicator">
            <span className="landing-hero__scroll-indicator-dot" />
          </span>
          <span>Scroll Down</span>
          <ChevronDownIcon />
        </a>
      </div>

      <div className="landing-hero__visual">
        <div aria-hidden="true" className="landing-hero__halo" ref={haloRef} />
        <div aria-hidden="true" className="landing-hero__dots" />
        <div className="landing-hero__orbit">
          {heroCards.map((card) => (
            <div
              className="landing-hero__orbit-item"
              key={card.key}
              ref={(node) => {
                orbitItemRefs.current[card.key] = node;
              }}
            >
              <article
                className="landing-hero__callout"
                ref={(node) => {
                  calloutRefs.current[card.key] = node;
                }}
              >
                <span className="landing-hero__callout-icon">{card.icon}</span>
                <span className="landing-hero__callout-copy">
                  <strong>{card.title}</strong>
                  <small>{card.subtitle}</small>
                </span>
              </article>
            </div>
          ))}
        </div>

        <div className="landing-hero__portrait-shell">
          {!showImageFallback ? (
            <img
              alt={`${profile.name} portrait`}
              className="landing-hero__portrait-image"
              onError={() => setShowImageFallback(true)}
              src="/profile-photo.png"
            />
          ) : null}
          {showImageFallback ? (
            <div className="landing-hero__portrait-placeholder">
              <span>Add your photo here</span>
              <small>/public/profile-photo.png</small>
            </div>
          ) : null}
        </div>

      </div>
    </section>
  );
}
