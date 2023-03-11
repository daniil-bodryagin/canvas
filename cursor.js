import { $canvas, camera } from "./camera.js";
import { map } from "./map.js";

export const cursor = {
    mode: 'stop',
    isCellChanged: function(cellX, cellY) {
        return cellX != this.cellX || cellY != this.cellY;
    },
    setCoords: function(cellX, cellY) {
        this.cellX = cellX;
        this.cellY = cellY;
    },
    getCoords: function() {
        const cellX = this.cellX;
        const cellY = this.cellY;
        return {cellX, cellY};
    },
    setImage: function(assetName) {
        this.assetName = assetName;
    },
    getImage: function() {
        return this.assetName;
    },
    setCursorMode: function(newMode, kind) {
        const events = Object.keys(cursorFunctions[newMode]);
        for (let event of events) {
            $canvas.removeEventListener(event, cursorFunctions[this.mode][event]);
            $canvas.addEventListener(event, cursorFunctions[newMode][event]);
        }
        this.layer = kind == 'terrain' ? 'terrain' : 'object';
        this.mode = newMode;
    }
};

const cursorFunctions = {
    assets: {
        mousemove: function({clientX, clientY}) {
            if (!map.isEmpty()) {
                const {cellX, cellY} = camera.getCellUnderCursor(clientX, clientY);
                if (cursor.isCellChanged(cellX, cellY)) {
                    cursor.setCoords(cellX, cellY);
                    if (cursor.isDragging && map.isCellInsideMap(cursor.getCoords())) {
                        map.setCellContent(cursor.getCoords(), cursor.getImage(), cursor.layer);
                    }
                }                
            }
        },
        mousedown: function() {
            if (!map.isEmpty()) {
                cursor.isDragging = true;
                if (map.isCellInsideMap(cursor.getCoords())) {
                    map.setCellContent(cursor.getCoords(), cursor.getImage(), cursor.layer);
                }
            }
        },
        mouseup: function() {
            if (!map.isEmpty()) {
                cursor.isDragging = false;
            }
        },
        mouseout: function () {
            if (!map.isEmpty()) {
                cursor.setCoords(Infinity, Infinity);
                cursor.isDragging = false;
            }
        }
    },
    stop: {
        mousemove: null,
        mousedown: null,
        mouseup: null,
        mouseout: null
    }
}