from dataclasses import dataclass
from enum import Enum
from typing import Optional, Dict, Callable, Tuple, ClassVar, Any

import torch

from core.ast_tree.ast_tree_factory import AstTreeFactory
from core.ast_tree.binary_operations.binary import BinaryOperation
from core.ast_tree.core.context import Context


class BinaryMathOperation(Enum):
    Add = "add"
    Sub = "sub"
    Mul = "mul"
    Div = "div"
    Mod = "mod"
    Pow = "pow"
    Min = "min"
    Max = "max"


import operator

BINARY_OPERATORS_FUNCS: Dict[Enum, Tuple[Callable, Callable]] = {
    BinaryMathOperation.Add: (torch.add, operator.add),
    BinaryMathOperation.Sub: (torch.sub, operator.sub),
    BinaryMathOperation.Mul: (torch.mul, operator.mul),
    BinaryMathOperation.Div: (torch.div, operator.truediv),
    BinaryMathOperation.Mod: (torch.remainder, operator.mod),
    BinaryMathOperation.Pow: (torch.pow, operator.pow),
    BinaryMathOperation.Min: (torch.minimum, min),
    BinaryMathOperation.Max: (torch.maximum, max),
}

@dataclass
class BinaryMathOperationNode(BinaryOperation[BinaryMathOperation]):
    type: ClassVar[str] = "binary_math_operation"
    __enum__: ClassVar[Enum] = BinaryMathOperation

    @classmethod
    def from_dict(cls, data: Dict[str, Any], builder: AstTreeFactory) -> 'BinaryMathOperationNode':
        return super().from_dict(data, builder)

    def eval(self, context: Context, local: Optional[Context] = None):
        left = self.left.eval(context)
        right = self.right.eval(context)


        has_tensor = bool(not (torch.is_tensor(left) or torch.is_tensor(right)))

        return BINARY_OPERATORS_FUNCS[self.operator][has_tensor](left, right)
