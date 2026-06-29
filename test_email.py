from app.utils.email_config import send_otp_email
from dotenv import load_dotenv
import os

load_dotenv()

print("Current Directory:", os.getcwd())
print("EMAIL =", os.getenv("EMAIL"))
print("APP_PASSWORD =", os.getenv("APP_PASSWORD"))

send_otp_email(
    "sricharitha47@gmail.com",
    "123456"
)

print("Mail Sent Successfully")