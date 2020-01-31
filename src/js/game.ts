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
        if(!this.gameOver){
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

        if(!this.gameOver) {
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
        if(this.gameOver) return;
        this.asteroids.forEach((a, i) => {
            if (this.ship.intersectsWith(a)) {
                this.endGame();
                return;
            }
            this.ship.bullets.forEach(b => {
                if (b.isActive && b.intersectsWith(a)) {
                    this.breakAsteroid(a, i);
                    b.isActive = false;
                }
            })
            this.ufos.forEach((u, j) => {
                if (u.intersectsWith(a)) {
                    this.ufos.splice(j, 1);
                    this.breakAsteroid(a, i);
                }
            });
            this.ufoProjectiles.forEach(up => {
                if (up.intersectsWith(a)) {
                    this.breakAsteroid(a, i);
                    up.isActive = false;
                }
            })
        });
        this.ufos.forEach((u, i) => {
            this.ship.bullets.forEach(b => {
                if (b.isActive && b.intersectsWith(u)) {
                    this.ufos.splice(i, 1);
                    this.createExplosion(u.x, u.y);
                    b.isActive = false;
                }
            })
            if (u.intersectsWith(this.ship)) {
                this.endGame();
                return;
            }
        });

        this.ufoProjectiles.forEach(up => {
            if (up.isActive && up.intersectsWith(this.ship)) {
                this.endGame();
                return;
            }
        })
    }

    private breakAsteroid(asteroid: Asteroid, index: number): void {
        this.asteroids.splice(index, 1);
        if (asteroid.category === AsteroidCategory.Small) return;

        const spawnCategory = asteroid.category === AsteroidCategory.Large
            ? AsteroidCategory.Medium
            : AsteroidCategory.Small;

        this.asteroids.push(...[
            new Asteroid(asteroid.x + 10, asteroid.y + 10, spawnCategory),
            new Asteroid(asteroid.x - 10, asteroid.y - 10, spawnCategory),
        ]);
        this.createExplosion(asteroid.x, asteroid.y);
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