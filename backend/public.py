# public.py
from flask import Blueprint, jsonify
from models import Maquinas 

# Definição do Blueprint: SEM prefixo (url_prefix)
public_bp = Blueprint('public_bp', __name__)

# ROTAS PÚBLICAS
@public_bp.route('/maquinas', methods=['GET'])
def get_all_maquinas_public():
    # Consulta a base de dados Neon
    maquinas = Maquinas.query.all()
    
    # Serialização dos dados para JSON
    lista_maquinas = []
    for maquina in maquinas:
        lista_maquinas.append({
            'id': maquina.id,
            'nome': maquina.nome,
            'descricao': maquina.descricao,
            # Adicionar campos de imagem mais tarde
        })
    
    return jsonify(lista_maquinas)