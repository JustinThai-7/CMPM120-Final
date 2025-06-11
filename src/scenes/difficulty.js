class DifficultyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DifficultyScene' });
    }

    create() {
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000).setOrigin(0);
        this.add.text(this.cameras.main.centerX, 50, 'Difficulty Settings', {
            fontSize: '48px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Grid Size
        this.add.text(this.cameras.main.centerX, 150, 'Grid Size', { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);
        const gridSizeOptions = ['3x3', '4x4', '5x5'];
        this.gridSize = this.createSelector(gridSizeOptions, 200, 'gridSize', '3x3');

        // Numbers per Round
        this.add.text(this.cameras.main.centerX, 250, 'Numbers per Round', { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);
        const numbersPerRoundOptions = ['1', '2', '3'];
        this.numbersPerRound = this.createSelector(numbersPerRoundOptions, 300, 'numbersPerRound', '1');

        // Display Speed
        this.add.text(this.cameras.main.centerX, 350, 'Display Speed', { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);
        const displaySpeedOptions = ['Normal', 'Fast'];
        this.displaySpeed = this.createSelector(displaySpeedOptions, 400, 'displaySpeed', 'Normal');

        // Back to Menu button
        const backButton = this.add.text(this.cameras.main.centerX, 500, 'Back to Menu', {
            fontSize: '24px',
            backgroundColor: '#4a4a4a',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.scene.start('MainMenu'));
    }

    createSelector(options, y, settingKey, defaultValue) {
        const selector = {
            options: options,
            currentIndex: options.indexOf(defaultValue),
            text: null
        };

        const leftArrow = this.add.text(this.cameras.main.centerX - 100, y, '<', { fontSize: '32px', color: '#ffffff' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                selector.currentIndex = (selector.currentIndex - 1 + options.length) % options.length;
                this.updateSelectorText(selector);
                this.updateDifficulty();
            });

        selector.text = this.add.text(this.cameras.main.centerX, y, options[selector.currentIndex], { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);

        const rightArrow = this.add.text(this.cameras.main.centerX + 100, y, '>', { fontSize: '32px', color: '#ffffff' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                selector.currentIndex = (selector.currentIndex + 1) % options.length;
                this.updateSelectorText(selector);
                this.updateDifficulty();
            });

        return selector;
    }

    updateSelectorText(selector) {
        selector.text.setText(selector.options[selector.currentIndex]);
    }

    updateDifficulty() {
        const gridSize = parseInt(this.gridSize.options[this.gridSize.currentIndex].split('x')[0]);
        const numbersPerRound = parseInt(this.numbersPerRound.options[this.numbersPerRound.currentIndex]);
        const displaySpeed = this.displaySpeed.options[this.displaySpeed.currentIndex] === 'Fast' ? 0.2 : 0.3;

        // Store settings globally or in the registry
        this.registry.set('difficulty', {
            gridSize: gridSize,
            numbersPerRound: numbersPerRound,
            displaySpeed: displaySpeed
        });
    }
} 