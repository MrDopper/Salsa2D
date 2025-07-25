class Sprite {
    constructor({ position, imageSrc, scale = 1, frame = 1, offset = { x: 0, y: 0 }, timeHold, title, rows, cols, mapData, titleOffset = 0 }) {
        this.position = position; //This is the position of each characters
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imageSrc; //Location of the sprite
        this.scale = scale; //Size of the sprite
        this.frame = frame; //Numbers of sprites 
        this.currentFrame = 0; // Create a loop that run animation
        this.timeHold = timeHold; //Every half of second
        this.timeElapsed = 0; //Time that run through sprite
        this.offset = offset;
        this.title = title;
        this.rows = rows;
        this.cols = cols;
        this.mapData = mapData;
        this.titleOffset = titleOffset;
    }
    draw() {
        // If this is a background (frame == 1), stretch image to fill canvas
        if (this.frame === 1) {
            ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.drawImage(this.image, this.currentFrame * (this.image.width / this.frame),
                0, this.image.width / this.frame, this.image.height, this.position.x - this.offset.x,
                this.position.y - this.offset.y, (this.image.width / this.frame) * this.scale,
                this.image.height * this.scale);
        }
    }
    //Animation function
    animateFrame() {
        this.timeElapsed++;
        if (this.timeElapsed % this.timeHold === 0) {
            this.timeElapsed = 0;         //Reset the time hold
            if (this.currentFrame < this.frame - 1) {
                this.currentFrame++;
            }
            else {
                this.currentFrame = 0;
            }
        }
    }
    update(ctx) {
        if (this.mapData) {
            this.drawTileMap(ctx, this.mapData, this.titleOffset);
        } else {
            this.draw();
            this.animateFrame();
        }
    }
    /**
     * Draws a tile map to the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @param {number[][]} mapData - 2D array of tile indices.
     * @param {number} [tileOffset=0] - Optional offset to add to each tile index.
     */
    drawTileMap(ctx, mapData, tileOffset) {
        if (!this.image.complete) return; // Ensure image is loaded
        const tilesPerRow = Math.floor(this.image.width / this.title);
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                let mapVal = mapData[row][col];
                if (mapVal === -1 || mapVal === null) continue; // Skip drawing for -1/null
                const tileIndex = mapVal + tileOffset;
                const sx = (tileIndex % tilesPerRow) * this.title;
                const sy = Math.floor(tileIndex / tilesPerRow) * this.title;
                ctx.drawImage(
                    this.image,
                    sx, sy, this.title, this.title, // source x, y, width, height (from tileset)
                    this.position.x + col * this.title, this.position.y + row * this.title, this.title, this.title // destination x, y, width, height (on canvas)
                );
            }
        }
    }
}

