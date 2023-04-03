import { map } from "./map.js";
import { cursor } from "./cursor.js";
import { loader } from "./loader.js";

const CELL_HEIGHT = 32;
const CELL_WIDTH = 64;
const CELL_HALF_HEIGHT = CELL_HEIGHT / 2;
const CELL_HALF_WIDTH = CELL_WIDTH / 2;
const MAX_OBJECT_WIDTH = 10;
const MAX_OBJECT_HEIGHT = 30;

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
    cameraSpeedLimit: 150,
    init: function() {
        window.addEventListener('resize', () => {
            this.resize();
        });
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('keyup', handleKeyup);
        this.resize();
    },
    getCellUnderCursor: function(cursorX, cursorY) {
        const cellX = map.size.height + Math.ceil((cursorX + this.cameraCoords.x - 2 * (cursorY + this.cameraCoords.y) - CELL_HALF_WIDTH) / CELL_WIDTH);
        const cellY = Math.ceil((cursorX + this.cameraCoords.x + 2 * (cursorY + this.cameraCoords.y) - CELL_HALF_WIDTH) / CELL_WIDTH);
        return {cellX, cellY};
    },
    getImageCoordsForCanvas: function({cellX, cellY}, image, offsetX, offsetY, {dCellsX, dCellsY, dCellsHeight}) {
        const dx = dCellsX * CELL_HALF_WIDTH;
        const dy = (dCellsY == dCellsHeight) ? 0 : image.height - dCellsY * CELL_HALF_HEIGHT;
        const dWidth = image.width - dCellsX * CELL_HALF_HEIGHT;
        const dHeight = (dCellsY == dCellsHeight) ? image.height - (dCellsHeight - 1) * CELL_HALF_HEIGHT : CELL_HALF_HEIGHT;
        const imageX = (cellY + (cellX - map.size.height) - 1) * CELL_HALF_WIDTH - this.cameraCoords.x + offsetX;
        const imageY = (cellY - (cellX - map.size.height) + 1) * CELL_HALF_HEIGHT - this.cameraCoords.y - dHeight - offsetY;
        return {dx, dy, dWidth, dHeight, imageX, imageY};
    },
    isImageVisible: function(image, {imageX, imageY}) {
        return ((imageX >= 0 && imageX <= this.screenSize.width) || 
                (imageX + image.width >= 0 && imageX + image.width <= this.screenSize.width)) &&
                ((imageY >= 0 && imageY <= this.screenSize.height) || 
                (imageY + image.height >= 0 && imageY + image.height <= this.screenSize.height));
    },
    resize: function() {
        this.screenSize.height = document.documentElement.clientHeight;
        this.screenSize.width = document.documentElement.clientWidth;
        $canvas.setAttribute('height', this.screenSize.height);
        $canvas.setAttribute('width', this.screenSize.width);
    },
    drawCell: function(cellX, cellY, layer) {
        const content = map.getCellContent({cellX, cellY}, layer);
        if (content) {
            const {image, offsetX, offsetY} = content.getImageWithOffsets({cellX, cellY});
            if (image) {
                const {dx, dy, dWidth, dHeight, imageX, imageY} = this.getImageCoordsForCanvas({cellX, cellY}, image, offsetX, offsetY, content.class.getDelta(content.properties.coords, cellY));
                if (this.isImageVisible(image, {imageX, imageY})) canvasCtx.drawImage(image, dx, dy, dWidth, dHeight, imageX, imageY, dWidth, dHeight);

                //canvasCtx.strokeText(`${cellY}, ${cellX}`, imageX + 16, imageY + 20); 
            }
        }
    },
    drawRow: function(row, type, layer) {
        const rowLength = type == 'odd' ? this.screenCells.width + 3 : this.screenCells.width + 2;
        for (let col = -MAX_OBJECT_WIDTH; col < rowLength + MAX_OBJECT_WIDTH; col++) {
            const cellY = type == 'odd' ? this.startCell.x + this.startCell.y + col + row : this.startCell.x + this.startCell.y + col + 1 + row;
            const cellX = this.startCell.x - this.startCell.y + map.size.height + col - row;
            if (map.isCellInsideMap({cellX, cellY})) {
                this.drawCell(cellX, cellY, layer);                       
            }                    
        }
    },
    drawScene: function(deltaTime) {
        const newCameraX = this.cameraCoords.x + Math.floor(this.cameraSpeed.x * deltaTime);
        const newCameraY = this.cameraCoords.y + Math.floor(this.cameraSpeed.y * deltaTime);
        if (!map.isEmpty() && newCameraX >= 0 && newCameraX <= map.size.width * CELL_WIDTH - this.screenSize.width) this.cameraCoords.x = newCameraX;
        if (!map.isEmpty() && newCameraY >= 0 && newCameraY <= map.size.height * CELL_HEIGHT - this.screenSize.height) this.cameraCoords.y = newCameraY;
        //console.log(cameraCoords.x, cameraCoords.y);
        canvasCtx.fillRect(0, 0, this.screenSize.width, this.screenSize.height);

        this.screenCells.width = Math.floor(this.screenSize.width / CELL_WIDTH);
        this.screenCells.height = Math.floor(this.screenSize.height / CELL_HEIGHT);
        this.startCell.x = Math.floor(this.cameraCoords.x / CELL_WIDTH);
        this.startCell.y = Math.floor(this.cameraCoords.y / CELL_HEIGHT);

        //canvasCtx.strokeStyle = "white"

        if (!map.isEmpty()) {
            for (let row = 0; row < this.screenCells.height + 3 + MAX_OBJECT_HEIGHT; row++) {
                this.drawRow(row, 'odd', 'terrain');
                this.drawRow(row, 'even', 'terrain');
            }
            for (let row = 0; row < this.screenCells.height + 3 + MAX_OBJECT_HEIGHT; row++) {
                this.drawRow(row, 'odd', 'object');
                this.drawRow(row, 'even', 'object');
            }
            if (cursor.getClass() && map.isCellInsideMap(cursor.getCoords())) {
                canvasCtx.globalAlpha = 0.5;
                const className = cursor.getClass();
                const image = className.image;
                const {cellX, cellY} = cursor.getCoords();
                for (let row = className.size.rightLength - 1; row >= 0; row--) {
                    const {dx, dy, dWidth, dHeight, imageX, imageY} = this.getImageCoordsForCanvas({cellX, cellY: cellY - row}, image, className.offset.x, className.offset.y, className.getDelta({cellX, cellY}, cellY - row));
                    canvasCtx.drawImage(image, dx, dy, dWidth, dHeight, imageX, imageY, dWidth, dHeight);
                }
                if (cursor.obstacles) {
                    const obstacleClass = loader.getClass('obstacle');
                    const obstacleImage = obstacleClass.image;
                    const buildIndicatorClass = loader.getClass('buildIndicator');
                    const buildIndiatorImage = buildIndicatorClass.image;
                    const buildIndicators = [];
                    for (let row = 0; row < className.size.rightLength; row++) {
                        const buildIndicatorsRow = [];
                        for (let cell = 0; cell < className.size.leftLength; cell++) {
                            buildIndicatorsRow.push('indicator');
                        }
                        buildIndicators.push(buildIndicatorsRow);
                    }
                    for (let {cellX, cellY} of cursor.obstacles) {
                        buildIndicators[className.size.rightLength - (cursor.getCoords().cellY - cellY + 1)][cellX - cursor.getCoords().cellX] = 'obstacle';
                    }
                    for (let row = 0; row < buildIndicators.length; row++) {
                        for (let col = 0; col < buildIndicators[row].length; col++) {
                            if (buildIndicators[row][col] == 'indicator') {
                                const {dx, dy, dWidth, dHeight, imageX, imageY} = this.getImageCoordsForCanvas({cellX: cursor.getCoords().cellX + col, cellY: cursor.getCoords().cellY - (className.size.rightLength - row - 1)}, buildIndiatorImage, buildIndicatorClass.offset.x, buildIndicatorClass.offset.y, buildIndicatorClass.getDelta({cellX, cellY}, cellY));
                                canvasCtx.drawImage(buildIndiatorImage, dx, dy, dWidth, dHeight, imageX, imageY, dWidth, dHeight);
                            } else {
                                const {dx, dy, dWidth, dHeight, imageX, imageY} = this.getImageCoordsForCanvas({cellX: cursor.getCoords().cellX + col, cellY: cursor.getCoords().cellY - (className.size.rightLength - row - 1)}, obstacleImage, obstacleClass.offset.x, obstacleClass.offset.y, obstacleClass.getDelta({cellX, cellY}, cellY));
                                canvasCtx.drawImage(obstacleImage, dx, dy, dWidth, dHeight, imageX, imageY, dWidth, dHeight);
                            }
                        }
                    }
                }
                canvasCtx.globalAlpha = 1;
            }           
        }        
    }
}

function handleKeydown({key}) {
    if ($canvas == document.activeElement) {
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
}

function handleKeyup({key}) {
    if ($canvas == document.activeElement) {
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
}
