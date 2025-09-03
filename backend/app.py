# IMPORTS
from flask import Flask, jsonify, request
from flask_mail import Mail, Message
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash # o generate é para uso a consola python e importo a app para criar utilizador
from flask_jwt_extended import create_access_token, JWTManager, jwt_required, get_jwt_identity
from flask_cors import CORS # serve para ligar os 2 ambientes de desenvolvimento, front e back (os 2 localhosts)
from dotenv import load_dotenv
import os

#########################
####  CONFIGURAÇÕES  ####
#########################

# CONFIGS INICIAIS
load_dotenv() # Lê e carrega as variáveis de ambiente do ficheiro .env
app = Flask(__name__) # Cria uma instância da classe flask na variável app
CORS(app) 

# ENVIO DE E-MAIL
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT'))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS') == 'True'
mail = Mail(app) # Cria uma instância da classe Mail (do Flask-Mail) e inicializa-a com as configs da variável app

# BASE DE DADOS
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ORM
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

# JWT (JSON Web Token)
app.config["JWT_SECRET_KEY"] = os.environ.get("SECRET_KEY_JWT")
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
    
################
####  CRUD  ####
################

# OBTER TODAS AS MÁQUINAS (CRUD - READ)
@app.route('/admin/maquinas', methods=['GET'])
@jwt_required()
def get_all_maquinas():
    maquinas = Maquinas.query.all()
    lista_maquinas = []
    for maquina in maquinas:
        lista_maquinas.append({
            'id': maquina.id,
            'nome': maquina.nome,
            'descricao': maquina.descricao
        })
    return jsonify(lista_maquinas)

# CRIAR UMA NOVA MÁQUINA (CRUD - CREATE)
@app.route('/admin/maquinas', methods=['POST'])
@jwt_required()
def create_maquina():
    if not request.is_json:
        return jsonify({"error": "O tipo de conteúdo deve ser application/json"}), 400

    dados_maquina = request.get_json()
    nome = dados_maquina.get('nome')
    descricao = dados_maquina.get('descricao')

    if not nome or not descricao:
        return jsonify({"error": "Campos 'nome' e 'descricao' são obrigatórios"}), 400

    nova_maquina = Maquinas(nome=nome, descricao=descricao)
    db.session.add(nova_maquina)
    db.session.commit()
    return jsonify({"message": f"Máquina '{nome}' criada com sucesso!"}), 201

# ACTUALIZAR MÁQUINA (CRUD - UPDATE)
@app.route('/admin/maquinas/<int:maquina_id>', methods=['PUT'])
@jwt_required()
def update_maquina(maquina_id):
    if not request.is_json:
        return jsonify({"error": "O tipo de conteúdo deve ser application/json"}), 400

    maquina = Maquinas.query.get(maquina_id)
    if not maquina:
        return jsonify({"error": "Máquina não encontrada"}), 404

    dados_atualizados = request.get_json()
    maquina.nome = dados_atualizados.get('nome', maquina.nome)
    maquina.descricao = dados_atualizados.get('descricao', maquina.descricao)

    db.session.commit()
    return jsonify({"message": f"Máquina {maquina_id} atualizada com sucesso!"}), 200

# APAGAR MÁQUINA (CRUD - DELETE)
@app.route('/admin/maquinas/<int:maquina_id>', methods=['DELETE'])
@jwt_required()
def delete_maquina(maquina_id):
    maquina = Maquinas.query.get(maquina_id)
    if not maquina:
        return jsonify({"error": "Máquina não encontrada"}), 404

    db.session.delete(maquina)
    db.session.commit()
    return jsonify({"message": f"Máquina {maquina_id} apagada com sucesso!"}), 200

# INICIAR APP
if __name__ == '__main__':
    app.run()