import Ship from './ship';

export default class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private height: number = 600;
    private width: number = 800;

    private ship: Ship = new Ship();

    constructor() {
        document.addEventListener('keydown', this.keyDownListener)
        document.addEventListener('keyup', this.keyUpListener)
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

    private keyDownListener = (event: KeyboardEvent) => {
        if (event.key === 'ArrowUp' || event.key === 'w') {
            this.ship.accelerate(true);
        }
        if(event.key === 'ArrowLeft' || event.key === 'a') {
            this.ship.rotateLeft();
        }
        if (event.key === 'ArrowRight' || event.key === 'd') {
            this.ship.rotateRight();
        }
    }

    private keyUpListener = (event: KeyboardEvent) => {
        if (event.key === 'ArrowUp' || event.key === 'w') {
            this.ship.accelerate(false);
        }
    }
}