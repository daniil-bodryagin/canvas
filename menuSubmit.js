import { map } from './map.js';

export const formActions = {
    new: function($menuForm) {
        const name = $menuForm.querySelector('#name').value;
        const size = parseInt($menuForm.querySelector('#size').value);
        map.new(name, size);
    },
    open: function($menuForm) {
        const $selectedMap = $menuForm.querySelector('input:checked');
        if ($selectedMap) {
            fetch(`http://127.0.0.1:8000/${$selectedMap.dataset.name}`)
            .then(response => response.json())
            .then(result => map.fill(JSON.parse(result)))
            .catch(error => console.log(`Server doesn't respond`));
        }
    },
    save: function($menuForm) {
        if (!map.isEmpty()) {
            fetch(`http://127.0.0.1:8000/${map.getName()}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(map)
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
