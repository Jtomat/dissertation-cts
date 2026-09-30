from dataclasses import dataclass
from typing import Dict, Any

from app.logic.models.resources.resource import Resource


@dataclass
class JsonFile(Resource):



    def read(self) -> Dict[str, Any]:
        import json

        with open(self.uri) as file:
            return json.load(file)
