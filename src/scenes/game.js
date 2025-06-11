class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Add background
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x333333).setOrigin(0);

        // Add some game text
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Game Scene', {
            fontSize: '32px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

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
} 