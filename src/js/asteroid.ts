export default class Asteroid {
    private x: number = 500;
    private y: number = 500;

    private direction: number = Math.floor(Math.random() * 360);
    private velocity: number = 1;

    constructor() {
    }

    public render(ctx: CanvasRenderingContext2D): void {
        this.update();
        ctx.strokeStyle = '#f9f9f9'

        ctx.beginPath();
        ctx.arc(this.x, this.y, 60, 0, Math.PI * 2);
        ctx.moveTo(this.x, this.y);

        ctx.stroke();
        ctx.closePath();
    }

    public update(): void {
        this.x += (Math.cos(this.direction * Math.PI / 180) * this.velocity);
        this.y += (Math.sin(this.direction * Math.PI / 180) * this.velocity);

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