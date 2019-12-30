export default class Ship {
    private x: number = 100;
    private y: number = 100;
    private rotationDegrees: number = 0;

    private xVelocity: number = 0;
    private yVelocity: number = 0;
    private xAcceleration: number = 0;
    private yAcceleration: number = 0;

    private accelerationDirection: number = 0;
    private acceleration: number = 0;

    constructor() {
    }

    public render(ctx: CanvasRenderingContext2D): void {
        this.update();
        ctx.strokeStyle = '#f9f9f9'

        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
        const toX = (Math.round(this.x + (10 * Math.cos(this.rotationDegrees))));
        const toY = (Math.round(this.y + (10 * Math.sin(this.rotationDegrees))));
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(toX, toY);

        ctx.stroke();
        ctx.closePath();

    }

    public update(): void {
        this.xAcceleration = Math.cos(this.accelerationDirection) * this.acceleration
        this.yAcceleration = Math.sin(this.accelerationDirection) * this.acceleration

        this.xVelocity += this.xAcceleration;
        this.yVelocity += this.yAcceleration;

        this.x = this.x+ this.xVelocity;
        this.y += this.yVelocity;

        if (this.xVelocity > 1) this.xVelocity = 1;
        if (this.yVelocity > 1) this.yVelocity = 1;
        if (this.xVelocity < -1) this.xVelocity = -1;
        if (this.yVelocity < -1) this.yVelocity = -1;

        if (this.x <= 0) {
            this.x = 799;
        }
        if (this.y <= 0) {
            this.y = 599;
        }
        if(this.x >= 800) {
            this.x = 1;
        }
        if(this.y >= 600) {
            this.y = 1;
        }
    }

    public rotateLeft(): void {
        this.rotationDegrees = (this.rotationDegrees - 0.2)
    }

    public rotateRight(): void {
        this.rotationDegrees = (this.rotationDegrees + 0.2)
    }

    public accelerate(isAccelerating: boolean): void {
        if(isAccelerating) {
            this.acceleration = 0.01;
            this.accelerationDirection = this.rotationDegrees;
        } else {
            this.acceleration = 0;
        }
    }
}