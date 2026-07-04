from typing import Optional

from app.models.blog import Blog


class BlogRepository:
    def list(self) -> list[Blog]:
        return [
            Blog(
                title="Why I’m Moving from Research and Backend Work into QA",
                slug="why-im-moving-into-qa",
                excerpt=(
                    "A personal note on how research, engineering, and curiosity about software quality brought me "
                    "toward QA."
                ),
                content=(
                    "My transition into QA does not feel like starting over. It feels like bringing together "
                    "everything I have already learned: how to ask better questions, how to analyze evidence, how "
                    "systems behave internally, and how small issues affect user trust."
                ),
                published_at="2026-06-18",
                reading_time="5 min read",
                tags=["QA", "Career", "Reflection"],
            ),
            Blog(
                title="What Research Taught Me About Finding Better Bugs",
                slug="what-research-taught-me-about-bugs",
                excerpt=(
                    "Research trained me to notice patterns, challenge assumptions, and document findings carefully. "
                    "QA needs the same habits."
                ),
                content=(
                    "A good bug report is not just a complaint. It is evidence. Research helped me learn how to "
                    "observe carefully, describe clearly, and support claims with detail, which translates directly "
                    "into stronger testing work."
                ),
                published_at="2026-05-29",
                reading_time="4 min read",
                tags=["QA", "Research", "Testing"],
            ),
            Blog(
                title="Testing APIs with a Backend Developer’s Perspective",
                slug="testing-apis-with-backend-perspective",
                excerpt=(
                    "Understanding backend structure changes the way I think about API validation, edge cases, and "
                    "reliability."
                ),
                content=(
                    "Because I have spent time working with backend logic, I often approach API testing by thinking "
                    "through data flow, expected failure modes, and how small inconsistencies surface in real usage."
                ),
                published_at="2026-05-06",
                reading_time="4 min read",
                tags=["API Testing", "Backend", "QA"],
            ),
            Blog(
                title="Building a Portfolio That Connects QA, AI, and Research",
                slug="building-a-portfolio-that-connects-qa-ai-and-research",
                excerpt=(
                    "A portfolio should not just list tools. It should explain the story that connects your skills "
                    "and direction."
                ),
                content=(
                    "For me, the portfolio is a place to connect computer engineering, data analytics, research, "
                    "backend development, and the shift into QA. The goal is not to appear scattered, but to show "
                    "how each step built the next one."
                ),
                published_at="2026-04-21",
                reading_time="5 min read",
                tags=["Portfolio", "QA", "Career Story"],
            ),
            Blog(
                title="Small QA Automation Projects as a Learning Strategy",
                slug="small-qa-automation-projects-as-a-learning-strategy",
                excerpt=(
                    "Automation becomes easier to learn when it grows from realistic testing habits instead of "
                    "isolated syntax drills."
                ),
                content=(
                    "I am approaching automation through small, repeatable QA projects: testing APIs, checking core "
                    "flows, and learning where scripts are genuinely useful. That keeps the learning practical and "
                    "tied to software quality rather than only tooling."
                ),
                published_at="2026-03-14",
                reading_time="4 min read",
                tags=["Automation", "QA", "Learning"],
            ),
        ]

    def get_by_slug(self, slug: str) -> Optional[Blog]:
        return next((blog for blog in self.list() if blog.slug == slug), None)
