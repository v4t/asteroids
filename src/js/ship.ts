import { Key, KEY_STATE } from './controls';

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
        ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
        const toX = (Math.round(this.x + (15 * Math.cos(this.rotationDegrees))));
        const toY = (Math.round(this.y + (15 * Math.sin(this.rotationDegrees))));
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(toX, toY);

        ctx.stroke();
        ctx.closePath();

    }

    public update(): void {
        if (KEY_STATE.has(Key.Left)) this.rotateLeft();
        if (KEY_STATE.has(Key.Right)) this.rotateRight();
        this.accelerate(KEY_STATE.has(Key.Throttle));

        this.xAcceleration += Math.cos(this.accelerationDirection) * this.acceleration
        this.yAcceleration += Math.sin(this.accelerationDirection) * this.acceleration

        this.xVelocity += this.xAcceleration;
        this.yVelocity += this.yAcceleration;

        this.xAcceleration = 0;
        this.yAcceleration = 0;

        this.x += this.xVelocity;
        this.y += this.yVelocity;

        // apply friction
        this.xVelocity *= 0.99;
        this.yVelocity *= 0.99;
        if (this.xVelocity < 0.01 && this.xVelocity > -0.01) this.xVelocity = 0;
        if (this.yVelocity < 0.01 && this.yVelocity > -0.01) this.yVelocity = 0;

        // apply max velocity limit
        if (this.xVelocity > 5) this.xVelocity = 5;
        if (this.yVelocity > 5) this.yVelocity = 5;
        if (this.xVelocity < -5) this.xVelocity = -5;
        if (this.yVelocity < -5) this.yVelocity = -5;

        console.log(this.xVelocity, this.yVelocity, this.acceleration);

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

    public rotateLeft(): void {
        this.rotationDegrees = (this.rotationDegrees - 0.04)
    }

    public rotateRight(): void {
        this.rotationDegrees = (this.rotationDegrees + 0.04)
    }

    public accelerate(isAccelerating: boolean): void {
        if (isAccelerating) {
            this.accelerationDirection = this.rotationDegrees;
            this.acceleration = 0.05
        } else {
            this.acceleration = 0;
        }
    }
}