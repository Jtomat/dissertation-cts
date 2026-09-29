from dataclasses import dataclass
from typing import Optional, Dict, ClassVar, Any

import torch
from functorch.dim import Tensor
from pydantic import ConfigDict

from core.ast_tree.core.context import Context
from core.ast_tree.core.expression import Expression
from core.ast_tree.declaration.variable_declaration import VariableDeclaration
from core.ast_tree.literal import LiteralNode
from core.ast_tree.ast_tree_factory import AstTreeFactory



@dataclass
class FunctionCallNode(Expression):
    name: str
    arguments: Dict[str, Expression]

    type: ClassVar[str]  = 'function_call'

    @classmethod
    def from_dict(cls, data: Dict[str, Any], builder: AstTreeFactory) -> 'FunctionCallNode':
        args = {}

        for key, value in data['arguments']:
            args[key] = builder.build(value)
        return FunctionCallNode(name=data['name'], arguments=args)

    def eval(self, context: Context, local: Optional[Context] = None) -> bool | float | Tensor:
        run_time = context.merge_with(local)

        func = run_time.get_declaration(self.name)

        if func is not None:
            eval_context = Context()

            for arg in func.arguments:
                literal_value = self.arguments[arg].eval(run_time)
                # внутри все параметры литералы для экономии при вычислениях
                eval_context.set_declaration(VariableDeclaration(name=arg, value=LiteralNode(value=literal_value)))

            return func.value.eval(run_time.merge_with(eval_context))

        raise AttributeError(f'Function with name "{self.name}" not found in runtime context."')
