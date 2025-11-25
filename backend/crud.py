from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

# IMPORTAÇÕES DO REFACTOR
from .models import Maquinas
from .extensions import db 

# Definição do Blueprint com o prefixo /api/admin
# 🛑 ATENÇÃO: A URL COMPLETA TEM DE SER /api/admin/ 🛑
crud_bp = Blueprint('crud_bp', __name__, url_prefix='/api/admin')

# OBTER TODAS AS MÁQUINAS (CRUD - READ)
# URL FINAL: /api/admin/maquinas
@crud_bp.route('/maquinas', methods=['GET']) 
@jwt_required()
def get_all_maquinas():
    maquinas_db = Maquinas.query.all()
    lista_maquinas = []
    
    # 🛑 ATENÇÃO: Aqui temos de usar a estrutura esperada pelo Dashboard.jsx
    for maquina in maquinas_db:
        lista_maquinas.append({
            'id': maquina.id,
            'titulo_pt': maquina.nome, # Mapeia nome para titulo_pt
            'descricao': maquina.descricao,
            'preco_eur': 'N/A', 
            'ano': 'N/A',       
        })
    
    # 🛑 ATENÇÃO: TEM DE DEVOLVER NA CHAVE 'maquinas' 🛑
    return jsonify({
        'maquinas': lista_maquinas
    }), 200

# CRIAR UMA NOVA MÁQUINA (CRUD - CREATE)
@crud_bp.route('/maquinas', methods=['POST']) 
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
@crud_bp.route('/maquinas/<int:maquina_id>', methods=['PUT']) 
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
@crud_bp.route('/maquinas/<int:maquina_id>', methods=['DELETE']) 
@jwt_required()
def delete_maquina(maquina_id):
    maquina = Maquinas.query.get(maquina_id)
    if not maquina:
        return jsonify({"error": "Máquina não encontrada"}), 404

    db.session.delete(maquina)
    db.session.commit()
    return jsonify({"message": f"Máquina {maquina_id} apagada com sucesso!"}), 200