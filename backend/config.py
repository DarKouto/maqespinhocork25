import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Configurações do ambiente: Flask, CORS, etc.
    JWT_SECRET_KEY = os.environ.get("SECRET_KEY_JWT")

    # Configurações da Base de Dados (SQLAlchemy)
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "connect_args": {"sslmode": "require"}, 
        "pool_timeout": 10,  
    }
    SQLALCHEMY_POOL_SIZE = 1 
    SQLALCHEMY_MAX_OVERFLOW = 0 
    SQLALCHEMY_POOL_RECYCLE = 300

    # Configurações do E-mail (Flask-Mail)
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_SERVER = os.getenv('MAIL_SERVER')
    MAIL_PORT = int(os.getenv('MAIL_PORT'))
    MAIL_USE_TLS = os.getenv('MAIL_USE_TLS') == 'True'