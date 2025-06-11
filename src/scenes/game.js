class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.squares = [];
        this.round = 1;
        this.roundText = null;
    }

    create() {
        const squareSize = 100;
        const margin = 10;
        const gridSize = 3;
        const gridWidth = gridSize * squareSize + (gridSize - 1) * margin;
        const startX = (this.cameras.main.width - gridWidth) / 2 + squareSize / 2;
        const startY = (this.cameras.main.height - gridWidth) / 2 + squareSize / 2;

        this.squares = [];
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const x = startX + j * (squareSize + margin);
                const y = startY + i * (squareSize + margin);
                const square = this.add.rectangle(x, y, squareSize, squareSize, 0x000000);

                square.setInteractive({ useHandCursor: true });
                square.on('pointerdown', () => {
                    const randomColor = Phaser.Display.Color.RandomRGB().color;
                    square.setFillStyle(randomColor);
                });
                this.squares.push(square);
            }
        }

        // Round text
        this.roundText = this.add.text(this.cameras.main.centerX, 30, `Round: ${this.round}`, {
            fontSize: '24px',
            color: '#000000'
        }).setOrigin(0.5);

        const nextRoundButton = this.add.text(this.cameras.main.centerX, this.cameras.main.height - 30, 'Next Round', {
            fontSize: '24px',
            backgroundColor: '#4a4a4a',
            color: '#ffffff',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => nextRoundButton.setStyle({ backgroundColor: '#666666' }))
            .on('pointerout', () => nextRoundButton.setStyle({ backgroundColor: '#4a4a4a' }))
            .on('pointerdown', () => this.startNewRound());

        // Back to menu button
        const menuButton = this.add.text(10, 10, 'Menu', {
            fontSize: '24px',
            backgroundColor: '#4a4a4a',
            padding: { x: 20, y: 10 }
        })
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => menuButton.setStyle({ backgroundColor: '#666666' }))
            .on('pointerout', () => menuButton.setStyle({ backgroundColor: '#4a4a4a' }))
            .on('pointerdown', () => this.scene.start('MainMenu'));
    }

    startNewRound() {
        this.round++;
        this.roundText.setText(`Round: ${this.round}`);

        this.squares.forEach(square => {
            square.setFillStyle(0x000000);
        });
    }
} 