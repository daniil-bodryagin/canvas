import { map } from "./map.js";
import { cursor } from "./cursor.js";
import { loader } from "./loader.js";

const tileHeight = 32;
const tileWidth = 64;
const tileHalfHeight = tileHeight / 2;
const tileHalfWidth = tileWidth / 2;
const cameraSpeedLimit = 50;

export const $canvas = document.querySelector('.canvas');
const canvasCtx = $canvas.getContext('2d');

export const camera = {
    screenHeight: 0,
    screenWidth: 0,
    cameraX: 0,
    cameraY: 0,
    cameraSpeedX: 0,
    cameraSpeedY: 0,
    init: function() {
        window.addEventListener('resize', () => {
            this.resize();
        });
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('keyup', handleKeyup);
        this.resize();
    },
    getCellUnderCursor: function(cursorX, cursorY) {
        const cellX = map.getSize() + Math.ceil((cursorX + this.cameraX - 2 * (cursorY + this.cameraY) - tileHalfWidth) / tileWidth);
        const cellY = Math.ceil((cursorX + this.cameraX + 2 * (cursorY + this.cameraY) - tileHalfWidth) / tileWidth);
        return {cellX, cellY};
    },
    getCellCoordsForCanvas: function({cellX, cellY}) {
        const imageX = (cellY + (cellX - map.getSize()) - 1) * tileHalfWidth - this.cameraX;
        const imageY = (cellY - (cellX - map.getSize()) - 1) * tileHalfHeight - this.cameraY;
        return {imageX, imageY};
    },
    resize: function() {
        this.screenHeight = document.documentElement.clientHeight;
        this.screenWidth = document.documentElement.clientWidth;
        $canvas.setAttribute('height', this.screenHeight);
        $canvas.setAttribute('width', this.screenWidth);
    },
    drawScene: function(deltaTime) {
        this.cameraX += Math.floor(this.cameraSpeedX * deltaTime);
        this.cameraY += Math.floor(this.cameraSpeedY * deltaTime);
        //console.log(cameraX, cameraY);
        canvasCtx.fillRect(0, 0, this.screenWidth, this.screenHeight);

        const tilesPerRow = Math.floor(this.screenWidth / tileWidth);
        const tilesPerColumn = Math.floor(this.screenHeight / tileHeight);
        const startCellX = Math.floor(this.cameraX / tileWidth);
        const startCellY = Math.floor(this.cameraY / tileHeight);
        //console.log([startCellX, startCellY, startCellShiftX, startCellShiftY]);

        //canvasCtx.strokeStyle = "white"

        if (!map.isEmpty()) {
            for (let row = 0; row < tilesPerColumn + 3; row++) {
                for (let col = 0; col < tilesPerRow + 3; col++) {
                    const cellY = startCellX + startCellY + col + row;
                    const cellX = startCellX - startCellY + map.getSize() + col - row;
                    if (map.isCellInsideMap({cellX, cellY})) {
                        const tileType = map.getCellTerrain({cellX, cellY}); /////////////////////////////
                        const tileImg = loader.getAsset(tileType); /////////////////////////////
                        const {imageX, imageY} = this.getCellCoordsForCanvas({cellX, cellY});
                        canvasCtx.drawImage(tileImg, imageX, imageY);
                        //canvasCtx.strokeText(`${cellY}, ${cellX}`, imageX + 16, imageY + 20);

                        const objectType = map.getCellObject({cellX, cellY}); /////////////////////////////
                        if (objectType) { /////////////////////////////
                            const objectImg = loader.getAsset(objectType); /////////////////////////////
                            const {imageX: imageX1, imageY: imageY1} = this.getCellCoordsForCanvas({cellX, cellY}); /////////////////////////////
                            canvasCtx.drawImage(objectImg, imageX1, imageY1); /////////////////////////////
                        }
                    }                    
                }
                for (let col = 0; col < tilesPerRow + 2; col++) {
                    const cellY = startCellX + startCellY + col + 1 + row;
                    const cellX = startCellX - startCellY + map.getSize() + col - row;
                    if (map.isCellInsideMap({cellX, cellY})) {
                        const tileType = map.getCellTerrain({cellX, cellY}); /////////////////////////////
                        const tileImg = loader.getAsset(tileType); /////////////////////////////
                        const {imageX, imageY} = this.getCellCoordsForCanvas({cellX, cellY});
                        canvasCtx.drawImage(tileImg, imageX, imageY);
                        //canvasCtx.strokeText(`${cellY}, ${cellX}`, imageX + 16, imageY + 20);

                        const objectType = map.getCellObject({cellX, cellY}); /////////////////////////////
                        if (objectType) { /////////////////////////////
                            const objectImg = loader.getAsset(objectType); /////////////////////////////
                            const {imageX: imageX1, imageY: imageY1} = this.getCellCoordsForCanvas({cellX, cellY}); /////////////////////////////
                            canvasCtx.drawImage(objectImg, imageX1, imageY1);///////////////////////////// 
                        }
                    }
                }
            }
            if (cursor.getImage() && map.isCellInsideMap(cursor.getCoords())) {
                canvasCtx.globalAlpha = 0.5;
                const {imageX, imageY} = this.getCellCoordsForCanvas(cursor.getCoords());
                canvasCtx.drawImage(loader.getAsset(cursor.getImage()), imageX, imageY);
                canvasCtx.globalAlpha = 1;
            }           
        }        
    }
}

function handleKeydown({key}) {
    switch (key) {
        case 'ArrowUp': 
            if (camera.cameraSpeedY <= 0) camera.cameraSpeedY = - cameraSpeedLimit;
            break;
        case 'ArrowDown':
            if (camera.cameraSpeedY >= 0) camera.cameraSpeedY = cameraSpeedLimit;
            break;
        case 'ArrowLeft':
            if (camera.cameraSpeedX <= 0) camera.cameraSpeedX = - cameraSpeedLimit;
            break;
        case 'ArrowRight':
            if (camera.cameraSpeedX >= 0) camera.cameraSpeedX = cameraSpeedLimit;
            break;
    }
}

function handleKeyup({key}) {
    switch (key) {
        case 'ArrowUp': 
            if (camera.cameraSpeedY <= 0) camera.cameraSpeedY = 0;
            break;
        case 'ArrowDown':
            if (camera.cameraSpeedY >= 0) camera.cameraSpeedY = 0;
            break;
        case 'ArrowLeft':
            if (camera.cameraSpeedX <= 0) camera.cameraSpeedX = 0;
            break;
        case 'ArrowRight':
            if (camera.cameraSpeedX >= 0) camera.cameraSpeedX = 0;
            break;
    }
}
