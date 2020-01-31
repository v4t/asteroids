import { keyDownListener, keyUpListener, clearKeyState } from './controls';
import Ship from './entities/ship';
import Asteroid, { AsteroidCategory } from './entities/asteroid';
import Ufo from './entities/ufo';
import UfoProjectile from './entities/ufo-projectile';
import Vector2D from './utils/vector2d';
import { ShrapnelParticle, createAnimation, updateParticle, renderParticle } from './utils/shrapnel-animation';

export const DEBUG = false;
export const WIDTH = 700;
export const HEIGHT = 700;

export default class Game {
    private level: number = 1;
    private gameOver: boolean = false;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private height: number = HEIGHT;
    private width: number = WIDTH;


    private ship: Ship = new Ship(WIDTH / 2, HEIGHT / 2);
    private asteroids: Asteroid[] = [];
    private ufos: Ufo[] = [];
    private ufoProjectiles: UfoProjectile[] = [];
    private shrapnelParticles: ShrapnelParticle[] = [];

    private lastFrame: number = 0;
    private fpsTime: number = 0;
    private frameCount: number = 0;
    private fps: number = 0;

    constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d");
    }

    public init(): void {
        document.addEventListener('keydown', keyDownListener);
        document.addEventListener('keyup', keyUpListener);

        this.spawnNewAsteroids(3);
    }

    public update(deltaTime: number): void {
        if (!this.gameOver) {
            this.ship.update(deltaTime);
            this.ship.bullets.forEach(b => b.update(deltaTime));
        }
        this.asteroids.forEach(a => a.update(deltaTime));

        if (Math.random() < 0.001 && this.ufos.length < this.level) {
            this.spawnNewUfo();
        }

        this.ufos.forEach(u => {
            u.update(deltaTime);
            if (u.isReadyToFire()) this.ufoProjectiles.push(u.fireProjectile());
        });
        this.ufoProjectiles.forEach(p => p.update(deltaTime));
        this.ufoProjectiles = this.ufoProjectiles.filter(p => p.isActive);
        this.handleCollisions();

        if (this.asteroids.length === 0) {
            this.level++;
            this.spawnNewAsteroids(this.level + 2);
        }
        this.shrapnelParticles.forEach(i => updateParticle(deltaTime, i));
    }

    public render(): void {
        this.ctx.fillStyle = '#020202';
        this.ctx.fillRect(0, 0, this.width, this.height);

        if (!this.gameOver) {
            this.ship.render(this.ctx);
            this.ship.bullets.forEach(b => b.render(this.ctx));
        }
        this.asteroids.forEach(a => a.render(this.ctx));
        this.ufos.forEach(u => {
            u.render(this.ctx);
        });
        this.ufoProjectiles.forEach(p => p.render(this.ctx));
        this.shrapnelParticles.forEach(i => renderParticle(this.ctx, i));
    }

    private spawnNewUfo(): void {
        if (this.gameOver) return;
        const position = this.getNewSpawnPosition();
        this.ufos.push(new Ufo(position.x, position.y, this.ship));
    }

    private spawnNewAsteroids(count: number): void {
        for (let i = 0; i < count; i++) {
            const position = this.getNewSpawnPosition();
            this.asteroids.push(new Asteroid(position.x, position.y, AsteroidCategory.Large));
        }
    }

    private getNewSpawnPosition(): Vector2D {
        if (Math.random() > 0.5) {
            return new Vector2D(
                Math.random() > 0.5 ? 0 : WIDTH,
                Math.random() * HEIGHT
            )
        } else {
            return new Vector2D(
                Math.random() * WIDTH,
                Math.random() > 0.5 ? 0 : HEIGHT
            )
        }
    }

    private handleCollisions(): void {
        if (this.gameOver) return;
        this.handleBulletCollisions();
        this.handleUfoProjectileCollisions();
        this.handleUfoCollisions();
        this.handleShipCollisions();
    }

    private handleBulletCollisions(): void {
        for (const bullet of this.ship.bullets) {
            if (!bullet.isActive) continue;

            const asteroidIndex = this.asteroids.findIndex(a => a.intersectsWith(bullet));
            if (asteroidIndex >= 0) {
                bullet.isActive = false;
                this.splitAsteroid(asteroidIndex);
            }
            const ufoIndex = this.ufos.findIndex(u => u.intersectsWith(bullet));
            if (ufoIndex >= 0) {
                this.createExplosion(this.ufos[ufoIndex].x, this.ufos[ufoIndex].y);
                this.ufos.splice(ufoIndex, 1);
                bullet.isActive = false;
            }
        }
    }

    private handleUfoProjectileCollisions(): void {
        for (const projectile of this.ufoProjectiles) {
            if (!projectile.isActive) continue;

            const asteroidIndex = this.asteroids.findIndex(a => a.intersectsWith(projectile));
            if (asteroidIndex >= 0) {
                projectile.isActive = false;
                this.splitAsteroid(asteroidIndex);
            }
            if (projectile.intersectsWith(this.ship)) {
                this.endGame();
                return;
            }
        }
    }

    private handleShipCollisions(): void {
        const ufoCollisionFound = this.ufos.some(u => u.intersectsWith(this.ship));
        const asteroidCollisionFound = this.asteroids.some(u => u.intersectsWith(this.ship));
        if (ufoCollisionFound || asteroidCollisionFound) {
            this.endGame();
        }
    }

    private handleUfoCollisions(): void {
        this.ufos.forEach((ufo, indexAt) => {
            const asteroidIndex = this.asteroids.findIndex(a => a.intersectsWith(ufo));
            if (asteroidIndex >= 0) {
                this.ufos.splice(indexAt, 1);
                this.splitAsteroid(asteroidIndex);
            }
        })
    }

    private splitAsteroid(indexAt: number): void {
        const asteroid = this.asteroids[indexAt];
        this.createExplosion(asteroid.x, asteroid.y);
        this.asteroids.splice(indexAt, 1);
        if (asteroid.category === AsteroidCategory.Small) return;

        const spawnCategory = asteroid.category === AsteroidCategory.Large
            ? AsteroidCategory.Medium
            : AsteroidCategory.Small;

        this.asteroids.push(...[
            new Asteroid(asteroid.x + 10, asteroid.y + 10, spawnCategory),
            new Asteroid(asteroid.x - 10, asteroid.y - 10, spawnCategory),
        ]);
    }

    private createExplosion(x: number, y: number): void {
        this.shrapnelParticles.push(...createAnimation(x, y));
    }

    private endGame(): void {
        this.createExplosion(this.ship.x, this.ship.y);
        console.log(`*GAME OVER*\nReached level ${this.level}`);
        this.gameOver = true;
        // this.restart();
    }

    private restart(): void {
        clearKeyState();
        this.ship = new Ship(WIDTH / 2, HEIGHT / 2);
        this.asteroids = [];
        this.ufos = [];
        this.ufoProjectiles = [];
        this.level = 1;
        this.spawnNewAsteroids(3);
    }
}