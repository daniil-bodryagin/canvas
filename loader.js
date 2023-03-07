import { setMenuHandlers } from "./menu.js";

export const loader = {
    terrainTiles: {},
    init: function() {
        fetch('http://127.0.0.1:8000/img/terrain')
        .then(response => response.json())
        .then(terrainList => {
            const tileSources = terrainList.map(({name}) => `img/terrain/${name}`);
            const tileLoadPromises = tileSources.map(tileSource => new Promise(resolve => {
                const tileImg = new Image();
                tileImg.src = tileSource;
                this.terrainTiles[tileSource] = tileImg;
                tileImg.onload = resolve;
            }));
            Promise.all(tileLoadPromises).then(setMenuHandlers);
        });
    }    
}
