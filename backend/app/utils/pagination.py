from collections.abc import Sequence
from typing import TypeVar

T = TypeVar("T")


def paginate(items: Sequence[T], limit: int = 10, offset: int = 0) -> list[T]:
    return list(items[offset : offset + limit])
