import Ship from './entities/ship';
import Asteroid, { AsteroidCategory } from './entities/asteroid';
import Bullet from './entities/bullet';
import { keyDownListener, keyUpListener, clearKeyState } from './controls';

export const WIDTH = 700;
export const HEIGHT = 700;

export default class Game {
    private level = 1;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private height: number = HEIGHT;
    private width: number = WIDTH;

    private ship: Ship = new Ship();
    private asteroids: Asteroid[] = []

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

    }

    public render(): void {
        this.ctx.fillStyle = '#020202';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ship.render(this.ctx);
        this.ship.bullets.forEach(b => b.render(this.ctx));
        this.asteroids.forEach(a => {
            a.render(this.ctx);
        })

        // update
        this.ship.update();
        this.asteroids.forEach(a => {
            a.update();
        })
        this.ship.bullets.forEach(b => b.update());
        this.handleCollisions();

        if (this.asteroids.length === 0) {
            this.level++;
            this.spawnNewAsteroids(this.level + 2);
        }
    }

    private restart(): void {
        clearKeyState();
        this.ship = new Ship();
        this.asteroids = [];
        this.level = 1;
        this.spawnNewAsteroids(3);
    }

    private spawnNewAsteroids(count: number): void {
        for (let i = 0; i < count; i++) {
            let x, y;
            if(Math.random() > 0.5) {
                x = Math.random() > 0.5 ? 0 : WIDTH;
                y = Math.random() * HEIGHT;
            } else {
                x = Math.random() * WIDTH;
                y = Math.random() > 0.5 ? 0 : HEIGHT;
            }
            this.asteroids.push(new Asteroid(x, y, AsteroidCategory.Large));
        }
    }

    private handleCollisions(): void {
        this.asteroids.forEach((a, i) => {
            if (this.ship.intersectsWith(a)) {
                alert('*GAME OVER*\nReached level ' + this.level);
                this.level = 1;
                this.restart();
                return;
            }
            this.ship.bullets.forEach(b => {
                if (b.isActive && b.intersectsWith(a)) {
                    this.breakUpAsteroid(a, i);
                    b.isActive = false;
                }
            })
        })
    }

    private breakUpAsteroid(asteroid: Asteroid, index: number): void {
        this.asteroids.splice(index, 1);
        if (asteroid.category === AsteroidCategory.Small) return;

        const spawnCategory = asteroid.category === AsteroidCategory.Large
            ? AsteroidCategory.Medium
            : AsteroidCategory.Small;

        this.asteroids.push(...[
            new Asteroid(asteroid.x + 10, asteroid.y + 10, spawnCategory),
            new Asteroid(asteroid.x - 10, asteroid.y - 10, spawnCategory),
        ]);
    }
}