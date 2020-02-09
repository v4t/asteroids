import Vector2D from '../utils/vector2d';
import { WIDTH, HEIGHT, DEBUG, OBJECT_COLOR } from '../game/constants';

export default abstract class Entity {
    /**
     * @var radius - Radius of entity's bounding circle.
     */
    public readonly radius: number;

    /**
     * @var position - Entity's current position.
     */
    protected position: Vector2D;

    /**
     * @var velocity - Entity's current velocity (pixels per second).
     */
    protected velocity: Vector2D;

    /**
     * @var direction - Entity's current direction (radians)
     */
    protected direction: number;

    /**
     * @param position - Entity's position vector.
     * @param radius  - Radius for entity's bounding circle.
     * @param velocity - Entity's velocity (pixels per second).
     * @param direction - Entity's direction (radians).
     */
    constructor(position: Vector2D, radius: number, velocity: Vector2D, direction: number) {
        this.radius = radius;
        this.position = position;
        this.velocity = velocity;
        this.direction = direction;
    }

    /**
     * Render entity on given canvas.
     *
     * @param ctx - Canvas context
     */
    public abstract render(ctx: CanvasRenderingContext2D): void

    /**
     * Update entity state.
     *
     * @param delta Change in time between last and current frame.
     */
    public abstract update(delta: number): void

    /**
     * @return - Current x-coordinate of entity.
     */
    public get x(): number {
        return this.position.x;
    }

    /**
     * @return - Current y-coordinate of entity.
     */
    public get y(): number {
        return this.position.y;
    }

    /**
     * Check if entity's bounding circle intersects with another entity.
     *
     * @param other - Some other entity.
     * @return - True if the bounding circles intersect, false otherwise.
     */
    public intersectsWith(other: Entity): boolean {
        const distanceX = other.x - this.position.x;
        const distanceY = other.y - this.position.y;
        const magnitude = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        return magnitude < this.radius + other.radius;
    }

    /**
     * Make the entity appear on the other side of the screen
     * when it crosses screen bounds.
     */
    protected handleAreaBoundsCheck(): void {
        if (this.position.x <= 0) {
            this.position.x = WIDTH - 1;
        }
        if (this.position.y <= 0) {
            this.position.y = HEIGHT - 1;
        }
        if (this.position.x >= WIDTH) {
            this.position.x = 1;
        }
        if (this.position.y >= HEIGHT) {
            this.position.y = 1;
        }
    }

    /**
     * Draw entity's bounding circle and direction for debugging purposes.
     * @param ctx - Canvas context
     */
    protected drawDebugHelpers(ctx: CanvasRenderingContext2D) {
        if (!DEBUG) return;

        ctx.strokeStyle = OBJECT_COLOR
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        const toX = (Math.round(this.position.x + (this.radius * Math.cos(this.direction))));
        const toY = (Math.round(this.position.y + (this.radius * Math.sin(this.direction))));
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        ctx.closePath();
    }
}