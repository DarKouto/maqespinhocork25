# backend/app.py

# IMPORTS DO FLASK
from flask import Flask, jsonify, request
from flask_mail import Mail, Message
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import re

# IMPORTS DO REFACTOR
from extensions import db
from config import Config
from models import Maquinas
from auth import auth_bp
from crud import crud_bp

# INICIALIZAÇÃO DE VARIÁVEIS FORA DA APP (para serem usadas na função)
mail = Mail()
jwt = JWTManager()
CORS_INSTANCE = CORS()

EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

# ####################################################################
# #### FUNÇÃO PRINCIPAL: CRIA E CONFIGURA A APP
# ####################################################################

def create_app():
    # 1. Cria a instância da app
    app = Flask(__name__)
    
    # 2. Configurações
    app.config.from_object(Config)
    
    # 3. Inicializa as Extensões (Lazy Initialization)
    CORS_INSTANCE.init_app(app)
    db.init_app(app) 
    mail.init_app(app) 
    jwt.init_app(app) 

    # 4. Regista as Blueprints (Rotas de Admin/CRUD)
    app.register_blueprint(auth_bp)
    app.register_blueprint(crud_bp)

    #################
    ####  ROTAS  ####
    #################

    # HOME / INDEX (Rota /)
    @app.route('/')
    def home():
        try:
            # Consulta a base de dados Neon
            maquinas = db.session.execute(db.select(Maquinas)).scalars().all()

            # Serialização dos dados para JSON
            lista_maquinas = []
            for maquina in maquinas:
                lista_maquinas.append({
                    'id': maquina.id,
                    'nome': maquina.nome,
                    'descricao': maquina.descricao,
                    # Adicionar a URL da imagem aqui
                })

            return jsonify(lista_maquinas)
        
        except Exception as e:
            # Captura o erro da DB (timeout) e loga-o para vermos nos logs da Vercel
            print(f"ERRO DE CONEXÃO DA DB (Rota Home): {e}")
            return jsonify({"error": "Não foi possível carregar o stock da API."}), 503 # 503 Service Unavailable

    # CONTACTOS / E-MAIL (Rota /contactos)
    @app.route('/contactos', methods=['POST']) 
    def contactos():
        if request.is_json == False:
            return jsonify({"error": "O tipo de conteúdo deve ser application/json"}), 400
        
        dados_email = request.get_json()
        nome = dados_email.get('nome')
        email = dados_email.get('email')
        mensagem = dados_email.get('mensagem')
        
        # Validações...
        if not nome or not nome.strip():
            return jsonify({"error": "O campo 'nome' é obrigatório."}), 400
        if not email or not email.strip():
            return jsonify({"error": "O campo 'email' é obrigatório."}), 400
        if not mensagem or not mensagem.strip():
            return jsonify({"error": "O campo 'mensagem' é obrigatório."}), 400
            
        if not re.fullmatch(EMAIL_REGEX, email.strip()): 
            return jsonify({"error": "O endereço de email fornecido não é válido."}), 400
        
        try:
            msg = Message(
                subject=f"Novo contacto de {nome} ({email})",
                sender=app.config['MAIL_USERNAME'],
                recipients=[app.config['MAIL_USERNAME']],
                body=f"De: {nome}\nEmail: {email}\n\nMensagem:\n{mensagem}"
            )
            mail.send(msg)
            return jsonify({"message": "Mensagem enviada com sucesso!"}), 200
            
        except Exception as e:
            print(f"Erro ao enviar email: {e}")
            return jsonify({"error": "Não foi possível enviar a mensagem. Por favor, tente de novo mais tarde."}), 500
            
    return app

# ####################################################################
# #### EXECUÇÃO COM TRATAMENTO DE ERROS DE STARTUP (DEBUGGING CRÍTICO)
# ####################################################################

# Tenta criar a aplicação. Se falhar no startup, captura o erro
# e imprime-o, o que deve finalmente aparecer nos Vercel Logs.
try:
    app = create_app()
except Exception as e:
    # Esta mensagem DEVE aparecer nos Vercel Logs (Runtime)
    print(f"FATAL APLICAÇÃO FALHOU A INICIAR (ERRO 500): {e}") 
    # Relança o erro para que o Vercel saiba que falhou
    raise e


# INICIAR APP (Apenas para desenvolvimento local!)
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
    app.run(debug=True)