import asyncio
import json
from typing import Any

from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse

from app.db.session import get_database_backend, get_postgres_listener
from app.repositories.content_repository import CONTENT_CHANGE_CHANNEL, content_repository

router = APIRouter()


@router.get("", response_model=dict[str, Any])
def get_public_content() -> dict[str, Any]:
    return content_repository.get_public_content()


def _format_sse_event(event: str, payload: dict[str, Any]) -> str:
    return f"event: {event}\ndata: {json.dumps(payload)}\n\n"


@router.get("/stream")
async def stream_public_content(once: bool = Query(False)) -> StreamingResponse:
    async def event_stream():
        backend = get_database_backend()
        last_update_marker = content_repository.get_latest_update_marker()

        if backend != "postgresql":
            yield _format_sse_event("connected", {"status": "listening", "backend": backend})

            if once:
                return

            idle_seconds = 0
            while True:
                await asyncio.sleep(1)
                current_update_marker = content_repository.get_latest_update_marker()

                if current_update_marker != last_update_marker:
                    last_update_marker = current_update_marker
                    idle_seconds = 0
                    yield _format_sse_event("content-changed", {"updatedAt": current_update_marker, "source": "poll"})
                    continue

                idle_seconds += 1

                if idle_seconds >= 15:
                    idle_seconds = 0
                    yield _format_sse_event("ping", {"backend": backend})

        with get_postgres_listener(CONTENT_CHANGE_CHANNEL) as connection:
            yield _format_sse_event("connected", {"status": "listening", "backend": backend})

            if once:
                return

            idle_seconds = 0
            while True:
                await asyncio.sleep(1)
                connection.poll()
                emitted_notification = False

                while connection.notifies:
                    notification = connection.notifies.pop(0)
                    payload = json.loads(notification.payload) if notification.payload else {}
                    last_update_marker = payload.get("updatedAt", last_update_marker)
                    emitted_notification = True
                    yield _format_sse_event("content-changed", payload)

                current_update_marker = content_repository.get_latest_update_marker()
                if current_update_marker != last_update_marker:
                    last_update_marker = current_update_marker
                    emitted_notification = True
                    yield _format_sse_event("content-changed", {"updatedAt": current_update_marker, "source": "poll"})

                if emitted_notification:
                    idle_seconds = 0
                    continue

                idle_seconds += 1

                if idle_seconds >= 15:
                    yield _format_sse_event("ping", {"backend": "postgresql"})
                    idle_seconds = 0

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
