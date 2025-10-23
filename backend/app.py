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
mail = Mail() # <-- Inicialização sem a app
jwt = JWTManager() # <-- Inicialização sem a app
CORS_INSTANCE = CORS() # <-- Inicialização sem a app

EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

# ####################################################################
# #### FUNÇÃO PRINCIPAL: CRIA E CONFIGURA A APP (ESSENCIAL PARA VERCEL)
# ####################################################################

def create_app():
    # 1. Cria a instância da app
    app = Flask(__name__)
    
    # 2. Configurações
    app.config.from_object(Config)
    
    # 3. Inicializa as Extensões (AGORA COM A APP)
    # A inicialização acontece AQUI, depois de a app estar criada,
    # garantindo que o motor de conexão só é ativado no momento do pedido.
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

    # HOME / INDEX
    @app.route('/')
    def home():
        # Consulta a base de dados Neon
        # NOTA: O Flask-SQLAlchemy gere a ligação à DB no momento desta consulta.
        try:
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
            print(f"ERRO DE CONEXÃO DA DB: {e}")
            return jsonify({"error": "Não foi possível carregar o stock da API."}), 503 # 503 Service Unavailable

    # CONTACTOS / E-MAIL
    @app.route('/contactos', methods=['POST']) # Removi o GET, pois não faz sentido na API
    def contactos():
        if request.is_json == False:
            return jsonify({"error": "O tipo de conteúdo deve ser application/json"}), 400
        
        dados_email = request.get_json()
        nome = dados_email.get('nome')
        email = dados_email.get('email')
        mensagem = dados_email.get('mensagem')
        
        # 1. VERIFICAÇÃO DE CAMPOS OBRIGATÓRIOS (EXISTENTE, MAS REFORÇADO)
        if not nome or not nome.strip():
            return jsonify({"error": "O campo 'nome' é obrigatório."}), 400
        if not email or not email.strip():
            return jsonify({"error": "O campo 'email' é obrigatório."}), 400
        if not mensagem or not mensagem.strip():
            return jsonify({"error": "O campo 'mensagem' é obrigatório."}), 400
            
        # 2. VALIDAÇÃO DO FORMATO DE EMAIL (NOVO)
        # O EMAIL_REGEX tem que ser acessível globalmente
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
# #### EXECUÇÃO: O VERCEL SÓ PROCURA ESTA LINHA!
# ####################################################################

# O Vercel procura pela variável 'app' no topo do ficheiro.
app = create_app()

# INICIAR APP (Apenas para desenvolvimento local!)
if __name__ == '__main__':
    # Cria as tabelas da DB no arranque local, se necessário
    with app.app_context():
        db.create_all()
        
    app.run(debug=True)