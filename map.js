export const map = {
    size: 0,
    isEmpty: function() {
        return this.size ? false: true;
    },
    getName: function() {
        return this.name;
    },
    getSize: function() {
        return this.size;
    },
    getGridSize: function() {
        return this.grid.length;
    },
    create: function({name, size, grid}) {
        this.name = name;
        this.size = size;
        this.grid = grid;
    },
    getCellTerrain: function({cellX, cellY}) { /////////////////////////////
        return this.grid[cellY][cellX].terrain; /////////////////////////////
    },
    setCellTerrain: function({cellX, cellY}, imageType) { /////////////////////////////
        this.grid[cellY][cellX].terrain = imageType; /////////////////////////////
    },
    getCellObject: function({cellX, cellY}) { /////////////////////////////
        return this.grid[cellY][cellX].object; /////////////////////////////
    },
    setCellObject: function({cellX, cellY}, imageType) { /////////////////////////////
        this.grid[cellY][cellX].object = imageType; /////////////////////////////
    },
    isCellInsideMap: function({cellX, cellY}) {
        return cellY < this.getGridSize() && cellY >= 0 && cellX < this.getGridSize() && cellX >= 0;
    }
};
