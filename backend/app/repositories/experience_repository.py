from app.models.experience import Experience


class ExperienceRepository:
    def list(self) -> list[Experience]:
        return [
            Experience(
                role="QA Engineering Learner",
                company="Independent Transition Track",
                period="2025 - Present",
                summary=(
                    "Deliberately transitioning into quality assurance through hands-on practice in manual testing, "
                    "API validation, exploratory testing, and automation fundamentals."
                ),
                highlights=[
                    "Creating test cases and structured bug reports around project-based learning.",
                    "Using backend understanding to reason more clearly about failures, edge cases, and expected behavior.",
                ],
                technologies=["Manual Testing", "Postman", "API Testing", "Playwright"],
            ),
            Experience(
                role="Researcher",
                company="Academic Research Projects",
                period="2023 - Present",
                summary=(
                    "Worked on research related to social media, well-being, analytics, and digital behavior, "
                    "including publication and international presentation."
                ),
                highlights=[
                    "Co-authored research and presented findings in an academic setting.",
                    "Strengthened skills in analysis, evidence handling, writing, and structured thinking.",
                ],
                technologies=["Research Methods", "Data Analysis", "Academic Writing", "Visualization"],
            ),
            Experience(
                role="Backend Development Contributor",
                company="Project-based Work",
                period="2023 - 2025",
                summary=(
                    "Built backend logic and data workflows through academic and independent software projects, "
                    "developing a practical understanding of APIs, databases, and debugging."
                ),
                highlights=[
                    "Implemented service logic and data handling for structured applications.",
                    "Learned to view reliability from the system side as well as from the user side.",
                ],
                technologies=["Python", "FastAPI", "SQL", "Git"],
            ),
            Experience(
                role="Volunteer and Team Contributor",
                company="Student and Community Initiatives",
                period="2021 - 2024",
                summary=(
                    "Contributed to collaborative and volunteer efforts that strengthened communication, "
                    "coordination, and accountability in group work."
                ),
                highlights=[
                    "Supported planning and teamwork across shared responsibilities.",
                    "Built patience, clarity, and responsibility that now shape my QA mindset.",
                ],
                technologies=["Communication", "Documentation", "Coordination"],
            ),
        ]
