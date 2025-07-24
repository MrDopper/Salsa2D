class Sprite {
    constructor({ postion, imageSrc, scale = 1, frame = 1, offset = { x: 0, y: 0 } }) {
        this.postion = postion
        this.imageSrc = imageSrc
        this.scale = scale
        this.frame = frame
        this.offset = offset
    }
}