from pathlib import PurePath
from typing import List

from app.logic.models.resources.resource import Resource


class ResourceService:
    resource_list: List[Resource] = []


    def resource_tree(self):
        tree = {}

        for file in self.resource_list:
            current = tree
            parts = PurePath(file.uri).parts

            for part in parts[:-1]:
                current = current.setdefault(part, {})

            current[parts[-1]] = file

        return tree


