(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!*****************************!*\
  !*** ./src/main/preload.ts ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
// src/main/preload.ts

// Define the channels for electron-store
const storeChannels = {
    get: 'electron-store-get',
    set: 'electron-store-set',
    // Add more channels if you extend functionality
};
// Expose APIs to the renderer process
electron__WEBPACK_IMPORTED_MODULE_0__.contextBridge.exposeInMainWorld('electron', {
    store: {
        /**
         * Synchronously retrieves a value from the store.
         * @param key - The key to retrieve.
         * @returns The value associated with the key or null if not found.
         */
        get: (key) => {
            return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.sendSync(storeChannels.get, key);
        },
        /**
         * Asynchronously sets a value in the store.
         * @param key - The key to set.
         * @param value - The value to associate with the key.
         * @returns A promise that resolves to the result of the set operation.
         */
        set: async (key, value) => {
            return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke(storeChannels.set, key, value);
        },
        // You can add more methods like has, delete, etc., here
    },
    // Expose other APIs as needed
    generateReport: async (prompts, studentName) => {
        return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('generate-report', prompts, studentName);
    },
    processFunction: async (functionName, studentName, modalInputs, files) => {
        return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('process-function', functionName, studentName, modalInputs, files);
    },
    saveFile: async (fileBuffer, fileName) => {
        return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('save-file', fileBuffer, fileName);
    },
    encryptAndStore: (userId, key, value) => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('encrypt-and-store', userId, key, value),
    retrieveAndDecrypt: (userId, key) => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('retrieve-and-decrypt', userId, key),
    // Expose the tile loading API
    getGlobeTile: async (tileId) => {
        return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('get-globe-tile', tileId);
    },
});

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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bE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vcG9sZXNoaWZ0L2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJlbGVjdHJvblwiIiwid2VicGFjazovL3BvbGVzaGlmdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wb2xlc2hpZnQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vcG9sZXNoaWZ0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9wb2xlc2hpZnQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9wb2xlc2hpZnQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wb2xlc2hpZnQvLi9zcmMvbWFpbi9wcmVsb2FkLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KShnbG9iYWwsICgpID0+IHtcbnJldHVybiAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3JjL21haW4vcHJlbG9hZC50c1xuXG5pbXBvcnQgeyBjb250ZXh0QnJpZGdlLCBpcGNSZW5kZXJlciB9IGZyb20gJ2VsZWN0cm9uJztcblxuLy8gRGVmaW5lIHRoZSBjaGFubmVscyBmb3IgZWxlY3Ryb24tc3RvcmVcbmNvbnN0IHN0b3JlQ2hhbm5lbHMgPSB7XG4gIGdldDogJ2VsZWN0cm9uLXN0b3JlLWdldCcsXG4gIHNldDogJ2VsZWN0cm9uLXN0b3JlLXNldCcsXG4gIC8vIEFkZCBtb3JlIGNoYW5uZWxzIGlmIHlvdSBleHRlbmQgZnVuY3Rpb25hbGl0eVxufTtcblxuLy8gRXhwb3NlIEFQSXMgdG8gdGhlIHJlbmRlcmVyIHByb2Nlc3NcbmNvbnRleHRCcmlkZ2UuZXhwb3NlSW5NYWluV29ybGQoJ2VsZWN0cm9uJywge1xuICBzdG9yZToge1xuICAgIC8qKlxuICAgICAqIFN5bmNocm9ub3VzbHkgcmV0cmlldmVzIGEgdmFsdWUgZnJvbSB0aGUgc3RvcmUuXG4gICAgICogQHBhcmFtIGtleSAtIFRoZSBrZXkgdG8gcmV0cmlldmUuXG4gICAgICogQHJldHVybnMgVGhlIHZhbHVlIGFzc29jaWF0ZWQgd2l0aCB0aGUga2V5IG9yIG51bGwgaWYgbm90IGZvdW5kLlxuICAgICAqL1xuICAgIGdldDogKGtleTogc3RyaW5nKTogYW55ID0+IHtcbiAgICAgIHJldHVybiBpcGNSZW5kZXJlci5zZW5kU3luYyhzdG9yZUNoYW5uZWxzLmdldCwga2V5KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFzeW5jaHJvbm91c2x5IHNldHMgYSB2YWx1ZSBpbiB0aGUgc3RvcmUuXG4gICAgICogQHBhcmFtIGtleSAtIFRoZSBrZXkgdG8gc2V0LlxuICAgICAqIEBwYXJhbSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBhc3NvY2lhdGUgd2l0aCB0aGUga2V5LlxuICAgICAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSByZXN1bHQgb2YgdGhlIHNldCBvcGVyYXRpb24uXG4gICAgICovXG4gICAgc2V0OiBhc3luYyAoXG4gICAgICBrZXk6IHN0cmluZyxcbiAgICAgIHZhbHVlOiBhbnksXG4gICAgKTogUHJvbWlzZTx7IHN1Y2Nlc3M6IGJvb2xlYW47IG1lc3NhZ2U/OiBzdHJpbmcgfT4gPT4ge1xuICAgICAgcmV0dXJuIGlwY1JlbmRlcmVyLmludm9rZShzdG9yZUNoYW5uZWxzLnNldCwga2V5LCB2YWx1ZSk7XG4gICAgfSxcbiAgICAvLyBZb3UgY2FuIGFkZCBtb3JlIG1ldGhvZHMgbGlrZSBoYXMsIGRlbGV0ZSwgZXRjLiwgaGVyZVxuICB9LFxuICAvLyBFeHBvc2Ugb3RoZXIgQVBJcyBhcyBuZWVkZWRcbiAgZ2VuZXJhdGVSZXBvcnQ6IGFzeW5jIChwcm9tcHRzOiBzdHJpbmdbXSwgc3R1ZGVudE5hbWU6IHN0cmluZykgPT4ge1xuICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoJ2dlbmVyYXRlLXJlcG9ydCcsIHByb21wdHMsIHN0dWRlbnROYW1lKTtcbiAgfSxcblxuICBwcm9jZXNzRnVuY3Rpb246IGFzeW5jIChcbiAgICBmdW5jdGlvbk5hbWU6IHN0cmluZyxcbiAgICBzdHVkZW50TmFtZTogc3RyaW5nLFxuICAgIG1vZGFsSW5wdXRzOiBhbnksXG4gICAgZmlsZXM/OiBhbnksXG4gICkgPT4ge1xuICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoJ3Byb2Nlc3MtZnVuY3Rpb24nLCBmdW5jdGlvbk5hbWUsIHN0dWRlbnROYW1lLCBtb2RhbElucHV0cywgZmlsZXMpO1xuICB9LFxuXG4gIHNhdmVGaWxlOiBhc3luYyAoZmlsZUJ1ZmZlcjogQXJyYXlCdWZmZXIsIGZpbGVOYW1lOiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKCdzYXZlLWZpbGUnLCBmaWxlQnVmZmVyLCBmaWxlTmFtZSk7XG4gIH0sXG4gIGVuY3J5cHRBbmRTdG9yZTogKHVzZXJJZDogc3RyaW5nLCBrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZykgPT5cbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ2VuY3J5cHQtYW5kLXN0b3JlJywgdXNlcklkLCBrZXksIHZhbHVlKSxcbiAgcmV0cmlldmVBbmREZWNyeXB0OiAodXNlcklkOiBzdHJpbmcsIGtleTogc3RyaW5nKSA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgncmV0cmlldmUtYW5kLWRlY3J5cHQnLCB1c2VySWQsIGtleSksXG5cbiAgLy8gRXhwb3NlIHRoZSB0aWxlIGxvYWRpbmcgQVBJXG4gIGdldEdsb2JlVGlsZTogYXN5bmMgKHRpbGVJZDogc3RyaW5nKTogUHJvbWlzZTx7IHN1Y2Nlc3M6IGJvb2xlYW47IGRhdGE/OiBzdHJpbmc7IG1lc3NhZ2U/OiBzdHJpbmcgfT4gPT4ge1xuICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoJ2dldC1nbG9iZS10aWxlJywgdGlsZUlkKTtcbiAgfSxcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9