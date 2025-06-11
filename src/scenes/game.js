class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.squares = [];
        this.sequence = [];
        this.playerInput = [];
        this.round = 1;
        this.score = 0;
        this.playerTurn = false;
        this.scoreText = null;
        this.roundText = null;
        this.difficulty = {};
    }

    init() {
        // Default difficulty settings
        const defaultDifficulty = {
            gridSize: 3,
            numbersPerRound: 1,
            displaySpeed: 0.3
        };
        this.difficulty = this.registry.get('difficulty') || defaultDifficulty;
    }

    preload() {
        this.load.audio('blip', 'assets/blipselect.wav');
    }

    async create() {
        try {
            await this.generateSequence();
            this.createGrid();

            this.scoreText = this.add.text(this.cameras.main.width - 10, 10, 'Score: 0', {
                fontSize: '24px',
                color: '#000000'
            }).setOrigin(1, 0);
            
            this.roundText = this.add.text(this.cameras.main.centerX, 30, 'Round: 1', {
                fontSize: '24px',
                color: '#000000'
            }).setOrigin(0.5);

            this.time.delayedCall(1000, () => this.startRound());
        } catch (error) {
            console.error("Failed to start game:", error);
            // Optionally, display an error to the user on the screen
            this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Error: Could not load sequence.', {
                fontSize: '24px',
                color: '#ff0000'
            }).setOrigin(0.5);
        }
    }

    async generateSequence() {
        try {
            const response = await fetch(`/generate-sequence?gridSize=${this.difficulty.gridSize}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.sequence = data.sequence.split('').map(Number); // Convert string of numbers to array of numbers
        } catch (error) {
            console.error("Could not fetch sequence:", error);
            throw error; // Re-throw to be caught by create()
        }
    }

    createGrid() {
        const squareSize = 100;
        const margin = 10;
        const gridSize = this.difficulty.gridSize;
        const gridWidth = gridSize * squareSize + (gridSize - 1) * margin;
        const startX = (this.cameras.main.width - gridWidth) / 2 + squareSize / 2;
        const startY = (this.cameras.main.height - gridWidth) / 2 + squareSize / 2;

        this.squares = [];
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const index = i * gridSize + j;
                const x = startX + j * (squareSize + margin);
                const y = startY + i * (squareSize + margin);
                const square = this.add.rectangle(x, y, squareSize, squareSize, 0x000000);

                square.setInteractive({ useHandCursor: true });
                square.on('pointerdown', () => this.handlePlayerInput(index));
                this.squares.push(square);
            }
        }
    }
    
    startRound() {
        this.playerTurn = false;
        this.playerInput = [];
        this.roundText.setText(`Round: ${this.round}`);
        this.showPattern();
    }
    
    showPattern() {
        const patternLength = this.round * this.difficulty.numbersPerRound;
        const pattern = this.sequence.slice(0, patternLength);
        let delay = 0;

        pattern.forEach((squareIndex, i) => {
            this.time.delayedCall(delay, () => {
                const square = this.squares[squareIndex - 1];
                const randomColor = Phaser.Display.Color.RandomRGB().color;
                square.setFillStyle(randomColor); // Highlight
                this.time.delayedCall(this.difficulty.displaySpeed * 1000, () => {
                    square.setFillStyle(0x000000); // Back to black
                    if (i === pattern.length - 1) {
                        this.playerTurn = true;
                    }
                });
            });
            delay += (this.difficulty.displaySpeed * 1000) * 2; // Delay between highlights
        });
    }

    handlePlayerInput(index) {
        if (!this.playerTurn) return;

        const patternLength = this.round * this.difficulty.numbersPerRound;
        const correctIndex = this.sequence[this.playerInput.length] - 1;

        if (index === correctIndex) {
            this.playerInput.push(index + 1);
            
            let pointsPerClick = 10;
            if (this.difficulty.gridSize === 4) pointsPerClick += 2;
            if (this.difficulty.gridSize === 5) pointsPerClick += 5;
            if (this.difficulty.displaySpeed < 0.3) pointsPerClick += 3;
            this.score += pointsPerClick;
            
            this.scoreText.setText(`Score: ${this.score}`);
            this.sound.play('blip');

            // Brief feedback on correct press
            const square = this.squares[index];
            square.setFillStyle(0x00ff00); // Green
            this.time.delayedCall(200, () => {
                square.setFillStyle(0x000000); // Back to black
            });

            if (this.playerInput.length === patternLength) {
                let roundClearBonus = 30;
                if (this.difficulty.numbersPerRound === 2) roundClearBonus += 10;
                if (this.difficulty.numbersPerRound === 3) roundClearBonus += 30;
                if (this.difficulty.displaySpeed < 0.3) roundClearBonus += 3;
                this.score += roundClearBonus;
                
                this.round++;
                this.playerTurn = false;
                this.time.delayedCall(1000, () => this.startRound());
            }
        } else {
            this.scene.start('GameOverScene', { score: this.score });
        }
    }
} 