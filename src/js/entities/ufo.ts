import Entity from './entity';
import Vector2D from '../utils/vector2d';
import UfoProjectile from './ufo-projectile';

export default class Ufo extends Entity {
    private readonly target: Entity;
    private reloadTimer = 0;

    constructor(target: Entity) {
        super(new Vector2D(100, 100), 15, new Vector2D(100, 100), 0);
        this.target = target;
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = '#f9f9f9'

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 15, 0, Math.PI * 2);
        ctx.moveTo(this.position.x, this.position.y);

        const img = new Image();
        img.src = '../assets/ufo.png';
        ctx.drawImage(img, this.x-15, this.y-15);

        ctx.stroke();
        ctx.closePath();
    }

    public update(delta: number): void {
        this.reloadTimer--;
        this.position.x += (Math.cos(this.direction) * this.velocity.x * delta);
        this.position.y += (Math.sin(this.direction) * this.velocity.y * delta);

        if (Math.random() < 0.002) this.changeDirection();
        this.handleAreaBoundsCheck();
    }


    public isReadyToFire(): boolean {
        return this.reloadTimer <= 0 && Math.random() < 0.006;
    }

    public fireProjectile(): UfoProjectile {
        this.reloadTimer = 240;
        const targetDirection = Math.atan2(this.target.y - this.y, this.target.x - this.x);
        return new UfoProjectile(this.position, targetDirection);
    }

    private changeDirection(): void {
        const modifier = Math.random() + 0.5;
        if(Math.random() > 0.5) {
            this.direction += modifier;
        } else {
            this.direction -= modifier;
        }
        this.direction %= 360;
    }

}