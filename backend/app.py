from flask import Flask, jsonify, request
from flask_mail import Mail, Message
from dotenv import load_dotenv # biblioteca que instalei do python para ler ficheiros .env
import os # necessário para ler ficheiros .env do OS

load_dotenv() # Lê e carrega as variáveis de ambiente do ficheiro .env
app = Flask(__name__) # Cria uma instância da classe flask na variável app
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME') # Guarda as variáveis do .env em variáveis python
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT'))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS') == 'True'
mail = Mail(app) # Cria uma instância da classe Mail (do Flask-Mail) e inicializa-a com as configs da variável app

# Sempre que a rota '/' for pedida ao servidor, a função home é executada
@app.route('/')
def home():
    return jsonify({"message": "Olá, o teu servidor backend está a funcionar!"})

# Sempre que a rota '/contactos' com o método GET ou POST for pedida ao servidor, a função contactos é executada
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

if __name__ == '__main__':
    app.run(debug=True)
    #corre a aplicação, o debug=True é para o servidor actualizar automaticamente quando mudo algo no código