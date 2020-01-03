export default class Vector2D {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public distanceTo(point: Vector2D) {
        const a = (this.x - point.x);
        const b = (this.y - point.y);
        return Math.sqrt(a*a + b*b);
    }
}