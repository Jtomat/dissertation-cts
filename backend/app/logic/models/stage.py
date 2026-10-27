from dataclasses import dataclass
from typing import List

from app.logic.models.operation_node import OperationNode
from app.logic.models.types import EvalStatus

@dataclass
class Stage:
    uuid: str
    name: str
    description: str

    status: EvalStatus

    nodes: List[OperationNode]

    def to_json(self):

        return {
            "uuid": self.uuid,
            "name": self.name,
            "description": self.description,
            "status": self.status,
            "nodes": list(map(lambda x: x.to_json(), self.nodes)),
        }