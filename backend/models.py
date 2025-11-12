from flask_login import UserMixin
from .extensions import db, login_manager
from bcrypt import checkpw

# --- CLASSES DE MÁQUINAS ---

class Maquinas(db.Model):
    __tablename__ = 'maquinas' # É boa prática especificar o nome
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    imagens = db.relationship('Imagens', backref='maquina', lazy=True)
    def __repr__(self):
        return f'<Máquina {self.nome}>'

class Imagens(db.Model):
    __tablename__ = 'imagens'
    id = db.Column(db.Integer, primary_key=True)
    url_imagem = db.Column(db.String(255), nullable=False)
    maquina_id = db.Column(db.Integer, db.ForeignKey('maquinas.id'), nullable=False)
    def __repr__(self):
        return f'<Imagem {self.url_imagem}>'

# A classe herda de UserMixin para que o Flask-Login a reconheça
class Utilizador(db.Model, UserMixin): 
    __tablename__ = 'utilizador' # Usa o nome exato da tua tabela no Neon
    id = db.Column(db.Integer, primary_key=True)
    nome_utilizador = db.Column(db.String(80), unique=True, nullable=False)
    # NOTA: Esta coluna guarda a password HASHADA (não a password em texto limpo)
    palavra_passe = db.Column(db.String(120), nullable=False)
    def __repr__(self):
        return f'<Utilizador {self.nome_utilizador}>'
    def verify_password(self, password): # <--- NOVO MÉTODO
        """Verifica a password fornecida contra o hash guardado na DB."""
        # A password guardada na DB e a password fornecida (em string)
        # têm de ser convertidas para bytes para o bcrypt funcionar.
        hashed_password = self.palavra_passe.encode('utf-8')
        plain_password = password.encode('utf-8')
        return checkpw(plain_password, hashed_password)


@login_manager.user_loader
def load_user(user_id):
    # Usa o ORM para procurar o utilizador pelo ID
    return Utilizador.query.get(int(user_id))