export default class Sprite {
    public readonly frames: number;
    public readonly frameHeight: number;
    public readonly frameWidth: number;

    private rotation: number;
    private currentFrame: number;
    private readonly image: HTMLImageElement;

    constructor(source: string, frames: number, frameHeight: number, frameWidth: number) {
        this.frames = frames;
        this.frameHeight = frameHeight;
        this.frameWidth = frameWidth;

        this.currentFrame = 0;
        this.rotation = 0;
        this.image = new Image();
        this.image.src = source;
    }

    public setFrame(frameIndex: number): void {
        if(frameIndex >= 0 && frameIndex < this.frames) {
            this.currentFrame = frameIndex;
        }
    }

    public setNextFrame(): void {
        this.currentFrame += 1;
        if(this.currentFrame >= this.frames) {
            this.currentFrame = 0;
        }
    }

    public setRotation(value: number) {
        this.rotation = value;
    }

    public rotate(value: number) {
        this.rotation += value;
    }

    public render(ctx: CanvasRenderingContext2D, x: number, y: number, centerSprite: boolean = true): void {
        ctx.save();

        // move to the middle of where we want to draw our image
        ctx.translate(x, y);

        // rotate around that point, converting our
        // angle from degrees to radians
        if(this.rotation !== undefined) {
            ctx.rotate(this.rotation);
        }

        // draw it up and to the left by half the width
        // and height of the image
        ctx.drawImage(this.image, 0, 0, 31, 31, -15, -15, 31, 31);

        ctx.restore();
    }
}