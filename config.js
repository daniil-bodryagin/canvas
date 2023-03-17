import { loader } from "./loader.js";

const path = {
    terrains: 'img/terrains/',
    environmentals: 'img/environmentals/'
}

const create = {
    terrains: function(settings) {
        const name = this.name;
        const {...object} = {...settings};
        object.getImage = function() {
            return loader.getAsset(name).image;
        };
        object.getCellSize = function() {
            return loader.getAsset(name).size;
        }
        return object;
    },
    environmentals: function(settings) {
        const name = this.name;
        const {...object} = {...settings};
        object.getImage = function() {
            return loader.getAsset(name).image;
        };
        object.getCellSize = function() {
            return loader.getAsset(name).size;
        }
        return object;
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
        source: `${path.terrains}sample_00.png`,
        settings: {
            name: 'yellow-tile'
        },
        create: create.terrains
    },
    {
        name: 'orange-tile',
        title: 'Orange Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        source: `${path.terrains}sample_01.png`,
        settings: {
            name: 'orange-tile'
        },
        create: create.terrains
    },
    {
        name: 'red-tile',
        title: 'Red Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        source: `${path.terrains}sample_02.png`,
        settings: {
            name: 'red-tile'
        },
        create: create.terrains
    },
    {
        name: 'pink-tile',
        title: 'Pink Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        source: `${path.terrains}sample_03.png`,
        settings: {
            name: 'pink-tile'
        },
        create: create.terrains
    },
    {
        name: 'hot-pink-tile',
        title: 'Hot Pink Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        source: `${path.terrains}sample_04.png`,
        settings: {
            name: 'hot-pink-tile'
        },
        create: create.terrains
    },
    {
        name: 'purple-tile',
        title: 'Purple Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        source: `${path.terrains}sample_05.png`,
        settings: {
            name: 'purple-tile'
        },
        create: create.terrains
    },
    {
        name: 'violet-tile',
        title: 'Violet Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        source: `${path.terrains}sample_06.png`,
        settings: {
            name: 'violet-tile'
        },
        create: create.terrains
    },
    {
        name: 'dark-blue-tile',
        title: 'Dark Blue Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        source: `${path.terrains}sample_07.png`,
        settings: {
            name: 'dark-blue-tile'
        },
        create: create.terrains
    },
    {
        name: 'blue-tile',
        title: 'Blue Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        source: `${path.terrains}sample_08.png`,
        settings: {
            name: 'blue-tile'
        },
        create: create.terrains
    },
    {
        name: 'light-blue-tile',
        title: 'Light Blue Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        source: `${path.terrains}sample_09.png`,
        settings: {
            name: 'light-blue-tile'
        },
        create: create.terrains
    },
    {
        name: 'deep-sky-blue-tile',
        title: 'Deep Sky Blue Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        source: `${path.terrains}sample_10.png`,
        settings: {
            name: 'deep-sky-blue-tile'
        },
        create: create.terrains
    },
    {
        name: 'aquamarine-tile',
        title: 'Aquamarine Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        source: `${path.terrains}sample_11.png`,
        settings: {
            name: 'aquamarine-tile'
        },
        create: create.terrains
    },
    {
        name: 'sea-green-tile',
        title: 'Sea Green Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        source: `${path.terrains}sample_12.png`,
        settings: {
            name: 'sea-green-tile'
        },
        create: create.terrains
    },
    {
        name: 'green-tile',
        title: 'Green Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        source: `${path.terrains}sample_13.png`,
        settings: {
            name: 'green-tile'
        },
        create: create.terrains
    },
    {
        name: 'light-green-tile',
        title: 'Light Green Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        source: `${path.terrains}sample_14.png`,
        settings: {
            name: 'light-green-tile'
        },
        create: create.terrains
    },
    {
        name: 'dark-green-tile',
        title: 'Dark Green Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        source: `${path.terrains}sample_15.png`,
        settings: {
            name: 'dark-green-tile'
        },
        create: create.terrains
    },
    {
        name: 'brown-tile',
        title: 'Brown Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        source: `${path.terrains}sample_16.png`,
        settings: {
            name: 'brown-tile'
        },
        create: create.terrains
    },
    {
        name: 'maroon-tile',
        title: 'Maroon Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        source: `${path.terrains}sample_17.png`,
        settings: {
            name: 'maroon-tile'
        },
        create: create.terrains
    },
    {
        name: 'teal-tile',
        title: 'Teal Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        source: `${path.terrains}sample_18.png`,
        settings: {
            name: 'teal-tile'
        },
        create: create.terrains
    },
    {
        name: 'white-tile',
        title: 'White Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        source: `${path.terrains}sample_19.png`,
        settings: {
            name: 'white-tile'
        },
        create: create.terrains
    },
    {
        name: 'silver-tile',
        title: 'Silver Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        source: `${path.terrains}sample_20.png`,
        settings: {
            name: 'silver-tile'
        },
        create: create.terrains
    },
    {
        name: 'light-gray-tile',
        title: 'Light Gray Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        source: `${path.terrains}sample_21.png`,
        settings: {
            name: 'light-gray-tile'
        },
        create: create.terrains
    },
    {
        name: 'gray-tile',
        title: 'Gray Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        source: `${path.terrains}sample_22.png`,
        settings: {
            name: 'gray-tile'
        },
        create: create.terrains
    },
    {
        name: 'dark-gray-tile',
        title: 'Dark Gray Tile',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        source: `${path.terrains}sample_23.png`,
        settings: {
            name: 'dark-gray-tile'
        },
        create: create.terrains
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
        source: `${path.environmentals}ball-orange.png`,
        settings: {
            name: 'orange-ball'
        },
        create: create.environmentals
    },
    {
        name: 'red-ball',
        title: 'Red Ball',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        source: `${path.environmentals}ball-red.png`,
        settings: {
            name: 'red-ball'
        },
        create: create.environmentals
    },
    {
        name: 'teal-ball',
        title: 'Teal Ball',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        source: `${path.environmentals}ball-teal.png`,
        settings: {
            name: 'teal-ball'
        },
        create: create.environmentals
    },
    {
        name: 'violet-ball',
        title: 'Violet Ball',
        size: {
            leftLength: 1,
            rightLength: 1
        },
        source: `${path.environmentals}ball-violet.png`,
        settings: {
            name: 'violet-ball'
        },
        create: create.environmentals
    },
    {
        name: 'shit-pyramid',
        title: 'Badly Made Pyramid',
        size: {
            leftLength: 3,
            rightLength: 3
        },
        source: `${path.environmentals}shit-pyramid.png`,
        settings: {
            name: 'shit-pyramid'
        },
        create: create.environmentals
    },
    {
        name: 'brick',
        title: 'Brick',
        size: {
            leftLength: 2,
            rightLength: 3
        },
        source: `${path.environmentals}brick.png`,
        settings: {
            name: 'brick'
        },
        create: create.environmentals
    }
]

export const fullSet = [...terrains, ...environmentals];

export const assetSets = {
    terrains: terrains,
    environmentals: environmentals
};
