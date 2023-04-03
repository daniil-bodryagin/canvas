import { cursor } from './cursor.js';
import { loader } from './loader.js';
import { assetSets } from './config.js';

export const editActions = {
    assets: function($targetMenuElement) {
        const $assetsList = document.querySelector('.asset-list');
        $assetsList.innerHTML = '';
        for (let asset of assetSets[$targetMenuElement.dataset.kind]) {
            $assetsList.insertAdjacentHTML('beforeend', `
            <div class="asset-record">
                <input type="radio" name="asset-radio" id="${asset.name}" class="asset-radio" data-type="asset-select">
                <label for="${asset.name}" class="asset-label">
                    <div class="asset-image-container" id="${asset.name}-container"></div>
                    <div class="asset-description">
                        <p class="asset-title">${asset.title}</p>
                        <p class="asset-size">L: ${asset.size.leftLength} R: ${asset.size.rightLength}</p>
                    </div>
                </label>
            </div>
            `);
            const $assetImageContainer = $assetsList.querySelector(`#${asset.name}-container`);
            const $assetImage = loader.getClass(asset.name).image.cloneNode();
            $assetImage.classList.add('asset-icon');
            $assetImageContainer.append($assetImage);
        }
        const $firstAsset = $assetsList.querySelector('input:first-child');
        $firstAsset.setAttribute('checked','checked');
        cursor.setClass(loader.getClass($firstAsset.id));
    },
    stop: function() {
        const $assetsList = document.querySelector('.asset-list');
        $assetsList.innerHTML = '';
        cursor.setClass(null);
    }
}

