export const loader = {
    assetImages: {},
    init: function(assetsList) {
        const tileLoadPromises = assetsList.map(asset => new Promise(resolve => {
            const assetImage = new Image();
            assetImage.src = asset.source;
            this.assetImages[asset.name] = assetImage;              
            assetImage.onload = resolve;
        }));
        return Promise.all(tileLoadPromises);
    },
    getAssetImage: function(assetName) {
        return this.assetImages[assetName];
    }
}
