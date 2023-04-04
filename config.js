const path = {
    terrains: 'img/terrains/',
    environmentals: 'img/environmentals/',
    hud: 'img/hud/'
}

function getDelta({cellX: baseCellX, cellY: baseCellY}, currentCellX, currentCellY) {
    const startLine = this.size.rightLength - (baseCellY - currentCellY + 1) + (currentCellX - baseCellX) + ((currentCellX - baseCellX > 0) ? 1 : 0);
    const endLine = this.size.rightLength - (baseCellY - currentCellY) + (currentCellX - baseCellX) + ((baseCellY - currentCellY == 0) ? 1 : 0);
    const upLine = (baseCellY - currentCellY) + (currentCellX - baseCellX);
    const shift = (currentCellX - baseCellX > 0) ? 1 : 0;
    return {startLine, endLine, upLine, shift};
}

const create = {
    terrains: function(settings) {
        return {
            class: this,
            properties: settings || this.defaultSettings,
            getImageWithOffsets: function({cellX, cellY}) {
                return (this.properties.coords.cellX == cellX || this.properties.coords.cellY == cellY) 
                        ? {
                            image: this.class.image,
                            offsetX: this.class.offset.x,
                            offsetY: this.class.offset.y
                        } 
                        : {
                            image: null,
                            offsetX: null,
                            offsetY: null
                        };
            },
            getCellSize: function() {
                return this.class.size;
            }
        };
    },
    environmentals: function(settings) {
        return {
            class: this,
            properties: settings || this.defaultSettings,
            getImageWithOffsets: function({cellX, cellY}) {
                return (this.properties.coords.cellX == cellX || this.properties.coords.cellY == cellY) 
                        ? {
                            image: this.class.image,
                            offsetX: this.class.offset.x,
                            offsetY: this.class.offset.y
                        } 
                        : {
                            image: null,
                            offsetX: null,
                            offsetY: null
                        };
            },
            getCellSize: function() {
                return this.class.size;
            }
        };
    }
}

function manufactureTerrain (crudeTerrainObject) {
    const {...terrainObject} = {...crudeTerrainObject};
    terrainObject.size = {
        leftLength: 1,
        rightLength: 1
    };
    terrainObject.offset = {
        x: 0,
        y: 0
    };
    terrainObject.defaultSettings = {};
    terrainObject.create = create.terrains;
    terrainObject.getDelta = getDelta;
    return terrainObject;
}

function manufactureBall (crudeBallObject) {
    const {...ballObject} = {...crudeBallObject};
    ballObject.size = {
        leftLength: 1,
        rightLength: 1
    };
    ballObject.offset = {
        x: 9,
        y: 9
    };
    ballObject.defaultSettings = {};
    ballObject.create = create.environmentals;
    ballObject.getDelta = getDelta;
    return ballObject;
}

const crudeTerrains = [
    {
        name: 'yellow-tile',
        title: 'Yellow Tile',
        source: `${path.terrains}sample_00.png`
    },
    {
        name: 'orange-tile',
        title: 'Orange Tile',
        source: `${path.terrains}sample_01.png`
    },
    {
        name: 'red-tile',
        title: 'Red Tile',
        source: `${path.terrains}sample_02.png`
    },
    {
        name: 'pink-tile',
        title: 'Pink Tile',
        source: `${path.terrains}sample_03.png`
    },
    {
        name: 'hot-pink-tile',
        title: 'Hot Pink Tile',
        source: `${path.terrains}sample_04.png`
    },
    {
        name: 'purple-tile',
        title: 'Purple Tile',
        source: `${path.terrains}sample_05.png`
    },
    {
        name: 'violet-tile',
        title: 'Violet Tile',
        source: `${path.terrains}sample_06.png`
    },
    {
        name: 'dark-blue-tile',
        title: 'Dark Blue Tile',
        source: `${path.terrains}sample_07.png`
    },
    {
        name: 'blue-tile',
        title: 'Blue Tile',
        source: `${path.terrains}sample_08.png`
    },
    {
        name: 'light-blue-tile',
        title: 'Light Blue Tile',
        source: `${path.terrains}sample_09.png`
    },
    {
        name: 'deep-sky-blue-tile',
        title: 'Deep Sky Blue Tile',
        source: `${path.terrains}sample_10.png`
    },
    {
        name: 'aquamarine-tile',
        title: 'Aquamarine Tile',
        source: `${path.terrains}sample_11.png`
    },
    {
        name: 'sea-green-tile',
        title: 'Sea Green Tile',
        source: `${path.terrains}sample_12.png`
    },
    {
        name: 'green-tile',
        title: 'Green Tile',
        source: `${path.terrains}sample_13.png`
    },
    {
        name: 'light-green-tile',
        title: 'Light Green Tile',
        source: `${path.terrains}sample_14.png`
    },
    {
        name: 'dark-green-tile',
        title: 'Dark Green Tile',
        source: `${path.terrains}sample_15.png`
    },
    {
        name: 'brown-tile',
        title: 'Brown Tile',
        source: `${path.terrains}sample_16.png`
    },
    {
        name: 'maroon-tile',
        title: 'Maroon Tile',
        source: `${path.terrains}sample_17.png`
    },
    {
        name: 'teal-tile',
        title: 'Teal Tile',
        source: `${path.terrains}sample_18.png`
    },
    {
        name: 'white-tile',
        title: 'White Tile',
        source: `${path.terrains}sample_19.png`
    },
    {
        name: 'silver-tile',
        title: 'Silver Tile',
        source: `${path.terrains}sample_20.png`
    },
    {
        name: 'light-gray-tile',
        title: 'Light Gray Tile',
        source: `${path.terrains}sample_21.png`
    },
    {
        name: 'gray-tile',
        title: 'Gray Tile',
        source: `${path.terrains}sample_22.png`
    },
    {
        name: 'dark-gray-tile',
        title: 'Dark Gray Tile',
        source: `${path.terrains}sample_23.png`
    }
];

const crudeBalls = [
    {
        name: 'orange-ball',
        title: 'Orange Ball',
        source: `${path.environmentals}ball-orange.png`
    },
    {
        name: 'red-ball',
        title: 'Red Ball',
        source: `${path.environmentals}ball-red.png`
    },
    {
        name: 'teal-ball',
        title: 'Teal Ball',
        source: `${path.environmentals}ball-teal.png`
    },
    {
        name: 'violet-ball',
        title: 'Violet Ball',
        source: `${path.environmentals}ball-violet.png`
    }
];

export const terrains = crudeTerrains.map(crudeTerrain => manufactureTerrain(crudeTerrain));

export const environmentals = [
    ...crudeBalls.map(crudeBall => manufactureBall(crudeBall)),
    {
        name: 'shit-pyramid',
        title: 'Badly Made Pyramid',
        size: {
            leftLength: 3,
            rightLength: 3
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.environmentals}shit-pyramid.png`,
        defaultSettings: {},
        create: create.environmentals,
        getDelta: getDelta
    },
    {
        name: 'brick',
        title: 'Brick',
        size: {
            leftLength: 2,
            rightLength: 3
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.environmentals}brick.png`,
        defaultSettings: {},
        create: create.environmentals,
        getDelta: getDelta
    }
]

export const hud = [
    {
        name: 'obstacle',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.hud}obstacle.png`,
        getDelta: getDelta
    },
    {
        name: 'buildIndicator',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.hud}indicator.png`,
        getDelta: getDelta
    }
]

export const fullSet = [...terrains, ...environmentals, ...hud];

export const assetSets = {
    terrains: terrains,
    environmentals: environmentals
};
