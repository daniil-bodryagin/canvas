const path = {
    terrains: 'img/terrains/',
    environmentals: 'img/environmentals/',
    hud: 'img/hud/'
}

function getDelta({cellY: baseCellY}, currentCellY) {
    const dCellsX = this.size.rightLength - (baseCellY - currentCellY + 1);
    const dCellsY = baseCellY - currentCellY + 1;
    const dCellsHeight = this.size.rightLength;
    return {dCellsX, dCellsY, dCellsHeight};
}

const create = {
    terrains: function(settings) {
        return {
            class: this,
            properties: settings || this.defaultSettings,
            getImageWithOffsets: function({cellX}) {
                return (this.properties.coords.cellX == cellX) 
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
            getImageWithOffsets: function({cellX}) {
                return (this.properties.coords.cellX == cellX) 
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
            getDelta: function(cellY) {
                const dCellsX = this.class.size.rightLength - (this.properties.coords.cellY - cellY + 1);
                const dCellsY = this.properties.coords.cellY - cellY + 1;
                const dCellsHeight = this.class.size.rightLength;
                return {dCellsX, dCellsY, dCellsHeight};
            },
            getCellSize: function() {
                return this.class.size;
            }
        };
    }
}

export const terrains = [
    {
        name: 'yellow-tile',
        title: 'Yellow Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.terrains}sample_00.png`,
        defaultSettings: {},
        create: create.terrains,
        getDelta: getDelta
    },
    {
        name: 'orange-tile',
        title: 'Orange Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.terrains}sample_01.png`,
        defaultSettings: {},
        create: create.terrains,
        getDelta: getDelta
    },
    {
        name: 'red-tile',
        title: 'Red Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.terrains}sample_02.png`,
        defaultSettings: {},
        create: create.terrains,
        getDelta: getDelta
    },
    {
        name: 'pink-tile',
        title: 'Pink Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.terrains}sample_03.png`,
        defaultSettings: {},
        create: create.terrains,
        getDelta: getDelta
    },
    {
        name: 'hot-pink-tile',
        title: 'Hot Pink Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.terrains}sample_04.png`,
        defaultSettings: {},
        create: create.terrains,
        getDelta: getDelta
    },
    {
        name: 'purple-tile',
        title: 'Purple Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.terrains}sample_05.png`,
        defaultSettings: {},
        create: create.terrains,
        getDelta: getDelta
    },
    {
        name: 'violet-tile',
        title: 'Violet Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.terrains}sample_06.png`,
        defaultSettings: {},
        create: create.terrains,
        getDelta: getDelta
    },
    {
        name: 'dark-blue-tile',
        title: 'Dark Blue Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.terrains}sample_07.png`,
        defaultSettings: {},
        create: create.terrains,
        getDelta: getDelta
    },
    {
        name: 'blue-tile',
        title: 'Blue Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.terrains}sample_08.png`,
        defaultSettings: {},
        create: create.terrains,
        getDelta: getDelta
    },
    {
        name: 'light-blue-tile',
        title: 'Light Blue Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.terrains}sample_09.png`,
        defaultSettings: {},
        create: create.terrains,
        getDelta: getDelta
    },
    {
        name: 'deep-sky-blue-tile',
        title: 'Deep Sky Blue Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.terrains}sample_10.png`,
        defaultSettings: {},
        create: create.terrains,
        getDelta: getDelta
    },
    {
        name: 'aquamarine-tile',
        title: 'Aquamarine Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.terrains}sample_11.png`,
        defaultSettings: {},
        create: create.terrains,
        getDelta: getDelta
    },
    {
        name: 'sea-green-tile',
        title: 'Sea Green Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.terrains}sample_12.png`,
        defaultSettings: {},
        create: create.terrains,
        getDelta: getDelta
    },
    {
        name: 'green-tile',
        title: 'Green Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.terrains}sample_13.png`,
        defaultSettings: {},
        create: create.terrains,
        getDelta: getDelta
    },
    {
        name: 'light-green-tile',
        title: 'Light Green Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.terrains}sample_14.png`,
        defaultSettings: {},
        create: create.terrains,
        getDelta: getDelta
    },
    {
        name: 'dark-green-tile',
        title: 'Dark Green Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.terrains}sample_15.png`,
        defaultSettings: {},
        create: create.terrains,
        getDelta: getDelta
    },
    {
        name: 'brown-tile',
        title: 'Brown Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.terrains}sample_16.png`,
        defaultSettings: {},
        create: create.terrains,
        getDelta: getDelta
    },
    {
        name: 'maroon-tile',
        title: 'Maroon Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.terrains}sample_17.png`,
        defaultSettings: {},
        create: create.terrains,
        getDelta: getDelta
    },
    {
        name: 'teal-tile',
        title: 'Teal Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.terrains}sample_18.png`,
        defaultSettings: {},
        create: create.terrains,
        getDelta: getDelta
    },
    {
        name: 'white-tile',
        title: 'White Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.terrains}sample_19.png`,
        defaultSettings: {},
        create: create.terrains,
        getDelta: getDelta
    },
    {
        name: 'silver-tile',
        title: 'Silver Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.terrains}sample_20.png`,
        defaultSettings: {},
        create: create.terrains,
        getDelta: getDelta
    },
    {
        name: 'light-gray-tile',
        title: 'Light Gray Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.terrains}sample_21.png`,
        defaultSettings: {},
        create: create.terrains,
        getDelta: getDelta
    },
    {
        name: 'gray-tile',
        title: 'Gray Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.terrains}sample_22.png`,
        defaultSettings: {},
        create: create.terrains,
        getDelta: getDelta
    },
    {
        name: 'dark-gray-tile',
        title: 'Dark Gray Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 0,
            y: 0
        },
        source: `${path.terrains}sample_23.png`,
        defaultSettings: {},
        create: create.terrains,
        getDelta: getDelta
    }
]

export const environmentals = [
    {
        name: 'orange-ball',
        title: 'Orange Ball',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 9,
            y: 9
        },
        source: `${path.environmentals}ball-orange.png`,
        defaultSettings: {},
        create: create.environmentals,
        getDelta: getDelta
    },
    {
        name: 'red-ball',
        title: 'Red Ball',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 9,
            y: 9
        },
        source: `${path.environmentals}ball-red.png`,
        defaultSettings: {},
        create: create.environmentals,
        getDelta: getDelta
    },
    {
        name: 'teal-ball',
        title: 'Teal Ball',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 9,
            y: 9
        },
        source: `${path.environmentals}ball-teal.png`,
        defaultSettings: {},
        create: create.environmentals,
        getDelta: getDelta
    },
    {
        name: 'violet-ball',
        title: 'Violet Ball',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        offset: {
            x: 9,
            y: 9
        },
        source: `${path.environmentals}ball-violet.png`,
        defaultSettings: {},
        create: create.environmentals,
        getDelta: getDelta
    },
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
