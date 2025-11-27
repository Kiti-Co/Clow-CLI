// kiti.cjs — versão completa AIO, 100% funcional em CJS

const fs = require("fs");
const path = require("path");
const readline = require("readline");
console.log(`
 ██╗  ██╗██╗████████╗██╗
 ██║ ██╔╝██║╚══██╔══╝██║
 █████╔╝ ██║   ██║   ██║
 ██╔═██╗ ██║   ██║   ██║
 ██║  ██╗██║   ██║   ██║
 ╚═╝  ╚═╝╚═╝   ╚═╝   ╚═╝

      k i t i   c l i
`);
// -------------------------
// SETUP (cria user.json se não existir)
// -------------------------
const userConfigPath = path.join(__dirname, "user.json");

if (!fs.existsSync(userConfigPath)) {
    console.log("realizando setup inicial...");
    fs.writeFileSync(
        userConfigPath,
        JSON.stringify(
            {
                username: "default",
                theme: "normal",
                createdAt: new Date().toISOString()
            },
            null,
            4
        ),
        "utf8"
    );
    console.log("arquivo user.json criado!\n");
}

// carrega config existente
let userConfig = JSON.parse(fs.readFileSync(userConfigPath, "utf8"));
let currentTheme = userConfig.theme || "normal";

// -------------------------
// TEMAS
// -------------------------
const themes = {
    normal:  { color: "\u001b[36m", name: "normal" },
    roxo:    { color: "\u001b[35m", name: "roxo" },
    azul:    { color: "\u001b[34m", name: "azul" },
    branco:  { color: "\u001b[37m", name: "branco" }
};

// -------------------------
// COLOR + PROMPT
// -------------------------
function promptColor() {
    const t = themes[currentTheme];
    return t ? t.color : "\u001b[37m";
}

function buildPrompt(cwd) {
    return `${promptColor()}kiti(${cwd})>\u001b[0m `;
}

// -------------------------
// CLI CORE
// -------------------------
let currentDir = process.cwd();
let editMode = false;
let editBuffer = "";
let editFilePath = "";

// -------------------------
// COMANDOS
// -------------------------
function runCommand(cmd, rl) {

    // modo edição ativo
    if (editMode) {
        if (cmd === "/save") {
            fs.writeFileSync(editFilePath, editBuffer, "utf8");
            console.log("arquivo salvo com sucesso!");
            editMode = false;
            editBuffer = "";
            editFilePath = "";
            return;
        }

        editBuffer += cmd + "\n";
        return;
    }

    const [command, ...args] = cmd.split(" ");

    switch (command) {

        case "cd":
            const target = path.resolve(currentDir, args.join(" "));
            if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
                currentDir = target;
            } else {
                console.log("diretório inválido");
            }
            break;

        case "ls":
            console.log(fs.readdirSync(currentDir).join("\n"));
            break;

        case "open":
            const filePath = path.join(currentDir, args.join(" "));
            if (fs.existsSync(filePath)) {
                console.log(fs.readFileSync(filePath, "utf8"));
            } else {
                console.log("arquivo inexistente");
            }
            break;

        case "edit":
            const f = path.join(currentDir, args.join(" "));
            editFilePath = f;

            if (fs.existsSync(f)) {
                console.log("editando arquivo existente");
                editBuffer = fs.readFileSync(f, "utf8");
            } else {
                console.log("arquivo novo");
                editBuffer = "";
            }

            console.log("--------------------");
            console.log("digita o novo conteúdo. quando terminar escreve: /save");
            console.log("--------------------");

            editMode = true;
            break;

        case "theme":
            const t = args[0];
            if (themes[t]) {
                currentTheme = t;

                // salva no user.json
                userConfig.theme = t;
                fs.writeFileSync(userConfigPath, JSON.stringify(userConfig, null, 4));

                console.log(`tema trocado para: ${t}`);
            } else {
                console.log("tema inexistente. disponíveis: normal, roxo, azul, branco");
            }
            break;

        case "help":
            console.log(`
comandos kiti cli:
  cd <dir>
  ls
  open <arquivo>
  edit <arquivo>
  theme <tema>
  exit
  help
`);
            break;

        case "exit":
            console.log("fechando o kiti cli...");
            process.exit(0);
            break;

        case "":
            break;

        default:
            console.log("comando inexistente.");
    }
}

// -------------------------
// LOOP PRINCIPAL
// -------------------------
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function loop() {
    rl.question(buildPrompt(currentDir), (answer) => {
        runCommand(answer.trim(), rl);
        loop();
    });
}

loop();
