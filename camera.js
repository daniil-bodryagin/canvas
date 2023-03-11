import { map } from "./map.js";
import { cursor } from "./cursor.js";
import { loader } from "./loader.js";

const CELL_HEIGHT = 32;
const CELL_WIDTH = 64;
const CELL_HALF_HEIGHT = CELL_HEIGHT / 2;
const CELL_HALF_WIFTH = CELL_WIDTH / 2;

export const $canvas = document.querySelector('.canvas');
const canvasCtx = $canvas.getContext('2d');

export const camera = {
    screenSize: {
        width: 0,
        height: 0
    },
    screenCells: {
        width: 0,
        height: 0
    },
    cameraCoords: {
        x: 0,
        y: 0
    },
    startCell: {
        x: 0,
        y: 0
    },
    cameraSpeed: {
        x: 0,
        y: 0
    },
    cameraSpeedLimit: 50,
    init: function() {
        window.addEventListener('resize', () => {
            this.resize();
        });
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('keyup', handleKeyup);
        this.resize();
    },
    getCellUnderCursor: function(cursorX, cursorY) {
        const cellX = map.getSize() + Math.ceil((cursorX + this.cameraCoords.x - 2 * (cursorY + this.cameraCoords.y) - CELL_HALF_WIFTH) / CELL_WIDTH);
        const cellY = Math.ceil((cursorX + this.cameraCoords.x + 2 * (cursorY + this.cameraCoords.y) - CELL_HALF_WIFTH) / CELL_WIDTH);
        return {cellX, cellY};
    },
    getCellCoordsForCanvas: function({cellX, cellY}) {
        const imageX = (cellY + (cellX - map.getSize()) - 1) * CELL_HALF_WIFTH - this.cameraCoords.x;
        const imageY = (cellY - (cellX - map.getSize()) - 1) * CELL_HALF_HEIGHT - this.cameraCoords.y;
        return {imageX, imageY};
    },
    resize: function() {
        this.screenSize.height = document.documentElement.clientHeight;
        this.screenSize.width = document.documentElement.clientWidth;
        $canvas.setAttribute('height', this.screenSize.height);
        $canvas.setAttribute('width', this.screenSize.width);
    },
    drawCell: function(cellX, cellY, layer) {
        const assetName = map.getCellContent({cellX, cellY}, layer);
        if (assetName) {
            const assetImg = loader.getAssetImage(assetName);
            const {imageX, imageY} = this.getCellCoordsForCanvas({cellX, cellY});
            canvasCtx.drawImage(assetImg, imageX, imageY);
        }
    },
    drawRow: function(row, type) {
        const rowLength = type == 'odd' ? this.screenCells.width + 3 : this.screenCells.width + 2;
        for (let col = 0; col < rowLength; col++) {
            const cellY = type == 'odd' ? this.startCell.x + this.startCell.y + col + row : this.startCell.x + this.startCell.y + col + 1 + row;
            const cellX = this.startCell.x - this.startCell.y + map.getSize() + col - row;
            if (map.isCellInsideMap({cellX, cellY})) {
                this.drawCell(cellX, cellY, 'terrain');
                this.drawCell(cellX, cellY, 'object');
                //canvasCtx.strokeText(`${cellY}, ${cellX}`, imageX + 16, imageY + 20);                        
            }                    
        }
    },
    drawScene: function(deltaTime) {
        this.cameraCoords.x += Math.floor(this.cameraSpeed.x * deltaTime);
        this.cameraCoords.y += Math.floor(this.cameraSpeed.y * deltaTime);
        //console.log(cameraCoords.x, cameraCoords.y);
        canvasCtx.fillRect(0, 0, this.screenSize.width, this.screenSize.height);

        this.screenCells.width = Math.floor(this.screenSize.width / CELL_WIDTH);
        this.screenCells.height = Math.floor(this.screenSize.height / CELL_HEIGHT);
        this.startCell.x = Math.floor(this.cameraCoords.x / CELL_WIDTH);
        this.startCell.y = Math.floor(this.cameraCoords.y / CELL_HEIGHT);

        //canvasCtx.strokeStyle = "white"

        if (!map.isEmpty()) {
            for (let row = 0; row < this.screenCells.height + 3; row++) {
                this.drawRow(row, 'odd');
                this.drawRow(row, 'even');
            }
            if (cursor.getImage() && map.isCellInsideMap(cursor.getCoords())) {
                canvasCtx.globalAlpha = 0.5;
                const {imageX, imageY} = this.getCellCoordsForCanvas(cursor.getCoords());
                canvasCtx.drawImage(loader.getAssetImage(cursor.getImage()), imageX, imageY);
                canvasCtx.globalAlpha = 1;
            }           
        }        
    }
}

function handleKeydown({key}) {
    switch (key) {
        case 'ArrowUp': 
            if (camera.cameraSpeed.y <= 0) camera.cameraSpeed.y = - camera.cameraSpeedLimit;
            break;
        case 'ArrowDown':
            if (camera.cameraSpeed.y >= 0) camera.cameraSpeed.y = camera.cameraSpeedLimit;
            break;
        case 'ArrowLeft':
            if (camera.cameraSpeed.x <= 0) camera.cameraSpeed.x = - camera.cameraSpeedLimit;
            break;
        case 'ArrowRight':
            if (camera.cameraSpeed.x >= 0) camera.cameraSpeed.x = camera.cameraSpeedLimit;
            break;
    }
}

function handleKeyup({key}) {
    switch (key) {
        case 'ArrowUp': 
            if (camera.cameraSpeed.y <= 0) camera.cameraSpeed.y = 0;
            break;
        case 'ArrowDown':
            if (camera.cameraSpeed.y >= 0) camera.cameraSpeed.y = 0;
            break;
        case 'ArrowLeft':
            if (camera.cameraSpeed.x <= 0) camera.cameraSpeed.x = 0;
            break;
        case 'ArrowRight':
            if (camera.cameraSpeed.x >= 0) camera.cameraSpeed.x = 0;
            break;
    }
}