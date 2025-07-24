class Sprite {
    constructor({ postion, imageSrc, scale = 1, frame = 1, offset = { x: 0, y: 0 }, timeHold }) {
        this.postion = postion;
        this.scale = scale;
        this.frame = frame;
        this.offset = offset;
        this.currentFrame = 0;
        this.timeHold = timeHold;
        this.image = new Image();
        this.image.src = imageSrc;
    }
    draw(){
        ctx.drawImage(this.image, this.currentFrame * (this.image.width / this.frame), 0, this.image.width / this.frame, this.image.height, this.postion.x, this.postion.y, (this.image.width / this.frame) * this.scale, this.image.height * this.scale);
    }
    animateFrame(){
        this.timeHold++;
        if(this.timeHold >= this.frame){
            if(this.currentFrame < this.frame - 1){
                this.currentFrame++;
            }else{
                this.currentFrame = 0;
            }
            this.timeHold = 0;
        }
    }
    update() {
        this.draw();
        this.animateFrame();
    }
}

