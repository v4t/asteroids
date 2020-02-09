import Entity from './entity';
import Vector2D from '../utils/vector2d';
import Sprite from '../utils/sprite';

// Ufo projectile constants
const PROJECTILE_TTL = 200;
const PROJECTILE_SPEED = 150;
const RADIUS = 5

// Sprite constants
const SPRITE_SOURCE = './assets/ufo-projectile.png';
const SPRITE_FRAMES = 5;
const FRAME_HEIGHT = 15;
const FRAME_WIDTH = 15;
const FRAME_TIME = 3;

export default class UfoProjectile extends Entity {
    /**
     * @var isActive - True, if projectile is still in flight, false otherwise.
     */
    public isActive: boolean = false;

    private ttl: number;
    private frameTimeRemaining: number = FRAME_TIME;
    private readonly sprite: Sprite;

    /**
     *
     * @param start - Starting position of projectile.
     * @param direction - Direction the projectile is travelling in radians.
     */
    constructor(start: Vector2D, direction: number) {
        super({ x: start.x, y: start.y }, RADIUS, { x: PROJECTILE_SPEED, y: PROJECTILE_SPEED }, direction);
        this.isActive = true;
        this.ttl = PROJECTILE_TTL;
        this.sprite = new Sprite(SPRITE_SOURCE, SPRITE_FRAMES, FRAME_WIDTH, FRAME_HEIGHT);
    }

    /**
     * @inheritdoc
     */
    public render(ctx: CanvasRenderingContext2D): void {
        if (!this.isActive) return;

        this.sprite.render(ctx, this.x, this.y);
        if (this.frameTimeRemaining <= 0) {
            this.sprite.setNextFrame();
            this.frameTimeRemaining = FRAME_TIME;
        } else {
            this.frameTimeRemaining--;
        }
        super.drawDebugHelpers(ctx);
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