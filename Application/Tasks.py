from Application.Workers import celery
from Application.Mailing import send_mail_sync
from celery.schedules  import crontab
from Application.Model import User,Borrow,User
from flask import render_template

@celery.task()
def send_mail(receivers, Subject, Body , HTML = None):
    return send_mail_sync(receivers, Subject, Body , HTML = HTML)


@celery.on_after_finalize.connect
def periodic_tasks(sender,**kwargs):
    sender.add_periodic_task(
        crontab(hour=12,minute=0),
        Daily.s()
    )
    sender.add_periodic_task(
        crontab(month_of_year='*',day_of_month= 17,hour = 16 , minute = 30),
        Monthly.s()
    )
    sender.add_periodic_task(
        crontab(hour=0,minute=0),
        Reset.s()
    )


@celery.task()
def Reset():
    User().dailyReset()

@celery.task()
def autoRemove(id):
    return Borrow().autoRem(id)

@celery.task()
def Daily():
    li = User().notVisited()
    for i in li:
        send_mail.delay([i['Mail']],'Remainder','',HTML=render_template('daily.html',user=i))

@celery.task()
def Monthly():
    li = User().mailReport()
    for i in li:
        send_mail.delay([i['Mail']],'Monthly Report','Hope you ar doing well, here is your summary for the week',
                        HTML=render_template('Monthly.html',user=i))
