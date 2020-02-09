import { OBJECT_COLOR } from '../game/constants';

const ANIMATION_TTL = 30;       // Animation length in frames
const MIN_VELOCITY = 30;        // Minimum velocity of individual particle
const MIN_PARTICLE_COUNT = 4;   // Minimum amount of shrapnel particles

interface ShrapnelParticle {
    x: number;
    y: number;
    direction: number;
    velocity: number;
    ttl: number;
}

export default class ImpactAnimations {
    /**
     * @var activeParticles List of active particles in animation.
     */
    private activeParticles: ShrapnelParticle[] = [];

    /**
     * Render impact animations on given canvas.
     *
     * @param ctx - Canvas context
     */
    public renderAnimations(ctx: CanvasRenderingContext2D): void {
        this.activeParticles.forEach(p => {
            ctx.fillStyle = OBJECT_COLOR;
            ctx.fillRect(p.x, p.y, 1, 1);
        });
    }

    /**
     * Update individual shrapnel particles in animation.
     *
     * @param delta - Change in time between last and current frame.
     */
    public updateAnimations(delta: number): void {
        this.activeParticles.forEach(p => {
            p.x += (Math.cos(p.direction) * p.velocity * delta);
            p.y += (Math.sin(p.direction) * p.velocity * delta);
            p.ttl--;
        });
        this.activeParticles = this.activeParticles.filter(p => p.ttl > 0);
    }

    /**
     * Start impact animation at given position.
     *
     * @param x - X-coordinate
     * @param y - Y-coordinate
     */
    public startImpactAnimation(x: number, y: number): void {
        const newParticles: ShrapnelParticle[] = [];
        const particleCount = MIN_PARTICLE_COUNT + Math.floor(Math.random() * 2);
        for (let i = 0; i < particleCount; i++) {
            newParticles.push({
                x: x,
                y: y,
                direction: Math.random() * (2 * Math.PI),
                velocity: MIN_VELOCITY + Math.random() * 30,
                ttl: ANIMATION_TTL,
            });
        }
        this.activeParticles.push(...newParticles);
    }
}
