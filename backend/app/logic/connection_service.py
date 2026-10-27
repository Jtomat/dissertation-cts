from pathlib import Path
from typing import Optional

from app.logic.models.project import Project


class ProjectService:

    @staticmethod
    def create_project(name: str, path: str, description: Optional[str]) -> None:
        uri = Path(path)
        uuid = str(hash(name + path))
        folder = uri.joinpath(name)

        new_project = Project(name=name, path=folder, uuid=uuid, description=description)



        import os
        if not os.path.exists(folder):
            os.makedirs(folder)

        project_file = new_project.path.joinpath("project.json")

        with open(project_file, "a") as f:


        pass

