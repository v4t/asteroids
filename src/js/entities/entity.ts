import Vector2D from "../utils/vector2d";
import { WIDTH, HEIGHT } from '../game';

export default abstract class Entity {
    public readonly radius: number;
    protected position: Vector2D;
    protected velocity: Vector2D;
    protected direction: number;

    constructor(position: Vector2D, radius: number, velocity: Vector2D, direction: number) {
        this.radius = radius;
        this.position = position;
        this.velocity = velocity;
        this.direction = direction;
    }

    public abstract render(ctx: CanvasRenderingContext2D): void

    public abstract update(): void

    public get x() {
        return this.position.x;
    }

    public get y() {
        return this.position.y;
    }

    public intersectsWith(other: Entity) {
        const distanceX = other.x - this.position.x;
        const distanceY = other.y - this.position.y;
        const magnitude = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        return magnitude < this.radius + other.radius;
    }

    protected handleAreaBoundsCheck(): void {
        // appear on the other side of the screen
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
}