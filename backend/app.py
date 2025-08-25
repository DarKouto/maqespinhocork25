# Vai à pasta venv buscar o Flask, jsonify, request que instalei
from flask import Flask, jsonify, request

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

# Sempre que a rota '/contactos' com o método POST for pedida ao servidor, a função contactos é executada
@app.route('/contactos', methods=['POST'])
def handle_contact_form():
    # 1. Lê os dados JSON enviados pelo frontend
    data = request.get_json()
    
    # 2. Extrai os dados pelas chaves
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    # 3. Faz uma validação simples para ver se os dados existem
    if not name or not email or not message:
        # Devolve um erro se faltarem campos
        return jsonify({"error": "Todos os campos do formulário são obrigatórios."}), 400
    
    # 4. Por enquanto, vamos só imprimir os dados para ver se funcionou
    print("--- Dados Recebidos do Formulário ---")
    print(f"Nome: {name}")
    print(f"Email: {email}")
    print(f"Mensagem: {message}")
    print("-------------------------------------")

    # 5. Envia uma resposta de sucesso para o frontend
    return jsonify({"message": "Dados recebidos com sucesso!"}), 200

# Corre a aplicação
if __name__ == '__main__':
    app.run(debug=True) # o debug=True serve para o servidor reiniciar automaticamente quando mudo o código