from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required
from .models import Maquinas, Imagens 
from .extensions import db 
from werkzeug.utils import secure_filename 
import os
import uuid 

# O prefixo é /api/admin. A rota fica /api/admin/maquinas
crud_bp = Blueprint('crud_bp', __name__, url_prefix='/api/admin')

# Tipos de ficheiro permitidos
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    """Verifica se a extensão do ficheiro é permitida."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# -------------------------------------------------------------
# Rota POST para CRIAR UMA NOVA MÁQUINA
# -------------------------------------------------------------
@crud_bp.route('/maquinas', methods=['POST']) 
@jwt_required()
def create_maquina():
    # ... (Corpo da função create_maquina mantido)
    try:
        dados_maquina = request.get_json(silent=True)
    except Exception:
        return jsonify({"error": "JSON malformado no corpo da requisição."}), 400

    if dados_maquina is None:
        return jsonify({"error": "Corpo da requisição vazio ou Content-Type não é 'application/json'."}), 400
        
    nome = dados_maquina.get('nome')
    descricao = dados_maquina.get('descricao')

    if not nome or not descricao:
        return jsonify({"error": "Campos 'nome' e 'descricao' são obrigatórios e não podem estar vazios."}), 400

    try:
        nova_maquina = Maquinas(nome=nome, descricao=descricao)
        db.session.add(nova_maquina)
        db.session.commit()
        
        return jsonify({
            "message": f"Máquina '{nome}' criada com sucesso! ID: {nova_maquina.id}", 
            "maquina_id": nova_maquina.id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Erro interno do servidor ao guardar dados: {e}"}), 500

# -------------------------------------------------------------
# Rota GET para Listar Máquinas
# -------------------------------------------------------------
@crud_bp.route('/maquinas', methods=['GET']) 
@jwt_required()
def get_all_maquinas():
    maquinas_db = Maquinas.query.all()
    lista_maquinas = []
    for maquina in maquinas_db:
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
# 🟢 ROTA DE UPLOAD (Com DEBUG CRÍTICO)
# -------------------------------------------------------------
@crud_bp.route('/maquinas/<int:maquina_id>/upload-imagem', methods=['POST'])
@jwt_required()
def upload_image(maquina_id):
    maquina = Maquinas.query.get(maquina_id)
    if not maquina:
        return jsonify({"error": "Máquina não encontrada para associar a imagem"}), 404

    # --- DEBUG CRÍTICO ---
    # Se esta linha for impressa, significa que o Flask não encontrou o ficheiro
    if 'file' not in request.files:
        print("--- DEBUG FLASK: ERRO 400 - O campo 'file' está ausente em request.files ---")
        return jsonify({"error": "Nenhum ficheiro encontrado no campo 'file'"}), 400
    # ---------------------
    
    file = request.files['file']
    
    # Se o utilizador não selecionar um ficheiro (o que é improvável neste ponto)
    if file.filename == '':
        return jsonify({"error": "Nenhum ficheiro selecionado"}), 400
    
    if file and allowed_file(file.filename):
        try:
            # 1. Preparar o nome e o caminho
            filename_base = secure_filename(file.filename)
            unique_filename = str(uuid.uuid4()) + '.' + filename_base.rsplit('.', 1)[1].lower()
            
            upload_path = os.path.join(current_app.root_path, current_app.config.get('UPLOAD_FOLDER_NAME', 'uploads'))
            
            # 2. Guardar o ficheiro no sistema local (⚠️ Será perdido no Vercel)
            file_save_path = os.path.join(upload_path, unique_filename)
            file.save(file_save_path)
            
            # 3. Guardar o caminho na base de dados
            relative_url = f"/{current_app.config.get('UPLOAD_FOLDER_NAME', 'uploads')}/{unique_filename}"
            
            nova_imagem = Imagens(url_imagem=relative_url, maquina_id=maquina_id)
            db.session.add(nova_imagem)
            db.session.commit()

            return jsonify({
                "message": "Imagem carregada e associada com sucesso!",
                "url": relative_url
            }), 201
            
        except Exception as e:
            db.session.rollback()
            print(f"DEBUG FLASK: Erro no upload ou na DB: {e}")
            return jsonify({"error": f"Erro interno do servidor durante o upload: {e}"}), 500

    return jsonify({"error": "Tipo de ficheiro não permitido"}), 400

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