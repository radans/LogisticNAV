/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const api = __webpack_require__(1);
const button = document.getElementById('menu-collapse');
const menu = document.getElementById('layout-menu');
const body = document.getElementById('layout-body');
const header = document.getElementById('layout-header');
if (button) {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        menu.classList.toggle('vt-menu-collapsed');
        body.classList.toggle('vt-body-expanded');
        header.classList.toggle('vt-header-collapsed');
        const collapsed = menu.classList.contains('vt-menu-collapsed');
        api.save('/api/auth/collapse', { collapsed }).catch((err) => console.log(err));
        const icon = document.getElementById('fold-icon');
        if (collapsed) {
            icon.className = 'fa fa-toggle-right vt-menu-icon';
        } else {
            icon.className = 'fa fa-toggle-left vt-menu-icon';
        }
    }, false);
}
// Schedules new flash message to be shows on
// page reload/refresh/redirect.
window.scheduleFlash = (message) => {
    sessionStorage.setItem('flash_message', message);
};
window.showFlash = (message, isError = false) => {
    const existingHolder = document.querySelector('.vt-flash-error');
    if (existingHolder) {
        existingHolder.innerText = message;
        return;
    }
    const messageHolder = document.createElement('div');
    messageHolder.className = 'vt-flash vt-flash-hidden' + (isError ? ' vt-flash-error' : '');
    messageHolder.innerText = message;
    document.body.appendChild(messageHolder);
    window.requestAnimationFrame(() => {
        messageHolder.classList.remove('vt-flash-hidden');
    });
    if (!isError) {
        setTimeout(() => {
            messageHolder.classList.add('vt-flash-hidden');
            setTimeout(() => {
                messageHolder.remove();
            }, 1000);
        }, 3000);
    }        
};
window.showError = (message) => {
    window.showFlash(message, true);
};
window.showSaveError = (message) => {
    window.showError('Viga andmete salvestamisel. Palun proovi' +
        ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
};
// Displays the previously set flash message.
window.addEventListener('load', () => {
    const flashMessage = sessionStorage.getItem('flash_message');
    if (flashMessage) {
        sessionStorage.removeItem('flash_message');
        window.showFlash(flashMessage);            
    }
});
window.hideLoader = () => {
    const existing = document.querySelector('.vt-page-loader');
    if (existing) {
        existing.remove();
    }
};
window.showLoader = (message) => {
    window.hideLoader();
    const messageHolder = document.createElement('div');
    messageHolder.className = 'vt-page-loader-message';
    messageHolder.innerText = message;
    const loader = document.createElement('div');
    loader.className = 'vt-loader';
    const spinnerHolder = document.createElement('div');
    spinnerHolder.className = 'vt-page-loader-spinner';
    spinnerHolder.appendChild(loader);
    const loaderHolder = document.createElement('div');
    loaderHolder.className = 'vt-page-loader';
    loaderHolder.appendChild(spinnerHolder);
    loaderHolder.appendChild(messageHolder);
    document.body.appendChild(loaderHolder);
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

exports.get = async (url) => {
    const response = await fetch(url, {credentials: 'include'});
    return handleResponse(response);
};

exports.save = async (url, data) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
        credentials: 'include'
    });
    return handleResponse(response);
};

exports.update = async (url, data) => {
    const response = await fetch(url, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
        credentials: 'include'
    });
    return handleResponse(response);
};

exports.updateFile = async (url, file) => {
    const response = await fetch(url, {
        method: 'PUT',
        body: file,
        credentials: 'include'
    });
    return handleResponse(response);
};

exports.postFile = async (url, file) => {
    const response = await fetch(url, {
        method: 'POST',
        body: file,
        credentials: 'include'
    });
    return handleResponse(response);
};

exports.remove = async (url) => {
    const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include'
    });
    return handleResponse(response);
};

const handleResponse = async (response) => {
    const json = await response.json();
    if (json.status === 'success') {
        return json.data;
    } else {
        const error = new Error('Serveri poolne viga.');
        error.json = json;
        throw error;
    }
};


/***/ })
/******/ ]);