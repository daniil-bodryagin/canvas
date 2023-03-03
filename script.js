const $canvas = document.querySelector('.canvas');
const canvasCtx = $canvas.getContext('2d');
const $menu = document.querySelector('.menu');
const $menuItems = $menu.querySelectorAll('.menu-item');
const $menuPanels = document.querySelectorAll('.panel');
const $terrainTiles = [];
const terrainTiles = {};
let cursorFunction;

function setCursorFunction(callback) {
    $canvas.removeEventListener('mousemove', cursorFunction);
    cursorFunction = callback;
    $canvas.addEventListener('mousemove', cursorFunction);
}

function setMenuHandlers() {
    $menu.addEventListener('click', ({target}) => {
        const $targetMenuElement = target.closest('[data-type]');
        if (!$targetMenuElement) return;
        switch ($targetMenuElement.dataset.type) {
            case 'menu-item':
                const targetPanelName = $targetMenuElement.dataset.panelName;
                for (let $menuItem of $menuItems) {
                    if ($targetMenuElement == $menuItem) {
                        $menuItem.classList.toggle('menu-item-selected');
                    } else {
                        $menuItem.classList.remove('menu-item-selected');
                    }
                }
                for (let $panel of $menuPanels) {
                    if ($panel.classList.contains(`${targetPanelName}`)) {
                        $panel.classList.toggle('show-panel');
                    } else {
                        $panel.classList.remove('show-panel');
                    }
                }
                if (menuActions[targetPanelName] && $targetMenuElement.classList.contains('menu-item-selected')) menuActions[targetPanelName](targetPanelName);
                break;
            case 'menu-edit':
                const $editButtons = document.querySelectorAll('.edit-button');
                setCursorFunction(cursorFunctions[$targetMenuElement.dataset.action]);
                if (editActions[$targetMenuElement.dataset.action]) editActions[$targetMenuElement.dataset.action]();
                for (let $editButton of $editButtons) {
                    if ($editButton == $targetMenuElement && $editButton.value != 'Stop') $editButton.classList.toggle('edit-button-selected');
                    else $editButton.classList.remove('edit-button-selected');
                }
                break;
            case 'menu-close':
                $targetMenuElement.closest('.panel').classList.remove('show-panel');
                break;
        }    
    });
    const $menuForms = $menu.querySelectorAll('.form');
    for (let $menuForm of $menuForms) {
        $menuForm.addEventListener('submit', function(event) {
            event.preventDefault();
            actions[$menuForm.dataset.action](event);
        });
    }
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

const menuActions = {
    open: createMapList,
    save: function() {  
        if (map) document.querySelector('#name-save').value = map.name;
    },
    delete: createMapList
}

const cursorFunctions = {
    terrain: function({clientX, clientY}) {
        console.log(clientX, clientY);
    },
    stop: null
}

const editActions = {
    terrain: function() {
        const $terrainList = document.querySelector('.tile-list');
        const terrainSources = Object.keys(terrainTiles);
        for (let terrainSource of terrainSources) {
            $terrainList.insertAdjacentHTML('beforeend', `
            <input type="radio" name="tile-radio" id="${terrainSource}" class="tile-radio">
            <label for="${terrainSource}" class="tile-label"><img src="${terrainSource}" class="tile-icon"></label>
        `);
        }
        $terrainList.querySelector('input:first-child').setAttribute('checked','checked');
    }
}

const actions = {
    new: function({target}) {
        map = {
            name: target.querySelector('#name').value,
            size: parseInt(target.querySelector('#size').value),
            grid: []
        }
        for (let row = 0; row < map.size * 2 + 1; row++) {
            const mapRow = [];
            for (let col = 0; col < map.size * 2 + 1; col++) {
                mapRow.push('img/terrain/sample_15.png');
            }
            map.grid.push(mapRow);
        }
    },
    open: function({target}) {
        const $selectedMap = target.querySelector('input:checked');
        if ($selectedMap) {
            fetch(`http://127.0.0.1:8000/${$selectedMap.dataset.name}`)
            .then(response => response.json())
            .then(result => map = JSON.parse(result))
            .catch(error => console.log(`Server doesn't respond`));
        }
    },
    save: function({target}) {
        if (map) {
            const name = target.querySelector('#name-save').value;
            const {...mapCopy} = {...map};
            mapCopy.name = name;
            fetch(`http://127.0.0.1:8000/${mapCopy.name}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(mapCopy)
            }).then(response => {
                return response.json()
            }).then(result => alert(result.message)).catch(error => console.log(`Server doesn't respond`));
        }
    },
    delete: function({target}) {
        const $selectedMap = target.querySelector('input:checked');
        const $selectedMapLabel = target.querySelector('input:checked + label');
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

let map;
const tileHeight = 32;
const tileWidth = 64;
const tileHalfHeight = tileHeight / 2;
const tileHalfWidth = tileWidth / 2;
let screenHeight;
let screenWidth;
let cameraX = 0;
let cameraY = 0;
let cameraSpeedX = 0;
let cameraSpeedY = 0;
const cameraSpeedLimit = 50;
const frameLapse = 30;
main();


fetch('http://127.0.0.1:8000/img/terrain')
    .then(response => response.json())
    .then(terrainList => {
        const tileSources = terrainList.map(({name}) => `img/terrain/${name}`);
        const tileLoadPromises = tileSources.map(tileSource => new Promise(resolve => {
            const tileImg = new Image();
            tileImg.src = tileSource;
            terrainTiles[tileSource] = tileImg;
            tileImg.onload = resolve;
        }));
        Promise.all(tileLoadPromises).then(setMenuHandlers);
    });

function main() {
    window.addEventListener('resize', () => {
        resize();
    });
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('keyup', handleKeyup);
    resize();
    let startTime = Date.now();
    const mainLoopInterval = setInterval(drawScene, frameLapse);

    function resize() {
        screenHeight = document.documentElement.clientHeight;
        screenWidth = document.documentElement.clientWidth;
        $canvas.setAttribute('height', screenHeight);
        $canvas.setAttribute('width', screenWidth);
    }

    function drawScene() {
        const newTime = Date.now();
        const deltaTime = (newTime - startTime) / 1000;
        //console.log(deltaTime);
        startTime = newTime;
        cameraX += cameraSpeedX * deltaTime;
        cameraY += cameraSpeedY * deltaTime;
        canvasCtx.fillRect(0, 0, screenWidth, screenHeight);

        const tilesPerRow = Math.ceil(screenWidth / tileWidth);
        const tilesPerColumn = Math.ceil(screenHeight / tileHeight);
        const startCellX = parseInt(cameraX / tileWidth);
        const startCellY = parseInt(cameraY / tileHeight);
        const startCellShiftY = parseInt(cameraY % tileHeight);
        const startCellShiftX = parseInt(cameraX % tileWidth);
        //console.log([startCellX, startCellY, startCellShiftX, startCellShiftY]);

        if (map) {
            const {size, grid} = map;
            for (let col = -1; col <= tilesPerColumn; col++) {
                for (let row = -1; row <= tilesPerRow; row++) {
                    if (grid[startCellX + row + startCellY + col] && grid[startCellX + row + startCellY + col][startCellX + row - startCellY - col + size]) {
                        const tileType = grid[startCellX + row + startCellY + col][startCellX + row - startCellY - col + size];
                        const tileImg = terrainTiles[tileType];
                        canvasCtx.drawImage(tileImg, row * tileWidth - startCellShiftX - tileHalfWidth, col * tileHeight - startCellShiftY - tileHalfHeight);
                    }                
                }
                for (let row = -1; row <= tilesPerRow; row++) {
                    if (grid[startCellX + row + startCellY + col + 1] && grid[startCellX + row + startCellY + col + 1][startCellX + row - startCellY - col + size]) {
                        const tileType = grid[startCellX + row + startCellY + col + 1][startCellX + row - startCellY - col + size];
                        const tileImg = terrainTiles[tileType];
                        canvasCtx.drawImage(tileImg, row * tileWidth - startCellShiftX, col * tileHeight - startCellShiftY);
                    }
                }
            }
        }        
    }

    function handleKeydown({key}) {
        switch (key) {
            case 'ArrowUp': 
                if (cameraSpeedY >= 0) cameraSpeedY = cameraSpeedLimit;
                break;
            case 'ArrowDown':
                if (cameraSpeedY <= 0) cameraSpeedY = -cameraSpeedLimit;
                break;
            case 'ArrowLeft':
                if (cameraSpeedX >= 0) cameraSpeedX = cameraSpeedLimit;
                break;
            case 'ArrowRight':
                if (cameraSpeedX <= 0) cameraSpeedX = -cameraSpeedLimit;
                break;
        }
    }

    function handleKeyup({key}) {
        switch (key) {
            case 'ArrowUp': 
                if (cameraSpeedY >= 0) cameraSpeedY = 0;
                break;
            case 'ArrowDown':
                if (cameraSpeedY <= 0) cameraSpeedY = 0;
                break;
            case 'ArrowLeft':
                if (cameraSpeedX >= 0) cameraSpeedX = 0;
                break;
            case 'ArrowRight':
                if (cameraSpeedX <= 0) cameraSpeedX = 0;
                break;
        }
    }
};
