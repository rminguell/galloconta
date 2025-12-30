import os
from ftpretty import ftpretty


class FTPFeedbackStorage:
    def upload(self, file_path: str, file_name: str) -> bool:
        try:
            ftp_host = os.getenv("FTP_HOST")
            ftp_user = os.getenv("FTP_USER")
            ftp_pass = os.getenv("FTP_PASS")
            ftp = ftpretty(ftp_host, ftp_user, ftp_pass)
            ftp.put(file_path, file_name)
            ftp.close()
            return True
        except Exception:
            return False
