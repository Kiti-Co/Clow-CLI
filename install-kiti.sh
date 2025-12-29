#!/usr/bin/env bash
set -e

echo "Instalando Clow CLI para Linux..."

# pasta de instalação
INSTALL_DIR="$HOME/.local/bin"
EXEC_NAME="kiti"

# cria diretório se não existir
mkdir -p "$INSTALL_DIR"

# url do binário linux (suba ele na release do GitHub)
DOWNLOAD_URL="https://github.com/Kiti-Co/Clow-CLI/releases/latest/download/KitiOS-Server"

echo "Baixando última versão do Clow CLI..."
curl -L "$DOWNLOAD_URL" -o "$INSTALL_DIR/$EXEC_NAME"

# verifica se o download foi bem-sucedido
if [ ! -f "$INSTALL_DIR/$EXEC_NAME" ]; then
    echo "Erro: Falha ao baixar o binário!"
    exit 1
fi

# garante permissão de execução
chmod +x "$INSTALL_DIR/$EXEC_NAME"

# adiciona ao PATH se não estiver
export PATH=\$PATH:$HOME/.local/bin
if ! command -v "$EXEC_NAME" &>/dev/null; then
    echo "Clow CLI não encontrado no PATH. Para adicioná-lo, execute:"
    echo "  export PATH=\$PATH:$INSTALL_DIR"
    echo "Ou adicione essa linha ao seu arquivo ~/.bashrc ou ~/.zshrc"
fi

echo ""
echo "Instalação concluída!"
echo "Agora, você pode executar: kiti"
