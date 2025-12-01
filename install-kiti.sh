#!/usr/bin/env bash
set -e

echo "Instalando KitiOS Server para Linux..."

# pasta de instalação
INSTALL_DIR="bin"
EXEC_NAME="kiti"

# cria diretório se não existir
mkdir -p "$INSTALL_DIR"

# url do binário linux (suba ele na release do GitHub)
DOWNLOAD_URL="https://github.com/Kiti-Co/Kiti-CLI/releases/latest/download/KitiOS-Server"

echo "Baixando última versão do KitiOS Server..."
curl -L "$DOWNLOAD_URL" -o "$INSTALL_DIR/$EXEC_NAME"

# garante permissão de execução
chmod +x "$INSTALL_DIR/$EXEC_NAME"

# adiciona ao PATH se não estiver
if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
    echo "Adicione ao PATH com:"
    echo "  export PATH=\$PATH:$INSTALL_DIR"
fi

echo ""
echo "Instalação concluída!"
echo "Execute: kiti"
