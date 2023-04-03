import { terrains } from './config.js';
import { map } from './map.js';

export const formActions = {
    new: function($menuForm) {
        const name = $menuForm.querySelector('#name').value;
        const width = parseInt($menuForm.querySelector('#width').value);
        const height = parseInt($menuForm.querySelector('#height').value);
        map.new(name, width, height);
    },
    open: function($menuForm) {
        const $selectedMap = $menuForm.querySelector('input:checked');
        if ($selectedMap) {
            fetch(`http://127.0.0.1:8000/maps/${$selectedMap.dataset.name}.json`)
            .then(response => response.json())
            .then(result => map.fill(JSON.parse(result)))
            // .catch(error => console.log(`Server doesn't respond`));
        }
    },
    save: function($menuForm) {
        const name = $menuForm.querySelector('#name-save').value;
        if (!map.isEmpty()) {
            fetch(`http://127.0.0.1:8000/maps/${name}.json`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(map.createMapFile())
            }).then(response => {
                return response.json()
            }).then(result => alert(result.message)).catch(error => console.log(`Server doesn't respond`));
        }
    },
    delete: function($menuForm) {
        const $selectedMapRadio = $menuForm.querySelector('input:checked');
        const $selectedMapLabel = $menuForm.querySelector('input:checked + label');
        if ($selectedMapRadio) {
            fetch(`http://127.0.0.1:8000/maps/${$selectedMapRadio.dataset.name}.json`, {
                method: 'DELETE'
            }).then(response => {
                return response.json()
            }).then(result => alert(result.message)).catch(error => console.log(`Server doesn't respond`))
        }
        $selectedMapRadio.remove();
        $selectedMapLabel.remove();
    }
}
