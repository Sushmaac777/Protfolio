import type { Blog } from "../types/blog";
import type { Experience } from "../types/experience";
import type { Profile } from "../types/profile";
import type { Project } from "../types/project";
import type { Publication } from "../types/publication";
import type { SkillCategory } from "../types/skill";

export const mockProfile: Profile = {
  name: "Sushma",
  title: "QA Engineer with AI & Backend Experience",
  location: "Kathmandu, Nepal",
  summary:
    "I build and validate reliable software systems through quality assurance, backend engineering, AI applications, and research. I enjoy understanding how systems work, finding where they break, and improving their reliability through thoughtful testing and engineering.",
  email: "hello@sushma.dev",
  availability: "Open to QA roles, automation growth, research-informed software, and backend-adjacent teams.",
  highlights: [
    "Brings research discipline and analytical thinking into software quality work.",
    "Connects backend understanding with user-facing quality and reliability.",
    "Growing in manual testing, API validation, SQL testing, automation, and AI-supported QA workflows.",
  ],
  social_links: [
    { label: "GitHub", url: "https://github.com/" },
    { label: "LinkedIn", url: "https://linkedin.com/" },
    { label: "Email", url: "mailto:hello@sushma.dev" },
  ],
};

export const mockProjects: Project[] = [
  {
    title: "Kidney Disease Prediction System",
    slug: "kidney-disease-prediction-system",
    year: "2025",
    summary: "A machine learning project focused on predicting chronic kidney disease from structured clinical data.",
    description:
      "This project explored how data preprocessing, feature analysis, and model comparison can support early disease prediction. It strengthened my foundation in data cleaning, evaluation, and interpreting technical results clearly.",
    status: "Academic Project",
    stack: ["Python", "Scikit-learn", "Pandas", "Jupyter", "Machine Learning"],
    featured: true,
    links: [
      { label: "Project Notes", url: "https://example.com/kidney-disease-prediction" },
      { label: "GitHub", url: "https://github.com/example/kidney-disease-prediction" },
    ],
  },
  {
    title: "Drug Prescription Analysis",
    slug: "drug-prescription-analysis",
    year: "2025",
    summary: "A data analytics project studying prescription patterns, trends, and decision support possibilities.",
    description:
      "This work focused on analyzing structured healthcare-related data to identify meaningful patterns, clean inconsistencies, and communicate findings through clear reporting and visual summaries.",
    status: "Data Analytics Study",
    stack: ["Python", "Pandas", "SQL", "Data Visualization", "Analytics"],
    featured: true,
    links: [
      { label: "Case Study", url: "https://example.com/drug-prescription-analysis" },
      { label: "Repository", url: "https://github.com/example/drug-prescription-analysis" },
    ],
  },
  {
    title: "Social Media and Well-being Research",
    slug: "social-media-and-wellbeing-research",
    year: "2024",
    summary: "A research project examining how social media use relates to well-being, behavior, and digital habits.",
    description:
      "This project brought together research design, literature review, data interpretation, and academic writing. It became a key part of my transition story by sharpening how I investigate evidence and communicate structured findings.",
    status: "Published Research",
    stack: ["Research Methods", "Survey Analysis", "Statistics", "Academic Writing"],
    featured: true,
    links: [
      { label: "Research Summary", url: "https://example.com/social-media-wellbeing" },
      { label: "Presentation", url: "https://example.com/social-media-wellbeing-presentation" },
    ],
  },
  {
    title: "Prompt Search Analysis",
    slug: "prompt-search-analysis",
    year: "2026",
    summary: "An exploratory study of how people search, refine, and evaluate prompts in AI-assisted workflows.",
    description:
      "This ongoing research interest connects my curiosity about AI with my growing interest in quality. It looks at prompt behavior, clarity, reliability, and how structured evaluation can improve AI-supported work.",
    status: "Ongoing Research",
    stack: ["Prompt Analysis", "Python", "Data Cleaning", "Visualization", "AI"],
    featured: false,
    links: [
      { label: "Research Notes", url: "https://example.com/prompt-search-analysis" },
    ],
  },
  {
    title: "QA Automation Sandbox",
    slug: "qa-automation-sandbox",
    year: "2026",
    summary: "A learning-focused testing project for practicing API testing, regression thinking, and automation fundamentals.",
    description:
      "This sandbox supports my transition into QA by giving me a place to design test cases, document bugs, validate APIs, and gradually build automation habits around real testing scenarios.",
    status: "In Progress",
    stack: ["Playwright", "Postman", "JavaScript", "API Testing", "QA"],
    featured: false,
    links: [
      { label: "Practice Log", url: "https://example.com/qa-automation-sandbox" },
      { label: "Repository", url: "https://github.com/example/qa-automation-sandbox" },
    ],
  },
  {
    title: "Portfolio Website",
    slug: "portfolio-website",
    year: "2026",
    summary: "A personal portfolio built to present my transition from engineering and research into quality assurance.",
    description:
      "This site is both a portfolio and a narrative project. It connects my academic background, research work, backend experience, QA direction, and interest in AI-powered testing through a structured, modern interface.",
    status: "Live Project",
    stack: ["React", "TypeScript", "FastAPI", "CSS", "Vite"],
    featured: false,
    links: [
      { label: "Live Site", url: "https://example.com/portfolio" },
      { label: "Source", url: "https://github.com/example/portfolio-website" },
    ],
  },
];

export const mockPublications: Publication[] = [
  {
    title: "Social Media Use and Well-being Among Students",
    venue: "Peer-reviewed Academic Publication",
    year: "2025",
    abstract:
      "A research paper exploring how social media habits, digital behavior, and well-being intersect in student life, with emphasis on evidence-based interpretation.",
    link: "https://example.com/publication/social-media-wellbeing",
    tags: ["Research", "Well-being", "Social Media"],
  },
  {
    title: "Presenting Digital Well-being Research at an International Conference",
    venue: "International Conference Presentation",
    year: "2025",
    abstract:
      "A conference presentation built from academic research findings, focusing on structured communication, interpretation of results, and practical relevance.",
    link: "https://example.com/publication/conference-presentation",
    tags: ["Conference", "Publication", "Presentation"],
  },
  {
    title: "Prompt Search Analysis for AI-assisted Workflows",
    venue: "Ongoing Independent Research",
    year: "2026",
    abstract:
      "A developing research direction examining prompt quality, search behavior, and evaluation habits in AI-supported knowledge work and testing contexts.",
    link: "https://example.com/publication/prompt-search-analysis",
    tags: ["AI", "Research", "Prompt Engineering"],
  },
];

export const mockExperience: Experience[] = [
  {
    role: "QA Engineering Learner",
    company: "Independent Transition Track",
    period: "2025 - Present",
    summary:
      "Deliberately transitioning into quality assurance through hands-on practice in manual testing, API validation, exploratory testing, and automation fundamentals.",
    highlights: [
      "Creating test cases and structured bug reports around project-based learning.",
      "Using backend understanding to reason more clearly about failures, edge cases, and expected behavior.",
    ],
    technologies: ["Manual Testing", "Postman", "API Testing", "Playwright"],
  },
  {
    role: "Researcher",
    company: "Academic Research Projects",
    period: "2023 - Present",
    summary:
      "Worked on research related to social media, well-being, analytics, and digital behavior, including publication and international presentation.",
    highlights: [
      "Co-authored research and presented findings in an academic setting.",
      "Strengthened skills in analysis, evidence handling, writing, and structured thinking.",
    ],
    technologies: ["Research Methods", "Data Analysis", "Academic Writing", "Visualization"],
  },
  {
    role: "Backend Development Contributor",
    company: "Project-based Work",
    period: "2023 - 2025",
    summary:
      "Built backend logic and data workflows through academic and independent software projects, developing a practical understanding of APIs, databases, and debugging.",
    highlights: [
      "Implemented service logic and data handling for structured applications.",
      "Learned to view reliability from the system side as well as from the user side.",
    ],
    technologies: ["Python", "FastAPI", "SQL", "Git"],
  },
  {
    role: "Volunteer and Team Contributor",
    company: "Student and Community Initiatives",
    period: "2021 - 2024",
    summary:
      "Contributed to collaborative and volunteer efforts that strengthened communication, coordination, and accountability in group work.",
    highlights: [
      "Supported planning and teamwork across shared responsibilities.",
      "Built patience, clarity, and responsibility that now shape my QA mindset.",
    ],
    technologies: ["Communication", "Documentation", "Coordination"],
  },
];

export const mockSkills: SkillCategory[] = [
  {
    name: "Quality Assurance",
    description: "Developing a testing mindset that combines structured coverage with curiosity about edge cases and reliability.",
    items: [
      { name: "Manual Testing", level: 82 },
      { name: "Test Case Design", level: 78 },
      { name: "Bug Reporting", level: 84 },
      { name: "API Testing", level: 76 },
    ],
  },
  {
    name: "Programming and Backend",
    description: "Engineering foundations that help me understand systems more deeply while testing them.",
    items: [
      { name: "Python", level: 84 },
      { name: "FastAPI", level: 80 },
      { name: "SQL", level: 78 },
      { name: "Git and GitHub", level: 75 },
    ],
  },
  {
    name: "AI, Data, and Research",
    description: "A blend of research discipline, analytics, and curiosity about AI-assisted workflows.",
    items: [
      { name: "Data Analytics", level: 82 },
      { name: "Machine Learning", level: 74 },
      { name: "Research Writing", level: 86 },
      { name: "Data Visualization", level: 72 },
    ],
  },
  {
    name: "Tools and Workflow",
    description: "Practical tools I use for analysis, project work, and steady QA growth.",
    items: [
      { name: "Postman", level: 78 },
      { name: "Jupyter", level: 80 },
      { name: "VS Code", level: 88 },
      { name: "Playwright", level: 64 },
    ],
  },
];

export const mockBlogs: Blog[] = [
  {
    title: "Why I’m Moving from Research and Backend Work into QA",
    slug: "why-im-moving-into-qa",
    excerpt: "A personal note on how research, engineering, and curiosity about software quality brought me toward QA.",
    content:
      "My transition into QA does not feel like starting over. It feels like bringing together everything I have already learned: how to ask better questions, how to analyze evidence, how systems behave internally, and how small issues affect user trust.",
    published_at: "2026-06-18",
    reading_time: "5 min read",
    tags: ["QA", "Career", "Reflection"],
  },
  {
    title: "What Research Taught Me About Finding Better Bugs",
    slug: "what-research-taught-me-about-bugs",
    excerpt: "Research trained me to notice patterns, challenge assumptions, and document findings carefully. QA needs the same habits.",
    content:
      "A good bug report is not just a complaint. It is evidence. Research helped me learn how to observe carefully, describe clearly, and support claims with detail, which translates directly into stronger testing work.",
    published_at: "2026-05-29",
    reading_time: "4 min read",
    tags: ["QA", "Research", "Testing"],
  },
  {
    title: "Testing APIs with a Backend Developer’s Perspective",
    slug: "testing-apis-with-backend-perspective",
    excerpt: "Understanding backend structure changes the way I think about API validation, edge cases, and reliability.",
    content:
      "Because I have spent time working with backend logic, I often approach API testing by thinking through data flow, expected failure modes, and how small inconsistencies surface in real usage.",
    published_at: "2026-05-06",
    reading_time: "4 min read",
    tags: ["API Testing", "Backend", "QA"],
  },
  {
    title: "Building a Portfolio That Connects QA, AI, and Research",
    slug: "building-a-portfolio-that-connects-qa-ai-and-research",
    excerpt: "A portfolio should not just list tools. It should explain the story that connects your skills and direction.",
    content:
      "For me, the portfolio is a place to connect computer engineering, data analytics, research, backend development, and the shift into QA. The goal is not to appear scattered, but to show how each step built the next one.",
    published_at: "2026-04-21",
    reading_time: "5 min read",
    tags: ["Portfolio", "QA", "Career Story"],
  },
  {
    title: "Small QA Automation Projects as a Learning Strategy",
    slug: "small-qa-automation-projects-as-a-learning-strategy",
    excerpt: "Automation becomes easier to learn when it grows from realistic testing habits instead of isolated syntax drills.",
    content:
      "I am approaching automation through small, repeatable QA projects: testing APIs, checking core flows, and learning where scripts are genuinely useful. That keeps the learning practical and tied to software quality rather than only tooling.",
    published_at: "2026-03-14",
    reading_time: "4 min read",
    tags: ["Automation", "QA", "Learning"],
  },
];
