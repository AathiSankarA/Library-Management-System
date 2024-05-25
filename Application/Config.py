from os import path
currentDir = path.abspath(path.dirname(__file__))


class Config():
    DEBUG = False
    SQLITEDB_DB_DIR = None
    SQLALCHEMY_DATABASE_URI = None
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    

class LocalDevelopmentConfig(Config):
    SQLITEDB_DB_DIR = path.join(currentDir,'../Database')
    SQLALCHEMY_DATABASE_URI = "sqlite:///"+path.join(SQLITEDB_DB_DIR,"Library.sqlite3")
    REDIS_HOST = "localhost"
    REDIS_PORT = 6379
    CACHE_REDIS_DB = 3
    CACHE_DEFAULT_TIMEOUT = 60
    DEBUG = True
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Auth-Token"
    CELERY_BROKER_URL = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND = "redis://localhost:6379/2"
    CELERY_TIME_ZONE = 'Asia/Kolkata'
    CELERY_ENABLE_UTC = False
    CACHE_TYPE = "RedisCache"
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USERNAME = '<your mail>'
    MAIL_PASSWORD = '<your app password form mail service provider>'
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False

