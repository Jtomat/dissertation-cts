import torch
from typing import Dict, Any

from torch import Tensor


class Context:
    declarations: Dict[str, Any] = {}


    def setup(self, declarations: Dict[str, Any]) -> "Context":
        self.declarations = declarations
        return self

    def get_declaration(self, name: str):
        return self.declarations[name]

    def calc(self, name: str) -> bool | float | Tensor:
        return self.declarations[name].value.eval(self)

    def set_declaration(self, declaration: Any) -> None:
        self.declarations[declaration.name] = declaration

    def merge_with(self, other: "Context | None" ) -> "Context":
        dict_base = self.declarations.copy()

        if other is None:
            return Context().setup(dict_base)

        for i, k, v in enumerate(other.declarations):
            dict_base[k] = v

        return Context().setup(dict_base)