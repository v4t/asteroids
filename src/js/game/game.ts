import { keyDownListener, keyUpListener, clearKeyState } from './controls';
import Ship from '../entities/ship';
import Asteroid from '../entities/asteroid';
import AsteroidCategory from '../entities/asteroid-category';
import Ufo from '../entities/ufo';
import UfoProjectile from '../entities/ufo-projectile';
import Vector2D from '../utils/vector2d';
import GameStats from './game-stats';
import ImpactAnimations from '../effects/impact-animations';
import { WIDTH, HEIGHT, SCREEN_COLOR } from './constants';

// Ufo spawn constants
const UFO_SPAWN_DELAY = 60;
const UFO_SPAWN_CHANCE = 0.001

export default class Game {
    // Game state
    private level: number = 1;
    private score: number = 0;
    private gameOver: boolean = false;

    // Game screen
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private width: number = WIDTH;
    private height: number = HEIGHT;

    // Game entities
    private ship: Ship;
    private asteroids: Asteroid[] = [];
    private ufos: Ufo[] = [];
    private ufoProjectiles: UfoProjectile[] = [];
    private ufoSpawnTimer = 300;

    // Other effects
    private impactAnimations: ImpactAnimations;

    constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');
        this.impactAnimations = new ImpactAnimations();
    }

    /**
     * @return - True if game is over, false otherwise.
     */
    public hasEnded(): boolean {
        return this.gameOver;
    }

    /**
     * @return - Current level and score.
     */
    public getGameStats(): GameStats {
        return {
            level: this.level,
            score: this.score
        };
    }

    /**
     * Initialize new game.
     */
    public init(): void {
        document.addEventListener('keydown', keyDownListener);
        document.addEventListener('keyup', keyUpListener);

        this.restart();
    }

    /**
     * Setup new game by clearing existing entities and setting up new initial state.
     */
    public restart(): void {
        clearKeyState();
        this.gameOver = false;
        this.ship = new Ship(WIDTH / 2, HEIGHT / 2);
        this.asteroids = [];
        this.ufos = [];
        this.ufoProjectiles = [];
        this.level = 1;
        this.score = 0;
        this.spawnNewAsteroids(3);
    }

    /**
     * Update game entities once per tick.
     *
     * @param deltaTime - Change in time between last and current frame.
     */
    public update(deltaTime: number): void {
        if (!this.gameOver) {
            this.ship.update(deltaTime);
            this.ship.bullets.forEach(b => b.update(deltaTime));
        }
        this.asteroids.forEach(a => a.update(deltaTime));

        this.ufoSpawnTimer--;
        if (this.ufoSpawnTimer <= 0 && Math.random() <= UFO_SPAWN_CHANCE) {
            this.spawnNewUfo();
            this.ufoSpawnTimer = UFO_SPAWN_DELAY;
        }
        this.ufos.forEach(u => {
            u.update(deltaTime);
            if (u.isReadyToFire()) this.ufoProjectiles.push(u.fireProjectile());
        });
        this.ufoProjectiles.forEach(p => p.update(deltaTime));
        this.ufoProjectiles = this.ufoProjectiles.filter(p => p.isActive);

        this.handleCollisions();

        if (this.asteroids.length === 0 && this.ufos.length === 0) {
            this.level++;
            this.spawnNewAsteroids(this.level + 2);
        }
        this.impactAnimations.updateAnimations(deltaTime);
    }

    /**
     * Render game entities once per tick.
     */
    public render(): void {
        this.ctx.fillStyle = SCREEN_COLOR;
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
        this, this.impactAnimations.renderAnimations(this.ctx);
    }

    /**
     * Add a new ufo to the game.
     */
    private spawnNewUfo(): void {
        if (this.gameOver) return;
        const position = this.getNewSpawnPosition();
        this.ufos.push(new Ufo(position.x, position.y, this.ship));
    }

    /**
     * Add new asteroids to the game.
     *
     * @param count - Number of new asteroids.
     */
    private spawnNewAsteroids(count: number): void {
        for (let i = 0; i < count; i++) {
            const position = this.getNewSpawnPosition();
            this.asteroids.push(new Asteroid(position.x, position.y, AsteroidCategory.Large));
        }
    }

    /**
     * Get a random spawn position for a new entity at the edge of the screen.
     *
     * @return - Spawn position as vector.
     */
    private getNewSpawnPosition(): Vector2D {
        if (Math.random() > 0.5) {
            return {
                x: Math.random() > 0.5 ? 0 : WIDTH,
                y: Math.random() * HEIGHT
            }
        } else {
            return {
                x: Math.random() * WIDTH,
                y: Math.random() > 0.5 ? 0 : HEIGHT
            }
        }
    }

    /**
     * Check for collisions between various entities.
     */
    private handleCollisions(): void {
        if (this.gameOver) return;
        this.handleBulletCollisions();
        this.handleUfoProjectileCollisions();
        this.handleUfoCollisions();
        this.handleShipCollisions();
    }

    /**
     * Check if any bullet collides with ufo or asteroid and apply the effects of collisions.
     */
    private handleBulletCollisions(): void {
        for (const bullet of this.ship.bullets) {
            if (!bullet.isActive) continue;

            const asteroidIndex = this.asteroids.findIndex(a => a.intersectsWith(bullet));
            if (asteroidIndex >= 0) {
                bullet.isActive = false;
                this.score += 10 * this.asteroids[asteroidIndex].radius;
                this.splitAsteroid(asteroidIndex);
            }
            const ufoIndex = this.ufos.findIndex(u => u.intersectsWith(bullet));
            if (ufoIndex >= 0) {
                this.impactAnimations.startImpactAnimation(this.ufos[ufoIndex].x, this.ufos[ufoIndex].y);
                this.ufos.splice(ufoIndex, 1);
                bullet.isActive = false;
                this.score += 1000;
            }
        }
    }

    /**
     * Check if any ufo projectile collides with ship or asteroids and apply the effects of collisions.
     */
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

    /**
     * Check if ship collides with any ufo or asteroid and apply the effects of collisions.
     */
    private handleShipCollisions(): void {
        const ufoCollisionFound = this.ufos.some(u => u.intersectsWith(this.ship));
        const asteroidCollisionFound = this.asteroids.some(u => u.intersectsWith(this.ship));
        if (ufoCollisionFound || asteroidCollisionFound) {
            this.endGame();
        }
    }

    /**
     * Check if any ufo ship collides with any asteroid and apply the effects of collisions.
     */
    private handleUfoCollisions(): void {
        this.ufos.forEach((ufo, indexAt) => {
            const asteroidIndex = this.asteroids.findIndex(a => a.intersectsWith(ufo));
            if (asteroidIndex >= 0) {
                this.ufos.splice(indexAt, 1);
                this.splitAsteroid(asteroidIndex);
            }
        })
    }

    /**
     * Split asteroid into two smaller asteroids. If asteroid is already as small as possible,
     * destroy it.
     *
     * @param indexAt - Asteroid's position at asteroid entity table.
     */
    private splitAsteroid(indexAt: number): void {
        const asteroid = this.asteroids[indexAt];
        this.impactAnimations.startImpactAnimation(asteroid.x, asteroid.y);
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

    /**
     * End game when ship gets destroyed.
     */
    private endGame(): void {
        this.impactAnimations.startImpactAnimation(this.ship.x, this.ship.y);
        this.gameOver = true;
    }
}