export type ProjectLink = {
  label: string;
  url: string;
};

export type Project = {
  title: string;
  slug: string;
  year: string;
  summary: string;
  description: string;
  status: string;
  stack: string[];
  featured: boolean;
  links: ProjectLink[];
};

