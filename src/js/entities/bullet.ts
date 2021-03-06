import Entity from './entity';
import { OBJECT_COLOR } from '../game/constants';

// Bullet constants
const BULLET_TTL = 30;
const VELOCITY = 1000;
const RADIUS = 2;

export default class Bullet extends Entity {
    public isActive: boolean = false;

    private ttl: number;

    constructor() {
        super({ x: 0, y: 0 }, RADIUS, { x: VELOCITY, y: VELOCITY }, 0);
    }

    /**
     * Fire a new bullet from given position into given direction.
     *
     * @param direction - Bullet's travel direction in radians.
     * @param x - X-coordinate of bullet's starting position.
     * @param y - Y-coordinate of bullet's starting position.
     */
    public fire(direction: number, x: number, y: number): void {
        this.isActive = true;
        this.direction = direction;
        this.position.x = x;
        this.position.y = y;
        this.ttl = BULLET_TTL;
    }

    /**
     * @inheritdoc
     */
    public render(ctx: CanvasRenderingContext2D): void {
        if (!this.isActive) return;
        ctx.fillStyle = OBJECT_COLOR;

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    /**
     * @inheritdoc
     */
    public update(delta: number): void {
        if (!this.isActive) return;
        this.ttl -= 1;
        if (this.ttl <= 0) this.isActive = false;

        this.position.x += (Math.cos(this.direction) * this.velocity.x * delta);
        this.position.y += (Math.sin(this.direction) * this.velocity.y * delta);

        // appear on the other side of the screen
        super.handleAreaBoundsCheck();
    }
}