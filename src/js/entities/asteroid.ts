import Entity from "./entity";
import Sprite from '../utils/sprite';
import Vector2D from "../utils/vector2d";

const SPRITE_SOURCE = '../assets/asteroids.png';
const SPRITE_FRAMES = 6;
const FRAME_HEIGHT = 111;
const FRAME_WIDTH = 111;

export enum AsteroidCategory {
    Small,
    Medium,
    Large,
}

export default class Asteroid extends Entity {

    public readonly category: AsteroidCategory;

    private readonly sprite: Sprite;

    constructor(x: number, y: number, category: AsteroidCategory) {
        let size: number;
        let velocity: Vector2D; // pixels per second
        let frame = 0;
        switch (category) {
            case AsteroidCategory.Small:
                size = 20;
                let i = Math.random() * 150 + 50
                frame = Math.floor(Math.random() * 2) + 4
                velocity = new Vector2D(i, i);
                break;
            case AsteroidCategory.Medium:
                frame = Math.floor(Math.random() * 2) + 2
                let j = Math.random() * 100 + 50
                size = 40;
                velocity = new Vector2D(j, j);
                break;
            case AsteroidCategory.Large:
            default:
                frame = Math.floor(Math.random() * 2)
                size = 60;
                let k = Math.random() * 50 + 50
                velocity = new Vector2D(k, k);
        }
        super(new Vector2D(x, y), size, velocity, Math.floor(Math.random() * (2 * Math.PI)));
        this.sprite = new Sprite(SPRITE_SOURCE, SPRITE_FRAMES, FRAME_WIDTH, FRAME_HEIGHT);
        this.sprite.setFrame(frame);
        this.category = category;
    }

    public render(ctx: CanvasRenderingContext2D): void {
        this.sprite.render(ctx, this.x, this.y);
        this.sprite.rotate(0.002);
        this.drawDebugHelpers(ctx);
    }

    public update(delta: number): void {
        this.position.x += (Math.cos(this.direction) * this.velocity.x * delta);
        this.position.y += (Math.sin(this.direction) * this.velocity.y * delta);

        this.handleAreaBoundsCheck();
    }
}