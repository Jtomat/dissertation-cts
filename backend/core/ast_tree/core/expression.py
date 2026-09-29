from typing import Optional

from torch import Tensor

from core.ast_tree.core.context import Context
from core.ast_tree.core.node import Node


# Вычисляемый элемент
class Expression(Node):

    def eval(self, context: Context, local: Optional[Context] = None) -> bool | float | Tensor:
        pass
