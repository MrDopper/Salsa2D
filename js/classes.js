class Sprite {
    constructor({ position, imageSrc, scale = 1, frame = 1, offset = { x: 0, y: 0 }, timeHold }) {
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
    update() {
        this.draw();
        this.animateFrame();
    }
}

