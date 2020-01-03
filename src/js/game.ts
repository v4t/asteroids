import Ship from './ship';
import Asteroid from './asteroid';
import { keyDownListener, keyUpListener } from './controls';

const WIDTH = 800;
const HEIGHT = 600;

export default class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private height: number = HEIGHT;
    private width: number = WIDTH;

    private ship: Ship = new Ship();
    private asteroids: Asteroid[] = []

    private lastFrame: number = 0;
    private fpsTime: number = 0;
    private frameCount: number = 0;
    private fps: number = 0;

    constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d");
    }

    public init(): void {
        document.addEventListener('keydown', keyDownListener)
        document.addEventListener('keyup', keyUpListener)

        this.asteroids = [new Asteroid(), new Asteroid(), new Asteroid()]
    }

    public update(deltaTime: number): void {

    }

    public render(): void {
        this.ctx.fillStyle = '#020202';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ship.update();
        this.ship.render(this.ctx);

        this.asteroids.forEach(a => {
            a.update();
            a.render(this.ctx);
        })
    }
}