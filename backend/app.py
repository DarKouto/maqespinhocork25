# IMPORTS DO FLASK
from flask import Flask, jsonify, request
from flask_mail import Mail, Message
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
import re
from werkzeug.security import check_password_hash
import os # Para ler variáveis de ambiente
import cloudinary # Para configurar o Cloudinary

# IMPORTS DO REFACTOR
from .extensions import db
from .config import Config
from .models import Maquinas, Utilizador 
from .auth import auth_bp
from .crud import crud_bp

# CONFIGS
app = Flask(__name__)
CORS(app)
# Carrega as configurações (incluindo as DB e JWT)
app.config.from_object(Config)

# -------------------------------------------------------------
# 🚨 CONFIGURAÇÃO GLOBAL DO CLOUDINARY
# Lê a variável de ambiente CLOUDINARY_URL
# -------------------------------------------------------------
CLOUDINARY_URL = os.environ.get('CLOUDINARY_URL')

if CLOUDINARY_URL:
    # O método 'config' do Cloudinary consegue analisar o URL completo se estiver
    # definido como variável de ambiente no formato 'cloudinary://<api_key>:<api_secret>@<cloud_name>'
    cloudinary.config(
        secure=True # Usa HTTPS
    )
    print("DEBUG FLASK: Cloudinary configurado usando CLOUDINARY_URL.")
else:
    # Esta mensagem aparece na consola do Vercel se a variável estiver em falta.
    print("DEBUG FLASK: ATENÇÃO! Variável CLOUDINARY_URL não encontrada. O upload de imagens falhará.")


db.init_app(app)

# REGISTO DOS BLUEPRINTS
app.register_blueprint(auth_bp)
app.register_blueprint(crud_bp) 

mail = Mail(app)
jwt = JWTManager(app)
EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

#################
####  ROTAS  ####
#################

# HOME / INDEX (API para o frontend)
@app.route('/api/', methods=['GET'])
def machines_api():
    """Retorna a lista de máquinas para o frontend (página inicial)."""
    maquinas = Maquinas.query.all()
    lista_maquinas = []
    for maquina in maquinas:
        # Nota: O Cloudinary está configurado para otimizar URLs. 
        # Esta rota deve ser atualizada para incluir a URL da imagem.
        imagens = maquina.imagens # Assumindo que a relação está carregada
        image_url = imagens[0].url_imagem if imagens else None

        lista_maquinas.append({
            'id': maquina.id,
            'nome': maquina.nome,
            'descricao': maquina.descricao,
            'imageUrl': image_url # Adiciona a primeira imagem
        })
    return jsonify(lista_maquinas)

# CONTACTOS / E-MAIL
@app.route('/contactos', methods=['GET', 'POST'])
def contactos():
    """Lida com o formulário de contacto e envia o e-mail."""
    if request.method == 'POST':
        if not request.is_json:
            return jsonify({"error": "O tipo de conteúdo deve ser application/json"}), 400
        
        dados_email = request.get_json()
        nome = dados_email.get('nome')
        email = dados_email.get('email')
        mensagem = dados_email.get('mensagem')
        
        # 1. VALIDAÇÃO DE CAMPOS OBRIGATÓRIOS
        if not nome or not nome.strip():
            return jsonify({"error": "O campo 'nome' é obrigatório."}), 400
        if not email or not email.strip():
            return jsonify({"error": "O campo 'email' é obrigatório."}), 400
        if not mensagem or not mensagem.strip():
            return jsonify({"error": "O campo 'mensagem' é obrigatório."}), 400
            
        # 2. VALIDAÇÃO DO FORMATO DE EMAIL
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
        return "Estás na página contactos. Usa POST para enviar dados."
    
##################
####  ADMIN  #####
##################

# 1. ROTA DE LOGIN (JWT)
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    nome_utilizador = data.get('nome_utilizador')
    palavra_passe = data.get('palavra_passe')

    utilizador = Utilizador.query.filter_by(nome_utilizador=nome_utilizador).first()

    if utilizador and check_password_hash(utilizador.palavra_passe, palavra_passe):
        access_token = create_access_token(identity=str(utilizador.id))
        return jsonify({
            'message': 'Login bem-sucedido!', 
            'access_token': access_token, 
            'user_id': utilizador.id
        }), 200
    else:
        return jsonify({'message': 'Nome de utilizador ou palavra-passe inválidos.'}), 401

# 2. ROTA DE LOGOUT (JWT)
@app.route('/api/admin/logout', methods=['POST'])
@jwt_required()
def admin_logout():
    return jsonify({'message': 'Logout realizado com sucesso (token revogado no cliente).'}), 200

# INICIAR APP
if __name__ == '__main__':
    app.run(debug=True)