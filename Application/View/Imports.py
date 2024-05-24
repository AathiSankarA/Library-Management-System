from flask import current_app as app
from flask import render_template,request,url_for,abort,jsonify
from Application.Controller.Controller import *
from functools import wraps
import jwt
from flask_mail import Mail
from datetime import datetime,timedelta