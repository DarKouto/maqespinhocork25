# IMPORTS DO FLASK
from flask import Flask, jsonify, request
from flask_mail import Mail, Message
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# IMPORTS DO REFACTOR
from extensions import db
from config import Config
from auth import auth_bp
from crud import crud_bp
from public import public_bp

# CONFIGS
app = Flask(__name__)
CORS(app)
app.config.from_object(Config)
db.init_app(app)
app.register_blueprint(auth_bp)
app.register_blueprint(crud_bp)
app.register_blueprint(public_bp)
mail = Mail(app)
jwt = JWTManager(app)

#################
####  ROTAS  ####
#################

# HOME / INDEX
@app.route('/')
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

# INICIAR APP
if __name__ == '__main__':
    app.run()