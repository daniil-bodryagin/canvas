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
                mapRow.push({terrain: 'dark-green-tile', object: ''});
            }
            this.grid.push(mapRow);
        }
    },
    fill: function({name, grid}) {
        this.name = name;
        this.grid = grid;
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
