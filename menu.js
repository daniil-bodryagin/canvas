import { $canvas } from './camera.js';
import { cursor } from './cursor.js';
import { menuItemActions } from './menuItem.js';
import { editActions } from './editButton.js';
import { formActions } from './menuSubmit.js';
import { loader } from './loader.js';

const $menu = document.querySelector('.menu');
const $menuItems = $menu.querySelectorAll('.menu-item');
const $menuPanels = $menu.querySelectorAll('.panel');
const $editButtons = $menu.querySelectorAll('[data-type=menu-edit]');

export const menu = {
    init: function () {
        $menu.addEventListener('click', ({target}) => {
            const $targetMenuElement = target.closest('[data-type]');
            if (!$targetMenuElement) return;
            menuActions[$targetMenuElement.dataset.type]($targetMenuElement);
        });
        document.onsubmit = function(event) {
            event.preventDefault();
        };
    }
}

const menuActions = {
    'menu-item': function($targetMenuElement) {
        const targetPanelName = $targetMenuElement.dataset.panelName;
        for (let $menuItem of $menuItems) {
            if ($targetMenuElement == $menuItem) {
                $menuItem.classList.toggle('menu-item-selected');
            } else {
                $menuItem.classList.remove('menu-item-selected');
                $canvas.focus();
            }
        }
        for (let $panel of $menuPanels) {
            if ($panel.classList.contains(`${targetPanelName}`)) {
                $panel.classList.toggle('show-panel');
            } else {
                $panel.classList.remove('show-panel');
                $canvas.focus();
            }
        }
        if (menuItemActions[targetPanelName] && $targetMenuElement.classList.contains('menu-item-selected')) 
            menuItemActions[targetPanelName](targetPanelName);
    },
    'menu-submit': function($targetMenuElement) {
        const $menuForm = $targetMenuElement.closest('.form');
        formActions[$menuForm.dataset.action]($menuForm);
        $canvas.focus();
    },
    'menu-edit': function($targetMenuElement) {
        cursor.setCursorMode($targetMenuElement.dataset.action, $targetMenuElement.dataset.kind);
        $canvas.focus();
        if (editActions[$targetMenuElement.dataset.action]) {
            editActions[$targetMenuElement.dataset.action]($targetMenuElement);
        }            
        for (let $editButton of $editButtons) {
            if ($editButton == $targetMenuElement && $editButton.value != 'Stop') {
                $editButton.classList.add('edit-button-selected');
            } else {
                $editButton.classList.remove('edit-button-selected');
            }
        }
    },
    'menu-close': function($targetMenuElement) {
        $targetMenuElement.closest('.panel').classList.remove('show-panel');
        $canvas.focus();
    },
    'asset-select': function($targetMenuElement) {
        cursor.setClass(loader.getClass($targetMenuElement.id));
        $canvas.focus();
    }
}
