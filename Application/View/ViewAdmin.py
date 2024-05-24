from Application.View.View import *
from Application.Controller.ControllerAdmin import *
import matplotlib.pyplot as plt

@app.route('/Admin/Dashboard' , methods = ["POST"])
@admin_required
def adminDashboaed():
    return {
        'status' : 'true',
        'users' : User().describe(),
        'books' : Books().describe(),
        'sections' : Sections().describe(),
        'requests' : Borrow().getRequests(),
        'approved' : Borrow().getApproved()
    }



@app.route('/Admin/Books/Add',methods = ["POST"])
@admin_required
def addBook():
    data = request.json
    bookName,Author,sectionId,Data = data['bookName'],data['Author'],data['sectionId'],data['Data']
    return AddBook(bookName,Author,sectionId,Data)


@app.route('/Admin/Sections/Add',methods = ["POST"])
@admin_required
def addSection():
    data = request.json
    return AddSection(data['sectionName'])


@app.route('/Borrow/Approve/<int:id>',methods = ["POST"])
@admin_required
def ApproveBook(id):
    return approveBook(id)


@app.route('/Borrow/Revoke/<int:id>',methods = ["POST"])
@admin_required
def RevokeBook(id):
    return revokeBook(id)


@app.route('/Borrow/Reject/<int:id>',methods = ["POST"])
@admin_required
def RejectBook(id):
    return rejectBook(id)
