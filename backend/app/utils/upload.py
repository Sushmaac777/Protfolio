from pathlib import Path


def generate_upload_path(filename: str) -> str:
    return str(Path("uploads") / filename)

