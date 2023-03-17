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
        for (let row = 0; row < size * 2 + 1; row++) {
            const mapRow = [];
            for (let col = 0; col < size * 2 + 1; col++) {
                const terrainClass = loader.getClass('dark-green-tile');
                const terrain = terrainClass.create();
                mapRow.push({terrain: terrain, object: null});
            }
            this.grid.push(mapRow);
        }
    },
    fill: function({name, grid}) {
        this.name = name;
        this.grid = [];
        for (let row of grid) {
            const mapRow = [];
            for (let cell of row) {
                const terrain = loader.getClass(cell.terrain.class).create(cell.terrain.properties);
                const object = cell.object.class ? loader.getClass(cell.object.class).create(cell.object.properties) : null;
                mapRow.push({terrain: terrain, object: object});
            }
            this.grid.push(mapRow);
        }
    },
    createMapFile: function() {
        const mapFile = {
            name: this.name,
            grid: []
        };
        for (let row of this.grid) {
            const mapFileRow = [];
            for (let cell of row) {
                const terrain = {
                    class: cell.terrain.class.name,
                    properties: cell.terrain.properties
                };
                const object = {};
                if (cell.object) {
                    object.class = cell.object.class.name;
                    object.properties = cell.object.properties;
                };
                mapFileRow.push({terrain: terrain, object: object});
            }
            mapFile.grid.push(mapFileRow);
        }
        return mapFile;
    },
    getCellContent: function({cellX, cellY}, layer) {
        return this.grid[cellY][cellX][layer];
    },
    setCellContent: function({cellX, cellY}, assetName, layer) {
        this.grid[cellY][cellX][layer] = assetName;
    },
    isCellInsideMap: function({cellX, cellY}) {
        return cellY < this.getGridSize() && cellY >= 0 && cellX < this.getGridSize() && cellX >= 0;
    }
};
