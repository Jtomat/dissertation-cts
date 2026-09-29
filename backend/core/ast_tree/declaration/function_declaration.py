from dataclasses import dataclass
from typing import ClassVar, Dict, Any

from core.ast_tree.ast_tree_factory import AstTreeFactory
from core.ast_tree.core.declaration import Declaration


@dataclass
class FunctionDeclaration(Declaration):
    arguments: list[str]
    type: ClassVar[str]  = 'function_declaration'

    @classmethod
    def from_dict(cls, data: Dict[str, Any], builder: AstTreeFactory) -> 'FunctionDeclaration':
        return FunctionDeclaration(arguments=data['arguments'], name=data['name'], value=builder.build(data['value']))


