import Entity from './entity';
import UfoProjectile from './ufo-projectile';
import Sprite from '../utils/sprite';

// Ufo constants
const VELOCITY = 100;
const RADIUS = 15;
const RELOAD_TIMER= 240;

// Sprite constants
const SPRITE_SOURCE = '../assets/ufo.png';
const SPRITE_FRAMES = 1;
const FRAME_HEIGHT = 31;
const FRAME_WIDTH = 31;

export default class Ufo extends Entity {
    private readonly target: Entity;
    private readonly sprite: Sprite;
    private reloadTimer = 0;

    /**
     * @param x - Ufo's x-coordinate.
     * @param y - Ufo's y-coordinate.
     * @param target - The target entity ufo is firing at.
     */
    constructor(x: number, y: number, target: Entity) {
        super({x, y}, RADIUS, {x: VELOCITY, y: VELOCITY}, Math.random() * (2 * Math.PI));
        this.target = target;
        this.sprite = new Sprite(SPRITE_SOURCE, SPRITE_FRAMES, FRAME_WIDTH, FRAME_HEIGHT);
    }

    /**
     * @inheritdoc
     */
    public render(ctx: CanvasRenderingContext2D): void {
        this.sprite.render(ctx, this.x, this.y);
        super.drawDebugHelpers(ctx);
    }

    /**
     * @inheritdoc
     */
    public update(delta: number): void {
        this.reloadTimer--;
        this.position.x += (Math.cos(this.direction) * this.velocity.x * delta);
        this.position.y += (Math.sin(this.direction) * this.velocity.y * delta);

        if (Math.random() < 0.005) this.changeDirection();
       super.handleAreaBoundsCheck();
    }

    /**
     * @return - True if ufo is going to fire, false otherwise.
     */
    public isReadyToFire(): boolean {
        return this.reloadTimer <= 0 && Math.random() < 0.006;
    }

    /**
     * @return - New projectile that the ufo fired.
     */
    public fireProjectile(): UfoProjectile {
        this.reloadTimer = RELOAD_TIMER;
        const targetDirection = Math.atan2(this.target.y - this.y, this.target.x - this.x);
        return new UfoProjectile(this.position, targetDirection);
    }

    /**
     * Change the direction ufo is traveling at.
     */
    private changeDirection(): void {
        const modifier = Math.random() + 0.5;
        if(Math.random() > 0.5) {
            this.direction += modifier;
        } else {
            this.direction -= modifier;
        }
    }

}