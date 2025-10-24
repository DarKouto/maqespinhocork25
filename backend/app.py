# IMPORTS DO FLASK
from flask import Flask, jsonify, request
from flask_mail import Mail, Message
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import re

# IMPORTS DO REFACTOR
from .extensions import db
from .config import Config
from .models import Maquinas
from .auth import auth_bp
from .crud import crud_bp

# CONFIGS
app = Flask(__name__)
CORS(app)
app.config.from_object(Config)
db.init_app(app)
app.register_blueprint(auth_bp)
app.register_blueprint(crud_bp)
mail = Mail(app)
jwt = JWTManager(app)
EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

#################
####  ROTAS  ####
#################

# HOME / INDEX
@app.route('/api/', methods=['GET'])
def machines_api():  # Nome da função alterado
    maquinas = Maquinas.query.all()
    lista_maquinas = []
    for maquina in maquinas:
        lista_maquinas.append({
            'id': maquina.id,
            'nome': maquina.nome,
            'descricao': maquina.descricao,
        })
    return jsonify(lista_maquinas)

# CONTACTOS / E-MAIL
@app.route('/contactos', methods=['GET', 'POST'])
def contactos():
    if request.method == 'POST':
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
    
    else:
        return "Estás na página contactos"

# INICIAR APP
if __name__ == '__main__':
    app.run()