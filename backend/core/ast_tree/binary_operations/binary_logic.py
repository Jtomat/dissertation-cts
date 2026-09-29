import operator
from dataclasses import dataclass
from enum import Enum
from typing import Optional, ClassVar, Dict, Any

import torch
from torch import Tensor

from core.ast_tree.ast_tree_factory import AstTreeFactory
from core.ast_tree.binary_operations.binary import BinaryOperation
from core.ast_tree.core.context import Context


class BinaryLogicalOperator(Enum):
    And = 'and'
    Or = 'or'

BINARY_LOGICAL_FUNCS = {
    BinaryLogicalOperator.And: operator.and_,
    BinaryLogicalOperator.Or: operator.or_,
}

@dataclass
class BinaryLogicalOperationNode(BinaryOperation[BinaryLogicalOperator]):
    type: ClassVar[str]  = "binary_logical_operation"
    __enum__: ClassVar[Enum] = BinaryLogicalOperator

    @classmethod
    def from_dict(cls, data: Dict[str, Any], builder: AstTreeFactory) -> 'BinaryLogicalOperationNode':
        return super().from_dict(data, builder)

    def eval(self, context: Context, local: Optional[Context]=None) -> bool | float | Tensor:
        left = self.left.eval(context)
        right = self.right.eval(context)

        return BINARY_LOGICAL_FUNCS[self.operator](left, right)