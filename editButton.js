import { cursor } from './cursor.js';
import { loader } from './loader.js';

export const editActions = {
    terrain: function() {
        const $terrainList = document.querySelector('.tile-list');
        const terrainSources = Object.keys(loader.terrainTiles);
        $terrainList.innerHTML = '';
        for (let terrainSource of terrainSources) {
            $terrainList.insertAdjacentHTML('beforeend', `
            <input type="radio" name="tile-radio" id="${terrainSource}" class="tile-radio" data-type="object-select">
            <label for="${terrainSource}" class="tile-label"><img src="${terrainSource}" class="tile-icon"></label>
        `);
        }
        const $firstTerrain = $terrainList.querySelector('input:first-child');
        $firstTerrain.setAttribute('checked','checked');
        cursor.setImage($firstTerrain.id);
    },
    stop: function() {
        cursor.setImage(null);
    }
}

