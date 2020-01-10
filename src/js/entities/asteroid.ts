import Entity from "./entity";
import Vector2D from "../utils/vector2d";

export enum AsteroidCategory {
    Small,
    Medium,
    Large,
}

export default class Asteroid extends Entity {

    public readonly category: AsteroidCategory;

    constructor(x: number, y: number, category: AsteroidCategory) {
        let size: number;
        let velocity: Vector2D;
        switch (category) {
            case AsteroidCategory.Small:
                size = 20;
                velocity = new Vector2D(1.3, 1.3);
                break;
                case AsteroidCategory.Medium:
                size = 40;
                velocity = new Vector2D(1.15, 1.15);
                break;
            case AsteroidCategory.Large:
            default:
                size = 60;
                velocity = new Vector2D(1,1);
        }
        super(new Vector2D(x, y), size, velocity, Math.floor(Math.random() * 360));
        this.category = category;
    }

    public render(ctx: CanvasRenderingContext2D): void {
        this.update();
        ctx.strokeStyle = '#f9f9f9'

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.moveTo(this.position.x, this.position.y);

        ctx.stroke();
        ctx.closePath();
    }

    public update(): void {
        this.position.x += (Math.cos(this.direction * Math.PI / 180) * this.velocity.x);
        this.position.y += (Math.sin(this.direction * Math.PI / 180) * this.velocity.y);

        this.handleAreaBoundsCheck();
    }
}