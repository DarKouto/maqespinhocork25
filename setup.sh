#!/bin/bash
echo "A criar/verificar ambiente virtual em backend/venv..."
python -m venv backend/venv

echo "A ativar ambiente virtual..."
source backend/venv/bin/activate
echo "A instalar dependências..."
pip install -r backend/requirements.txt

# 4. Define a variável Flask (necessário para as importações relativas)
echo "A definir variável FLASK_APP=backend.app"
export FLASK_APP=backend.app

echo "SETUP COMPLETO. Ambiente ativado."
echo "Podes agora usar 'flask run --debug' ou 'deactivate'."
