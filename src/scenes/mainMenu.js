class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    create() {
        // Add background and title
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000).setOrigin(0);
        this.add.text(this.cameras.main.centerX, 100, 'Memory Marathon', {
            fontSize: '48px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Create buttons
        const buttonStyle = {
            fontSize: '24px',
            backgroundColor: '#4a4a4a',
            padding: { x: 20, y: 10 },
            fixedWidth: 200
        };

        // Play button
        const playButton = this.add.text(this.cameras.main.centerX, 250, 'Play Game', buttonStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => playButton.setStyle({ backgroundColor: '#666666' }))
            .on('pointerout', () => playButton.setStyle({ backgroundColor: '#4a4a4a' }))
            .on('pointerdown', () => this.scene.start('GameScene'));

        // Difficulty button
        const difficultyButton = this.add.text(this.cameras.main.centerX, 325, 'Difficulty', buttonStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => difficultyButton.setStyle({ backgroundColor: '#666666' }))
            .on('pointerout', () => difficultyButton.setStyle({ backgroundColor: '#4a4a4a' }))
            .on('pointerdown', () => this.scene.start('DifficultyScene'));

        // Controls button
        const controlsButton = this.add.text(this.cameras.main.centerX, 400, 'Controls', buttonStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => controlsButton.setStyle({ backgroundColor: '#666666' }))
            .on('pointerout', () => controlsButton.setStyle({ backgroundColor: '#4a4a4a' }))
            .on('pointerdown', () => this.scene.start('ControlsScene'));

        // Credits button
        const creditsButton = this.add.text(this.cameras.main.centerX, 475, 'Credits', buttonStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => creditsButton.setStyle({ backgroundColor: '#666666' }))
            .on('pointerout', () => creditsButton.setStyle({ backgroundColor: '#4a4a4a' }))
            .on('pointerdown', () => this.scene.start('CreditsScene'));
    }
} 