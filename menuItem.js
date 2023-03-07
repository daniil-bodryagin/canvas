import { map } from './map.js';

export const menuItemActions = {
    open: createMapList,
    save: function() {  
        if (!map.isEmpty()) document.querySelector('#name-save').value = map.getName();
    },
    delete: createMapList
}

function createMapList(panelName) {
    fetch('http://127.0.0.1:8000')
        .then(response => response.json())
        .then(mapList => {
            const $mapList = document.querySelector(`.${panelName} .map-list`);
            $mapList.innerHTML = '';
            for (let {name} of mapList) {
                const nameSplitted = name.split('.')[0];
                $mapList.insertAdjacentHTML('beforeend', `
                    <input type="radio" name="map-radio" id="${panelName}-${nameSplitted}" class="map-radio" data-name="${nameSplitted}">
                    <label for="${panelName}-${nameSplitted}" class="map-label">${nameSplitted}</label>`);
            }
        }).catch(error => console.log(`Server doesn't respond`));
}
