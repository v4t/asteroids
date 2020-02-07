import Entity from "./entity";
import Vector2D from "../utils/vector2d";
import Sprite from "../utils/sprite";

const PROJECTILE_TTL = 200;
const PROJECTILE_SPEED = 150;
const SPRITE_SOURCE = '../assets/ufo-projectile.png';
const SPRITE_FRAMES = 5;
const FRAME_HEIGHT = 15;
const FRAME_WIDTH = 15;
const FRAME_TIME = 3;

export default class UfoProjectile extends Entity {
    public isActive: boolean = false;

    private ttl: number;
    private frameTimeRemaining: number = FRAME_TIME;
    private readonly sprite: Sprite;

    constructor(source: Vector2D, direction: number) {
        super({ x: source.x, y: source.y }, 5, { x: PROJECTILE_SPEED, y: PROJECTILE_SPEED }, direction);
        this.isActive = true;
        this.ttl = PROJECTILE_TTL;

        this.sprite = new Sprite(SPRITE_SOURCE, SPRITE_FRAMES, FRAME_WIDTH, FRAME_HEIGHT);
    }

    public render(ctx: CanvasRenderingContext2D): void {
        if (!this.isActive) return;

        this.sprite.render(ctx, this.x, this.y);
        if (this.frameTimeRemaining <= 0) {
            this.sprite.setNextFrame();
            this.frameTimeRemaining = FRAME_TIME;
        } else {
            this.frameTimeRemaining--;
        }
        this.drawDebugHelpers(ctx);
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