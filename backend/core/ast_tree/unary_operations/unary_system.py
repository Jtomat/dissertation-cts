from enum import Enum
from typing import Optional, Dict, Callable, Tuple, ClassVar

import torch
from torch import Tensor

from core.ast_tree.core.context import Context
from core.ast_tree.unary_operations.unary import UnaryOperation


class UnarySystemOperation(Enum):
    ReadPointCloudFile = "read_pcl_file"
    CallFunction = "call_function"


UNARY_OPERATORS_FUNCS: Dict[Enum, Tuple[Callable, Callable]] = {
    # TODO
    UnarySystemOperation.ReadPointCloudFile: (...),
    UnarySystemOperation.CallFunction: (...),
}


class UnarySystemOperationNode(UnaryOperation[UnarySystemOperation]):
    type: ClassVar[str]  = 'unary_system_operation'
    __enum__: ClassVar[Enum] = UnarySystemOperation

    def eval(self, context: Context, local: Optional[Context] = None) -> bool | float | Tensor:
        run_time = context.merge_with(local)
        base_val = self.operand.eval(run_time)

        to_exec = UNARY_OPERATORS_FUNCS[self.operator][bool(not torch.is_tensor(base_val))]

        return to_exec(base_val)