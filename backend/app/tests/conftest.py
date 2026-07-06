import os
from pathlib import Path
from tempfile import gettempdir
from uuid import uuid4

TEST_DATABASE_PATH = Path(gettempdir()) / f"portfolio-test-{uuid4().hex}.db"
os.environ["PORTFOLIO_DATABASE_URL"] = f"sqlite:///{TEST_DATABASE_PATH.as_posix()}"


def pytest_sessionfinish(session, exitstatus) -> None:  # type: ignore[unused-argument]
    TEST_DATABASE_PATH.unlink(missing_ok=True)
