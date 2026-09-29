from typing import Generic, TypeVar, Callable

TEnum = TypeVar("TEnum")

class OperatorFuncs(dict[TEnum, tuple[Callable, Callable]], Generic[TEnum]):
    pass