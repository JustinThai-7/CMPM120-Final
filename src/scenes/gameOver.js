class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.finalScore = data.score;
    }

    create() {
        // Add background
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000).setOrigin(0);

        // Add title
        this.add.text(this.cameras.main.centerX, 100, 'Game Over', {
            fontSize: '48px',
            color: '#ff0000'
        }).setOrigin(0.5);

        // Display final score
        this.add.text(this.cameras.main.centerX, 200, `Your Score: ${this.finalScore}`, {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);


        const buttonStyle = {
            fontSize: '24px',
            backgroundColor: '#4a4a4a',
            padding: { x: 20, y: 10 },
            fixedWidth: 200
        };

        // Play Again button
        const playAgainButton = this.add.text(this.cameras.main.centerX, 350, 'Play Again', buttonStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => playAgainButton.setStyle({ backgroundColor: '#666666' }))
            .on('pointerout', () => playAgainButton.setStyle({ backgroundColor: '#4a4a4a' }))
            .on('pointerdown', () => this.scene.start('GameScene'));

        // Main Menu button
        const menuButton = this.add.text(this.cameras.main.centerX, 450, 'Main Menu', buttonStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => menuButton.setStyle({ backgroundColor: '#666666' }))
            .on('pointerout', () => menuButton.setStyle({ backgroundColor: '#4a4a4a' }))
            .on('pointerdown', () => this.scene.start('MainMenu'));
    }
} 