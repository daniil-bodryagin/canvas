import { loader } from "./loader.js";

export const map = {
    isEmpty: function() {
        return this.name ? false: true;
    },
    getName: function() {
        return this.name;
    },
    getSize: function() {
        return (this.grid.length - 1) / 2;
    },
    getGridSize: function() {
        return this.grid.length;
    },
    new: function(name, size) {
        this.name = name;
        this.grid = [];
        this.listOfAllObjects = [];
        for (let row = 0; row < size * 2 + 1; row++) {
            const mapRow = [];
            for (let col = 0; col < size * 2 + 1; col++) {
                const terrainClass = loader.getClass('dark-green-tile');
                const terrain = terrainClass.create({coords: {cellX: col, cellY: row}});
                mapRow.push({terrain: terrain, object: null});
            }
            this.grid.push(mapRow);
        }
    },
    fill: function({name, grid}) {
        this.name = name;
        this.grid = [];
        this.listOfAllObjects = [];
        for (let row of grid) {
            const mapRow = [];
            for (let cell of row) {
                const terrain = loader.getClass(cell.terrain.class).create(cell.terrain.properties);
                if (cell.object) {
                    const object = loader.getClass(cell.object.class).create(cell.object.properties);
                    this.listOfAllObjects.push(object);
                }
                mapRow.push({terrain: terrain, object: null});
            }
            this.grid.push(mapRow);
        }
        for (let object of this.listOfAllObjects) {
            this.setCellContent(object.properties.coords, object, 'object');
        }
    },
    createMapFile: function() {
        const mapFile = {
            name: this.name,
            grid: []
        };
        for (let row = 0; row < this.grid.length; row++) {
            const mapFileRow = [];
            for (let cell = 0; cell < this.grid[0].length; cell++) {
                const terrain = this.grid[row][cell].terrain;
                const terrainRecord = {
                    class: terrain.class.name,
                    properties: terrain.properties
                };
                const object = this.grid[row][cell].object;
                const objectRecord = (object && row == object.properties.coords.cellY && cell == object.properties.coords.cellX) ? {
                    class: object.class.name,
                    properties: object.properties
                } : null;
                mapFileRow.push({terrain: terrainRecord, object: objectRecord});
            }
            mapFile.grid.push(mapFileRow);
        }
        return mapFile;
    },
    getCellContent: function({cellX, cellY}, layer) {
        return this.grid[cellY][cellX][layer];
    },
    setCellContent: function({cellX, cellY}, object, layer) {
        for (let y = cellY - object.class.size.rightLength + 1; y <= cellY; y++) {
            for (let x = cellX; x < cellX + object.class.size.leftLength; x++) {
                this.grid[y][x][layer] = object;
            }
        }
    },
    getObstacles: function({cellX, cellY}, className) {
        const obstacles = [];
        for (let row = cellY; row > cellY - className.size.rightLength; row--) {
            for (let col = cellX; col < cellX + className.size.leftLength; col++) {
                if (!this.isCellInsideMap({cellX: col, cellY: row}) || this.grid[row][col].object) {
                    obstacles.push({cellX: col, cellY: row});
                }
            }
        }
        return obstacles.length ? obstacles : null;
    },
    addToList: function(object) {
        this.listOfAllObjects.push(object);
    },
    isCellInsideMap: function({cellX, cellY}) {
        return cellY < this.getGridSize() && cellY >= 0 && cellX < this.getGridSize() && cellX >= 0;
    }
};
