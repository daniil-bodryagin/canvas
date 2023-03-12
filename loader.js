export const loader = {
    assetsSet: {},
    init: function(assetsList) {
        const tileLoadPromises = assetsList.map(asset => new Promise(resolve => {
            this.assetsSet[asset.name] = asset;
            const assetImage = new Image();
            assetImage.src = asset.source;
            this.assetsSet[asset.name].image = assetImage;              
            assetImage.onload = resolve;
        }));
        return Promise.all(tileLoadPromises);
    },
    getAsset: function(assetName) {
        return this.assetsSet[assetName];
    }
}
