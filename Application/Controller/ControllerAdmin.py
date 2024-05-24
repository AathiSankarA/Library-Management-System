from Application.Controller.Controller import *
from flask import current_app as app


def AddBook(bookName,Author,sectionId,Data):
    try:
        bID = Books().insert(bookName,Author,sectionId,Data)
        print(bID,sectionId)
        for i in sectionId.split(','):
            sid = int(i)
            Sections().addBook(bID,sid)
            
        return {
            'status' : 'true'
        }
    except:
        return {
            'status' : 'false'
        }
    
def AddSection(sectionName):
    try:
        Sections().addSection(sectionName)
        return {
            'status' : 'true'
        }
    except:
        return {
            'status' : 'false'
        }


def approveBook(id):
    try:
        Borrow().Approve(id)
        Tasks.autoRemove.apply_async((id,),eta = datetime.utcnow() + timedelta(days=2,))
        return {
            'status' : 'true'
        }
    except:
        return {
            'status' : 'false'
        }

def revokeBook(id):
    try:
        Borrow().Revoke(id)
        Tasks.autoRemove.apply_async((id,),eta = datetime.utcnow() + timedelta(days=2,))
        return {
            'status' : 'true'
        }
    except:
        return {
            'status' : 'false'
        }


def rejectBook(id):
    # try:
        Borrow().Reject(id)
        return {
            'status' : 'true'
        }
    # except:
        return {
            'status' : 'false'
        }