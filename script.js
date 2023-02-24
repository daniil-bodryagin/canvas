const $canvas = document.querySelector('.canvas');
const canvasCtx = $canvas.getContext('2d');
const tileHalfHeight = 8;
const tileHalfWidth = 16;
const mapSideLength = 99;
const mapHalfLength = parseInt((mapSideLength - 1) / 2);
let screenHeight;
let screenWidth;
let cameraX = 0;
let cameraY = 0;
let cameraSpeedX = 0;
let cameraSpeedY = 0;
const cameraSpeedLimit = 50;
const frameLapse = 30;

const map = [];
for (let row = 0; row < mapSideLength; row++) {
    const mapRow = [];
    for (let col = 0; col < mapSideLength; col++) {
        mapRow.push('sample.png');
    }
    map.push(mapRow);
}
const tiles = {};
const tileSources = ['sample.png'];
const tileLoadMarkers = tileSources.map(tileSource => new Promise(resolve => {
    const tileImg = new Image();
    tileImg.src = tileSource;
    tiles[tileSource] = tileImg;
    tileImg.onload = resolve;
}));
Promise.all(tileLoadMarkers).then(main);

function main() {
    window.addEventListener('resize', () => {
        resize();
    });
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('keyup', handleKeyup);
    resize();
    let startTime = Date.now();
    const mainLoop = setInterval(drawScene, frameLapse);

    function resize() {
        screenHeight = document.documentElement.clientHeight;
        screenWidth = document.documentElement.clientWidth;
        $canvas.setAttribute('height', screenHeight);
        $canvas.setAttribute('width', screenWidth);
    }

    function drawScene() {
        const newTime = Date.now();
        const deltaTime = (newTime - startTime) / 1000;
        //console.log(deltaTime);
        startTime = newTime;
        cameraX += cameraSpeedX * deltaTime;
        cameraY += cameraSpeedY * deltaTime;
        canvasCtx.fillRect(0, 0, screenWidth, screenHeight);

        const tilesPerRow = Math.ceil(screenWidth / (2 * tileHalfWidth)) + 1;
        const tilesPerColumn = Math.ceil(screenHeight / (2 * tileHalfHeight)) + 1;
        const startCellX = parseInt(cameraX / 32);
        const startCellY = parseInt(cameraY / 16);
        const startCellShiftX = parseInt(cameraX % 32);
        const startCellShiftY = parseInt(cameraY % 16);
        //console.log([startCellX, startCellY, startCellShiftX, startCellShiftY]);
        for (let col = -1; col <= tilesPerColumn; col++) {
            for (let row = -1; row <= tilesPerRow; row++) {
                if (map[startCellX + row + startCellY + col] && map[startCellX + row + startCellY + col][startCellX + row - startCellY - col + mapHalfLength]) {
                    const tileType = map[startCellX + row + startCellY + col][startCellX + row - startCellY - col + mapHalfLength];
                    const tileImg = tiles[tileType];
                    canvasCtx.drawImage(tileImg, row * 2 * tileHalfWidth - startCellShiftX - tileHalfWidth, col * 2 * tileHalfHeight - startCellShiftY - tileHalfHeight);
                }                
            }
            for (let row = -1; row <= tilesPerRow; row++) {
                if (map[startCellX + row + startCellY + col + 1] && map[startCellX + row + startCellY + col + 1][startCellX + row - startCellY - col + mapHalfLength]) {
                    const tileType = map[startCellX + row + startCellY + col + 1][startCellX + row - startCellY - col + mapHalfLength];
                    const tileImg = tiles[tileType];
                    canvasCtx.drawImage(tileImg, row * 2 * tileHalfWidth - startCellShiftX, col * 2 * tileHalfHeight - startCellShiftY);
                }
            }
        }
    }

    function handleKeydown({key}) {
        switch (key) {
            case 'ArrowUp': 
                if (cameraSpeedY >= 0) cameraSpeedY = cameraSpeedLimit;
                break;
            case 'ArrowDown':
                if (cameraSpeedY <= 0) cameraSpeedY = -cameraSpeedLimit;
                break;
            case 'ArrowLeft':
                if (cameraSpeedX >= 0) cameraSpeedX = cameraSpeedLimit;
                break;
            case 'ArrowRight':
                if (cameraSpeedX <= 0) cameraSpeedX = -cameraSpeedLimit;
                break;
        }
    }

    function handleKeyup({key}) {
        switch (key) {
            case 'ArrowUp': 
                if (cameraSpeedY >= 0) cameraSpeedY = 0;
                break;
            case 'ArrowDown':
                if (cameraSpeedY <= 0) cameraSpeedY = 0;
                break;
            case 'ArrowLeft':
                if (cameraSpeedX >= 0) cameraSpeedX = 0;
                break;
            case 'ArrowRight':
                if (cameraSpeedX <= 0) cameraSpeedX = 0;
                break;
        }
    }
};






