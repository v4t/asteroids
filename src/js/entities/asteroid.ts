import Entity from "./entity";
import Vector2D from "../utils/vector2d";

export enum AsteroidCategory {
    Small,
    Medium,
    Large,
}

export default class Asteroid extends Entity {

    private rotation: number;
    public readonly category: AsteroidCategory;
    private readonly sprite: HTMLImageElement;

    constructor(x: number, y: number, category: AsteroidCategory) {
        let size: number;
        let velocity: Vector2D; // pixels per second
        switch (category) {
            case AsteroidCategory.Small:
                size = 20;
                let i = Math.random() * 150 + 50
                velocity = new Vector2D(i, i);
                break;
            case AsteroidCategory.Medium:
                let j = Math.random() * 100 + 50
                size = 40;
                velocity = new Vector2D(j, j);
                break;
            case AsteroidCategory.Large:
            default:
                size = 60;
                let k = Math.random() * 50 + 50
                velocity = new Vector2D(k, k);
        }
        super(new Vector2D(x, y), size, velocity, Math.floor(Math.random() * (2 * Math.PI)));
        this.sprite = new Image();
        this.sprite.src = '../assets/asteroids.png'
        this.category = category;
        this.rotation = 0;
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.save();


        ctx.strokeStyle = '#f9f9f9'

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.moveTo(this.position.x, this.position.y);

        // move to the middle of where we want to draw our image
        ctx.translate(this.x, this.y);

        // rotate around that point, converting our
        // angle from degrees to radians
        ctx.rotate(this.rotation * (Math.PI / 180));

        // draw it up and to the left by half the width
        // and height of the image
        ctx.drawImage(this.sprite, -55, -55);

        ctx.stroke();
        ctx.closePath();

        ctx.restore();
        this.rotation += 0.2;
    }

    public update(delta: number): void {
        this.position.x += (Math.cos(this.direction) * this.velocity.x * delta);
        this.position.y += (Math.sin(this.direction) * this.velocity.y * delta);

        this.handleAreaBoundsCheck();
    }
}