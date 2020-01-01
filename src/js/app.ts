declare var require: any;

require('../css/index.css');

import Game from './game';


class App {
    private lastFrame: number;
    private fpsInterval: number;
    private _game: Game;

    private fpsTime = 0;
    private frameCount = 0;
    private fps = 0;

    constructor(game: Game) {
        this._game = game;
    }

    public setup(): void {
        this._game.init();
        this.lastFrame = Date.now();
        this.gameLoop();
    }

    private gameLoop(): void {
        requestAnimationFrame(this.gameLoop.bind(this));

        const now = Date.now();
        const elapsed = now - this.lastFrame;
        const deltaTime = elapsed / 1000;
        this.lastFrame = now - (elapsed & this.fpsInterval);

        if(this.fpsTime > 0.25) {
            console.log('FPS:', this.fps);
            this.fps = Math.round(this.frameCount / this.fpsTime)
            this.fpsTime = 0;
            this.frameCount = 0;
        }
        this.fpsTime += deltaTime;
        this.frameCount++;

        this._game.update(deltaTime);
        this._game.render();
    }
}

window.onload = () => {
    let app = new App(new Game());
    app.setup();
}