const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight; // This is the canvas height for the map
let isRunning = true;
const background = new Sprite({
    position: { x: 0, y: 0 },
    imageSrc: './Assets/sky.png'
});

const tileMap = new Sprite({
    position: { x: 100, y: canvas.height / 2 + 250 },
    imageSrc: './Assets/world_tileset.png',
    title: 16, rows: 1, cols: 16,
    mapData: [[0, 0, 0, 0, 0, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0]]
});
// Create heart image globally so it persists and loads only once
if (!window.heartImg) {
    window.heartImg = new Image();
    window.heartImg.src = "https://static.vecteezy.com/system/resources/previews/033/034/173/non_2x/pixel-heart-pixel-art-illustration-8-bit-heart-icon-red-heart-pixel-graphic-video-game-heart-icon-vector.jpg";
}

function drawStaticElement() {
    ctx.save();
    ctx.fillStyle = "#f5f5f5";
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 2;
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.beginPath();
    if (ctx.roundRect) {
        ctx.roundRect(20, 20, 560, 80, 10); // x, y, width, height, radius
    } else {
        // Fallback for browsers without roundRect
        ctx.rect(20, 20, 560, 80);
    }
    ctx.fill();
    ctx.stroke();

    // Draw profile circle
    ctx.shadowColor = "transparent"; // Turn off shadow
    ctx.beginPath();
    ctx.fillStyle = "#ccc";
    ctx.arc(50, 60, 20, 0, Math.PI * 2);
    ctx.fill();

    // Draw name text
    ctx.fillStyle = "#000";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Name: Jack", 80, 55);

    // Draw heart images
    const startX = 80;
    const y = 65;
    const spacing = 25;
    for (let i = 0; i < 3; i++) {
        if (window.heartImg && window.heartImg.complete && window.heartImg.naturalWidth > 0) {
            ctx.drawImage(window.heartImg, startX + i * spacing, y, 20, 20);
        } else {
            // Draw a fallback heart shape
            ctx.beginPath();
            ctx.fillStyle = "#e00";
            ctx.moveTo(startX + i * spacing + 10, y + 15);
            ctx.arc(startX + i * spacing + 6, y + 15, 5, Math.PI, 0);
            ctx.arc(startX + i * spacing + 14, y + 15, 5, Math.PI, 0);
            ctx.lineTo(startX + i * spacing + 10, y + 25);
            ctx.closePath();
            ctx.fill();
        }
    }

    // Score and time (aligned right)
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.font = "16px sans-serif";
    ctx.fillText("Score: 000000", 570, 45);
    ctx.fillText("Time: 000000", 570, 70);
    ctx.textAlign = "left";
    ctx.restore();
}
const dirtBase = new Sprite({
    position: { x: 100, y: canvas.height / 2 + 265 },
    imageSrc: './Assets/world_tileset.png',
    title: 16, rows: 8, cols: 16, titleOffset: 16,
    mapData: [[0, 0, 0, 0, 0, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0]]
});

const baseLine1 = new Sprite({
    position: { x: 388, y: canvas.height / 2 + 216 },
    imageSrc: './Assets/platforms.png',
    title: 16, rows: 1, cols: 2,
    mapData: [[0, 0]]
});
const baseLine2 = new Sprite({
    position: { x: 452, y: canvas.height / 2 + 184 },
    imageSrc: './Assets/platforms.png',
    title: 16, rows: 1, cols: 2,
    mapData: [[0, 0]]
});
function animate() {
    if (isRunning) {
        requestAnimationFrame(animate);
    }
    background.update(ctx); // Draw sky background first
    drawStaticElement();
    tileMap.update(ctx);    // Draw tile map (if mapData is present)
    dirtBase.update(ctx);
    baseLine1.update(ctx);
    baseLine2.update(ctx);

}



// Log if the image fails to load
background.image.onerror = function () {
    console.error('Failed to load background image:', background.image.src);
    alert('Failed to load background image: ' + background.image.src);
};

// Wait for the background image to load before starting animation
background.image.onload = function () {
    console.log('Background image loaded:', background.image.src);
    animate();
}
// Do not call animate() here; it will be called after the image loads

