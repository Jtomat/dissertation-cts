from dataclasses import dataclass
from typing import List, Optional, ClassVar, Dict, Any

import torch
from torch import Tensor

from core.ast_tree.ast_tree_factory import AstTreeFactory
from core.ast_tree.condition.condition_variant import ConditionVariantNode
from core.ast_tree.core.context import Context
from core.ast_tree.core.expression import Expression


@dataclass
class ConditionNode(Expression):
    variants: List[ConditionVariantNode]
    else_: Expression
    type: ClassVar[str]  = "condition"

    @classmethod
    def from_dict(cls, data: Dict[str, Any], builder: AstTreeFactory) -> 'ConditionNode':
        return  ConditionNode(
            variants=list(map(lambda v: builder.build(v), data['variants'])),
            else_=builder.build(data['else']))

    def eval(self, context: Context, local: Optional[Context] = None) -> bool | float | Tensor:
        for variant in self.variants:
            if variant.condition.eval(context, local):
                return variant.eval(context, local)
        return self.else_.eval(context, local)
