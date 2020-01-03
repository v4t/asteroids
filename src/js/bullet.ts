export default class Bullet {
    public isActive: boolean = false;
    private x: number;
    private y: number;
    private direction: number; // radians
    private velocity: number = 8;

    private ttl: number;

    constructor() {
    }

    public fire(direction: number, x: number, y: number): void {
        this.isActive = true;
        this.direction = direction;
        this.x = x;
        this.y = y;
        this.ttl = 60;
        console.log(direction);
    }

    public render(ctx: CanvasRenderingContext2D): void {
        if (!this.isActive) return;
        ctx.fillStyle = '#f9f9f9'

        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    public update(): void {
        if(!this.isActive) return;
        this.ttl -= 1;
         if(this.ttl === 0) this.isActive = false;

        this.x += (Math.cos(this.direction) * this.velocity);
        this.y += (Math.sin(this.direction) * this.velocity);

        // appear on the other side of the screen
        if (this.x <= 0) {
            this.x = 799;
        }
        if (this.y <= 0) {
            this.y = 599;
        }
        if (this.x >= 800) {
            this.x = 1;
        }
        if (this.y >= 600) {
            this.y = 1;
        }
    }
}