from dataclasses import dataclass
from pathlib import Path
from typing import Any

@dataclass
class Resource:
    id: str
    name: str
    uri: Path


    type: Any
    metadata: Any


    def load(self):
        pass

    def read(self):
        pass