from dataclasses import Field, dataclass
from typing import Optional, ClassVar, Dict, Any

import torch
from torch import Tensor

from core.ast_tree.ast_tree_factory import AstTreeFactory
from core.ast_tree.core.context import Context
from core.ast_tree.core.expression import Expression


@dataclass
class ConditionVariantNode(Expression):
    condition: Expression
    then_: Expression
    type: ClassVar[str]  = 'condition_variant'

    @classmethod
    def from_dict(cls, data: Dict[str, Any], builder: AstTreeFactory) -> 'ConditionVariantNode':
      return ConditionVariantNode(condition=builder.build(data['condition']), then_=builder.build(data['then']))
    def eval(self, context: Context, local: Optional[Context] = None) -> bool | float | Tensor:
        return self.then_.eval(context.merge_with(local))
