from sqlalchemy import Column, Integer, String,Float
from sqlalchemy import select,insert,update,delete
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from Application.Cache import cache
from datetime import datetime, timedelta
import random

def rand_gen():
    l = 256
    char = [chr(i) for i in range(97,123)] + [chr(i) for i in range(48,58)]
    s = ''
    for i in range(l):
        s += random.choice(char)
    return s

db = SQLAlchemy()

class User(db.Model):
    id : int
    username : str
    email : str
    defaults : int
    nBooks : str

    __tablename__ = 'user'
    id = db.Column(Integer , primary_key = True , autoincrement = True)
    username = db.Column(String , nullable = False, unique = True)
    email = db.Column(String , nullable = False , unique = True)
    password = db.Column(String , nullable = False)
    active = db.Column(Integer)
    fs_uniquifier = db.Column(String)
    defaults = db.Column(Integer)
    nBooks = db.Column(Integer)
    visited = db.Column(Integer)
    Books = db.Column(String)

    # methods
    def addDefault(self,id,bId , default = True):
        cur = User.query.where(User.id == id).all()[0]
        defaults , book = cur.defaults , list(map(int,cur.Books.split(',')))
        book.remove(bId)
        BooksStr = ','.join([str(i) for i in book])
        if default:
            defaults = defaults+1
        query = update(User).where(User.id == id).values(defaults = defaults,Books = BooksStr,nBooks = cur.nBooks-1)
        db.session.execute(query)
        db.session.commit()

    def getBook(self,uid,bId):
        user = User.query.where(User.id == uid).all()[0]
        books = list(map(int,user.Books.split(','))) if user.Books else []
        books.append(bId)
        books = ','.join([str(i) for i in books])
        query = update(User).where(User.id == uid).values(Books = books,nBooks = user.nBooks+1)
        db.session.execute(query)
        db.session.commit()

    def returnBook(self,id,bId):
        cur = User.query.where(User.id == id).all()[0]
        book = list(map(int,cur.Books.split(',')))
        book.remove(bId)
        BooksStr = ','.join([str(i) for i in book])
        db.session.execute(update(User).where(User.id == id).values(nBooks = cur.nBooks-1,Books = BooksStr))
        db.session.commit()

    def dailyReset(self):
        db.session.execute(update(User).values(visited=0))
        db.session.commit()

    def available(self,mail):
        for i in self.getUsers():
            if i.email == mail:
                return False
        return True

    def insertUser(self,email,userName,password):
        fs_uniquifier = rand_gen()
        query = insert(User).values(
            email = email,
            username=userName,
            active = 0,
            password=generate_password_hash(password),
            fs_uniquifier = fs_uniquifier
            )
        db.session.execute(query)
        db.session.commit()
        return {
            'username' : userName,
            'email' : email,
            'fs_uniquifier' : fs_uniquifier,
            'active' : 0,
            'defaults' : 0,
            'nBooks' : 0
        }
    
    def make_active(self,fs):
        db.session.execute(update(User).where(User.fs_uniquifier == fs).values(active=1,fs_uniquifier = rand_gen()))
        db.session.commit()

    def getUsers(self):
        que = User.query.all()
        return que
    
    def describe(self):
        l = []
        for i in self.getUsers():
            l.append(
                {
                    'ID' : i.id,
                    'Name' : i.username,
                    'Mail' : i.email,
                    'Books' : list(map(lambda x:Books().getBook(int(x)),i.Books.split(','))) if i.Books else [],
                    'defaults' : i.defaults,
                    'nBooks' : i.nBooks
                }
            )
        return l
    
    def mailReport(self):
        li = []
        for i in self.describe():
            user = i
            user['Books'] = Borrow().getInfo(i['ID'])
            li.append(user)
        return li
    
    def notVisited(self):
        li = []
        for i in self.getUsers():
            if i.visited == 0:
                li.append({
                    'Mail' : i.email,
                    'Name' : i.username
                })
        return li

    def Visited(self,id):
        db.session.execute(update(User).where(User.id == id).values(visited = 1))
        db.session.commit()

    def getUser(self,uId):
        obj = User.query.where(User.id == uId).all()[0]
        res = {
            'id' : obj.id,
            'username' : obj.username,
            'email' : obj.email,
            'defaults' :obj.defaults,
            'nBooks' : obj.nBooks,
            'Books' : list(map(lambda x:Books().getBook(int(x)),obj.Books.split(','))) if obj.Books else []
        }
        return res

class Admin(db.Model):
    __tablename__ = 'Admin'
    username = db.Column(String , nullable = False, unique = True, primary_key = True)
    email = db.Column(String , nullable = False , unique = True)
    password = db.Column(String , nullable = False)

    def getUsers(self):
        que = Admin.query.all()
        return que

class Books(db.Model):
    __tablename__ = 'Books'
    BookID = db.Column(Integer , nullable = False, unique = True, primary_key = True)
    BookName = db.Column(String , nullable = False )
    Author = db.Column(String , nullable = False)
    Data = db.Column(String,nullable = False)
    sectionId = db.Column(String)

    def describe(self):
        l = []
        for i in self.query.all():
            l.append(
                {
                    'ID' : i.BookID,
                    'Name' : i.BookName,
                    'Author' : i.Author,
                    'Sections' : list(map(int,str(i.sectionId).split(','))) if i.sectionId else []
                }
            )
        return l
    
    def insert(self,bookName,Author,sectionId,Data):
        query = insert(Books).values(BookName=bookName,Author=Author,sectionId=sectionId,Data=Data)
        db.session.execute(query)
        db.session.commit()
        ID = Books.query.where(Books.BookName==bookName,Books.Author==Author,Books.sectionId==sectionId,Books.Data==Data).all()[0].BookID
        return ID

    def removeBook(self,bookID):
        query = delete(Books).where(Books.BookID == bookID)
        db.session.execute(query)
        db.session.commit()

    def getBookData(self,BookID):
        res = Books.query.where(Books.BookID == BookID).all()[0]
        return {
            'Name' : res.BookName,
            'Data' :res.Data,
            'Author' : res.Author
        }

    def getBook(self,BookID):
        books = Books().describe()
        for i in books:
            if i['ID'] == BookID:
                temp = i
                return temp
            
    def getBooks(self,key):
        res = Books.query.where(Books.BookName.like(key)).all()
        li = []
        for i in res:
            li.append({
                "ID" : i.BookID,
                "Name" : i.BookName,
                "Author" : i.Author,
            })
        return li
    
class Sections(db.Model):
    __tablename__ = 'sections'
    SectionID = db.Column(Integer , nullable = False, unique = True, primary_key = True)
    SectionName = db.Column(String , nullable = False )
    Books = db.Column(String,nullable = False)

    def describe(self):
        l = []
        for i in self.query.all():
            l.append(
                {
                    'ID' : i.SectionID,
                    'Name' : i.SectionName,
                    'Books' : list(map(int,i.Books.split(','))) if i.Books else [],
                }
            )
        return l
    
    def getSectionBooks(self,id):
        books = self.query.where(Sections.SectionID == id).all()[0]
        li = []
        for i in list(map(int,books.Books.split(','))):
            li.append(Books().getBook(i))
        return {'BookNames' : li}
        

    def getSections(self,key):
        res = Sections.query.where(Sections.SectionName.like(key)).all()
        li = []
        for i in res:
            li.append({
                "ID" : i.SectionID,
                "Name" : i.SectionName,
                "Books" : list(map(int,i.Books.split(','))) if i.Books else []
            })
        return li
    
    def addSection(self,sectionName):
        query = insert(Sections).values(SectionName = sectionName,Books = '')
        db.session.execute(query)
        db.session.commit()
    
    def addBook(self,bID,sID):
        books = Sections.query.where(Sections.SectionID == sID).all()[0].Books
        books = books+f',{bID}' if books else f'{bID}'
        query = update(Sections).where(Sections.SectionID == sID).values(Books = books)
        db.session.execute(query)
        db.session.commit()

class Borrow(db.Model):
    __tablename__ = 'borrow'
    id = db.Column(Integer , primary_key = True)
    userID = db.Column(Integer)
    bookID = db.Column(Integer)
    status = db.Column(Integer)
    expiry = db.Column(String)

    def addRequest(self,uId,bId,exp):
        que = insert(Borrow).values(
            userID = uId,
            bookID = bId,
            expiry = exp
        )
        db.session.execute(que)
        db.session.commit()
    
    def getUserBorrow(self,uid):
        res = len(Borrow.query.where(Borrow.userID == uid).all())
        if res >= 5:
            return False
        return True

    def getInfo(self,uId):
        que = Borrow.query.where(Borrow.userID == uId).all()
        res = []
        for i in que:
            res.append({
                'id' : i.id ,
                'bookName' : Books().getBook(i.bookID)['Name'],
                'status' : i.status,
                'expiry' : i.expiry
            })
        return res
    
    def getApproved(self):
        que = Borrow.query.where(Borrow.status == 1).all()
        res = []
        for i in que:
            res.append({
                'ID' : i.id ,
                'bookName' : Books().getBook(i.bookID)['Name'],
                'userName' : User().getUser(i.userID)['username'],
                'status' : i.status,
                'expiry' : i.expiry
            })
        return res
    
    def getRequests(self):
        results = Borrow.query.where(Borrow.status == 0).all()
        res = []
        for i in results:
            res.append({
                'ID' : i.id,
                'userName' : User().getUser(i.userID)['username'],
                'bookName' : Books().getBook(i.bookID)['Name']
            })
        return res
    
    def Approve(self,bId):
        borrow = Borrow.query.where(Borrow.id == bId).all()[0]
        User().getBook(borrow.userID,borrow.bookID)
        db.session.execute(update(Borrow).where(Borrow.id == bId).values(status = 1,expiry=str(datetime.now()+timedelta(days=7))))
        db.session.commit()
    
    def Revoke(self,bId):
        borrow = Borrow.query.where(Borrow.id == bId).all()[0]
        return self.autoRem(borrow.id)
    
    def Reject(self,bId):
        db.session.execute(delete(Borrow).where(Borrow.id == bId))
        db.session.commit()

    def autoRem(self,id):
        try:
            status =  Borrow.query.where(Borrow.id == id).all()
            if status:
                User().addDefault(status[0].userID,status[0].bookID)
                db.session.execute(delete(Borrow).where(Borrow.id == id))
                db.session.commit()
                return {'status' : 'true'}
            return {'status' : 'false'}
        except:
            return {'status' : 'false'}

    def ReturnBook(self,id,bId):
        try:
            status =  Borrow.query.where(Borrow.userID == id,Borrow.bookID == bId).all()
            if status:
                User().returnBook(status[0].userID,status[0].bookID)
                db.session.execute(delete(Borrow).where(Borrow.userID == id,Borrow.bookID == bId))
                db.session.commit()
                return {'status' : 'true'}
            return {'status' : 'false'}
        except:
            return {'status' : 'false'}

    def isBorrowed(self,uId,id):
        res = Borrow.query.where(Borrow.userID == uId and Borrow.bookID == id).all()[0]
        if res.status == 1:
            return True
        return False
