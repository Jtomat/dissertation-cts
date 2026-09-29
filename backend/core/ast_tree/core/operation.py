from dataclasses import dataclass
from enum import Enum
from typing import TypeVar, Generic, SupportsAbs, Dict, Callable, get_origin, get_args, ClassVar

from core.ast_tree.core.expression import Expression

T = TypeVar('T', bound=SupportsAbs[Enum])


@dataclass
class CallableOperation:
    tensor: Callable
    scalar: Callable

@dataclass
class Operation(Expression, Generic[T]):
    operator: T
    __enum__: ClassVar[type[Enum]]
    _operations_dict: ClassVar[Dict[T, CallableOperation]]

