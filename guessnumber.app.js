let target = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
MiniOS.print(`🎮 Bem-vindo ao GuessNumber!\nTente adivinhar o número entre 1 e 100`);
function ask() {
MiniOS.readInput('Digite seu palpite: ', (input) => {
const guess = parseInt(input);
attempts++;
if (isNaN(guess)) {
MiniOS.print('Por favor, digite um número válido!');
ask();
} else if (guess < target) {
MiniOS.print('📈 Muito baixo!');
ask();
} else if (guess > target) {
MiniOS.print('📉 Muito alto!');
ask();
} else {
MiniOS.print(`🎉 Parabéns! Você acertou em ${attempts} tentativas!`);
}
});
}
ask();