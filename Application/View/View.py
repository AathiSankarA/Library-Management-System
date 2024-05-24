from Application.View.Imports import *
from Application import Tasks 

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Auth-Token" in request.headers:
            token = request.headers["Auth-Token"]
        if not token:
            return jsonify(
                {"status" : "token missing"}
            ), 401
        try:
            data=jwt.decode(eval(token), app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user=validateUser(data.get('email'),'',Token = True)

            if data['expiration'] < str(datetime.now()):
                return {
                    'status':'session time out'
                }

            if not current_user:
                return jsonify(
                    {"status" : "not authenticated"}
                ), 401
        except Exception as e:
            return jsonify(
                {
                    "status" : "Error"
                }
            ), 500

        return f(data,*args, **kwargs)

    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Auth-Token" in request.headers:
            token = request.headers["Auth-Token"]
        if not token:
            return jsonify(
                {"status" : "token missing"}
            ), 401
        try:
            data=jwt.decode(eval(token), app.config["SECRET_KEY"], algorithms=["HS256"])
            if 'Admin' not in data:
                return jsonify(
                    {"status" : "not authenticated"}
                ), 401
            if data['expiration'] < str(datetime.now()):
                return {
                    'status':'session time out'
                }
            current_user=validateAdmin(data.get('email'),'',Token = True)
            if not current_user:
                return jsonify(
                    {"status" : "not authenticated"}
                ), 401
        except Exception as e:
            return jsonify(
                {
                    "status" : "Error"+str(e)
                }
        ), 500

        return f( *args, **kwargs)

    return decorated


@app.route('/', methods = ["GET"])
def home():
    return render_template(
        'base.html'
    )


@app.route('/Login', methods = ["POST"])
def login():
    try : 
        if request.method == "POST":
            userName , Password ,email = request.json.get('userName'),request.json.get('password'),request.json.get('email').lower()
            if any([(i in Password) or (i in email)  for i in ['%','<','>','=','*','#',';']]):
                return {
            'status' : 'false'
        }
            user = validateUser(email , Password)
            if user['status'] == 'true':
                user.pop('status')
                user['expiration']=str(datetime.now() + timedelta(hours=0,minutes=20))
                user = {
                    'userName' : user['username'],
                    'status' : 'true',
                    'token':jwt.encode(
                        user,
                        app.config["SECRET_KEY"],
                        algorithm="HS256",
                    )
                }
                return jsonify(user)
            else:
                return {
                    'status' : 'false'
                }
    except Exception as e:
        return {
        'status' : 'false '+str(e)
    }
    return {
        'status' : 'false'
    }

@app.route('/SignUp' , methods=["POST"])
def signup():
        if request.method == "POST":
            userName , Password ,email = request.json.get('userName'),request.json.get('password'),request.json.get('email').lower()
            if any([(i in Password) or (i in email) or (i in userName) for i in ['%','<','>','=','*','#',';']]):
                return {
            'status' : 'false'
        }
            status = insertUser(userName,Password,email)
            if status == False:
                return jsonify(
                    {
                        "status" : "false"
                    }
                )
            job = Tasks.send_mail.delay([status['email']],'Verify',Body='Verify' , HTML = render_template('verify.html',fs = status['fs_uniquifier'] ))
            return jsonify(
                    {
                        "status" : "true"
                    }
                )
        return jsonify({
            'status' : 'error'
        })

@app.route('/Verify/<fs>',methods = ["POST"])
def verify(fs):
     make_active(fs)
     return {
          'status':'true' 
     }

@app.route('/AdminLogin', methods = ["POST"])
def adminLogin():
    if request.method == "POST":
        userName , Password ,email = request.json.get('userName'),request.json.get('password'),request.json.get('email').lower()
        if any([(i in Password) or (i in email) for i in ['%','<','>','=','*','#',';']]):
            return {
            'status' : 'false'
        }
        user = validateAdmin(email , Password)
        if user:
            user['expiration']=str(datetime.now() + timedelta(minutes=30))
            user['Admin'] = 'true'
            user = {
                'status' : 'true',
                'token':jwt.encode(
                    user,
                    app.config["SECRET_KEY"],
                    algorithm="HS256",
                )
            }
            return jsonify(user)
        return {
            'status' : 'false'
        }


# APIs
@app.route('/Users/Validate' , methods = ["POST"])
def ValidateUser():
    email = request.json.get('email')
    Password = request.json.get('password')
    if validateUser(email,Password):
                return {'authendication':'success'}
    return {'authendication':'failure'}

@app.route('/Users/Available')
def availeUser():
    email = request.json.get('email')
    return availeUser(email)

