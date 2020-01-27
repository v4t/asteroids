import Entity from './entity';
import Bullet from './bullet';
import Vector2D from '../utils/vector2d';
import { Key, KEY_STATE } from '../controls';
import Sprite from '../utils/sprite';

const SPRITE_SOURCE = '../assets/ship.png';
const SPRITE_FRAMES = 2;
const FRAME_HEIGHT = 33;
const FRAME_WIDTH = 33;

export default class Ship extends Entity {
    public bullets: Bullet[];
    private acceleration: Vector2D;
    private thrust: number = 0;
    private reloadTimer: number = 0;
    private readonly sprite: Sprite;

    constructor() {
        super(new Vector2D(400, 300), 16, new Vector2D(0, 0), 0);
        this.acceleration = new Vector2D(0, 0);
        this.bullets = [new Bullet(this), new Bullet(this), new Bullet(this), new Bullet(this)];
        this.sprite = new Sprite(SPRITE_SOURCE, SPRITE_FRAMES, FRAME_WIDTH, FRAME_HEIGHT);
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = '#f9f9f9'

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 16, 0, Math.PI * 2);
        // const toX = (Math.round(this.position.x + (16 * Math.cos(this.direction))));
        // const toY = (Math.round(this.position.y + (16 * Math.sin(this.direction))));
        // ctx.moveTo(this.position.x, this.position.y);
        // ctx.lineTo(toX, toY);
        ctx.stroke();
        ctx.closePath();

        if(this.thrust > 0 && Math.random() > 0.5) {
            this.sprite.setFrame(1);
        } else {
            this.sprite.setFrame(0);
        }
        this.sprite.setRotation(this.direction);
        this.sprite.render(ctx, this.x, this.y);
    }

    public update(delta: number): void {
        if (KEY_STATE.has(Key.Left)) this.rotateLeft();
        if (KEY_STATE.has(Key.Right)) this.rotateRight();
        if (KEY_STATE.has(Key.Shoot)) this.fire();
        if (KEY_STATE.has(Key.Throttle)) {
            this.thrust = 7;
        } else {
            this.thrust = 0;
        }

        this.acceleration.add(new Vector2D(
            Math.cos(this.direction) * this.thrust * delta,
            Math.sin(this.direction) * this.thrust * delta
        ))

        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);

        this.acceleration.x = 0;
        this.acceleration.y = 0;

        // apply friction
        this.velocity.x *= 0.99;
        this.velocity.y *= 0.99;
        if(this.thrust === 0) {
            if (this.velocity.x < delta && this.velocity.x > -delta) this.velocity.x = 0;
            if (this.velocity.y < delta && this.velocity.y > -delta) this.velocity.y = 0;
        }

        // apply maxvelocity  limit
        const maxVel = 500 * delta;
        if (this.velocity.x > maxVel) this.velocity.x = maxVel;
        if (this.velocity.y > maxVel) this.velocity.y = maxVel;
        if (this.velocity.x < -maxVel) this.velocity.x = -maxVel;
        if (this.velocity.y < -maxVel) this.velocity.y = -maxVel;

        this.handleAreaBoundsCheck();
    }

    public rotateLeft(): void {
        this.direction = (this.direction - 0.08)
    }

    public rotateRight(): void {
        this.direction = (this.direction + 0.08)
    }

    public fire(): void {
        if (this.reloadTimer > 0) {
            this.reloadTimer -= 1;
            return;
        }
        const availableBullet = this.bullets.find(b => !b.isActive);
        if (availableBullet !== undefined) {
            availableBullet.fire(this.direction, this.position.x, this.position.y);
            this.reloadTimer = 10;
        }
    }
}