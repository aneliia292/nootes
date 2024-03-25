import datetime
from threading import Timer
import telebot

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from main.secret import TOKENTELEGRAM, chatID


tz = datetime.timezone(datetime.timedelta(hours=3, minutes=0))

def create_telegram_reminder(object_datetime, text):
    delta = object_datetime - datetime.datetime.now(tz=tz)
    secs=delta.seconds+1

    def send_reminder_telegram():
        bot = telebot.TeleBot(TOKENTELEGRAM)
        bot.send_message(chatID, text)

    t = Timer(secs, send_reminder_telegram)
    t.start()


def create_email_reminder(object_datetime, text):
    delta = object_datetime - datetime.datetime.now(tz=tz)
    secs=delta.seconds+1

    def send_reminder_email():
        msg = MIMEMultipart()
        msg['From'] = "your-address@example.com"
        msg['To'] = "friend-address@example.com"
        msg['Subject'] = "Напоминание"

        msg.attach(MIMEText(text, 'plain'))

        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.ehlo()
            server.login("your-address@example.com", "your-password")
            server.send_message(msg)
            server.quit()
    
    t = Timer(secs, send_reminder_email)
    t.start()
