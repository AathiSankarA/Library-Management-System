from celery import Celery
from Application.Mailing import send_mail_sync
from flask import current_app as app

celery = Celery(__name__)

class ContextTask(celery.Task):
    def __call__(self,*args,**kwargs):
        with app.app_context():
            return self.run(*args,**kwargs)
        
