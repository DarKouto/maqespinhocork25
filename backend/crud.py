from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

# IMPORTAÇÕES DO REFACTOR
from models import Maquinas
from extensions import db 

# Definição do Blueprint com o prefixo /admin
crud_bp = Blueprint('crud_bp', __name__, url_prefix='/admin')

# OBTER TODAS AS MÁQUINAS (CRUD - READ)
@crud_bp.route('/maquinas', methods=['GET']) # ROTAS JÁ NÃO PRECISAM DO /admin
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
@crud_bp.route('/maquinas', methods=['POST']) # ROTAS JÁ NÃO PRECISAM DO /admin
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
@crud_bp.route('/maquinas/<int:maquina_id>', methods=['PUT']) # ROTAS JÁ NÃO PRECISAM DO /admin
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
@crud_bp.route('/maquinas/<int:maquina_id>', methods=['DELETE']) # ROTAS JÁ NÃO PRECISAM DO /admin
@jwt_required()
def delete_maquina(maquina_id):
    maquina = Maquinas.query.get(maquina_id)
    if not maquina:
        return jsonify({"error": "Máquina não encontrada"}), 404

    db.session.delete(maquina)
    db.session.commit()
    return jsonify({"message": f"Máquina {maquina_id} apagada com sucesso!"}), 200