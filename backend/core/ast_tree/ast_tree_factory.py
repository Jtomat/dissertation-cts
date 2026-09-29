from typing import Dict, Callable, Any


class AstTreeFactory:
    types = {}

    @classmethod
    def register(cls, key: str, builder: Callable[[Dict, 'AstTreeFactory'], Any]):
        cls.types[key] = builder

    @classmethod
    def build(cls, obj: Dict) -> Any:
        return cls.types[obj['type']](obj, cls)