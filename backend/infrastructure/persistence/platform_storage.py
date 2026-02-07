import os
import httpx


class PlatformFeedbackStorage:
    def upload(
        self, file_path: str, file_name: str, conf: float, iou: float, feedback: str
    ) -> bool:
        try:
            api_url = os.getenv("PLATFORM_API_URL")
            api_token = os.getenv("PLATFORM_API_TOKEN")

            with open(file_path, "rb") as f:
                files = {"photos": (file_name, f, "image/jpeg")}
                data = {"conf": str(conf), "iou": str(iou), "feedback": feedback}
                headers = {"Authorization": f"Bearer {api_token}"}

                response = httpx.post(
                    f"{api_url}/api/upload",
                    files=files,
                    data=data,
                    headers=headers,
                    timeout=30.0,
                )

            return response.status_code == 200
        except Exception:
            return False
