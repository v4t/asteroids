declare var require: any;

require('../css/index.css');

import Game from './game/game';
import { DEBUG } from './game/constants';

class App {
    private game: Game;

    // Game over menu
    private gameOverMenu: HTMLElement;
    private levelResult: HTMLElement;
    private scoreResult: HTMLElement;
    private newGameBtn: HTMLElement;

    // FPS variables
    private lastFrame: number;
    private fpsInterval: number;
    private fpsTime = 0;
    private frameCount = 0;
    private fps = 0;

    /**
     * @param game - Game engine.
     */
    constructor(game: Game) {
        this.game = game;
    }

    /**
     * Initialize the application.
     */
    public setup(): void {
        this.gameOverMenu = document.getElementById('gameOver');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.levelResult = document.getElementById('levelResult');
        this.scoreResult = document.getElementById('scoreResult');
        this.newGameBtn.addEventListener('click', () => this.restart());

        this.game.init();
        this.lastFrame = Date.now();
        this.gameLoop();
    }

    /**
     * Handle restart button click.
     */
    public restart() {
        this.game.restart();
        this.hideGameOverMenu();
    }

    /**
     * Application loop, calculates FPS and calls the game engine updates.
     */
    private gameLoop(): void {
        requestAnimationFrame(this.gameLoop.bind(this));

        const now = Date.now();
        const elapsed = now - this.lastFrame;
        const deltaTime = elapsed / 1000;
        this.lastFrame = now - (elapsed & this.fpsInterval);

        if (DEBUG && this.fpsTime > 0.25) {
            console.log('FPS:', this.fps);
            this.fps = Math.round(this.frameCount / this.fpsTime)
            this.fpsTime = 0;
            this.frameCount = 0;
        }
        this.fpsTime += deltaTime;
        this.frameCount++;

        this.game.update(deltaTime);
        this.game.render();
        if (this.game.hasEnded() && this.menuIsHidden()) {
            this.showGameOverMenu();
        }
    }

    /**
     * @return - True if game over menu is currently hidden, false otherwise.
     */
    private menuIsHidden(): boolean {
        return this.gameOverMenu.classList.contains('hide-menu');
    }

    /**
     * Hide the game over menu when game is active.
     */
    private hideGameOverMenu(): void {
        this.gameOverMenu.classList.add('hide-menu');
    }

    /**
     * Show the game over menu when the game ends.
     */
    private showGameOverMenu(): void {
        const stats = this.game.getGameStats();
        this.levelResult.textContent = `You reached level ${stats.level}.`;
        this.scoreResult.textContent =  `Final score was ${stats.score}.`;
        this.gameOverMenu.classList.remove('hide-menu');
    }
}

window.onload = () => {
    const app = new App(new Game());
    app.setup();
}
