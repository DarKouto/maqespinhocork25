import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Configurações do ambiente: Flask, CORS, etc.
    JWT_SECRET_KEY = os.environ.get("SECRET_KEY_JWT")

    # Configurações da Base de Dados (SQLAlchemy)
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # NOVO: CONFIGURAÇÃO DE ENGENHARIA PARA POSTGRESQL/NEON
    # Estas opções ajudam a manter a conexão estável em ambientes cloud com "Scale to Zero"
    SQLALCHEMY_ENGINE_OPTIONS = {
        # Esta opção força o uso de SSL/TLS, que é obrigatório no Neon
        "connect_args": {"sslmode": "require"}, 
        # pool_recycle: Fecha e reabre as conexões após 299 segundos (menos que os 5 minutos de inatividade do Neon)
        "pool_recycle": 299, 
        # pool_timeout: Tempo máximo de espera para uma conexão ser disponibilizada (10 segundos)
        "pool_timeout": 10,  
    }

    # Configurações do E-mail (Flask-Mail)
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_SERVER = os.getenv('MAIL_SERVER')
    MAIL_PORT = int(os.getenv('MAIL_PORT'))
    MAIL_USE_TLS = os.getenv('MAIL_USE_TLS') == 'True'