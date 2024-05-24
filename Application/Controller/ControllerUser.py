from datetime import datetime,timedelta
from Application.Controller.Controller import *

def getUserData(uId):
    result = dict(User().getUser(uId))
    result['status'] = 'true'
    return result

def getBook(uId,id):
    if Borrow().isBorrowed(uId,id):
        data = Books().getBookData(id)
        data['status'] = 'true'
        return data
    return {
        'status' : 'false'
        }

def requestBook(uId,id):
    if Borrow().getUserBorrow(uId):
        Borrow().addRequest(uId,id,str(datetime.now()+timedelta(days=7)))
        return {'status' : 'true'}
    return {'status' : 'false'}
    