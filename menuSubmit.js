import { map } from './map.js';

export const formActions = {
    new: function($menuForm) {
        const name = $menuForm.querySelector('#name').value;
        const size = parseInt($menuForm.querySelector('#size').value);
        const grid = [];        
        for (let row = 0; row < size * 2 + 1; row++) {
            const mapRow = [];
            for (let col = 0; col < size * 2 + 1; col++) {
                mapRow.push('img/terrain/sample_15.png');
            }
            grid.push(mapRow);
        }
        map.create({name, size, grid});
    },
    open: function($menuForm) {
        const $selectedMap = $menuForm.querySelector('input:checked');
        if ($selectedMap) {
            fetch(`http://127.0.0.1:8000/${$selectedMap.dataset.name}`)
            .then(response => response.json())
            .then(result => map.create(JSON.parse(result)))
            .catch(error => console.log(`Server doesn't respond`));
        }
    },
    save: function($menuForm) {
        if (!map.isEmpty()) {
            // const name = $menuForm.querySelector('#name-save').value;
            // const {...mapCopy} = {...map};
            // mapCopy.name = name;
            fetch(`http://127.0.0.1:8000/${map.getName()}`, { //mapCopy.name}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(map) //mapCopy)
            }).then(response => {
                return response.json()
            }).then(result => alert(result.message)).catch(error => console.log(`Server doesn't respond`));
        }
    },
    delete: function($menuForm) {
        const $selectedMap = $menuForm.querySelector('input:checked');
        const $selectedMapLabel = $menuForm.querySelector('input:checked + label');
        if ($selectedMap) {
            fetch(`http://127.0.0.1:8000/${$selectedMap.dataset.name}`, {
                method: 'DELETE'
            }).then(response => {
                return response.json()
            }).then(result => alert(result.message)).catch(error => console.log(`Server doesn't respond`))
        }
        $selectedMap.remove();
        $selectedMapLabel.remove();
    }
}
