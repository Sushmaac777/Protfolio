import type { Blog } from "./blog";
import type { Experience } from "./experience";
import type { Profile } from "./profile";
import type { Project } from "./project";
import type { Publication } from "./publication";
import type { SkillCategory } from "./skill";

export type AchievementsContent = {
  eyebrow: string;
  title: string;
  description: string;
  filters: string[];
  stats: Array<{
    icon: string;
    label: string;
    value: string;
  }>;
  entries: Array<{
    description: string;
    filters: string[];
    icon: string;
    tag: string;
    tone: string;
    year: string;
    title: string;
  }>;
  quote: string;
};

export type SiteCopy = {
  navigation: {
    brandMeta: string;
  };
  home: {
    heroEyebrow: string;
    heroPill: string;
    heroPrimaryAction: string;
    heroSecondaryAction: string;
    heroPanelLabel: string;
    heroPanelChip: string;
    heroSignature: string;
    aboutEyebrow: string;
    aboutTitle: string;
    aboutNoteLabel: string;
    highlightsEyebrow: string;
    highlightsTitle: string;
    highlightsDescription: string;
    highlightsItems: Array<{
      value: string;
      label: string;
    }>;
    featuredEyebrow: string;
    featuredTitle: string;
    featuredDescription: string;
    skillsEyebrow: string;
    skillsTitle: string;
    skillsDescription: string;
    exploreEyebrow: string;
    exploreTitle: string;
    exploreDescription: string;
    exploreCards: Array<{
      kicker: string;
      title: string;
      description: string;
      to: string;
    }>;
    ctaEyebrow: string;
    ctaTitle: string;
    ctaDescription: string;
    ctaButton: string;
  };
  about: {
    educationEyebrow: string;
    educationTitle: string;
    educationItems: Array<{
      institution: string;
      detail: string;
    }>;
    timelineEyebrow: string;
    timelineTitle: string;
    interestsEyebrow: string;
    interestsTitle: string;
    interestsItems: string[];
  };
  journey: {
    eyebrow: string;
    title: string;
    description: string;
    milestones: Array<{
      year: string;
      title: string;
      detail: string;
    }>;
  };
  pages: {
    projects: {
      eyebrow: string;
      title: string;
      description: string;
    };
    publications: {
      eyebrow: string;
      title: string;
    };
    experience: {
      eyebrow: string;
      title: string;
    };
    skills: {
      eyebrow: string;
      title: string;
    };
    blog: {
      eyebrow: string;
      title: string;
    };
    contact: {
      eyebrow: string;
      title: string;
      description: string;
    };
    journey: {
      eyebrow: string;
      title: string;
      description: string;
    };
    achievements: {
      eyebrow: string;
      title: string;
      description: string;
    };
  };
  footer: {
    title: string;
    description: string;
    tagline: string;
  };
};

export type PortfolioContentMap = {
  profile: Profile;
  projects: Project[];
  publications: Publication[];
  experience: Experience[];
  skills: SkillCategory[];
  blogs: Blog[];
  achievements: AchievementsContent;
  siteCopy: SiteCopy;
};

export type PortfolioContentKey = keyof PortfolioContentMap;
