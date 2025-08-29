###################
####  IMPORTS  ####
###################

from flask import Flask, jsonify, request
from flask_mail import Mail, Message
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, JWTManager, jwt_required, get_jwt_identity
from dotenv import load_dotenv
from flask_cors import CORS
import os

############################
####  CONFIGS INICIAIS  ####
############################

load_dotenv() # Lê e carrega as variáveis de ambiente do ficheiro .env
app = Flask(__name__) # Cria uma instância da classe flask na variável app
CORS(app) # serve para ligar os 2 ambientes de desenvolvimento, front e back (os 2 localhosts)

##########################
####  ENVIO DE EMAIL #####
##########################

app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME') # Guarda as variáveis do .env em variáveis python
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT'))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS') == 'True'
mail = Mail(app) # Cria uma instância da classe Mail (do Flask-Mail) e inicializa-a com as configs da variável app

#########################
####  BASE DE DADOS  ####
#########################

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Maquinas(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    imagens = db.relationship('Imagens', backref='maquina', lazy=True) # Esta linha cria a ligação com a classe Imagens
    def __repr__(self):
        return f'<Máquina {self.nome}>'

class Imagens(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url_imagem = db.Column(db.String(255), nullable=False)
    maquina_id = db.Column(db.Integer, db.ForeignKey('maquinas.id'), nullable=False) # Esta linha liga cada imagem à sua máquina
    def __repr__(self):
        return f'<Imagem {self.url_imagem}>'

class Utilizador(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome_utilizador = db.Column(db.String(80), unique=True, nullable=False)
    palavra_passe = db.Column(db.String(120), nullable=False)
    def __repr__(self):
        return f'<Utilizador {self.nome_utilizador}>'

#################
####  ROTAS  ####
#################

@app.route('/') # Sempre que a rota '/' for pedida ao servidor, a função home é executada
def home():
    return jsonify({"message": "Olá, o teu servidor backend está a funcionar!"})

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

################################
####  JWT (JSON Web Token)  ####
################################

app.config["JWT_SECRET_KEY"] = os.environ.get("SECRET_KEY_JWT")
jwt = JWTManager(app)

@app.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"error": "O tipo de conteúdo deve ser application/json"}), 400

    dados_login = request.get_json()
    nome_utilizador = dados_login.get('nome_utilizador')
    palavra_passe = dados_login.get('palavra_passe')

    if not nome_utilizador or not palavra_passe:
        return jsonify({"error": "Campos 'nome_utilizador' e 'palavra_passe' são obrigatórios."}), 400

    # Procura o utilizador na base de dados
    utilizador = Utilizador.query.filter_by(nome_utilizador=nome_utilizador).first()

    # Se o utilizador existir e a password estiver correta (usando o hash)
    if utilizador and check_password_hash(utilizador.palavra_passe, palavra_passe):
        # Cria o token JWT
        access_token = create_access_token(identity=utilizador.id)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"error": "Nome de utilizador ou palavra-passe incorretos"}), 401
    
@app.route('/admin/maquinas', methods=['GET'])
@jwt_required()
def get_maquinas():
    # Esta função só vai correr se o pedido tiver um token válido
    return jsonify({"mensagem": "Bem-vindo à área de administração, o teu token é válido!"}), 200

#######################
####  INICIAR APP  ####
#######################

if __name__ == '__main__':
    app.run()