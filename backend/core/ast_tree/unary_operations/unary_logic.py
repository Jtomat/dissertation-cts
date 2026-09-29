from enum import Enum
from typing import Unpack, ClassVar

import torch
from pydantic import ConfigDict

from core.ast_tree.core.operation import CallableOperation
from core.ast_tree.ast_tree_factory import AstTreeFactory
from core.ast_tree.unary_operations.unary import UnaryOperation


class UnaryLogicOperation(Enum):
    Not = "not"
    Cast = "cast"


UNARY_OPERATORS_FUNCS = {
    UnaryLogicOperation.Not: CallableOperation(scalar=lambda value: not value, tensor=torch.logical_not),
    UnaryLogicOperation.Cast: CallableOperation(scalar=bool, tensor=torch.Tensor.bool),
}


class UnaryLogicOperationNode(UnaryOperation[UnaryLogicOperation]):
    type: ClassVar[str]  = 'unary_logic_operation'
    _operations_dict = UNARY_OPERATORS_FUNCS
    __enum__: ClassVar[Enum] = UnaryLogicOperation


    def __init_subclass__(cls, **kwargs: Unpack[ConfigDict]):
        super().__init_subclass__(**kwargs)
        AstTreeFactory.register(cls.type, lambda data, builder:
        UnaryLogicOperationNode(type=data['type'], operator=cls.__enum__(data['operator']),
                                operand=builder.build(data['operand'])))
