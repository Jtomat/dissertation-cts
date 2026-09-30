from typing import List

from app.logic.models.operation_node import OperationNode


class Stage:
    id: str
    name: str
    nodes: List[OperationNode]
    status: str
