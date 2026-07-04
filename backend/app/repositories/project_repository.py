from typing import Optional

from app.models.project import Project, ProjectLink


class ProjectRepository:
    def list(self) -> list[Project]:
        return [
            Project(
                title="Kidney Disease Prediction System",
                slug="kidney-disease-prediction-system",
                year="2025",
                summary="A machine learning project focused on predicting chronic kidney disease from structured clinical data.",
                description=(
                    "This project explored how data preprocessing, feature analysis, and model comparison can support "
                    "early disease prediction. It strengthened my foundation in data cleaning, evaluation, and "
                    "interpreting technical results clearly."
                ),
                status="Academic Project",
                stack=["Python", "Scikit-learn", "Pandas", "Jupyter", "Machine Learning"],
                featured=True,
                links=[
                    ProjectLink(label="Project Notes", url="https://example.com/kidney-disease-prediction"),
                    ProjectLink(label="GitHub", url="https://github.com/example/kidney-disease-prediction"),
                ],
            ),
            Project(
                title="Drug Prescription Analysis",
                slug="drug-prescription-analysis",
                year="2025",
                summary="A data analytics project studying prescription patterns, trends, and decision support possibilities.",
                description=(
                    "This work focused on analyzing structured healthcare-related data to identify meaningful "
                    "patterns, clean inconsistencies, and communicate findings through clear reporting and visual "
                    "summaries."
                ),
                status="Data Analytics Study",
                stack=["Python", "Pandas", "SQL", "Data Visualization", "Analytics"],
                featured=True,
                links=[
                    ProjectLink(label="Case Study", url="https://example.com/drug-prescription-analysis"),
                    ProjectLink(label="Repository", url="https://github.com/example/drug-prescription-analysis"),
                ],
            ),
            Project(
                title="Social Media and Well-being Research",
                slug="social-media-and-wellbeing-research",
                year="2024",
                summary="A research project examining how social media use relates to well-being, behavior, and digital habits.",
                description=(
                    "This project brought together research design, literature review, data interpretation, and "
                    "academic writing. It became a key part of my transition story by sharpening how I investigate "
                    "evidence and communicate structured findings."
                ),
                status="Published Research",
                stack=["Research Methods", "Survey Analysis", "Statistics", "Academic Writing"],
                featured=True,
                links=[
                    ProjectLink(label="Research Summary", url="https://example.com/social-media-wellbeing"),
                    ProjectLink(label="Presentation", url="https://example.com/social-media-wellbeing-presentation"),
                ],
            ),
            Project(
                title="Prompt Search Analysis",
                slug="prompt-search-analysis",
                year="2026",
                summary="An exploratory study of how people search, refine, and evaluate prompts in AI-assisted workflows.",
                description=(
                    "This ongoing research interest connects my curiosity about AI with my growing interest in "
                    "quality. It looks at prompt behavior, clarity, reliability, and how structured evaluation can "
                    "improve AI-supported work."
                ),
                status="Ongoing Research",
                stack=["Prompt Analysis", "Python", "Data Cleaning", "Visualization", "AI"],
                featured=False,
                links=[
                    ProjectLink(label="Research Notes", url="https://example.com/prompt-search-analysis"),
                ],
            ),
            Project(
                title="QA Automation Sandbox",
                slug="qa-automation-sandbox",
                year="2026",
                summary="A learning-focused testing project for practicing API testing, regression thinking, and automation fundamentals.",
                description=(
                    "This sandbox supports my transition into QA by giving me a place to design test cases, document "
                    "bugs, validate APIs, and gradually build automation habits around real testing scenarios."
                ),
                status="In Progress",
                stack=["Playwright", "Postman", "JavaScript", "API Testing", "QA"],
                featured=False,
                links=[
                    ProjectLink(label="Practice Log", url="https://example.com/qa-automation-sandbox"),
                    ProjectLink(label="Repository", url="https://github.com/example/qa-automation-sandbox"),
                ],
            ),
            Project(
                title="Portfolio Website",
                slug="portfolio-website",
                year="2026",
                summary="A personal portfolio built to present my transition from engineering and research into quality assurance.",
                description=(
                    "This site is both a portfolio and a narrative project. It connects my academic background, "
                    "research work, backend experience, QA direction, and interest in AI-powered testing through a "
                    "structured, modern interface."
                ),
                status="Live Project",
                stack=["React", "TypeScript", "FastAPI", "CSS", "Vite"],
                featured=False,
                links=[
                    ProjectLink(label="Live Site", url="https://example.com/portfolio"),
                    ProjectLink(label="Source", url="https://github.com/example/portfolio-website"),
                ],
            ),
        ]

    def get_by_slug(self, slug: str) -> Optional[Project]:
        return next((project for project in self.list() if project.slug == slug), None)
