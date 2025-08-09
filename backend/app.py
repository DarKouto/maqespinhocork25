# Importa a classe Flask
from flask import Flask, jsonify

# Cria uma instância da aplicação Flask
app = Flask(__name__)

# Cria a rota principal
@app.route('/')
def home():
    return jsonify({"message": "Olá, o teu servidor backend está a funcionar!"})

# Executa a aplicação
if __name__ == '__main__':
    app.run(debug=True)
    # O debug=True é para o ambiente de desenvolvimento.
    # Ele reinicia o servidor automaticamente quando fazes alterações.