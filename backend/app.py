# Vai à pasta venv buscar o Flask e jsonify que instalei
from flask import Flask, jsonify

# Cria uma instância da classe flask (modelo) na variável app
app = Flask(__name__)

# Sempre que a rota '/' for pedida ao servidor, a função home é executada
@app.route('/')
def home():
    return jsonify({"message": "Olá, o teu servidor backend está a funcionar!"})

# Sempre que a rota '/contactos' for pedida ao servidor, a função contactos é executada
@app.route('/contactos')
def contactos():
    return "Estás na página contactos"

@app.route('/contactos', methods=['POST'])
def handle_contact_form():
    # A lógica para processar o formulário vai ficar aqui
    # ...
    return "Dados recebidos!"

# Corre a aplicação
if __name__ == '__main__':
    app.run(debug=True) # o debug=True serve para o servidor reiniciar automaticamente quando mudo o código