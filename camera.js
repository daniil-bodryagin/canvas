import { gameMap } from "./gameMap.js";
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
const $selectionCanvas = document.querySelector('.selection');
const selectionCtx = $selectionCanvas.getContext('2d', { willReadFrequently: true });

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
        const cellX = gameMap.size.height + Math.ceil((cursorX + this.cameraCoords.x - 2 * (cursorY + this.cameraCoords.y) - CELL_HALF_WIDTH) / CELL_WIDTH);
        const cellY = Math.ceil((cursorX + this.cameraCoords.x + 2 * (cursorY + this.cameraCoords.y) - CELL_HALF_WIDTH) / CELL_WIDTH);
        return {cellX, cellY};
    },
    getShadowColorUnderCursor: function(cursorX, cursorY) {
        return selectionCtx.getImageData(cursorX, cursorY, 1, 1);
    },
    getImageCoordsForCanvas: function({cellX, cellY}, image, offsetX, offsetY, {startLine, endLine, upLine, shift}) {
        let dx;
        let dWidth;
        let imageX;
        if (offsetX > endLine * CELL_HALF_WIDTH || offsetX + image.width < startLine * CELL_HALF_WIDTH) {
            dx = 0;
            dWidth = 0;
            imageX = endLine * CELL_HALF_WIDTH;
        } else if (offsetX > startLine * CELL_HALF_WIDTH) {
            dx = 0;
            if (offsetX + image.width < endLine * CELL_HALF_WIDTH) dWidth = image.width;
            else dWidth = endLine * CELL_HALF_WIDTH - offsetX;
            imageX = (cellY + (cellX - gameMap.size.height) - 1) * CELL_HALF_WIDTH - this.cameraCoords.x + offsetX + shift * CELL_HALF_WIDTH;
        } else {
            dx = startLine * CELL_HALF_WIDTH - offsetX;
            if (offsetX + image.width < endLine * CELL_HALF_WIDTH) dWidth = offsetX + image.width - startLine * CELL_HALF_WIDTH;
            else dWidth = (endLine - startLine) * CELL_HALF_WIDTH;
            imageX = (cellY + (cellX - gameMap.size.height) - 1) * CELL_HALF_WIDTH - this.cameraCoords.x + shift * CELL_HALF_WIDTH;
        }        
        const dy = 0;
        const dHeight = image.height;
        const imageY = (cellY - (cellX - gameMap.size.height) + upLine + 1) * CELL_HALF_HEIGHT - this.cameraCoords.y - image.height - offsetY;
        return {dx, dy, dWidth, dHeight, imageX, imageY};
    },
    getFrameCoords: function(object) {
        const cellX = object.properties.coords.cellX;
        const cellY = object.properties.coords.cellY;
        const image = object.class.image;
        const offsetX = object.class.offset.x;
        const offsetY = object.class.offset.y;
        const shift = (object.class.size.rightLength - 1) * CELL_HALF_WIDTH;
        const frameStartX = (cellY + (cellX - gameMap.size.height) - 1) * CELL_HALF_WIDTH + offsetX - this.cameraCoords.x - shift - 1;
        const frameStartY = (cellY - (cellX - gameMap.size.height) + 1) * CELL_HALF_HEIGHT - this.cameraCoords.y - image.height - offsetY - 1;
        const frameEndX = frameStartX + image.width + 1;
        const frameEndY = frameStartY + image.height + 1
        //return {frameStartX, frameStartY, frameEndX, frameEndY};
        const width = image.width + 1;
        const height = image.height + 1;
        return {frameStartX, frameStartY, width, height};
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
        $selectionCanvas.setAttribute('height', this.screenSize.height);
        $selectionCanvas.setAttribute('width', this.screenSize.width);
    },
    drawCursor: function() {
        canvasCtx.globalAlpha = 0.5;
        const className = cursor.getClass();
        const image = className.image;
        const {cellX, cellY} = cursor.getCoords();
        for (let row = className.size.rightLength - 1; row >= 0; row--) {
            for (let col = 0; col < className.size.leftLength; col++) {
                if (row == 0 || col == 0) {
                    const {dx, dy, dWidth, dHeight, imageX, imageY} = this.getImageCoordsForCanvas({cellX: cellX + col, cellY: cellY - row}, image, className.offset.x, className.offset.y, className.getDelta({cellX, cellY}, cellX + col, cellY - row));
                    canvasCtx.drawImage(image, dx, dy, dWidth, dHeight, imageX, imageY, dWidth, dHeight);
                }
            }
        }
        if (cursor.obstacles) {
            const obstacleClass = loader.getClass('obstacle');
            const obstacleImage = obstacleClass.image;
            const buildIndicatorClass = loader.getClass('buildIndicator');
            const buildIndicatorImage = buildIndicatorClass.image;
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
                        const {dx, dy, dWidth, dHeight, imageX, imageY} = this.getImageCoordsForCanvas({cellX: cursor.getCoords().cellX + col, cellY: cursor.getCoords().cellY - (className.size.rightLength - row - 1)}, buildIndicatorImage, buildIndicatorClass.offset.x, buildIndicatorClass.offset.y, buildIndicatorClass.getDelta({cellX, cellY}, cellX, cellY));
                        canvasCtx.drawImage(buildIndicatorImage, dx, dy, dWidth, dHeight, imageX, imageY, dWidth, dHeight);
                    } else {
                        const {dx, dy, dWidth, dHeight, imageX, imageY} = this.getImageCoordsForCanvas({cellX: cursor.getCoords().cellX + col, cellY: cursor.getCoords().cellY - (className.size.rightLength - row - 1)}, obstacleImage, obstacleClass.offset.x, obstacleClass.offset.y, obstacleClass.getDelta({cellX, cellY}, cellX, cellY));
                        canvasCtx.drawImage(obstacleImage, dx, dy, dWidth, dHeight, imageX, imageY, dWidth, dHeight);
                    }
                }
            }
        }
        canvasCtx.globalAlpha = 1;
    },
    drawSelectionFrame: function() {
        //const {frameStartX, frameStartY, frameEndX, frameEndY} = this.getFrameCoords(cursor.selectedObject);
        const {frameStartX, frameStartY, width, height} = this.getFrameCoords(cursor.selectedObject);
        canvasCtx.strokeRect(frameStartX, frameStartY, width, height);
        // canvasCtx.beginPath();
        // canvasCtx.moveTo(frameStartX, frameStartY);
        // canvasCtx.lineTo(frameEndX, frameEndY);
        // canvasCtx.stroke();
    },
    drawCell: function(cellX, cellY, layer) {
        const content = gameMap.getCellContent({cellX, cellY}, layer);
        if (content) {
            const {image, offsetX, offsetY} = content.getImageWithOffsets({cellX, cellY});
            if (image) {
                const {dx, dy, dWidth, dHeight, imageX, imageY} = this.getImageCoordsForCanvas({cellX, cellY}, image, offsetX, offsetY, content.class.getDelta(content.properties.coords, cellX, cellY));
                if (this.isImageVisible(image, {imageX, imageY})) {
                    canvasCtx.drawImage(image, dx, dy, dWidth, dHeight, imageX, imageY, dWidth, dHeight);
                    if (layer == 'object') {
                        const shadow = content.getShadow({cellX, cellY});
                        selectionCtx.drawImage(shadow, dx, dy, dWidth, dHeight, imageX, imageY, dWidth, dHeight);
                    }
                }
                //canvasCtx.strokeText(`${cellY}, ${cellX}`, imageX + 16, imageY + 20); 
            }
        }
    },
    drawRow: function(row, type, layer) {
        const rowLength = type == 'odd' ? this.screenCells.width + 3 : this.screenCells.width + 2;
        for (let col = -MAX_OBJECT_WIDTH; col < rowLength + MAX_OBJECT_WIDTH; col++) {
            const cellY = type == 'odd' ? this.startCell.x + this.startCell.y + col + row : this.startCell.x + this.startCell.y + col + 1 + row;
            const cellX = this.startCell.x - this.startCell.y + gameMap.size.height + col - row;
            if (gameMap.isCellInsideMap({cellX, cellY})) {
                this.drawCell(cellX, cellY, layer);                       
            }                    
        }
    },
    drawScene: function(deltaTime) {
        const newCameraX = this.cameraCoords.x + Math.floor(this.cameraSpeed.x * deltaTime);
        const newCameraY = this.cameraCoords.y + Math.floor(this.cameraSpeed.y * deltaTime);
        if (!gameMap.isEmpty() && newCameraX >= 0 && newCameraX <= gameMap.size.width * CELL_WIDTH - this.screenSize.width) this.cameraCoords.x = newCameraX;
        if (!gameMap.isEmpty() && newCameraY >= 0 && newCameraY <= gameMap.size.height * CELL_HEIGHT - this.screenSize.height) this.cameraCoords.y = newCameraY;
        //console.log(cameraCoords.x, cameraCoords.y);
        canvasCtx.fillRect(0, 0, this.screenSize.width, this.screenSize.height);
        selectionCtx.fillRect(0, 0, this.screenSize.width, this.screenSize.height);

        this.screenCells.width = Math.floor(this.screenSize.width / CELL_WIDTH);
        this.screenCells.height = Math.floor(this.screenSize.height / CELL_HEIGHT);
        this.startCell.x = Math.floor(this.cameraCoords.x / CELL_WIDTH);
        this.startCell.y = Math.floor(this.cameraCoords.y / CELL_HEIGHT);

        canvasCtx.strokeStyle = "white"

        if (!gameMap.isEmpty()) {
            for (let row = 0; row < this.screenCells.height + 3 + MAX_OBJECT_HEIGHT; row++) {
                this.drawRow(row, 'odd', 'terrain');
                this.drawRow(row, 'even', 'terrain');
            }
            for (let row = 0; row < this.screenCells.height + 3 + MAX_OBJECT_HEIGHT; row++) {
                this.drawRow(row, 'odd', 'object');
                this.drawRow(row, 'even', 'object');
            }
            if (cursor.getClass() && gameMap.isCellInsideMap(cursor.getCoords())) {
                this.drawCursor();
            }
            if (cursor.selectedObject) {
                this.drawSelectionFrame();
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
