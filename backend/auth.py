from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token
from models import Utilizador

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/login', methods=['POST'])
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