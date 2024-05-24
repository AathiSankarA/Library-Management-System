from Application import Tasks
from Application.Model import *


def insertUser(userName,password,email):
    if User().available(email):
        return User().insertUser(email,userName,password,)
    return False

def validateUser(email,Password,Token = False):
    users = User().getUsers()
    if Token:
        for  i in users:
          if i.email == email and i.active == 1:
            User().Visited(i.id)
            return {
                'id' : i.id,
                'username' : i.username,
                'email' : i.email,
                'fs_uniquifier' : i.fs_uniquifier,
                'active' : i.active
            }
        return {
            'status' : 'false'
        }
    for  i in users:
        if i.email == email and check_password_hash(i.password, Password) and i.active == 1:
            return {
                'status' : 'true',
                'id' : i.id,
                'username' : i.username,
                'email' : i.email,
                'fs_uniquifier' : i.fs_uniquifier,
                'active' : i.active
            }
    return False

def validateAdmin(email,Password,Token = False):
    users = Admin().getUsers()
    if Token:
        for  i in users:
          if i.email == email:
            return {
                'username' : i.username,
                'email' : i.email,
            }
    for  i in users:
        if i.email == email and check_password_hash(i.password, Password):
            temp = {
                'username' : i.username,
                'email' : i.email,
            }
            return temp
    return False

def make_active(fs):
    User().make_active(fs)
    return {
        'status' : 'true'
    } 

def availUser(email,Password):
    users = User().getUsers()
    for  i in users:
        if i.email == email:
            return {
                "available" : "false"
            }
    return {
                "available" : "true"
            }