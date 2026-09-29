import math
from enum import Enum
from typing import ClassVar

import torch

from core.ast_tree.core.operation import CallableOperation
from core.ast_tree.unary_operations.unary import UnaryOperation


class UnaryMathOperation(Enum):
    Negate = "negate"
    Abs = "abs"
    Sqrt = "sqrt"
    Sin = "sin"
    Cos = "cos"
    Tan = "tan"
    Exp = "exp"
    Log = "log"
    Floor = "floor"
    Ceil = "ceil"


UNARY_OPERATORS_FUNCS = {
    UnaryMathOperation.Negate: CallableOperation(scalar=lambda x: -x, tensor=torch.neg),
    UnaryMathOperation.Abs: CallableOperation(scalar=abs, tensor=torch.abs),
    UnaryMathOperation.Sqrt: CallableOperation(scalar=math.sqrt, tensor=torch.sqrt),
    UnaryMathOperation.Sin: CallableOperation(scalar=math.sin, tensor=torch.sin),
    UnaryMathOperation.Cos: CallableOperation(scalar=math.cos, tensor=torch.cos),
    UnaryMathOperation.Tan: CallableOperation(scalar=math.tan, tensor=torch.tan),
    UnaryMathOperation.Exp: CallableOperation(scalar=math.exp, tensor=torch.exp),
    UnaryMathOperation.Log: CallableOperation(scalar=math.log, tensor=torch.log),
    UnaryMathOperation.Floor: CallableOperation(scalar=math.floor, tensor=torch.floor),
    UnaryMathOperation.Ceil: CallableOperation(scalar=math.ceil, tensor=torch.ceil),
}


class UnaryMathOperationNode(UnaryOperation[UnaryMathOperation]):
    type: ClassVar[str]  = 'unary_math_operation'
    __enum__: ClassVar[Enum] = UnaryMathOperation
    _operations_dict = UNARY_OPERATORS_FUNCS
