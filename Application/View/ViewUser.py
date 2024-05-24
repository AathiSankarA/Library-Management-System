from Application.View.View import *
from Application.Controller.ControllerUser import *


@app.route('/User/Dashboard')
@cache.cached(timeout=60)
@token_required
def userDash(data):
    return getUserData(data['id'])

@app.route('/Book/<int:id>')
@token_required
def Book(data,id):
    uId = data['id']
    return getBook(uId,id)


@app.route('/Search/<key>')
@cache.cached(timeout=60)
@token_required
def Search(data,key):
    key = '%'+'%'.join(list(key))+'%'
    return {"books" : Books().getBooks(key),"sections" : Sections().getSections(key),'curbooks':User().getUser(data['id'])['Books']}

@app.route('/Search/')
@cache.cached(timeout=60)
@token_required
def SearchR(data,):
    key=''
    key = '%'+'%'.join(list(key))+'%'
    return {"books" : Books().getBooks(key),"sections" : Sections().getSections(key)}


@app.route('/Request/<int:id>')
@cache.cached(timeout=60)
@token_required
def ResuestBook(data,id):
    uId = data['id']
    return requestBook(uId,id)


@app.route('/Return/<int:id>')
@cache.cached(timeout=60)
@token_required
def ReturnBook(data,id):
    uId = data['id']
    return Borrow().ReturnBook(uId,id)

@app.route('/Section/<int:id>')
@cache.cached(timeout=60)
@token_required
def Section(data,id):
    uId = data['id']
    data = Sections().getSectionBooks(id)
    data['curbooks'] = User().getUser(uId)['Books']
    return data