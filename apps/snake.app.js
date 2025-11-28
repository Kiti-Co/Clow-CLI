// apps/snake.app.js — Snake Game fluido para Kiti CLI PRO (corrigido)
let width = 20;
let height = 10;
let snake = [{x: Math.floor(width/2), y: Math.floor(height/2)}];
let dir = 'RIGHT';
let fruit = {x: Math.floor(Math.random()*width), y: Math.floor(Math.random()*height)};
let gameOver = false;
let gameInterval;

function draw() {
    let output = '';
    for (let y=0; y<height; y++) {
        for (let x=0; x<width; x++) {
            if (snake.some(s => s.x===x && s.y===y)) output += 'O';
            else if (fruit.x===x && fruit.y===y) output += 'X';
            else output += '.';
        }
        output += '\n';
    }
    MiniOS.clear();
    MiniOS.print(output);
    MiniOS.print('Use W/A/S/D para mover.');
}

function move() {
    let head = {...snake[0]};
    if (dir==='UP') head.y--;
    if (dir==='DOWN') head.y++;
    if (dir==='LEFT') head.x--;
    if (dir==='RIGHT') head.x++;

    // colisão com paredes ou corpo
    if (head.x<0 || head.x>=width || head.y<0 || head.y>=height || snake.some(s=>s.x===head.x && s.y===head.y)) {
        gameOver = true;
        clearInterval(gameInterval);
        MiniOS.print('💀 Game Over! pressione Enter para voltar ao MiniOS');
        process.stdin.removeListener('data', onKeyPress);
        process.removeListener('SIGINT', handleExit);
        return;
    }

    snake.unshift(head);
    if (head.x===fruit.x && head.y===fruit.y) {
        fruit = {x: Math.floor(Math.random()*width), y: Math.floor(Math.random()*height)};
    } else {
        snake.pop();
    }
}

MiniOS.print('🎮 Snake Game iniciado!');

function handleExit() {
    if (gameInterval) clearInterval(gameInterval);
    MiniOS.print('🚪 Jogo encerrado, voltando ao MiniOS');
    process.stdin.removeListener('data', onKeyPress);
    process.removeListener('SIGINT', handleExit);
}

function onKeyPress(key) {
    const str = key.toString().toLowerCase();
    if (str==='w' && dir!=='DOWN') dir='UP';
    if (str==='s' && dir!=='UP') dir='DOWN';
    if (str==='a' && dir!=='RIGHT') dir='LEFT';
    if (str==='d' && dir!=='LEFT') dir='RIGHT';
}

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', onKeyPress);
process.on('SIGINT', handleExit);

gameInterval = setInterval(() => {
    if (!gameOver) {
        move();
        draw();
    }
}, 200);
