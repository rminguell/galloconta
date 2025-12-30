import os


class LocalFileStorage:
    def clear_folder(self, folder_path: str) -> None:
        for filename in os.listdir(folder_path):
            file_path = os.path.join(folder_path, filename)
            if os.path.isfile(file_path):
                os.remove(file_path)

    def save_file(self, file_path: str, content: bytes) -> None:
        with open(file_path, "wb") as f:
            f.write(content)

    def file_exists(self, file_path: str) -> bool:
        return os.path.exists(file_path)

    def ensure_folder_exists(self, folder_path: str) -> None:
        os.makedirs(folder_path, exist_ok=True)
