import { loader } from "./loader.js";
import { map } from "./map.js";
import { cursor } from "./cursor.js";

document.onsubmit = function(event) {
    event.preventDefault();
};

export const $canvas = document.querySelector('.canvas');
const canvasCtx = $canvas.getContext('2d');

function getCellCoordsForCanvas({cellX, cellY}) {
    const imageX = (cellY + (cellX - map.getSize()) - 1) * tileHalfWidth - cameraX;
    const imageY = (cellY - (cellX - map.getSize()) - 1) * tileHalfHeight - cameraY;
    return {imageX, imageY};
}

export function getCellUnderCursor(cursorX, cursorY) {
    const cellX = map.getSize() + Math.ceil((cursorX + cameraX - 2 * (cursorY + cameraY) - tileHalfWidth) / tileWidth);
    const cellY = Math.ceil((cursorX + cameraX + 2 * (cursorY + cameraY) - tileHalfWidth) / tileWidth);
    return {cellX, cellY};
}

export const tileHeight = 32;
export const tileWidth = 64;
export const tileHalfHeight = tileHeight / 2;
export const tileHalfWidth = tileWidth / 2;
let screenHeight;
let screenWidth;
export let cameraX = 0;
export let cameraY = 0;
let cameraSpeedX = 0;
let cameraSpeedY = 0;
const cameraSpeedLimit = 50;
const frameLapse = 30;


function main() {
    loader.init();
    
    window.addEventListener('resize', () => {
        resize();
    });
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('keyup', handleKeyup);
    resize();
    let startTime = Date.now();
    const mainLoopInterval = setInterval(drawScene, frameLapse);

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
        cameraX += Math.floor(cameraSpeedX * deltaTime);
        cameraY += Math.floor(cameraSpeedY * deltaTime);
        //console.log(cameraX, cameraY);
        canvasCtx.fillRect(0, 0, screenWidth, screenHeight);

        const tilesPerRow = Math.floor(screenWidth / tileWidth);
        const tilesPerColumn = Math.floor(screenHeight / tileHeight);
        const startCellX = Math.floor(cameraX / tileWidth);
        const startCellY = Math.floor(cameraY / tileHeight);
        //console.log([startCellX, startCellY, startCellShiftX, startCellShiftY]);

        //canvasCtx.strokeStyle = "white"

        if (!map.isEmpty()) {
            const size = map.getGridSize();
            for (let row = 0; row < tilesPerColumn + 3; row++) {
                for (let col = 0; col < tilesPerRow + 3; col++) {
                    const cellY = startCellX + startCellY + col + row;
                    const cellX = startCellX - startCellY + map.getSize() + col - row;
                    if (map.isCellInsideMap({cellX, cellY})) {
                        const tileType = map.getCell({cellX, cellY});
                        const tileImg = loader.terrainTiles[tileType];
                        const {imageX, imageY} = getCellCoordsForCanvas({cellX, cellY});
                        canvasCtx.drawImage(tileImg, imageX, imageY);
                        //canvasCtx.strokeText(`${cellY}, ${cellX}`, imageX + 16, imageY + 20);
                    }                    
                }
                for (let col = 0; col < tilesPerRow + 2; col++) {
                    const cellY = startCellX + startCellY + col + 1 + row;
                    const cellX = startCellX - startCellY + map.getSize() + col - row;
                    if (map.isCellInsideMap({cellX, cellY})) {
                        const tileType = map.getCell({cellX, cellY});
                        const tileImg = loader.terrainTiles[tileType];
                        const {imageX, imageY} = getCellCoordsForCanvas({cellX, cellY});
                        canvasCtx.drawImage(tileImg, imageX, imageY);
                        //canvasCtx.strokeText(`${cellY}, ${cellX}`, imageX + 16, imageY + 20);
                    }
                }
            }
            if (cursor.getImage()) {
                if (map.isCellInsideMap(cursor.getCoords())) {
                    canvasCtx.globalAlpha = 0.5;
                    const {imageX, imageY} = getCellCoordsForCanvas(cursor.getCoords());
                    canvasCtx.drawImage(loader.terrainTiles[cursor.getImage()], imageX, imageY);
                    canvasCtx.globalAlpha = 1;
                }
            }            
        }        
    }

    function handleKeydown({key}) {
        switch (key) {
            case 'ArrowUp': 
                if (cameraSpeedY <= 0) cameraSpeedY = - cameraSpeedLimit;
                break;
            case 'ArrowDown':
                if (cameraSpeedY >= 0) cameraSpeedY = cameraSpeedLimit;
                break;
            case 'ArrowLeft':
                if (cameraSpeedX <= 0) cameraSpeedX = - cameraSpeedLimit;
                break;
            case 'ArrowRight':
                if (cameraSpeedX >= 0) cameraSpeedX = cameraSpeedLimit;
                break;
        }
    }

    function handleKeyup({key}) {
        switch (key) {
            case 'ArrowUp': 
                if (cameraSpeedY <= 0) cameraSpeedY = 0;
                break;
            case 'ArrowDown':
                if (cameraSpeedY >= 0) cameraSpeedY = 0;
                break;
            case 'ArrowLeft':
                if (cameraSpeedX <= 0) cameraSpeedX = 0;
                break;
            case 'ArrowRight':
                if (cameraSpeedX >= 0) cameraSpeedX = 0;
                break;
        }
    }
};

main();
