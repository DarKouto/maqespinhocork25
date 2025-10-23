# create_db.py - é usado uma única vez no terminal com: "python create_db.py"
# serve para criar as tabelas da base de dados com base no ORM do models.py
from app import app, db
from models import Maquinas, Imagens, Utilizador 

with app.app_context():
    db.create_all() 
    print("Tabelas criadas no Postgres (ou já existiam).")