const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
// canvas.width = 1080;
// canvas.height = 640; // This is the canvas height for the map
let isRunning = true;
const background = new Sprite({
    postion: {
        x: 0,
        y: 0
    },
    imageSrc: './Assets/sky.png'
});
function animate() {
    if (isRunning) {
        requestAnimationFrame(animate);
    }
    background.update();
}
animate();
