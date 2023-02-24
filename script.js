const fieldCanvas = document.querySelector('.field');
const screenHeight = document.documentElement.clientHeight;
const screenWidth = document.documentElement.clientWidth;
fieldCanvas.setAttribute('height', screenHeight);
fieldCanvas.setAttribute('width', screenWidth);
window.addEventListener('resize', () => {
    const screenHeight = document.documentElement.clientHeight;
    const screenWidth = document.documentElement.clientWidth;
    fieldCanvas.setAttribute('height', screenHeight);
    fieldCanvas.setAttribute('width', screenWidth);
    drawScene();
});
const field = fieldCanvas.getContext('2d');
const sample = new Image();
sample.src = 'sample.png';
const sampleHeight = 8;
const sampleWidth = 16;
sample.onload = drawScene;
const sideLength = 50;
function drawScene() {
    field.fillRect(0, 0, screenWidth, screenHeight);
    for (let row = 0; row < sideLength; row++) {
        for (let col = 0; col < sideLength; col++) {
            field.drawImage(sample, row * sampleWidth + col * sampleWidth, (sideLength - 1) * sampleHeight + row * sampleHeight - col * sampleHeight);
        }
    }
}
