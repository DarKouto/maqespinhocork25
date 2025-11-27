from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required
from .models import Maquinas, Imagens 
from .extensions import db 
from werkzeug.utils import secure_filename 
import os
import uuid 
import cloudinary.uploader # 🚨 IMPORTANTE: Importar o uploader

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
# 🟢 ROTA DE UPLOAD (AGORA COM CLOUDINARY)
# -------------------------------------------------------------
@crud_bp.route('/maquinas/<int:maquina_id>/upload-imagem', methods=['POST'])
@jwt_required()
def upload_image(maquina_id):
    maquina = Maquinas.query.get(maquina_id)
    if not maquina:
        return jsonify({"error": "Máquina não encontrada para associar a imagem"}), 404

    if 'file' not in request.files:
        print("--- DEBUG FLASK: ERRO 400 - O campo 'file' está ausente em request.files ---")
        return jsonify({"error": "Nenhum ficheiro encontrado no campo 'file'"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "Nenhum ficheiro selecionado"}), 400
    
    if file and allowed_file(file.filename):
        try:
            # 1. FAZER O UPLOAD PARA O CLOUDINARY (Substitui o file.save() local)
            # Usamos o ID da máquina para criar uma pasta de organização no Cloudinary.
            # O public_id garante um nome único.
            upload_result = cloudinary.uploader.upload(
                file, 
                folder=f"maquinas/{maquina_id}", 
                public_id=str(uuid.uuid4()),
                transformation=[
                    {
                        'width': 1000, 
                        'crop': "limit", # Mantém o aspeto e limita a dimensão máxima
                        'quality': "auto:best", # Otimiza a qualidade
                        'fetch_format': "auto" # Converte para WebP/AVIF se o browser suportar
                    }
                ]
                
            )
            
            # Extrair o URL seguro e público do resultado
            public_url = upload_result.get('secure_url')
            
            if not public_url:
                 # Se o upload falhar, o public_url será None
                 return jsonify({"error": "Falha ao obter URL público do Cloudinary. Credenciais ou erro de rede?"}), 500

            # 2. Guardar o URL público (e não o caminho local) na base de dados NEON
            nova_imagem = Imagens(url_imagem=public_url, maquina_id=maquina_id)
            db.session.add(nova_imagem)
            db.session.commit()
            
            # 3. Sucesso! Devolve o URL permanente.
            return jsonify({
                "message": "Imagem carregada e associada com sucesso ao Cloudinary!",
                "url": public_url 
            }), 201
            
        except Exception as e:
            db.session.rollback()
            print(f"DEBUG FLASK: Erro no upload ou na DB: {e}")
            # Devolve sempre JSON para o frontend poder tratar a resposta
            return jsonify({"error": f"Erro interno do servidor: {str(e)}"}), 500

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
    
    # Adicional: Poderias adicionar lógica para apagar as imagens associadas
    # do Cloudinary aqui antes de apagar a máquina da DB.
    # Exemplo: Imagens.query.filter_by(maquina_id=maquina_id).delete()
    
    db.session.delete(maquina)
    db.session.commit()
    return jsonify({"message": f"Máquina {maquina_id} apagada com sucesso!"}), 200