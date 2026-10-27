from dataclasses import dataclass

from app.logic.models.types import EvalStatus
from core.ast_tree import Declaration
from core.ast_tree.core import declaration


@dataclass
class OperationNode:
    uuid: str
    name: str
    description: str

    status: EvalStatus

    declaration: Declaration

    def to_json(self):
        return {
            "uuid": self.uuid,
            "name": self.name,
            "description": self.description,
            "declaration": self.declaration,
        }
