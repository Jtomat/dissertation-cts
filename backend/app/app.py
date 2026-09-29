import os
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="My IDE Core", root_path='/api')

ROOT = Path(
    os.environ.get("IDE_WORKSPACE", str(Path.home()))
).resolve()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4300"],
    allow_credentials=False,
    allow_methods=["*"],  # ["GET", "POST"],
    allow_headers=["*"],  # ["Content-Type", "Authorization"],
)


class FileReadRequest(BaseModel):
    path: str


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "python-core"
    }


@app.get("/state")
async def state():
    return {
        "project": "My IDE",
        "core": "ready",
        "workspace": str(ROOT)
    }


@app.post("/files/read")
async def read_file(request: FileReadRequest):
    path = (ROOT / request.path).resolve()

    # Не разрешаем выходить за пределы workspace
    if not path.is_relative_to(ROOT):
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    if not path.is_file():
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )

    try:
        content = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=415,
            detail="Unsupported file encoding"
        )

    return {
        "path": str(path.relative_to(ROOT)),
        "content": content
    }
