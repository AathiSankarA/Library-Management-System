from flask import Flask
from Application.Config import LocalDevelopmentConfig
from Application import Workers
from Application.Cache import cache
from Application.Mailing import mail
from Application.Model import db



def create_app():
    app = Flask(__name__)
    app.secret_key = 'HElLo'
    app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    cache.init_app(app)
    mail.init_app(app)
    celery = Workers.celery
    celery.conf.update(
        broker_url = app.config['CELERY_BROKER_URL'],
        result_backend = app.config['CELERY_RESULT_BACKEND']
    )
    celery.Task = Workers.ContextTask
    app.app_context().push()
    return app,celery

app,celery = create_app()

from Application.View.View import *
from Application.View.ViewUser import *
from Application.View.ViewAdmin import *


if __name__ == '__main__':
    app.run(host='0.0.0.0')