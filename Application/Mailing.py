from flask_mail import Mail, Message
from flask import current_app as app

mail = Mail()

def send_mail_sync(receivers, Subject, Body , HTML = None):
    with app.app_context():
            message = Message(
                subject = Subject ,
                sender = app.config['MAIL_USERNAME'],
                recipients = receivers
                )
            message.body = Body
            if HTML:
                message.html = HTML
            mail.send(message)
            return {'status' : 'true'}
            return {'status' : 'false'}