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

//A contructor that helps the game draw
class Fighter extends Sprite {
    //Make it pass through 1 argument
    constructor({ position, velocity, colour, health, imageSrc,
        scale = 1, frame = 1, offset = { x: 0, y: 0 }, timeHold,
        attackBoxOffset = { x: 0, y: 0 }, spriteSheet }) {
        super({
            position,
            imageSrc,
            scale,
            frame,
            offset,
            timeHold
        });
        this.position = position; //This is the position of each characters
        this.velocity = velocity; //How fast it will travel
        this.height = 150;
        this.width = 50;
        this.gravity = 0.7; //Gravity that pull characters down
        this.jumpCount = 0; //Track number of jumps
        this.dashCount = 0;
        this.colour = colour; //The colour of character box
        this.health = health;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBoxOffset,
            width: 145,
            height: 50
        };
        this.currentFrame = 0; // Create a loop that run animation
        this.timeHold = timeHold; //Every half of second
        this.timeElapsed = 0;
        this.isAttack = false; //Currently no characters are attacking  
        this.isCooldown = false; //Cool down for the attack 
        this.spriteSheet = spriteSheet;
        this.facingLeft = false;

        for (const pixel in this.spriteSheet) {
            spriteSheet[pixel].image = new Image();
            spriteSheet[pixel].image.src = spriteSheet[pixel].imageSrc;
        }
    }

    updateAnimation(state) {
        // Prevent switching out of attack animations until they are complete
        const isAttackAnimation =
            this.image === this.spriteSheet.attack.image ||
            this.image === this.spriteSheet.attack_left.image;

        if (isAttackAnimation && this.currentFrame < this.frame - 1) {
            return; // Do not interrupt ongoing attack animation
        }
        const sprite = this.spriteSheet[state];
        if (sprite && this.image !== sprite.image) {
            this.image = sprite.image;
            this.frame = sprite.frame;
            this.timeHold = sprite.timeHold;
            // Reset animation frame and time on state change
            this.currentFrame = 0;
            this.timeElapsed = 0;
        }
    }

    //Update characters functions
    update(opponent) {
        //Call the current draw function within the constructor
        this.draw();
        this.animateFrame();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        // Update attack box offset based on relative position
        if (this.position.x < opponent.position.x) {
            this.attackBox.offset.x = 0; // Attack box in front
        } else {
            this.attackBox.offset.x = -(this.attackBox.width - this.width); // Attack box behind
        }
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.height / 2 - this.attackBox.height / 2;

        if ((this.position.y + this.height) >= canvas.height - 54) {
            this.velocity.y = 0; //Stop all the falling actions
            this.jumpCount = 0; //reset the double jumps
            this.position.y = canvas.height - this.height - 54;
        }
        else {
            //It will pull you down
            this.velocity.y += this.gravity;
        }
        // Horizontal boundaries
        if (this.position.x < 15) {
            this.position.x = 15; // Prevent moving beyond the left boundary
        } else if (this.position.x + this.width > canvas.width) {
            this.position.x = canvas.width - this.width; // Prevent moving beyond the right boundary
        }
    }
    attack() {
        if (!this.isCooldown) {
            this.isAttack = true;
            this.isCooldown = true;
            // Determine the direction and update the animation
            if (this.facingLeft) {
                this.updateAnimation("attack_left");
            } else {

                this.updateAnimation("attack");
            }

            // Set a short duration for the attack visibility
            setTimeout(() => {
                this.isAttack = false; // Reset the attack state
            }, 100); // Attack lasts for 100ms (adjust as needed)

            // Set the cooldown period
            setTimeout(() => {
                this.isCooldown = false; // Reset cooldown after 500ms
            }, 600); // Cooldown lasts for 500ms (adjust as needed)
        }
    }
}
//When the keys are not pressing
window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
    }
});
