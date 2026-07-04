import type { AchievementsContent } from "../types/content";

export const achievements: AchievementsContent = {
  eyebrow: "Achievements",
  title: "Milestones that shape my journey",
  description:
    "A collection of achievements, recognitions, and accomplishments that reflect my dedication to learning, research, and creating impact.",
  filters: ["All Achievements", "Research", "Academic", "Professional", "Leadership", "Community"],
  stats: [
    {
      icon: "medal",
      label: "Major Achievements",
      value: "06+",
    },
    {
      icon: "cap",
      label: "Scholarships",
      value: "02",
    },
    {
      icon: "book",
      label: "Published Paper",
      value: "01",
    },
    {
      icon: "mic",
      label: "Conference Talk",
      value: "01",
    },
  ],
  entries: [
    {
      description:
        'Published a research paper on "Social Media, Loneliness and Social Comparison" in an international journal.',
      filters: ["Research", "Academic"],
      icon: "cap",
      tag: "Research",
      title: "Published Research Paper",
      tone: "blue",
      year: "2025",
    },
    {
      description: "Presented my research work at the International Conference - ICESA 2025.",
      filters: ["Research"],
      icon: "mic",
      tag: "Research",
      title: "International Conference Presentation",
      tone: "green",
      year: "2025",
    },
    {
      description: "Graduated with a Bachelor's degree in Computer Engineering.",
      filters: ["Academic"],
      icon: "trophy",
      tag: "Academic",
      title: "Bachelor's Degree in Computer Engineering",
      tone: "violet",
      year: "2024",
    },
    {
      description:
        "Worked as a Research Assistant under Professor Shailesh Bahadur Pandey, contributing to multiple research projects.",
      filters: ["Professional", "Research"],
      icon: "star",
      tag: "Professional",
      title: "Research Assistant",
      tone: "amber",
      year: "2023",
    },
    {
      description: "Received university scholarship for academic excellence.",
      filters: ["Academic"],
      icon: "medal",
      tag: "Academic",
      title: "University Scholarship Recipient",
      tone: "rose",
      year: "2022",
    },
    {
      description:
        "Coordinated multiple college events and volunteered in technical and social initiatives.",
      filters: ["Leadership", "Community"],
      icon: "people",
      tag: "Leadership",
      title: "Volunteer & Event Coordinator",
      tone: "cyan",
      year: "2021",
    },
  ],
  quote:
    "Every achievement is a stepping stone. I believe in continuous learning, meaningful research, and creating solutions that make a difference.",
};
