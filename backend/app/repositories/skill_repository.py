from app.models.skill import SkillCategory, SkillItem


class SkillRepository:
    def list(self) -> list[SkillCategory]:
        return [
            SkillCategory(
                name="Quality Assurance",
                description=(
                    "Developing a testing mindset that combines structured coverage with curiosity about edge cases "
                    "and reliability."
                ),
                items=[
                    SkillItem(name="Manual Testing", level=82),
                    SkillItem(name="Test Case Design", level=78),
                    SkillItem(name="Bug Reporting", level=84),
                    SkillItem(name="API Testing", level=76),
                ],
            ),
            SkillCategory(
                name="Programming and Backend",
                description="Engineering foundations that help me understand systems more deeply while testing them.",
                items=[
                    SkillItem(name="Python", level=84),
                    SkillItem(name="FastAPI", level=80),
                    SkillItem(name="SQL", level=78),
                    SkillItem(name="Git and GitHub", level=75),
                ],
            ),
            SkillCategory(
                name="AI, Data, and Research",
                description="A blend of research discipline, analytics, and curiosity about AI-assisted workflows.",
                items=[
                    SkillItem(name="Data Analytics", level=82),
                    SkillItem(name="Machine Learning", level=74),
                    SkillItem(name="Research Writing", level=86),
                    SkillItem(name="Data Visualization", level=72),
                ],
            ),
            SkillCategory(
                name="Tools and Workflow",
                description="Practical tools I use for analysis, project work, and steady QA growth.",
                items=[
                    SkillItem(name="Postman", level=78),
                    SkillItem(name="Jupyter", level=80),
                    SkillItem(name="VS Code", level=88),
                    SkillItem(name="Playwright", level=64),
                ],
            ),
        ]
