# kiti CLI

Um terminal simples em Node.js, baseado em CommonJS, com suporte a temas, edição de arquivos, navegação de diretórios e configuração persistente através de `user.json`.

---

## Recursos

- Navegação básica (`cd`, `ls`)
- Leitura de arquivos (`open`)
- Editor interno com salvamento (`edit` + `/save`)
- Sistema de temas com persistência (`theme <nome>`)
- Configuração automática no primeiro uso (`user.json`)
- Comando `exit` para encerrar o CLI
- Arquitetura AIO (um único arquivo: `kiti.cjs`)

---

## Temas disponíveis

- **normal** — ciano  
- **roxo** — magenta  
- **azul** — azul  
- **branco** — branco  

O tema escolhido fica salvo em `user.json` e é carregado automaticamente em todas as execuções seguintes.
