from copy import deepcopy
from dataclasses import asdict, is_dataclass
from threading import Lock
from typing import Any

from app.repositories.blog_repository import BlogRepository
from app.repositories.experience_repository import ExperienceRepository
from app.repositories.profile_repository import ProfileRepository
from app.repositories.project_repository import ProjectRepository
from app.repositories.publication_repository import PublicationRepository
from app.repositories.skill_repository import SkillRepository

CONTENT_KEYS = (
    "profile",
    "aboutPage",
    "projects",
    "publications",
    "experience",
    "skills",
    "blogs",
    "achievements",
    "siteCopy",
)

PUBLIC_CONTENT_KEYS = ("aboutPage", "achievements", "siteCopy")


def _serialize(value: Any) -> Any:
    if is_dataclass(value):
        return asdict(value)

    if isinstance(value, list):
        return [_serialize(item) for item in value]

    if isinstance(value, dict):
        return {key: _serialize(item) for key, item in value.items()}

    return deepcopy(value)


def _build_default_content() -> dict[str, Any]:
    return {
        "profile": _serialize(ProfileRepository().get()),
        "aboutPage": {
            "introTitle": "A learning journey built through resilience, scholarships, and steady technical growth.",
            "introDescription": (
                "Coming from a full Nepali-medium background, every academic step asked me to adapt faster, work "
                "harder, and keep believing that progress could still be earned. That climb shaped not just my "
                "grades, but also the discipline, humility, and persistence I now bring into engineering and "
                "quality-focused work."
            ),
            "currentDirectionLabel": "Current direction",
            "currentDirectionText": (
                "I am growing at the intersection of QA, software engineering, and research while continuing my "
                "master's journey and building a stronger testing mindset every day."
            ),
            "introHighlights": [
                {
                    "label": "SEE",
                    "value": "3.30 GPA",
                    "detail": "Batch topper at Kudule Ma. Vi in 2015.",
                },
                {
                    "label": "+2 comeback",
                    "value": "2.66 -> 3.29",
                    "detail": "Recovered from an early struggle in science and finished among the top 3 in class.",
                },
                {
                    "label": "Bachelor's",
                    "value": "3.64 Distinction",
                    "detail": "Class topper, Pokhara University scholarship recipient, and major project award winner.",
                },
                {
                    "label": "Master's",
                    "value": "Full Scholarship",
                    "detail": "Started MSc CS in June 2025 at NCIT with a full Pokhara University scholarship.",
                },
            ],
            "skillsEyebrow": "Strengths",
            "skillsTitle": "Technical skills and human strengths that shape how I learn, build, and test.",
            "skillsDescription": (
                "I rely on both sides of the toolkit: practical technical ability for systems work, and "
                "non-technical strengths that help me stay steady, collaborative, and thoughtful under pressure."
            ),
            "skillGroups": [
                {
                    "title": "Technical DNA",
                    "description": (
                        "Tools and capabilities I use across QA, backend development, data handling, and research."
                    ),
                    "icon": "code",
                    "tone": "blue",
                    "items": [
                        "Manual Testing",
                        "API Testing",
                        "Postman",
                        "Playwright",
                        "SQL",
                        "Python",
                        "FastAPI",
                        "React",
                        "TypeScript",
                        "Research Methods",
                        "Data Analysis",
                        "Git & GitHub",
                    ],
                },
                {
                    "title": "Human Strengths",
                    "description": (
                        "Personal qualities strengthened by academic transition, research, teamwork, and long-term "
                        "self-driven growth."
                    ),
                    "icon": "users",
                    "tone": "violet",
                    "items": [
                        "Analytical Thinking",
                        "Resilience",
                        "Adaptability",
                        "Documentation",
                        "Communication",
                        "Presentation",
                        "Collaboration",
                        "Leadership",
                        "Time Management",
                        "Curiosity",
                        "Consistency",
                        "Ownership",
                    ],
                },
            ],
            "heroEyebrow": "About me",
            "heroTitleLead": "Every opportunity I've earned began with learning how",
            "heroTitleAccent": "to adapt.",
            "heroParagraphs": [
                (
                    "My journey into software engineering wasn't defined by shortcuts or perfect conditions. "
                    "Growing up with a full Nepali-medium education meant that every new academic stage demanded "
                    "extra effort, especially while transitioning into science and engineering. Rather than seeing "
                    "those challenges as limitations, they became the foundation of how I approach learning today: "
                    "patiently, consistently, and with curiosity."
                ),
                (
                    "Those experiences eventually led me toward computer engineering, academic research, backend "
                    "development, and now quality assurance, where I enjoy understanding how software behaves, "
                    "uncovering hidden issues, and helping build systems people can rely on."
                ),
            ],
            "heroPathway": [
                {
                    "title": "Learning",
                    "subtitle": "Building strong foundations",
                    "icon": "book",
                    "tone": "blue",
                },
                {
                    "title": "Engineering",
                    "subtitle": "Solving problems with code",
                    "icon": "code",
                    "tone": "green",
                },
                {
                    "title": "Research",
                    "subtitle": "Exploring, analyzing and discovering",
                    "icon": "search",
                    "tone": "violet",
                },
                {
                    "title": "Quality",
                    "subtitle": "Making software reliable and trustworthy",
                    "icon": "shield",
                    "tone": "amber",
                },
            ],
            "educationEyebrow": "Journey",
            "educationTitle": "My Academic Journey",
            "educationDescription": "A story of growth, resilience, and consistent progress.",
            "educationJourney": [
                {
                    "year": "2015",
                    "stage": "SEE",
                    "institution": "Kudule Ma. Vi",
                    "detail": "Completed SEE with a 3.30 GPA and finished as batch topper.",
                    "outcome": "Batch Topper",
                    "highlights": ["3.30 GPA"],
                    "icon": "trophy",
                    "tone": "blue",
                },
                {
                    "year": "2017",
                    "stage": "+2 Science",
                    "institution": "Kaski Modernized Academy",
                    "detail": "From 2.66 GPA in grade 11 to 3.29 GPA in grade 12 and graduated among top 3.",
                    "outcome": "Top 3 in Class",
                    "highlights": ["2.66 in Grade 11", "3.29 in Grade 12"],
                    "icon": "leaf",
                    "tone": "green",
                },
                {
                    "year": "2024",
                    "stage": "B.E. in Computer Engineering",
                    "institution": "Everest Engineering College",
                    "detail": (
                        "Completed with 3.64 GPA in distinction, PU scholarship, class topper, and major project "
                        "award."
                    ),
                    "outcome": "Distinction & Class Topper",
                    "highlights": ["3.64 GPA", "PU Scholarship", "Major Project Award"],
                    "icon": "cap",
                    "tone": "violet",
                },
                {
                    "year": "2025 - Present",
                    "stage": "MSc Computer Science",
                    "institution": "Nepal College of Information Technology",
                    "detail": "Started master's in June 2025 with a full Pokhara University scholarship.",
                    "outcome": "Full Scholarship",
                    "highlights": ["Started June 2025", "PU Scholarship"],
                    "icon": "star",
                    "tone": "amber",
                },
            ],
            "lessonTitle": "What Each Stage Taught Me",
            "lessonItems": [
                {
                    "eyebrow": "School",
                    "title": "Discipline",
                    "description": "Consistency and daily effort matter more than talent.",
                    "icon": "school",
                    "tone": "blue",
                },
                {
                    "eyebrow": "Engineering",
                    "title": "Systems Thinking",
                    "description": "Understanding how complex systems are designed, built, and maintained.",
                    "icon": "code",
                    "tone": "green",
                },
                {
                    "eyebrow": "Research",
                    "title": "Analytical Thinking",
                    "description": "Investigating problems with evidence, not assumptions, drives meaningful results.",
                    "icon": "search",
                    "tone": "violet",
                },
                {
                    "eyebrow": "Quality Assurance",
                    "title": "Attention to Detail",
                    "description": "Every edge case is an opportunity to improve someone's experience.",
                    "icon": "shield",
                    "tone": "amber",
                },
            ],
            "nextTitle": "What I'm Building Next",
            "nextSteps": [
                {
                    "title": "Quality Engineering",
                    "description": (
                        "Deepening my understanding of QA processes, test design, and product quality from both "
                        "user and system perspectives."
                    ),
                    "icon": "shield",
                    "tone": "blue",
                },
                {
                    "title": "Automation",
                    "description": (
                        "Building reliable test automation suites with Playwright and API testing to improve "
                        "efficiency and software reliability."
                    ),
                    "icon": "bot",
                    "tone": "green",
                },
                {
                    "title": "Research & Growth",
                    "description": (
                        "Continuing my master's journey while exploring AI, data-driven testing, and "
                        "research-informed software solutions."
                    ),
                    "icon": "chart",
                    "tone": "violet",
                },
            ],
            "quoteLead": "Good software isn't just software that works.",
            "quoteAccent": "It's software people can trust.",
        },
        "projects": _serialize(ProjectRepository().list()),
        "publications": _serialize(PublicationRepository().list()),
        "experience": _serialize(ExperienceRepository().list()),
        "skills": _serialize(SkillRepository().list()),
        "blogs": _serialize(BlogRepository().list()),
        "achievements": {
            "eyebrow": "Achievements",
            "title": "Milestones that shape my journey",
            "description": (
                "A collection of achievements, recognitions, and accomplishments that reflect my dedication to "
                "learning, research, and creating impact."
            ),
            "filters": [
                "All Achievements",
                "Research",
                "Academic",
                "Professional",
                "Leadership",
                "Community",
            ],
            "stats": [
                {
                    "icon": "medal",
                    "label": "Major Achievements",
                    "value": "06+",
                },
                {
                    "icon": "cap",
                    "label": "Scholarships",
                    "value": "02",
                },
                {
                    "icon": "book",
                    "label": "Published Paper",
                    "value": "01",
                },
                {
                    "icon": "mic",
                    "label": "Conference Talk",
                    "value": "01",
                },
            ],
            "entries": [
                {
                    "description": (
                        'Published a research paper on "Social Media, Loneliness and Social Comparison" in an '
                        "international journal."
                    ),
                    "filters": ["Research", "Academic"],
                    "icon": "cap",
                    "tag": "Research",
                    "title": "Published Research Paper",
                    "tone": "blue",
                    "year": "2025",
                },
                {
                    "description": "Presented my research work at the International Conference - ICESA 2025.",
                    "filters": ["Research"],
                    "icon": "mic",
                    "tag": "Research",
                    "title": "International Conference Presentation",
                    "tone": "green",
                    "year": "2025",
                },
                {
                    "description": "Graduated with a Bachelor's degree in Computer Engineering.",
                    "filters": ["Academic"],
                    "icon": "trophy",
                    "tag": "Academic",
                    "title": "Bachelor's Degree in Computer Engineering",
                    "tone": "violet",
                    "year": "2024",
                },
                {
                    "description": (
                        "Worked as a Research Assistant under Professor Shailesh Bahadur Pandey, contributing to "
                        "multiple research projects."
                    ),
                    "filters": ["Professional", "Research"],
                    "icon": "star",
                    "tag": "Professional",
                    "title": "Research Assistant",
                    "tone": "amber",
                    "year": "2023",
                },
                {
                    "description": "Received university scholarship for academic excellence.",
                    "filters": ["Academic"],
                    "icon": "medal",
                    "tag": "Academic",
                    "title": "University Scholarship Recipient",
                    "tone": "rose",
                    "year": "2022",
                },
                {
                    "description": "Coordinated multiple college events and volunteered in technical and social initiatives.",
                    "filters": ["Leadership", "Community"],
                    "icon": "people",
                    "tag": "Leadership",
                    "title": "Volunteer & Event Coordinator",
                    "tone": "cyan",
                    "year": "2021",
                },
            ],
            "quote": (
                "Every achievement is a stepping stone. I believe in continuous learning, meaningful research, and "
                "creating solutions that make a difference."
            ),
        },
        "siteCopy": {
            "navigation": {
                "brandMeta": "QA engineer • AI, backend, and research",
            },
            "home": {
                "heroEyebrow": "Portfolio",
                "heroPill": "Open for selected collaborations",
                "heroPrimaryAction": "Explore Projects",
                "heroSecondaryAction": "Start a Conversation",
                "heroPanelLabel": "Based in",
                "heroPanelChip": "Independent",
                "heroSignature": (
                    "Building expertise in software quality assurance through manual testing, API validation, SQL "
                    "testing, and automation while continuing research in AI and data-driven systems."
                ),
                "aboutEyebrow": "About",
                "aboutTitle": "Tracing the journey from computer engineering and research into software quality.",
                "aboutNoteLabel": "Current direction",
                "highlightsEyebrow": "Snapshot",
                "highlightsTitle": "A quick view of the work so far.",
                "highlightsDescription": (
                    "The combination matters most: software quality, backend engineering, AI curiosity, and "
                    "research discipline working together."
                ),
                "highlightsItems": [
                    {
                        "value": "1+",
                        "label": "Research publication",
                    },
                    {
                        "value": "1",
                        "label": "International presentation",
                    },
                    {
                        "value": "6+",
                        "label": "Technical projects",
                    },
                    {
                        "value": "4",
                        "label": "Experience chapters",
                    },
                    {
                        "value": "QA",
                        "label": "Current direction",
                    },
                    {
                        "value": "AI • Backend • Research",
                        "label": "Supporting strengths",
                    },
                ],
                "featuredEyebrow": "Selected Work",
                "featuredTitle": "Featured work across QA practice, AI and backend projects, and research.",
                "featuredDescription": (
                    "A few selected projects that show how testing, analysis, and engineering come together in my "
                    "work."
                ),
                "skillsEyebrow": "Strengths",
                "skillsTitle": "A profile shaped by testing, backend logic, analytics, and research.",
                "skillsDescription": (
                    "Not just tools I know, but the different lenses I bring into debugging, validation, and analysis."
                ),
                "exploreEyebrow": "Browse the Work",
                "exploreTitle": "A personal portfolio should feel like an invitation, not a brochure.",
                "exploreDescription": (
                    "Start with the angle that feels most interesting: the QA journey, the project work, the "
                    "research background, or the writing."
                ),
                "exploreCards": [
                    {
                        "kicker": "01",
                        "title": "QA Lens",
                        "description": (
                            "How I approach testing, reliability, bug thinking, and the transition into QA."
                        ),
                        "to": "/skills",
                    },
                    {
                        "kicker": "02",
                        "title": "Projects",
                        "description": (
                            "Research, analytics, backend, and portfolio work that show how the path evolved."
                        ),
                        "to": "/projects",
                    },
                    {
                        "kicker": "03",
                        "title": "Research",
                        "description": (
                            "Publications and inquiry-driven work that shaped my analytical habits."
                        ),
                        "to": "/publications",
                    },
                    {
                        "kicker": "04",
                        "title": "Writing",
                        "description": "Short notes on QA learning, AI workflows, and software quality.",
                        "to": "/blog",
                    },
                ],
                "ctaEyebrow": "Next Step",
                "ctaTitle": "I’m currently seeking opportunities to contribute as a QA Engineer.",
                "ctaDescription": (
                    "I want to keep growing in automation testing, software quality, and AI-enabled systems while "
                    "bringing strong research habits and backend understanding to the team."
                ),
                "ctaButton": "Get in Touch",
            },
            "about": {
                "educationEyebrow": "Education",
                "educationTitle": "An engineering foundation strengthened by research and self-directed QA growth.",
                "educationItems": [
                    {
                        "institution": "Bachelor of Computer Engineering",
                        "detail": (
                            "Built a foundation in programming, software engineering, databases, networking, and "
                            "analytical problem solving through formal engineering study."
                        ),
                    },
                    {
                        "institution": "Research and Continuous Learning",
                        "detail": (
                            "Extended that foundation through academic research, data analytics, backend projects, QA "
                            "learning, and growing interest in AI-powered testing."
                        ),
                    },
                ],
                "timelineEyebrow": "Timeline",
                "timelineTitle": "Recent chapters in the work.",
                "interestsEyebrow": "Interests",
                "interestsTitle": "What I’m excited to keep exploring next.",
                "interestsItems": [
                    "Quality assurance that connects user impact with system reliability.",
                    "AI-powered testing, prompt evaluation, and data-informed QA workflows.",
                    "Research-driven software work where analytics, engineering, and communication overlap.",
                ],
            },
            "journey": {
                "eyebrow": "Journey",
                "title": (
                    "Following the path from engineering study into research, backend work, and software quality."
                ),
                "description": (
                    "This timeline is less about job titles and more about how each chapter shaped the way I learn, "
                    "build, investigate, and test systems."
                ),
                "milestones": [
                    {
                        "year": "2020",
                        "title": "Started Computer Engineering",
                        "detail": (
                            "Built the technical foundation in programming, systems thinking, software engineering, "
                            "and structured problem solving."
                        ),
                    },
                    {
                        "year": "2022",
                        "title": "Research Became a Serious Thread",
                        "detail": (
                            "Developed stronger habits around analysis, evidence, writing, and asking better "
                            "questions through academic research work."
                        ),
                    },
                    {
                        "year": "2024",
                        "title": "Graduation and Deeper Project Work",
                        "detail": (
                            "Strengthened backend, analytics, and applied AI experience through independent and "
                            "academic software projects."
                        ),
                    },
                    {
                        "year": "2025",
                        "title": "Research Presentation and QA Shift",
                        "detail": (
                            "Presented work internationally and started intentionally moving toward quality "
                            "assurance, testing, and reliability-focused practice."
                        ),
                    },
                    {
                        "year": "2026",
                        "title": "Building Toward Automation QA",
                        "detail": (
                            "Expanding into API testing, Playwright, AI evaluation, and research-informed testing "
                            "workflows with long-term focus on dependable systems."
                        ),
                    },
                ],
            },
            "pages": {
                "projects": {
                    "eyebrow": "Projects",
                    "title": "Projects that show the path from research and analytics toward QA.",
                    "description": "Browse by technology, topic, or project name.",
                },
                "publications": {
                    "eyebrow": "Research",
                    "title": "Published work, presentations, and evolving research interests.",
                },
                "experience": {
                    "eyebrow": "Experience",
                    "title": "A journey through engineering study, research, backend work, and QA transition.",
                },
                "skills": {
                    "eyebrow": "Skills",
                    "title": "A toolkit shaped by engineering, research, analytics, and quality-focused learning.",
                },
                "blog": {
                    "eyebrow": "Blog",
                    "title": "Notes on QA learning, research thinking, AI workflows, and software quality.",
                },
                "contact": {
                    "eyebrow": "Contact",
                    "title": "Let’s build something thoughtful.",
                    "description": "If you have a project, role, or collaboration in mind, send a note.",
                },
                "journey": {
                    "eyebrow": "Journey",
                    "title": "A timeline of how engineering, research, and QA began connecting.",
                    "description": "A quick way to understand how the story has evolved over time.",
                },
                "achievements": {
                    "eyebrow": "Achievements",
                    "title": "Recognition, milestones, and markers of steady progress.",
                    "description": "A focused view of academic, research, and professional milestones.",
                },
            },
            "footer": {
                "title": "Sushma Portfolio",
                "copyright": "All rights reserved.",
            },
        },
    }


class ContentRepository:
    def __init__(self) -> None:
        self._defaults = _build_default_content()
        self._content = deepcopy(self._defaults)
        self._lock = Lock()

    def list_keys(self) -> tuple[str, ...]:
        return CONTENT_KEYS

    def exists(self, section: str) -> bool:
        return section in CONTENT_KEYS

    def get(self, section: str) -> Any:
        if not self.exists(section):
            raise KeyError(section)

        with self._lock:
            return deepcopy(self._content[section])

    def get_public_content(self) -> dict[str, Any]:
        with self._lock:
            return {section: deepcopy(self._content[section]) for section in PUBLIC_CONTENT_KEYS}

    def get_all(self) -> dict[str, Any]:
        with self._lock:
            return deepcopy(self._content)

    def update(self, section: str, value: Any) -> Any:
        if not self.exists(section):
            raise KeyError(section)

        with self._lock:
            self._content[section] = deepcopy(value)
            return deepcopy(self._content[section])

    def reset(self, section: str) -> Any:
        if not self.exists(section):
            raise KeyError(section)

        with self._lock:
            self._content[section] = deepcopy(self._defaults[section])
            return deepcopy(self._content[section])

    def reset_all(self) -> dict[str, Any]:
        with self._lock:
            self._content = deepcopy(self._defaults)
            return deepcopy(self._content)


content_repository = ContentRepository()
