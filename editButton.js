import { cursor } from './cursor.js';
import { loader } from './loader.js';

export const editActions = {
    terrain: function() {
        const $assetsList = document.querySelector('.tile-list');  /////////////////////////////
        const terrainSources = Object.keys(loader.terrainTiles); /////////////////////////////
        $assetsList.innerHTML = ''; /////////////////////////////
        for (let terrainSource of terrainSources) {
            $assetsList.insertAdjacentHTML('beforeend', `
            <input type="radio" name="tile-radio" id="${terrainSource}" class="tile-radio" data-type="object-select">
            <label for="${terrainSource}" class="tile-label"><img src="${terrainSource}" class="tile-icon"></label>
        `); /////////////////////////////
        }
        const $firstTerrain = $assetsList.querySelector('input:first-child'); /////////////////////////////
        $firstTerrain.setAttribute('checked','checked');
        cursor.setImage($firstTerrain.id);
    },
    objects: function() { /////////////////////////////
        const $assetsList = document.querySelector('.tile-list'); /////////////////////////////
        const objectSources = Object.keys(loader.objects); /////////////////////////////
        $assetsList.innerHTML = ''; /////////////////////////////
        for (let objectSource of objectSources) { /////////////////////////////
            $assetsList.insertAdjacentHTML('beforeend', `
            <input type="radio" name="tile-radio" id="${objectSource}" class="tile-radio" data-type="object-select">
            <label for="${objectSource}" class="tile-label"><img src="${objectSource}" class="tile-icon"></label>
        `); /////////////////////////////
        }
        const $firstObject = $assetsList.querySelector('input:first-child'); /////////////////////////////
        $firstObject.setAttribute('checked','checked'); /////////////////////////////
        cursor.setImage($firstObject.id); /////////////////////////////
    },
    stop: function() {
        cursor.setImage(null);
    }
}

