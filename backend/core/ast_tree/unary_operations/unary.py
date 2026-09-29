from dataclasses import dataclass
from enum import Enum

from torch import Tensor

from core.ast_tree.ast_tree_factory import AstTreeFactory
from core.ast_tree.core.context import Context
from core.ast_tree.core.expression import Expression
from typing import TypeVar, SupportsAbs, Optional, Dict, Any

from core.ast_tree.core.operation import Operation

T = TypeVar('T', bound=SupportsAbs[Enum])

# TODO
@dataclass
class UnaryOperation(Operation[T]):
    operand: Expression

    @classmethod
    def from_dict(cls, data: Dict[str, Any], builder: AstTreeFactory) -> 'UnaryOperation':
        return UnaryOperation(operator=cls.__enum__(data['operator']), operand=builder.build(data['operand']))


    def eval(self, context: Context, local: Optional[Context] = None) -> bool | float | Tensor:
        run_time = context.merge_with(local)

        value = self.operand.eval(run_time)

        has_tenor = self.operand.eval(run_time)

        funcs = self._operations_dict[self.operator]

        return funcs.tensor(value) if has_tenor else funcs.scalar(value)
