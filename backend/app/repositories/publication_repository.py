from app.models.publication import Publication


class PublicationRepository:
    def list(self) -> list[Publication]:
        return [
            Publication(
                title="Social Media Use and Well-being Among Students",
                venue="Peer-reviewed Academic Publication",
                year="2025",
                abstract=(
                    "A research paper exploring how social media habits, digital behavior, and well-being intersect "
                    "in student life, with emphasis on evidence-based interpretation."
                ),
                link="https://example.com/publication/social-media-wellbeing",
                tags=["Research", "Well-being", "Social Media"],
            ),
            Publication(
                title="Presenting Digital Well-being Research at an International Conference",
                venue="International Conference Presentation",
                year="2025",
                abstract=(
                    "A conference presentation built from academic research findings, focusing on structured "
                    "communication, interpretation of results, and practical relevance."
                ),
                link="https://example.com/publication/conference-presentation",
                tags=["Conference", "Publication", "Presentation"],
            ),
            Publication(
                title="Prompt Search Analysis for AI-assisted Workflows",
                venue="Ongoing Independent Research",
                year="2026",
                abstract=(
                    "A developing research direction examining prompt quality, search behavior, and evaluation "
                    "habits in AI-supported knowledge work and testing contexts."
                ),
                link="https://example.com/publication/prompt-search-analysis",
                tags=["AI", "Research", "Prompt Engineering"],
            ),
        ]
