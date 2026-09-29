import operator
from dataclasses import dataclass
from enum import Enum
from typing import Optional, ClassVar, Any, Dict

import torch
from torch import Tensor

from core.ast_tree.ast_tree_factory import AstTreeFactory
from core.ast_tree.binary_operations.binary import BinaryOperation
from core.ast_tree.core.context import Context


class BinaryComparisonOperation(Enum):
    Equal = "equal"
    Not_Equal = "not_equal"
    Less = "less"
    Less_Equal = "less_equal"
    Greater = "greater"
    Greater_Equal = "greater_equal"


COMPARISON_OPERATORS_FUNCS = {
    BinaryComparisonOperation.Equal: operator.eq,
    BinaryComparisonOperation.Not_Equal: operator.ne,
    BinaryComparisonOperation.Less: operator.lt,
    BinaryComparisonOperation.Less_Equal: operator.le,
    BinaryComparisonOperation.Greater: operator.gt,
    BinaryComparisonOperation.Greater_Equal: operator.ge,
}

@dataclass
class BinaryComparisonNode(BinaryOperation[BinaryComparisonOperation]):
    type: ClassVar[str]  = "binary_comparison"
    __enum__: ClassVar[Enum] = BinaryComparisonOperation

    @classmethod
    def from_dict(cls, data: Dict[str, Any], builder: AstTreeFactory) -> 'BinaryComparisonNode':
        return super().from_dict(data, builder)

    def eval(self, context: Context, local: Optional[Context] = None) -> bool | Tensor:
        left = self.left.eval(context)
        right = self.right.eval(context)

        return COMPARISON_OPERATORS_FUNCS[self.operator](left, right)
