import Entity from "./entity";
import Vector2D from "../utils/vector2d";

export enum AsteroidCategory {
    Small,
    Medium,
    Large,
}

const ASTEROID_PROPERTIES = {
    Small : 'foo',
    Medium : 'bar',
    Large : 'baz',
}

export default class Asteroid extends Entity {

    public readonly category: AsteroidCategory;

    constructor(x: number, y:number, category: AsteroidCategory) {
        super(new Vector2D(x, y), 60, new Vector2D(1, 1), Math.floor(Math.random() * 360));
        this.category = category;
    }

    public render(ctx: CanvasRenderingContext2D): void {
        this.update();
        ctx.strokeStyle = '#f9f9f9'

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 60, 0, Math.PI * 2);
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