from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional

from app.logic.models.resources.resource import Resource
from app.logic.models.stage import Stage

@dataclass
class Project:
    uuid: str
    name: str
    description: str
    path: Path

    stages: Optional[List[Stage]]

    resources: Optional[List[Resource]]

    globals: Optional[Stage]

    def to_json(self):
        return {
            "uuid": self.uuid,
            "name": self.name,
            "description": self.description,
        }
