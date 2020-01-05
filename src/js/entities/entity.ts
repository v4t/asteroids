import Vector2D from "../utils/vector2d";

export default abstract class Entity {
    protected position: Vector2D;
    protected velocity: Vector2D;
    protected direction: number;

    constructor(position: Vector2D, velocity: Vector2D, direction: number) {
        this.position = position;
        this.velocity = velocity;
        this.direction = direction;
    }

    public abstract render(ctx: CanvasRenderingContext2D): void

    public abstract update(): void

    protected handleAreaBoundsCheck(): void {
        // appear on the other side of the screen
        if (this.position.x <= 0) {
            this.position.x = 799;
        }
        if (this.position.y <= 0) {
            this.position.y = 599;
        }
        if (this.position.x >= 800) {
            this.position.x = 1;
        }
        if (this.position.y >= 600) {
            this.position.y = 1;
        }
    }
}