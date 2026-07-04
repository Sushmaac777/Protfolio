"""Starter seed script for a future persistent database."""

from pprint import pprint


def main() -> None:
    pprint(
        {
            "status": "ready",
            "message": "The current backend uses in-memory repositories. Replace this script once a database is added.",
        }
    )


if __name__ == "__main__":
    main()

