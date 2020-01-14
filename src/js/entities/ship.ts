import Entity from './entity';
import Bullet from './bullet';
import Vector2D from '../utils/vector2d';
import { Key, KEY_STATE } from '../controls';

export default class Ship extends Entity {
    public bullets: Bullet[];
    private acceleration: Vector2D;
    private thrust: number = 0;
    private reloadTimer: number = 0;

    constructor() {
        super(new Vector2D(400, 300), 15, new Vector2D(0, 0), 0);
        this.acceleration = new Vector2D(0, 0);
        this.bullets = [new Bullet(this), new Bullet(this), new Bullet(this), new Bullet(this)];
    }

    public render(ctx: CanvasRenderingContext2D): void {
        this.update();
        ctx.strokeStyle = '#f9f9f9'

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 15, 0, Math.PI * 2);
        const toX = (Math.round(this.position.x + (15 * Math.cos(this.direction))));
        const toY = (Math.round(this.position.y + (15 * Math.sin(this.direction))));
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(toX, toY);


        ctx.stroke();
        ctx.closePath();

        this.bullets.forEach(b => b.render(ctx));
    }

    public update(): void {
        if (KEY_STATE.has(Key.Left)) this.rotateLeft();
        if (KEY_STATE.has(Key.Right)) this.rotateRight();
        if (KEY_STATE.has(Key.Shoot)) this.fire();
        if (KEY_STATE.has(Key.Throttle)) {
            this.thrust = 0.04;
        } else {
            this.thrust = 0;
        }

        this.acceleration.add(new Vector2D(
            Math.cos(this.direction) * this.thrust,
            Math.sin(this.direction) * this.thrust
        ))
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);

        this.acceleration.x = 0;
        this.acceleration.y = 0;

        // apply friction
        this.velocity.x *= 0.995;
        this.velocity.y *= 0.995;
        if (this.velocity.x < 0.01 && this.velocity.x > -0.01) this.velocity.x = 0;
        if (this.velocity.y < 0.01 && this.velocity.y > -0.01) this.velocity.y = 0;

        // apply maxvelocity  limit
        if (this.velocity.x > 4) this.velocity.x = 4;
        if (this.velocity.y > 4) this.velocity.y = 4;
        if (this.velocity.x < -4) this.velocity.x = -4;
        if (this.velocity.y < -4) this.velocity.y = -4;

        this.handleAreaBoundsCheck();
    }

    public rotateLeft(): void {
        this.direction = (this.direction - 0.05)
    }

    public rotateRight(): void {
        this.direction = (this.direction + 0.05)
    }

    public fire(): void {
        if (this.reloadTimer > 0) {
            this.reloadTimer -= 1;
            return;
        }
        const availableBullet = this.bullets.find(b => !b.isActive);
        if (availableBullet !== undefined) {
            availableBullet.fire(this.direction, this.position.x, this.position.y);
            this.reloadTimer = 20;
        }
    }
}