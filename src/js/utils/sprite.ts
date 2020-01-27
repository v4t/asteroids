export default class Sprite {
    public readonly frames: number;
    public readonly frameHeight: number;
    public readonly frameWidth: number;

    private rotation: number;
    private currentFrame: number;
    private readonly image: HTMLImageElement;

    constructor(source: string, frames: number, frameWidth: number, frameHeight: number) {
        this.frames = frames;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;

        this.currentFrame = 0;
        this.rotation = 0;
        this.image = new Image();
        this.image.src = source;
    }

    public setFrame(frameIndex: number): void {
        if (frameIndex >= 0 && frameIndex < this.frames) {
            this.currentFrame = frameIndex;
        }
    }

    public setNextFrame(): void {
        this.currentFrame += 1;
        if (this.currentFrame >= this.frames) {
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

        // Move to the middle of where we want to draw our image
        ctx.translate(x, y);

        // Rotate around that point using radians
        if (this.rotation !== 0) {
            ctx.rotate(this.rotation);
        }

        // Set the coordinates of source image subrectangle (top-left corner)
        const sx = this.currentFrame === 0
            ? 0
            : (this.currentFrame * this.frameWidth) + 1;
        const sy = 0;

        // Set the image coordinates at destination canvas (top-left corner)
        const dx = Math.floor(this.frameWidth/2) * (-1)
        const dy = Math.floor(this.frameHeight/2) * (-1)

        ctx.drawImage(this.image, sx, sy, this.frameWidth, this.frameHeight, dx, dy, this.frameWidth, this.frameHeight);
        ctx.restore();
    }
}