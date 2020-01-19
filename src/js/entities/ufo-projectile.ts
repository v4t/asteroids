import Entity from "./entity";
import Vector2D from "../utils/vector2d";

const PROJECTILE_TTL = 150;

export default class UfoProjectile extends Entity {
    public isActive: boolean = false;

    private ttl: number;

    constructor(source: Vector2D, direction: number) {
        super(new Vector2D(source.x, source.y), 5, new Vector2D(250, 250), direction);
        this.isActive = true;
        this.ttl = PROJECTILE_TTL;
    }

    public render(ctx: CanvasRenderingContext2D): void {
        if (!this.isActive) return;
        ctx.fillStyle = '#ff6e33'

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    public update(delta: number): void {
        if (!this.isActive) return;
        this.ttl -= 1;
        if (this.ttl <= 0) this.isActive = false;

        this.position.x += (Math.cos(this.direction) * this.velocity.x * delta);
        this.position.y += (Math.sin(this.direction) * this.velocity.y * delta);

        // appear on the other side of the screen
        this.handleAreaBoundsCheck();
    }
}