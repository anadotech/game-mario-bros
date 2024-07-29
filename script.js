const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const start = document.querySelector('.start');
const gameOver = document.querySelector('.game-over');
const scoreElement = document.querySelector('.score'); // Elemento para mostrar a pontuação
const highScoreElement = document.querySelector('.high-score'); // Elemento para mostrar o recorde

const audioStart = new Audio('./sounds/mario.sound.theme.mp3');
const audioGameOver = new Audio('./sounds/mario.sound.gameover.mp3');

let startTime;
let timerInterval;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0; // Recupera o recorde do localStorage

const updateHighScore = () => {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore); // Salva o novo recorde
    highScoreElement.textContent = `Recorde: ${highScore}`;
  }
};

const startGame = () => {
  pipe.classList.add('pipe-animation');
  start.style.display = 'none';
  audioStart.play();

  // Inicializa o cronômetro
  startTime = Date.now();
  timerInterval = setInterval(updateScore, 1000); // Atualiza a pontuação a cada segundo
};

const restartGame = () => {
  gameOver.style.display = 'none';
  pipe.style.left = 'initial';
  pipe.classList.remove('pipe-animation');

  mario.src = './img/mario.gif';
  mario.style.width = '150px';
  mario.style.bottom = '0';

  start.style.display = 'flex';

  audioGameOver.pause();
  audioGameOver.currentTime = 0;
  audioStart.play();
  audioStart.currentTime = 0;

  // Reinicia o cronômetro e a pontuação
  clearInterval(timerInterval);
  score = 0;
  scoreElement.textContent = `Pontos: ${score}`;
};

const jump = () => {
  mario.classList.add('jump');
  setTimeout(() => {
    mario.classList.remove('jump');
  }, 800);
};

const updateScore = () => {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Tempo em segundos
  score = elapsedTime;
  scoreElement.textContent = `Pontos: ${score}`;
};

const loop = () => {
  setInterval(() => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = parseInt(window.getComputedStyle(mario).bottom);

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
      pipe.classList.remove('pipe-animation');
      pipe.style.left = `${pipePosition}px`;
      mario.src = './img/mariomorto.gif';
      mario.style.width = '150px'; 
      mario.style.marginLeft = '0'; 
      mario.classList.remove('jump');
      audioStart.pause();
      audioGameOver.play();
      setTimeout(() => audioGameOver.pause(), 7000);

      gameOver.style.display = 'flex';

      // Parar o cronômetro e atualizar o recorde ao terminar o jogo
      clearInterval(timerInterval);
      updateHighScore();
      
    }
  }, 10);
};

// Inicializa a exibição do recorde
highScoreElement.textContent = `Recorde: ${highScore}`;

loop();

document.addEventListener('keypress', e => {
  if (e.key === ' ') {
    jump();
  } else if (e.key === 'Enter') {
    startGame();
  }
});

document.addEventListener('touchstart', e => {
  if (e.touches.length) {
    jump();
  }
});
