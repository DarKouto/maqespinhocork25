from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from .models import Maquinas, Imagens # Garante que Imagens está importado
from .extensions import db 

# O prefixo é /api/admin. A rota fica /api/admin/maquinas
crud_bp = Blueprint('crud_bp', __name__, url_prefix='/api/admin')

# -------------------------------------------------------------
# Rota GET para Listar Máquinas (funcional)
# -------------------------------------------------------------
@crud_bp.route('/maquinas', methods=['GET']) 
@jwt_required()
def get_all_maquinas():
    maquinas_db = Maquinas.query.all()
    lista_maquinas = []
    for maquina in maquinas_db:
        # Busca todas as URLs de imagem relacionadas
        imagens_urls = [img.url_imagem for img in maquina.imagens]
        
        lista_maquinas.append({
            'id': maquina.id,
            'nome': maquina.nome,
            'descricao': maquina.descricao,
            'imagens': imagens_urls
        })
    return jsonify({
        'maquinas': lista_maquinas
    }), 200

# -------------------------------------------------------------
# Rota POST para CRIAR UMA NOVA MÁQUINA (Corrigido o 405)
# -------------------------------------------------------------
@crud_bp.route('/maquinas', methods=['POST']) 
@jwt_required()
def create_maquina():
    print("--- DEBUG FLASK: Tentativa de POST em /api/admin/maquinas ---")
    
    # Tenta obter o JSON de forma robusta. 
    # request.get_json(force=True) tenta analisar o corpo mesmo que Content-Type 
    # não seja application/json, o que pode resolver o problema do 400 se for um erro de frontend.
    try:
        dados_maquina = request.get_json(silent=True)
    except Exception as e:
        # Se houver um erro de parsing (JSON malformado)
        print(f"DEBUG FLASK: Erro ao analisar JSON: {e}")
        return jsonify({"error": "JSON malformado no corpo da requisição."}), 400

    # Se request.get_json(silent=True) devolver None, significa que falhou a ler o JSON.
    if dados_maquina is None:
        print("DEBUG FLASK: request.get_json() retornou None. Provável Content-Type errado ou corpo vazio.")
        # Retorna 400, pois o corpo não pôde ser lido como JSON, que é o formato esperado.
        return jsonify({"error": "Corpo da requisição vazio ou Content-Type não é 'application/json'."}), 400
        
    nome = dados_maquina.get('nome')
    descricao = dados_maquina.get('descricao')
    
    # Log dos dados recebidos (para debugging no lado do servidor)
    print(f"DEBUG FLASK: Dados recebidos: Nome='{nome}', Descrição='{descricao[:20]}...'")

    # Garante que as chaves existem E que os valores não são strings vazias
    if not nome or not descricao:
        print("DEBUG FLASK: 'nome' ou 'descricao' estão em falta/vazios.")
        return jsonify({"error": "Campos 'nome' e 'descricao' são obrigatórios e não podem estar vazios."}), 400

    try:
        nova_maquina = Maquinas(nome=nome, descricao=descricao)
        db.session.add(nova_maquina)
        db.session.commit()
        print(f"DEBUG FLASK: Máquina '{nome}' criada com sucesso!")
        return jsonify({"message": f"Máquina '{nome}' criada com sucesso!"}), 201
    except Exception as e:
        db.session.rollback()
        print(f"DEBUG FLASK: Erro na DB ao criar máquina: {e}")
        return jsonify({"error": f"Erro interno do servidor ao guardar dados: {e}"}), 500

# -------------------------------------------------------------
# Rota PUT para ACTUALIZAR MÁQUINA
# -------------------------------------------------------------
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

# -------------------------------------------------------------
# Rota DELETE para APAGAR MÁQUINA
# -------------------------------------------------------------
@crud_bp.route('/maquinas/<int:maquina_id>', methods=['DELETE']) 
@jwt_required()
def delete_maquina(maquina_id):
    maquina = Maquinas.query.get(maquina_id)
    if not maquina:
        return jsonify({"error": "Máquina não encontrada"}), 404

    db.session.delete(maquina)
    db.session.commit()
    return jsonify({"message": f"Máquina {maquina_id} apagada com sucesso!"}), 200