import Entity from './entity';
import Vector2D from '../utils/vector2d';
import UfoProjectile from './ufo-projectile';

export default class Ufo extends Entity {
    private readonly target: Entity;
    private reloadTimer = 0;

    constructor(target: Entity) {
        super(new Vector2D(100, 100), 15, new Vector2D(1, 1), 0);
        this.target = target;
    }

    public render(ctx: CanvasRenderingContext2D): void {

        this.update();
        ctx.fillStyle = '#f9f9f9'

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 15, 0, Math.PI * 2);
        ctx.moveTo(this.position.x, this.position.y);

        ctx.fill();
        ctx.closePath();
    }

    public update(): void {
        this.reloadTimer--;
        this.position.x += (Math.cos(this.direction) * this.velocity.x);
        this.position.y += (Math.sin(this.direction) * this.velocity.y);

        if(Math.random() < 0.002) this.changeDirection();
        this.handleAreaBoundsCheck();
    }

    public isReadyToFire(): boolean {
        return this.reloadTimer <= 0 && Math.random() < 0.006;
    }

    public fireProjectile(): UfoProjectile {
        this.reloadTimer = 240;
        const targetDirection = Math.atan2(this.target.y - this.y, this.target.x - this.x)
        return new UfoProjectile(this.position, targetDirection);
    }

    private changeDirection(): void {
        const modifier = Math.random() + 0.5
        if(Math.random() > 0.5) {
            this.direction += modifier
        } else {
            this.direction -= modifier
        }
        this.direction %= 360
    }

}