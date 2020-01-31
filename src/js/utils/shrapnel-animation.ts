const ANIMATION_TTL = 45;

export interface ShrapnelParticle {
    x: number;
    y: number;
    direction: number;
    velocity: number;
    ttl: number;
}

export function renderParticle(ctx: CanvasRenderingContext2D, particle: ShrapnelParticle): void {
    if (particle.ttl <= 0) return;
    ctx.fillStyle = '#f9f9f9';
    ctx.fillRect(particle.x, particle.y, 1, 1);
}

export function updateParticle(delta: number, particle: ShrapnelParticle): void {
    if (particle.ttl <= 0) return;
    particle.x += (Math.cos(particle.direction) * particle.velocity * delta);
    particle.y += (Math.sin(particle.direction) * particle.velocity * delta);
    particle.ttl--;
}

export function createAnimation(x: number, y: number): ShrapnelParticle[] {
    const particles: ShrapnelParticle[] = [];
    const shrapnelCount = 4 + Math.floor(Math.random() * 2);
    for (let i = 0; i < shrapnelCount; i++) {
        particles.push({
            x: x,
            y: y,
            direction: Math.random() * (2 * Math.PI),
            velocity: Math.random() * 60,
            ttl: ANIMATION_TTL,
        });
    }
    return particles;
}
