class ControlsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ControlsScene' });
    }

    create() {
        // Add background
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000).setOrigin(0);

        // Add title
        this.add.text(this.cameras.main.centerX, 100, 'Controls', {
            fontSize: '48px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Add control instructions
        const controlsText = [
            'Click',
        ];

        controlsText.forEach((text, index) => {
            this.add.text(this.cameras.main.centerX, 250 + (index * 50), text, {
                fontSize: '24px',
                color: '#ffffff'
            }).setOrigin(0.5);
        });

        // Back button
        const backButton = this.add.text(this.cameras.main.centerX, 500, 'Back to Menu', {
            fontSize: '24px',
            backgroundColor: '#4a4a4a',
            padding: { x: 20, y: 10 },
            fixedWidth: 200
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => backButton.setStyle({ backgroundColor: '#666666' }))
            .on('pointerout', () => backButton.setStyle({ backgroundColor: '#4a4a4a' }))
            .on('pointerdown', () => this.scene.start('MainMenu'));
    }
} 