function idFromColors(red, green, blue) {
    return red * 1000000 + green * 1000 + blue;
}

function colorsFromId(colorId) {
    const red = Math.floor(colorId / 1000000);
    const green = Math.floor(colorId % 1000000 / 1000);
    const blue = colorId % 1000;
    return {red, green, blue};
}

const freeIDs = [];
for (let red = 1; red < 256; red++) {
    for (let green = 1; green < 256; green++) {
        for (let blue = 1; blue < 256; blue++) {
            freeIDs.push(idFromColors(red, green, blue));
        }
    }
}

export const selectionHelper = {
    selectionShadows: {},
    createShadow: function(object) {
        const colorId = freeIDs.pop();
        const selectionShadow = document.createElement('canvas');
        const ctxShadow = selectionShadow.getContext('2d');
        const image = object.class.image;
        selectionShadow.width = image.width;
        selectionShadow.height = image.height;
        ctxShadow.drawImage(image, 0 ,0);
        const imgData = ctxShadow.getImageData(0, 0, image.width, image.height);
        for (let i = 3; i < imgData.width * imgData.height * 4; i += 4){
            if (imgData.data[i] != 0) {
                const {red, green, blue} = colorsFromId(colorId);
                imgData.data[i - 3] = red;
                imgData.data[i - 2] = green;
                imgData.data[i - 1] = blue;
            }
        }
        ctxShadow.putImageData(imgData, 0, 0);
        this.selectionShadows[colorId] = object;
        object.colorId = colorId;
        object.shadow = selectionShadow;
    },
    destroyShadow: function(object) {
        freeIDs.push(object.colorId);
        delete this.selectionShadows[object.colorId];
    },
    getSelectedObject: function(pixel) {
        return this.selectionShadows[idFromColors(pixel.data[0], pixel.data[1], pixel.data[2])];
    }
}
