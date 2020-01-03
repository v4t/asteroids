import Bullet from './bullet';
import { Key, KEY_STATE } from './controls';

export default class Ship {
    private x: number = 100;
    private y: number = 100;
    private direction: number = 0; // radians

    private xVelocity: number = 0;
    private yVelocity: number = 0;
    private xAcceleration: number = 0;
    private yAcceleration: number = 0;

    private accelerationDirection: number = 0; // radians
    private acceleration: number = 0;

    private bullets: Bullet[];
    private reloadTimer: number = 0;

    constructor() {
        this.bullets = [new Bullet(), new Bullet(), new Bullet(), new Bullet()];
    }

    public render(ctx: CanvasRenderingContext2D): void {
        this.update();
        ctx.strokeStyle = '#f9f9f9'

        ctx.beginPath();
        ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
        const toX = (Math.round(this.x + (15 * Math.cos(this.direction))));
        const toY = (Math.round(this.y + (15 * Math.sin(this.direction))));
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(toX, toY);

        console.log(this.direction)

        ctx.stroke();
        ctx.closePath();

        this.bullets.forEach(b => b.render(ctx));
    }

    public update(): void {
        if (KEY_STATE.has(Key.Left)) this.rotateLeft();
        if (KEY_STATE.has(Key.Right)) this.rotateRight();
        if (KEY_STATE.has(Key.Shoot)) this.fire();
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
        this.xVelocity *= 0.995;
        this.yVelocity *= 0.995;
        if (this.xVelocity < 0.01 && this.xVelocity > -0.01) this.xVelocity = 0;
        if (this.yVelocity < 0.01 && this.yVelocity > -0.01) this.yVelocity = 0;

        // apply max velocity limit
        if (this.xVelocity > 4) this.xVelocity = 4;
        if (this.yVelocity > 4) this.yVelocity = 4;
        if (this.xVelocity < -4) this.xVelocity = -4;
        if (this.yVelocity < -4) this.yVelocity = -4;

        this.bullets.forEach(b => b.update());

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
        this.direction = (this.direction - 0.05)
    }

    public rotateRight(): void {
        this.direction = (this.direction + 0.05)
    }

    public accelerate(isAccelerating: boolean): void {
        if (isAccelerating) {
            this.accelerationDirection = this.direction;
            this.acceleration = 0.04
        } else {
            this.acceleration = 0;
        }
    }

    public fire(): void {
        if(this.reloadTimer > 0) {
            this.reloadTimer -= 1;
            return;
        }
        const availableBullet = this.bullets.find(b => !b.isActive);
        if(availableBullet !== undefined) {
            availableBullet.fire(this.direction, this.x, this.y);
            this.reloadTimer = 20;
        }
    }
}