const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight; // This is the canvas height for the map
let isRunning = true;
const background = new Sprite({
    position: { x: 0, y: 0 },
    imageSrc: './Assets/sky.png',
    scale: 1,
    frame: 1,
    offset: { x: 0, y: 0 },
    timeHold: 10
});

// Log if the image fails to load
background.image.onerror = function () {
    console.error('Failed to load background image:', background.image.src);
    alert('Failed to load background image: ' + background.image.src);
};

// Wait for the background image to load before starting animation
background.image.onload = function () {
    console.log('Background image loaded:', background.image.src);
    animate();
};

function animate() {
    if (isRunning) {
        requestAnimationFrame(animate);
    }
    background.update();
}
// Do not call animate() here; it will be called after the image loads

