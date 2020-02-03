declare var require: any;

require('../css/index.css');

import Game from './game';
import { DEBUG } from './constants';

class App {
    private game: Game;
    private gameOverMenu: HTMLElement;
    private newGameBtn: HTMLElement;

    private lastFrame: number;
    private fpsInterval: number;
    private fpsTime = 0;
    private frameCount = 0;
    private fps = 0;

    constructor(game: Game, gameOverMenu: HTMLElement, newGameBtn: HTMLElement) {
        this.game = game;
        this.gameOverMenu = gameOverMenu;
        this.newGameBtn = newGameBtn;
    }

    public setup(): void {
        this.game.init();
        this.lastFrame = Date.now();
        this.gameLoop();
    }

    public restart() {
        this.game.restart();
        this.hideGameOverMenu();
    }

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
        if(this.game.hasEnded() && this.menuIsHidden()) {
            this.showGameOverMenu();
        }
    }

    private menuIsHidden(): boolean {
        return this.gameOverMenu.classList.contains('hide-menu');
    }

    private showGameOverMenu(): void {
        this.gameOverMenu.classList.remove('hide-menu');
    }

    private hideGameOverMenu(): void {
        this.gameOverMenu.classList.add('hide-menu');
    }
}

window.onload = () => {
    const gameMenu = document.getElementById('gameOver');
    const newGameBtn= document.getElementById('newGameBtn');
    const app = new App(new Game(), gameMenu, newGameBtn);
    app.setup();
    newGameBtn.addEventListener('click', () => app.restart());
}
