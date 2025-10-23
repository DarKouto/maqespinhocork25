from extensions import db

class Maquinas(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    imagens = db.relationship('Imagens', backref='maquina', lazy=True)
    def __repr__(self):
        return f'<Máquina {self.nome}>'

class Imagens(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url_imagem = db.Column(db.String(255), nullable=False)
    maquina_id = db.Column(db.Integer, db.ForeignKey('maquinas.id'), nullable=False)
    def __repr__(self):
        return f'<Imagem {self.url_imagem}>'

class Utilizador(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome_utilizador = db.Column(db.String(80), unique=True, nullable=False)
    palavra_passe = db.Column(db.String(120), nullable=False)
    def __repr__(self):
        return f'<Utilizador {self.nome_utilizador}>'