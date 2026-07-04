from app.models.profile import Profile, SocialLink


class ProfileRepository:
    def get(self) -> Profile:
        return Profile(
            name="Sushma",
            title="QA Engineer | Computer Engineer | AI & Data Analytics Researcher",
            location="Kathmandu, Nepal",
            summary=(
                "I am a computer engineer shaping my career in quality assurance after building experience across "
                "research, data analytics, backend development, and applied AI. I enjoy understanding how systems "
                "behave, where they break, and how better testing can make software more trustworthy."
            ),
            email="hello@sushma.dev",
            availability="Open to QA, test automation, research-informed software, and backend-adjacent roles.",
            highlights=[
                "Brings research discipline and analytical thinking into software quality work.",
                "Understands products from both the backend system side and the end-user quality side.",
                "Interested in manual testing, API validation, automation, and AI-powered testing workflows.",
            ],
            social_links=[
                SocialLink(label="GitHub", url="https://github.com/"),
                SocialLink(label="LinkedIn", url="https://linkedin.com/"),
                SocialLink(label="Email", url="mailto:hello@sushma.dev"),
            ],
        )
