import { $canvas, camera } from "./camera.js";
import { gameMap } from "./gameMap.js";
import { selectionHelper } from "./selectionHelper.js";

export const cursor = {
    mode: 'stop',
    kind: 'environmentals',
    obstacles: null,
    init: function() {
        this.setCursorMode(this.mode, this.kind);
    },
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
    gameMap.setCellContent(cursor.getCoords(), object, cursor.layer);
    gameMap.addToList(object);
}

const cursorFunctions = {
    assets: {
        mousemove: function({clientX, clientY}) {
            if (!gameMap.isEmpty()) {
                const {cellX, cellY} = camera.getCellUnderCursor(clientX, clientY);
                if (cursor.isCellChanged(cellX, cellY)) {
                    cursor.setCoords(cellX, cellY);
                    cursor.obstacles = gameMap.getObstacles(cursor.getCoords(), cursor.getClass());
                    if (cursor.isDragging && !cursor.obstacles) {
                        placeObject();
                    } 
                }                
            }
        },
        mousedown: function() {
            if (!gameMap.isEmpty()) {
                cursor.isDragging = true;
                if (!cursor.obstacles) {
                    placeObject();
                }
            }
        },
        mouseup: function() {
            if (!gameMap.isEmpty()) {
                cursor.isDragging = false;
            }
        },
        mouseout: function () {
            if (!gameMap.isEmpty()) {
                cursor.setCoords(Infinity, Infinity);
                cursor.isDragging = false;
            }
        }
    },
    stop: {
        mousemove: null,
        mousedown: null,
        mouseup: function({clientX, clientY}) {
            if (!gameMap.isEmpty()) {
                const pixel = camera.getShadowColorUnderCursor(clientX, clientY);
                cursor.selectedObject = selectionHelper.getSelectedObject(pixel);
            }
        },
        mouseout: null
    }
}
