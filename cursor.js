import { $canvas, camera } from "./camera.js";
import { map } from "./map.js";

export const cursor = {
    mode: 'stop',
    obstacles: null,
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
    setClass: function(className) {
        this.class = className;
    },
    getClass: function() {
        return this.class;
    },
    setCursorMode: function(newMode, kind) {
        const events = Object.keys(cursorFunctions[newMode]);
        for (let event of events) {
            $canvas.removeEventListener(event, cursorFunctions[this.mode][event]);
            $canvas.addEventListener(event, cursorFunctions[newMode][event]);
        }
        this.layer = kind == 'terrains' ? 'terrain' : 'object';
        this.mode = newMode;
    }
};

const placeObject = function() {
    const className = cursor.getClass();
    const object = className.create({coords: cursor.getCoords()});
    map.setCellContent(cursor.getCoords(), object, cursor.layer);
    map.addToList(object);

}

const cursorFunctions = {
    assets: {
        mousemove: function({clientX, clientY}) {
            if (!map.isEmpty()) {
                const {cellX, cellY} = camera.getCellUnderCursor(clientX, clientY);
                if (cursor.isCellChanged(cellX, cellY)) {
                    cursor.setCoords(cellX, cellY);
                    cursor.obstacles = map.getObstacles(cursor.getCoords(), cursor.getClass());
                    if (cursor.isDragging && !cursor.obstacles) {
                        placeObject();
                    } 
                }                
            }
        },
        mousedown: function() {
            if (!map.isEmpty()) {
                cursor.isDragging = true;
                if (!cursor.obstacles) {
                    placeObject();
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
