// kiti.cjs — versão 0.3.0, pkg-friendly, AIO, com sistema de apps e sysinfo

const fs = require("fs");
const path = require("path");
const os = require("os");
const readline = require("readline");

// -------------------------
// ASCII BANNER
// -------------------------
console.log(`
 ██╗  ██╗██╗████████╗██╗
 ██║ ██╔╝██║╚══██╔══╝██║
 █████╔╝ ██║   ██║   ██║
 ██╔═██╗ ██║   ██║   ██║
 ██║  ██╗██║   ██║   ██║
 ╚═╝  ╚═╝╚═╝   ╚═╝   ╚═╝

  k i t i   o s   s e r v e r
`);

// -------------------------
// PASTA DE DADOS (fora do exe)
// -------------------------
const dataDir = path.join(os.homedir(), ".kiti");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

// -------------------------
// USER CONFIG
// -------------------------
const userConfigPath = path.join(dataDir, "user.json");
if (!fs.existsSync(userConfigPath)) {
    fs.writeFileSync(userConfigPath, JSON.stringify({
        username: "default",
        theme: "normal",
        createdAt: new Date().toISOString()
    }, null, 4));
}
let userConfig = JSON.parse(fs.readFileSync(userConfigPath, "utf8"));
let currentTheme = userConfig.theme || "normal";
let currentUser = userConfig.username;

// -------------------------
// TEMAS
// -------------------------
const themes = {
    neon: { color: "\u001b[36m", name: "neon" },
    vaporwave: { color: "\u001b[35m", name: "vaporwave" },
    win98: { color: "\u001b[34m", name: "win98" },
    dark: { color: "\u001b[37m", name: "dark" }
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
// SISTEMA DE APPS
// -------------------------
const appsDir = path.join(dataDir, "apps");
if (!fs.existsSync(appsDir)) fs.mkdirSync(appsDir);
let appRegistry = {};

function loadApp(filePath) {
    try {
        const code = fs.readFileSync(filePath, "utf8");
        const fn = new Function('MiniOS', code);
        const name = path.basename(filePath, '.app.js');
        appRegistry[name] = fn;
        console.log(`App '${name}' carregado!`);
    } catch(e) {
        console.log("Erro ao carregar app:", e.message);
    }
}

// auto carregar apps existentes
fs.readdirSync(appsDir).filter(f => f.endsWith('.app.js')).forEach(f => {
    loadApp(path.join(appsDir, f));
});

function runApp(name) {
    if (appRegistry[name]) {
        appRegistry[name]({
            print: console.log,
            clear: () => console.clear(),
            cwd: () => currentDir,
            readInput: (msg, cb) => {
                rl.question(msg + ' ', cb);
            },
            fs: fs,
            os: os,
            path: path
        });
    } else {
        console.log("App não registrado.");
    }
}

// -------------------------
// SYSINFO (tipo neofetch)
// -------------------------
function sysinfo() {
    const uname = `${os.type()} ${os.release()}`;
    const cpu = os.cpus()[0].model;
    const memTotal = Math.round(os.totalmem()/1024/1024);
    const memFree = Math.round(os.freemem()/1024/1024);
    return `\nKiti OS Server v0.3\nUser: ${currentUser}\nOS: ${uname}\nCPU: ${cpu}\nRAM: ${memFree} MB / ${memTotal} MB\nHome Dir: ${currentDir}\n`;
}

// -------------------------
// COMANDOS
// -------------------------
function runCommand(cmd) {
    if (editMode) {
        if (cmd === '/save') {
            fs.writeFileSync(editFilePath, editBuffer, 'utf8');
            console.log('Arquivo salvo!');
            editMode = false; editBuffer = ''; editFilePath = '';
            return;
        }
        editBuffer += cmd + '\n';
        return;
    }

    const [command, ...args] = cmd.split(' ');

    switch(command) {
        case 'cd':
            const target = path.resolve(currentDir, args.join(' '));
            if(fs.existsSync(target) && fs.statSync(target).isDirectory()) currentDir = target;
            else console.log('Diretório inválido');
            break;
        case 'ls':
            console.log(fs.readdirSync(currentDir).join('\n'));
            break;
        case 'open':
            const fPath = path.join(currentDir, args.join(' '));
            if(fs.existsSync(fPath)) console.log(fs.readFileSync(fPath, 'utf8'));
            else console.log('Arquivo inexistente');
            break;
        case 'edit':
            editFilePath = path.join(currentDir, args.join(' '));
            editBuffer = fs.existsSync(editFilePath) ? fs.readFileSync(editFilePath,'utf8') : '';
            console.log(editBuffer ? 'Editando arquivo existente' : 'Novo arquivo');
            console.log('Digite o conteúdo e depois /save');
            editMode = true;
            break;
        case 'theme':
            if(themes[args[0]]) { currentTheme = args[0]; userConfig.theme = args[0]; fs.writeFileSync(userConfigPath, JSON.stringify(userConfig, null, 4)); console.log(`Tema: ${args[0]}`); }
            else console.log('Tema inválido');
            break;
        case 'config':
            console.log(JSON.stringify(userConfig,null,4));
            break;
        case 'echo':
            console.log(args.join(' '));
            break;
        case 'calc':
            try { console.log(eval(args.join(' '))); } catch { console.log('Erro na expressão'); }
            break;
        case 'run':
            runApp(args[0]);
            break;
        case 'loadapp':
            loadApp(path.join(currentDir, args[0]));
            break;
        case 'sysinfo':
            console.log(sysinfo());
            break;
        case 'help':
            console.log(`Comandos: cd, ls, open, edit, theme, config, echo, calc, run, loadapp, sysinfo, help, exit`);
            break;
        case 'exit':
            console.log('Saindo do Kiti CLI...'); process.exit(0);
            break;
        default:
            if(command) console.log('Comando inexistente');
    }
}

// -------------------------
// LOOP PRINCIPAL
// -------------------------
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function loop() {
    rl.question(buildPrompt(currentDir), (ans) => { runCommand(ans.trim()); loop(); });
}
loop();