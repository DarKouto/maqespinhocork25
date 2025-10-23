# insert_admin.py - é usado uma única vez no terminal com: "python insert_admin.py"
# serve para criar um utilizador admin com base nos dados do ORM do models.py
from app import app, db
from models import Utilizador 
from werkzeug.security import generate_password_hash
import os

ADMIN_USERNAME = os.getenv('ADMIN_USERNAME') 
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD') 

# Adicionar uma verificação para garantir que as variáveis estão no .env
if not ADMIN_USERNAME or not ADMIN_PASSWORD:
    raise ValueError("ADMIN_USERNAME e ADMIN_PASSWORD devem estar definidos no .env")

with app.app_context():
    # 1. Verificar se o utilizador já existe
    utilizador_existente = Utilizador.query.filter_by(nome_utilizador=ADMIN_USERNAME).first()

    if utilizador_existente:
        print(f"Utilizador '{ADMIN_USERNAME}' já existe.")
    else:
        # 2. Encriptar a password
        hashed_password = generate_password_hash(ADMIN_PASSWORD, method='pbkdf2:sha256')
        
        # 3. Criar o novo utilizador
        novo_admin = Utilizador(
            nome_utilizador=ADMIN_USERNAME,
            palavra_passe=hashed_password,
        )
        
        # 4. Adicionar à sessão e guardar
        db.session.add(novo_admin)
        db.session.commit()
        print(f"Utilizador admin '{ADMIN_USERNAME}' criado e guardado com sucesso!")