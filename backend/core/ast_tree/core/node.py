from __future__ import annotations

from dataclasses import dataclass
from typing import ClassVar, Dict, Any

from core.ast_tree.ast_tree_factory import AstTreeFactory


@dataclass
class Node:
    type: ClassVar[str] = 'node'

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)

        AstTreeFactory.register(
            cls.type,
            lambda data, builder: cls.from_dict(data, builder),
        )


    @classmethod
    def from_dict(cls, data: Dict[str, Any], builder: AstTreeFactory) -> Node:
        raise NotImplementedError
