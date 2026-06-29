from pathlib import Path
from dotenv import dotenv_values
import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


BASE_DIR = Path(__file__).resolve().parents[2]

config = dotenv_values(BASE_DIR / ".env")

EMAIL = config.get("EMAIL")
APP_PASSWORD = config.get("APP_PASSWORD")

print("EMAIL =", EMAIL)
print("APP_PASSWORD =", APP_PASSWORD)


def send_otp_email(receiver_email, otp):

    subject = "Hotel Management System - Password Reset OTP"

    body = f"""
Hello,

Your OTP is:

{otp}

This OTP is valid for 5 minutes.

Regards,
Hotel Management System
"""

    message = MIMEMultipart()

    message["From"] = EMAIL
    message["To"] = receiver_email
    message["Subject"] = subject

    message.attach(
        MIMEText(body, "plain")
    )

    server = smtplib.SMTP(
        "smtp.gmail.com",
        587
    )

    server.starttls()

    server.login(
        EMAIL,
        APP_PASSWORD
    )

    server.send_message(message)

    server.quit()