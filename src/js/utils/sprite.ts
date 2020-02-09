export default class Sprite {

    /**
     * @var frames - Number of frames in the sprite.
     */
    public readonly frames: number;

    /**
     * @var frameWidth - Width of individual frame.
     */
    public readonly frameWidth: number;

    /**
     * @var frameHeight - Height of individual frame.
     */
    public readonly frameHeight: number;

    /**
     * @var rotation - Current rotation for sprite.
     */
    private rotation: number;

    /**
     * @var currentFrame - Index of the current frame of the sprite.
     */
    private currentFrame: number;

    /**
     * @var image - Sprite image.
     */
    private readonly image: HTMLImageElement;

    /**
     * @param source - Sprite image source.
     * @param frames - Number of frames in image.
     * @param frameWidth - Width of individual frame.
     * @param frameHeight - Height of individual frame.
     */
    constructor(source: string, frames: number, frameWidth: number, frameHeight: number) {
        this.frames = frames;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;

        this.currentFrame = 0;
        this.rotation = 0;
        this.image = new Image();
        this.image.src = source;
    }

    /**
     * Set current frame position. If invalid index is given, do not update frame position.
     *
     * @param frameIndex - Index of the new frame (0-based).
     */
    public setFrame(frameIndex: number): void {
        if (frameIndex >= 0 && frameIndex < this.frames) {
            this.currentFrame = frameIndex;
        }
    }

    /**
     * Set the current frame as next frame in the sprite. If frame is the last one, loop
     * to the beginning.
     */
    public setNextFrame(): void {
        this.currentFrame += 1;
        if (this.currentFrame >= this.frames) {
            this.currentFrame = 0;
        }
    }

    /**
     * Set new value for rotation of the sprite.
     *
     * @param value - New rotation in radians.
     */
    public setRotation(value: number) {
        this.rotation = value;
    }

    /**
     * Apply some value to the rotation of the sprite.
     *
     * @param value - Value applied in radians.
     */
    public rotate(value: number) {
        this.rotation += value;
    }

    /**
     * Render sprite on given canvas at given position.
     *
     * @param ctx - Canvas context.
     * @param x - X-coordinate for the rendered sprite.
     * @param y - Y-coordinate for the rendered sprite.
     */
    public render(ctx: CanvasRenderingContext2D, x: number, y: number): void {
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

        // Since we want to use x- and y-coordinates as the center of the sprite,
        // we need to apply this transformation to get the top-left corner coordinates
        const dx = Math.floor(this.frameWidth/2) * (-1)
        const dy = Math.floor(this.frameHeight/2) * (-1)

        ctx.drawImage(this.image, sx, sy, this.frameWidth, this.frameHeight, dx, dy, this.frameWidth, this.frameHeight);
        ctx.restore();
    }
}