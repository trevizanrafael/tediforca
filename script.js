const words = [
    {
        word: 'CELULAR',
        hint: 'É o telefone que você leva para todo lugar, cabe na sua mão.'
    },
    {
        word: 'GALERIA',
        hint: 'Onde ficam guardadas todas as suas fotos e vídeos no celular.'
    },
    {
        word: 'CAMERA',
        hint: 'A parte do celular que você usa para tirar fotos e filmar.'
    },
    {
        word: 'APLICATIVO',
        hint: 'São os programinhas que você instala no celular para fazer várias coisas, como jogos ou banco.'
    },
    {
        word: 'WHATSAPP',
        hint: 'O programa que você usa para mandar mensagens para a família e amigos, e até fazer chamadas.'
    }
];

class HangmanGame {
    constructor() {
        this.canvas = document.getElementById('hangmanCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.wordElement = document.getElementById('word');
        this.hintElement = document.getElementById('dica');
        this.messageElement = document.getElementById('message');
        this.keyboardElement = document.querySelector('.keyboard');
        
        this.canvas.width = 200;
        this.canvas.height = 250;
        
        this.initGame();
        this.createKeyboard();
        
        document.getElementById('newGame').addEventListener('click', () => this.initGame());
        document.getElementById('backToMural').addEventListener('click', () => {
            window.location.href = 'https://trevizanrafael.github.io/muraltedi/';
        });
    }

    initGame() {
        const randomIndex = Math.floor(Math.random() * words.length);
        this.currentWord = words[randomIndex].word;
        this.currentHint = words[randomIndex].hint;
        this.guessedLetters = new Set();
        this.wrongGuesses = 0;
        this.maxWrongGuesses = 6;
        
        this.updateWordDisplay();
        this.updateHintDisplay();
        this.resetKeyboard();
        this.clearCanvas();
        this.drawGallows();
        this.messageElement.textContent = '';
        this.messageElement.className = ''; // Clear previous message classes
    }

    createKeyboard() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        alphabet.forEach(letter => {
            const button = document.createElement('button');
            button.textContent = letter;
            button.className = 'key';
            button.setAttribute('data-letter', letter); // Add data-letter attribute
            button.addEventListener('click', () => this.guessLetter(letter));
            this.keyboardElement.appendChild(button);
        });
    }

    resetKeyboard() {
        const keys = document.querySelectorAll('.key');
        keys.forEach(key => {
            key.disabled = false;
        });
    }

    updateWordDisplay() {
        this.wordElement.textContent = this.currentWord
            .split('')
            .map(letter => this.guessedLetters.has(letter) ? letter : '_')
            .join(' ');
    }

    updateHintDisplay() {
        this.hintElement.textContent = `Dica: ${this.currentHint}`;
    }

    guessLetter(letter) {
        if (this.guessedLetters.has(letter)) return;

        this.guessedLetters.add(letter);
        const button = document.querySelector(`.key[data-letter="${letter}"]`);
        if (button) button.disabled = true;

        if (!this.currentWord.includes(letter)) {
            this.wrongGuesses++;
            this.drawHangman();
        }

        this.updateWordDisplay();
        this.checkGameStatus();
    }

    checkGameStatus() {
        const won = this.currentWord
            .split('')
            .every(letter => this.guessedLetters.has(letter));

        if (won) {
            this.messageElement.textContent = 'Parabéns! Você venceu! 🎉';
            this.messageElement.className = 'success';
            this.disableAllKeys();
        } else if (this.wrongGuesses >= this.maxWrongGuesses) {
            this.messageElement.textContent = `Fim de jogo! A palavra era: ${this.currentWord}`;
            this.messageElement.className = 'error';
            this.disableAllKeys();
        }
    }

    disableAllKeys() {
        const keys = document.querySelectorAll('.key');
        keys.forEach(key => key.disabled = true);
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGallows() {
        this.ctx.strokeStyle = '#333333'; // Darker color for gallows for better contrast
        this.ctx.lineWidth = 4; // Thicker lines for gallows

        // Base
        this.ctx.beginPath();
        this.ctx.rect(0, 220, 200, 10); // Solid ground base
        this.ctx.fillStyle = '#666666'; // Fill base with dark gray
        this.ctx.fill();
        this.ctx.stroke();

        // Vertical post
        this.ctx.beginPath();
        this.ctx.rect(30, 25, 10, 200); // Thicker vertical post
        this.ctx.fillStyle = '#666666';
        this.ctx.fill();
        this.ctx.stroke();

        // Horizontal beam
        this.ctx.beginPath();
        this.ctx.rect(30, 25, 90, 10); // Thicker horizontal beam
        this.ctx.fillStyle = '#666666';
        this.ctx.fill();
        this.ctx.stroke();

        // Rope
        this.ctx.beginPath();
        this.ctx.moveTo(110, 35);
        this.ctx.lineTo(110, 55);
        this.ctx.lineWidth = 3; // Thicker rope
        this.ctx.strokeStyle = '#8B4513'; // Rope color
        this.ctx.stroke();
    }

    drawHangman() {
        this.ctx.lineWidth = 3; // Line width for hangman parts
        this.ctx.strokeStyle = '#333333'; // Outline color for character
        this.ctx.fillStyle = '#FFFFFF'; // Fill color for character

        switch(this.wrongGuesses) {
            case 1: // Head
                this.ctx.beginPath();
                this.ctx.arc(110, 75, 20, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
                break;
            case 2: // Body
                this.ctx.beginPath();
                this.ctx.moveTo(110, 95);
                this.ctx.lineTo(110, 150);
                this.ctx.stroke();
                break;
            case 3: // Left Arm
                this.ctx.beginPath();
                this.ctx.moveTo(110, 105);
                this.ctx.lineTo(80, 130);
                this.ctx.stroke();
                break;
            case 4: // Right Arm
                this.ctx.beginPath();
                this.ctx.moveTo(110, 105);
                this.ctx.lineTo(140, 130);
                this.ctx.stroke();
                break;
            case 5: // Left Leg
                this.ctx.beginPath();
                this.ctx.moveTo(110, 150);
                this.ctx.lineTo(85, 185);
                this.ctx.stroke();
                break;
            case 6: // Right Leg + Face (Game Over)
                this.ctx.beginPath();
                this.ctx.moveTo(110, 150);
                this.ctx.lineTo(135, 185);
                this.ctx.stroke();

                // Draw X eyes
                this.ctx.beginPath();
                this.ctx.moveTo(100, 70);
                this.ctx.lineTo(105, 75);
                this.ctx.moveTo(105, 70);
                this.ctx.lineTo(100, 75);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.moveTo(115, 70);
                this.ctx.lineTo(120, 75);
                this.ctx.moveTo(120, 70);
                this.ctx.lineTo(115, 75);
                this.ctx.stroke();

                // Draw sad mouth
                this.ctx.beginPath();
                this.ctx.arc(110, 85, 5, 0, Math.PI, false);
                this.ctx.stroke();
                break;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HangmanGame();
});
