from typing import List

from core.logic.models.operation_node import OperationNode


class Stage:
    id: str
    name: str
    nodes: List[OperationNode]
    status: str
