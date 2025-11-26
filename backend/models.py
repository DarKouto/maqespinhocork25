from .extensions import db

class Maquinas(db.Model):
    __tablename__ = 'maquinas' # Boa prática: definir explicitamente o nome
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    
    # Relação com Imagens. O 'cascade' é CRÍTICO para apagar imagens
    # se a máquina for apagada (ON DELETE CASCADE)
    imagens = db.relationship('Imagens', backref='maquina', lazy=True, cascade="all, delete-orphan")
    
    def __repr__(self):
        return f'<Máquina {self.nome}>'

class Imagens(db.Model):
    __tablename__ = 'imagens' # Boa prática: definir explicitamente o nome
    id = db.Column(db.Integer, primary_key=True)
    url_imagem = db.Column(db.String(255), nullable=False)
    maquina_id = db.Column(db.Integer, db.ForeignKey('maquinas.id'), nullable=False)
    def __repr__(self):
        return f'<Imagem {self.url_imagem}>'

class Utilizador(db.Model):
    __tablename__ = 'utilizador' # Boa prática: definir explicitamente o nome
    id = db.Column(db.Integer, primary_key=True)
    nome_utilizador = db.Column(db.String(80), unique=True, nullable=False)
    palavra_passe = db.Column(db.String(120), nullable=False)
    def __repr__(self):
        return f'<Utilizador {self.nome_utilizador}>'