from pathlib import Path
from typing import List, Any

from app.logic.models.resources.resource import Resource
from app.logic.models.stage import Stage


class Project:
    id: str
    name: str
    path: Path
    description: str

    stages: List[Stage]
    resources: List[Resource]
    globals: Any
