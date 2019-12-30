import Ship from './ship';
import {keyDownListener, keyUpListener} from './controls';

export default class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private height: number = 600;
    private width: number = 800;

    private ship: Ship = new Ship();

    constructor() {
        document.addEventListener('keydown', keyDownListener)
        document.addEventListener('keyup', keyUpListener)
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d");
    }


    public render(): void {
        this.ctx.fillStyle = '#020202';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ship.update();
        this.ship.render(this.ctx);
    }
}