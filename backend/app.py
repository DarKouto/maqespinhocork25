# IMPORTS DO FLASK
from flask import Flask, jsonify, request
from flask_mail import Mail, Message
from werkzeug.security import check_password_hash, generate_password_hash # o generate é quando uso a consola python e importo a app para criar utilizador
from flask_jwt_extended import create_access_token, JWTManager, jwt_required
from flask_cors import CORS

# IMPORTS DO REFACTOR
from models import Maquinas, Imagens, Utilizador
from extensions import db
from crud import crud_bp
from config import Config

# CONFIGS INICIAIS
app = Flask(__name__)
CORS(app)

# CONFIGS CONFIG.PY
app.config.from_object(Config)
db.init_app(app)
app.register_blueprint(crud_bp)
mail = Mail(app)
jwt = JWTManager(app)

#################
####  ROTAS  ####
#################

# HOME / INDEX
@app.route('/') # Sempre que a rota '/' for pedida ao servidor, a função home é executada
def home():
    return jsonify({"message": "Olá, o teu servidor backend está a funcionar!"})

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
        
        if not nome or not email or not mensagem:
            return jsonify({"error": "Campos 'nome', 'email' e 'mensagem' são obrigatórios"}), 400
        
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

# LOGIN
@app.route('/login', methods=['POST'])
def login():
    if request.is_json == False:
        return jsonify({"error": "O tipo de conteúdo deve ser application/json"}), 400

    dados_login = request.get_json()
    nome_utilizador = dados_login.get('nome_utilizador')
    palavra_passe = dados_login.get('palavra_passe')

    if not nome_utilizador or not palavra_passe:
        return jsonify({"error": "Campos 'nome_utilizador' e 'palavra_passe' são obrigatórios."}), 400

    utilizador = Utilizador.query.filter_by(nome_utilizador=nome_utilizador).first()
    if utilizador and check_password_hash(utilizador.palavra_passe, palavra_passe):
        access_token = create_access_token(identity=str(utilizador.id))
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"error": "Nome de utilizador ou palavra-passe incorretos"}), 401
    
# INICIAR APP
if __name__ == '__main__':
    app.run()