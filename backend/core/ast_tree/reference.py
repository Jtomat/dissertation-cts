from dataclasses import dataclass
from typing import Optional, ClassVar, Dict, Any

import torch
from pydantic import ConfigDict
from torch import Tensor

from core.ast_tree.core.context import Context
from core.ast_tree.core.expression import Expression
from core.ast_tree.ast_tree_factory import AstTreeFactory


@dataclass
class ReferenceNode(Expression):
    name: str
    type: ClassVar[str]  = 'reference'


    @classmethod
    def from_dict(cls, data: Dict[str, Any], builder: AstTreeFactory) -> 'ReferenceNode':
        return ReferenceNode(name=data['name'])

    def eval(self, context: Context, local: Optional[Context] = None) -> bool | float | Tensor:
        run_time = context.merge_with(local)

        return  run_time.get_declaration(self.name).value.eval(run_time)
