import Ship from './entities/ship';
import Asteroid, { AsteroidCategory } from './entities/asteroid';
import Bullet from './entities/bullet';
import { keyDownListener, keyUpListener } from './controls';

const WIDTH = 800;
const HEIGHT = 600;

export default class Game {
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
        document.addEventListener('keydown', keyDownListener)
        document.addEventListener('keyup', keyUpListener)

        this.asteroids = [new Asteroid(50, 50, AsteroidCategory.Large)]
    }

    public update(deltaTime: number): void {

    }

    public render(): void {
        this.ctx.fillStyle = '#020202';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ship.update();
        this.asteroids.forEach(a => {
            a.update();
        })
        this.ship.bullets.forEach(b => b.update());

        this.handleCollisions();

        this.ship.render(this.ctx);
        this.ship.bullets.forEach(b => b.render(this.ctx));
        this.asteroids.forEach(a => {
            a.render(this.ctx);
        })
    }

    private handleCollisions(): void {
        this.asteroids.forEach((a, i) => {
            if (this.ship.intersectsWith(a)) {
                console.log('*game over*');
            }
            this.ship.bullets.forEach(b => {
                if (b.isActive && b.intersectsWith(a)) {
                    console.log('*boom*');
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
            new Asteroid(asteroid.x, asteroid.y, spawnCategory),
            new Asteroid(asteroid.x, asteroid.y, spawnCategory),
        ]);
    }
}