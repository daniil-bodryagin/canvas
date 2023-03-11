import { setMenuHandlers } from "./menu.js";

export const loader = {
    terrainTiles: {},
    objects: {}, /////////////////////////////
    init: function() {
        fetch('http://127.0.0.1:8000/img') /////////////////////////////
        .then(response => response.json())
        .then(assetsList => { /////////////////////////////
            const tileLoadPromises = assetsList.map(assetSource => new Promise(resolve => { /////////////////////////////
                const assetImage = new Image(); /////////////////////////////
                assetImage.src = assetSource; /////////////////////////////
                if (assetSource.startsWith('img/terrain')) { /////////////////////////////
                    this.terrainTiles[assetSource] = assetImage; /////////////////////////////
                } else { /////////////////////////////
                    this.objects[assetSource] = assetImage; /////////////////////////////
                }                
                assetImage.onload = resolve; /////////////////////////////
            }));
            Promise.all(tileLoadPromises).then(setMenuHandlers);
        });
    }, /////////////////////////////
    getAsset: function(assetSource) { /////////////////////////////
        if (assetSource.startsWith('img/terrain')) return this.terrainTiles[assetSource]; /////////////////////////////
        else return this.objects[assetSource]; /////////////////////////////
    }
}
