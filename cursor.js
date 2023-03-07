import { $canvas } from "./script.js";
import { getCellUnderCursor } from "./script.js";

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
    setImage: function(imageType) {
        this.imageType = imageType;
    },
    getImage: function() {
        return this.imageType;
    },
    setCursorMode: function(newMode) {
        const events = Object.keys(cursorFunctions[newMode]);
        for (let event of events) {
            $canvas.removeEventListener(event, cursorFunctions[this.mode][event]);
            $canvas.addEventListener(event, cursorFunctions[newMode][event]);
        }
        this.mode = newMode;
    }
};

const cursorFunctions = {
    terrain: {
        mousemove: function({clientX, clientY}) {
            if (!map.isEmpty()) {
                const {cellX, cellY} = getCellUnderCursor(clientX, clientY);
                if (cursor.isCellChanged(cellX, cellY)) {
                    cursor.setCoords(cellX, cellY);
                    if (cursor.isDragging && map.isCellInsideMap(cursor.getCoords())) {
                        map.setCell(cursor.getCoords(), cursor.getImage());
                    }
                }                
            }
        },
        mousedown: function() {
            if (!map.isEmpty()) {
                cursor.isDragging = true;
                if (map.isCellInsideMap(cursor.getCoords())) {
                    map.setCell(cursor.getCoords(), cursor.getImage());
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
