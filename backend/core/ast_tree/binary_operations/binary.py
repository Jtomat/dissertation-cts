from dataclasses import dataclass
from enum import Enum
from typing import TypeVar, SupportsAbs, Dict, Any

from core.ast_tree.ast_tree_factory import AstTreeFactory
from core.ast_tree.core.expression import Expression
from core.ast_tree.core.operation import Operation

T = TypeVar('T', bound=SupportsAbs[Enum])

@dataclass
class BinaryOperation(Operation[T]):
    left: Expression
    right: Expression

    @classmethod
    def from_dict(cls, data: Dict[str, Any], builder: AstTreeFactory) -> 'BinaryOperation':
        return cls(operator=cls.__enum__(data['operator']),
            left=builder.build(data['left']),
            right=builder.build(data['right']))
