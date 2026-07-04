export type SocialLink = {
  label: string;
  url: string;
};

export type Profile = {
  name: string;
  title: string;
  location: string;
  summary: string;
  email: string;
  availability: string;
  highlights: string[];
  social_links: SocialLink[];
};

