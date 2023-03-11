import { cursor } from './cursor.js';
import { loader } from './loader.js';
import { assetSets } from './config.js';

export const editActions = {
    assets: function($targetMenuElement) {
        const $assetsList = document.querySelector('.asset-list');
        $assetsList.innerHTML = '';
        for (let asset of assetSets[$targetMenuElement.dataset.kind]) {
            $assetsList.insertAdjacentHTML('beforeend', `
            <input type="radio" name="asset-radio" id="${asset.name}" class="asset-radio" data-type="asset-select">
            <label for="${asset.name}" class="asset-label"></label>
            `);
            const $assetLabel = $assetsList.querySelector(`[for=${asset.name}]`);
            const $assetImage = loader.getAssetImage(asset.name);
            $assetImage.classList.add('asset-icon');
            $assetLabel.append($assetImage)
        }
        const $firstAsset = $assetsList.querySelector('input:first-child');
        $firstAsset.setAttribute('checked','checked');
        cursor.setImage($firstAsset.id);
    },
    stop: function() {
        cursor.setImage(null);
    }
}

