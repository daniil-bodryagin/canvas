window.onsubmit = function(event) {
    event.preventDefault();
};

const $canvas = document.querySelector('.canvas');
const canvasCtx = $canvas.getContext('2d');
const $menu = document.querySelector('.menu');
const $menuItems = $menu.querySelectorAll('.menu-item');
const $menuPanels = document.querySelectorAll('.panel');
const $editButtons = document.querySelectorAll('[data-type=menu-edit]');
const $terrainTiles = [];
const terrainTiles = {};

function setCursorActiveFunctions(cursorFunctions) {
    const events = Object.keys(cursorFunctions);
    for (let event of events) {
        $canvas.removeEventListener(event, cursorActiveFunctions[event]);
        cursorActiveFunctions[event] = cursorFunctions[event];
        $canvas.addEventListener(event, cursorActiveFunctions[event]);
    }
}

function setMenuHandlers() {
    $menu.addEventListener('click', ({target}) => {
        const $targetMenuElement = target.closest('[data-type]');
        if (!$targetMenuElement) return;
        menuActions[$targetMenuElement.dataset.type]($targetMenuElement);
    });
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
    'menu-item': function($targetMenuElement) {
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
        if (menuItemActions[targetPanelName] && $targetMenuElement.classList.contains('menu-item-selected')) menuItemActions[targetPanelName](targetPanelName);
    },
    'menu-submit': function($targetMenuElement) {
        const $menuForm = $targetMenuElement.closest('.form');
        formActions[$menuForm.dataset.action]($menuForm);
    },
    'menu-edit': function($targetMenuElement) {
        setCursorActiveFunctions(cursorFunctions[$targetMenuElement.dataset.action]);
        if (editActions[$targetMenuElement.dataset.action]) editActions[$targetMenuElement.dataset.action]();
        for (let $editButton of $editButtons) {
            if ($editButton == $targetMenuElement && $editButton.value != 'Stop') $editButton.classList.add('edit-button-selected');
            else $editButton.classList.remove('edit-button-selected');
        }
    },
    'menu-close': function($targetMenuElement) {
        $targetMenuElement.closest('.panel').classList.remove('show-panel');
    },
    'object-select': function($targetMenuElement) {
        cursorImageType = $targetMenuElement.id;
    }
}

const menuItemActions = {
    open: createMapList,
    save: function() {  
        if (map) document.querySelector('#name-save').value = map.name;
    },
    delete: createMapList
}

function getCellUnderCursor(cursorX, cursorY) {
    const cellX = map.size + Math.ceil((cursorX + cameraX - 2 * (cursorY + cameraY) - tileHalfWidth) / tileWidth);
    const cellY = Math.ceil((cursorX + cameraX + 2 * (cursorY + cameraY) - tileHalfWidth) / tileWidth);
    return {cellX, cellY};
}

function getCellCoordsForCanvas(cellX, cellY) {
    const imageX = (cellY + (cellX - map.size) - 1) * tileHalfWidth - cameraX;
    const imageY = (cellY - (cellX - map.size) - 1) * tileHalfHeight - cameraY;
    return {imageX, imageY};
}

const cursorFunctions = {
    terrain: {
        mousemove: function({clientX, clientY}) {
            if (map) {
                const {cellX, cellY} = getCellUnderCursor(clientX, clientY);
                //console.log(cellX, cellY);
                const tileImg = terrainTiles[cursorImageType];
                const {imageX, imageY} = getCellCoordsForCanvas(cellX, cellY);
                cursorObject = {tileImg, cellX, cellY, imageX, imageY};
                if (cursorImage) {
                    if (cellY < map.grid.length && cellY >= 0 && cellX < map.grid[0].length && cellX >= 0) map.grid[cellY][cellX] = cursorImage;
                }
            }
        },
        mousedown: function({clientX, clientY}) {
            if (map) {
                const {cellX, cellY} = getCellUnderCursor(clientX, clientY);
                cursorImage = cursorImageType;
                if (cellY < map.grid.length && cellY >= 0 && cellX < map.grid[0].length && cellX >= 0) map.grid[cellY][cellX] = cursorImage;
            }
        },
        mouseup: function() {
            if (map) {
                cursorImage = null;
            }
        },
        mouseout: function () {
            if (map) {
                cursorImage = null;
                cursorObject = null;
            }
        }
    },
    stop: {
        mousemove: null,
        mousedown: null,
        mouseup: null,
        mouseout: null
    }
}

const editActions = {
    terrain: function() {
        const $terrainList = document.querySelector('.tile-list');
        const terrainSources = Object.keys(terrainTiles);
        $terrainList.innerHTML = '';
        for (let terrainSource of terrainSources) {
            $terrainList.insertAdjacentHTML('beforeend', `
            <input type="radio" name="tile-radio" id="${terrainSource}" class="tile-radio" data-type="object-select">
            <label for="${terrainSource}" class="tile-label"><img src="${terrainSource}" class="tile-icon"></label>
        `);
        }
        const $firstTerrain = $terrainList.querySelector('input:first-child');
        $firstTerrain.setAttribute('checked','checked');
        cursorImageType = $firstTerrain.id;
    },
    stop: function() {
        cursorObject = null;
    }
}

const formActions = {
    new: function($menuForm) {
        map = {
            name: $menuForm.querySelector('#name').value,
            size: parseInt($menuForm.querySelector('#size').value),
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
    open: function($menuForm) {
        const $selectedMap = $menuForm.querySelector('input:checked');
        if ($selectedMap) {
            fetch(`http://127.0.0.1:8000/${$selectedMap.dataset.name}`)
            .then(response => response.json())
            .then(result => map = JSON.parse(result))
            .catch(error => console.log(`Server doesn't respond`));
        }
    },
    save: function($menuForm) {
        if (map) {
            const name = $menuForm.querySelector('#name-save').value;
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

const cursorActiveFunctions = {};
let cursorImageType;
let cursorImage;
let cursorObject;

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
        //console.log(cameraX, cameraY);
        canvasCtx.fillRect(0, 0, screenWidth, screenHeight);

        const tilesPerRow = Math.floor(screenWidth / tileWidth);
        const tilesPerColumn = Math.floor(screenHeight / tileHeight);
        const startCellX = Math.floor(cameraX / tileWidth);
        const startCellY = Math.floor(cameraY / tileHeight);
        //console.log([startCellX, startCellY, startCellShiftX, startCellShiftY]);

        //canvasCtx.strokeStyle = "white"

        if (map) {
            const {size, grid} = map;
            for (let row = 0; row < tilesPerColumn + 3; row++) {
                for (let col = 0; col < tilesPerRow + 3; col++) {
                    const currentCellRow = startCellX + startCellY + col + row;
                    const currentCellCol = startCellX - startCellY + size + col - row;
                    if (currentCellRow < grid.length && currentCellRow >= 0 && currentCellCol < grid[0].length && currentCellCol >= 0) {
                        const tileType = grid[currentCellRow][currentCellCol];
                        const tileImg = terrainTiles[tileType];
                        const {imageX, imageY} = getCellCoordsForCanvas(currentCellCol, currentCellRow);
                        canvasCtx.drawImage(tileImg, imageX, imageY);
                        //canvasCtx.strokeText(`${currentCellRow}, ${currentCellCol}`, imageX + 16, imageY + 20);
                    }                    
                }
                for (let col = 0; col < tilesPerRow + 2; col++) {
                    const currentCellRow = startCellX + startCellY + col + 1 + row;
                    const currentCellCol = startCellX - startCellY + size + col - row;
                    if (currentCellRow < grid.length && currentCellRow >= 0 && currentCellCol < grid[0].length && currentCellCol >= 0) {
                        const tileType = grid[currentCellRow][currentCellCol];
                        const tileImg = terrainTiles[tileType];
                        const {imageX, imageY} = getCellCoordsForCanvas(currentCellCol, currentCellRow);
                        canvasCtx.drawImage(tileImg, imageX, imageY);
                        //canvasCtx.strokeText(`${currentCellRow}, ${currentCellCol}`, imageX + 16, imageY + 20);
                    }
                }
            }
            if (cursorObject) {
                if (cursorObject.cellY < grid.length && cursorObject.cellY >= 0 && cursorObject.cellX < grid[0].length && cursorObject.cellX >= 0)
                    canvasCtx.globalAlpha = 0.5;
                    canvasCtx.drawImage(cursorObject.tileImg, cursorObject.imageX, cursorObject.imageY);
                    canvasCtx.globalAlpha = 1;
            }            
        }        
    }

    function handleKeydown({key}) {
        switch (key) {
            case 'ArrowUp': 
                if (cameraSpeedY <= 0) cameraSpeedY = - cameraSpeedLimit;
                break;
            case 'ArrowDown':
                if (cameraSpeedY >= 0) cameraSpeedY = cameraSpeedLimit;
                break;
            case 'ArrowLeft':
                if (cameraSpeedX <= 0) cameraSpeedX = - cameraSpeedLimit;
                break;
            case 'ArrowRight':
                if (cameraSpeedX >= 0) cameraSpeedX = cameraSpeedLimit;
                break;
        }
    }

    function handleKeyup({key}) {
        switch (key) {
            case 'ArrowUp': 
                if (cameraSpeedY <= 0) cameraSpeedY = 0;
                break;
            case 'ArrowDown':
                if (cameraSpeedY >= 0) cameraSpeedY = 0;
                break;
            case 'ArrowLeft':
                if (cameraSpeedX <= 0) cameraSpeedX = 0;
                break;
            case 'ArrowRight':
                if (cameraSpeedX >= 0) cameraSpeedX = 0;
                break;
        }
    }
};
