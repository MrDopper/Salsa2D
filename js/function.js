const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight; // This is the canvas height for the map
let isRunning = true;
const background = new Sprite({
    position: { x: 0, y: 0 },
    imageSrc: './Assets/sky.png'
});
// --- TILESET DEMO ---
// Load the tileset image
const titleSet = new Sprite({
    position: { x: 20, y: 20 },
    imageSrc: './Assets/Grass.png'
});
const tileSet = new Image();
tileSet.src = './Assets/Grass.png';

const TILE_SIZE = 32; // Change if your tiles are a different size
const MAP_ROWS = 4;
const MAP_COLS = 4;
// --- END TILESET DEMO ---

// Wait for both background and tileset to load before starting animation
let backgroundLoaded = false;
background.image.onload = function () {
    backgroundLoaded = true;
    tryStartGame();
};
function drawTileMap() {
    for (let row = 0; row < MAP_ROWS; row++) {
        for (let col = 0; col < MAP_COLS; col++) {
            ctx.drawImage(
                tileSet,
                0, 0, TILE_SIZE, TILE_SIZE, // source x, y, width, height (from tileset)
                col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE // destination x, y, width, height (on canvas)
            );
        }
    }
}

function animate() {
    if (isRunning) {
        requestAnimationFrame(animate);
    }
    background.update(); // Draw sky background first
    drawTileMap();       // Draw tile map on top
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

