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
});

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlbG9hZC5idW5kbGUuZGV2LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7Ozs7Ozs7O0FDVkE7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7OztBQ05BLHNCQUFzQjtBQUVnQztBQUV0RCx5Q0FBeUM7QUFDekMsTUFBTSxhQUFhLEdBQUc7SUFDcEIsR0FBRyxFQUFFLG9CQUFvQjtJQUN6QixHQUFHLEVBQUUsb0JBQW9CO0lBQ3pCLGdEQUFnRDtDQUNqRCxDQUFDO0FBRUYsc0NBQXNDO0FBQ3RDLG1EQUFhLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFO0lBQzFDLEtBQUssRUFBRTtRQUNMOzs7O1dBSUc7UUFDSCxHQUFHLEVBQUUsQ0FBQyxHQUFXLEVBQU8sRUFBRTtZQUN4QixPQUFPLGlEQUFXLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdEQsQ0FBQztRQUNEOzs7OztXQUtHO1FBQ0gsR0FBRyxFQUFFLEtBQUssRUFDUixHQUFXLEVBQ1gsS0FBVSxFQUN1QyxFQUFFO1lBQ25ELE9BQU8saURBQVcsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDM0QsQ0FBQztRQUNELHdEQUF3RDtLQUN6RDtJQUNELDhCQUE4QjtJQUM5QixjQUFjLEVBQUUsS0FBSyxFQUFFLE9BQWlCLEVBQUUsV0FBbUIsRUFBRSxFQUFFO1FBQy9ELE9BQU8saURBQVcsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFRCxlQUFlLEVBQUUsS0FBSyxFQUNwQixZQUFvQixFQUNwQixXQUFtQixFQUNuQixXQUFnQixFQUNoQixLQUFXLEVBQ1gsRUFBRTtRQUNGLE9BQU8saURBQVcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDL0YsQ0FBQztJQUVELFFBQVEsRUFBRSxLQUFLLEVBQUUsVUFBdUIsRUFBRSxRQUFnQixFQUFFLEVBQUU7UUFDNUQsT0FBTyxpREFBVyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFDRCxlQUFlLEVBQUUsQ0FBQyxNQUFjLEVBQUUsR0FBVyxFQUFFLEtBQWEsRUFBRSxFQUFFLENBQzlELGlEQUFXLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDO0lBQzdELGtCQUFrQixFQUFFLENBQUMsTUFBYyxFQUFFLEdBQVcsRUFBRSxFQUFFLENBQ2xELGlEQUFXLENBQUMsTUFBTSxDQUFDLHNCQUFzQixFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUM7Q0FDMUQsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcG9sZXNoaWZ0L3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9wb2xlc2hpZnQvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImVsZWN0cm9uXCIiLCJ3ZWJwYWNrOi8vcG9sZXNoaWZ0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3BvbGVzaGlmdC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9wb2xlc2hpZnQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3BvbGVzaGlmdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3BvbGVzaGlmdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3BvbGVzaGlmdC8uL3NyYy9tYWluL3ByZWxvYWQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIHtcblx0XHR2YXIgYSA9IGZhY3RvcnkoKTtcblx0XHRmb3IodmFyIGkgaW4gYSkgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyA/IGV4cG9ydHMgOiByb290KVtpXSA9IGFbaV07XG5cdH1cbn0pKGdsb2JhbCwgKCkgPT4ge1xucmV0dXJuICIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uXCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzcmMvbWFpbi9wcmVsb2FkLnRzXG5cbmltcG9ydCB7IGNvbnRleHRCcmlkZ2UsIGlwY1JlbmRlcmVyIH0gZnJvbSAnZWxlY3Ryb24nO1xuXG4vLyBEZWZpbmUgdGhlIGNoYW5uZWxzIGZvciBlbGVjdHJvbi1zdG9yZVxuY29uc3Qgc3RvcmVDaGFubmVscyA9IHtcbiAgZ2V0OiAnZWxlY3Ryb24tc3RvcmUtZ2V0JyxcbiAgc2V0OiAnZWxlY3Ryb24tc3RvcmUtc2V0JyxcbiAgLy8gQWRkIG1vcmUgY2hhbm5lbHMgaWYgeW91IGV4dGVuZCBmdW5jdGlvbmFsaXR5XG59O1xuXG4vLyBFeHBvc2UgQVBJcyB0byB0aGUgcmVuZGVyZXIgcHJvY2Vzc1xuY29udGV4dEJyaWRnZS5leHBvc2VJbk1haW5Xb3JsZCgnZWxlY3Ryb24nLCB7XG4gIHN0b3JlOiB7XG4gICAgLyoqXG4gICAgICogU3luY2hyb25vdXNseSByZXRyaWV2ZXMgYSB2YWx1ZSBmcm9tIHRoZSBzdG9yZS5cbiAgICAgKiBAcGFyYW0ga2V5IC0gVGhlIGtleSB0byByZXRyaWV2ZS5cbiAgICAgKiBAcmV0dXJucyBUaGUgdmFsdWUgYXNzb2NpYXRlZCB3aXRoIHRoZSBrZXkgb3IgbnVsbCBpZiBub3QgZm91bmQuXG4gICAgICovXG4gICAgZ2V0OiAoa2V5OiBzdHJpbmcpOiBhbnkgPT4ge1xuICAgICAgcmV0dXJuIGlwY1JlbmRlcmVyLnNlbmRTeW5jKHN0b3JlQ2hhbm5lbHMuZ2V0LCBrZXkpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQXN5bmNocm9ub3VzbHkgc2V0cyBhIHZhbHVlIGluIHRoZSBzdG9yZS5cbiAgICAgKiBAcGFyYW0ga2V5IC0gVGhlIGtleSB0byBzZXQuXG4gICAgICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBrZXkuXG4gICAgICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdGhlIHJlc3VsdCBvZiB0aGUgc2V0IG9wZXJhdGlvbi5cbiAgICAgKi9cbiAgICBzZXQ6IGFzeW5jIChcbiAgICAgIGtleTogc3RyaW5nLFxuICAgICAgdmFsdWU6IGFueSxcbiAgICApOiBQcm9taXNlPHsgc3VjY2VzczogYm9vbGVhbjsgbWVzc2FnZT86IHN0cmluZyB9PiA9PiB7XG4gICAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKHN0b3JlQ2hhbm5lbHMuc2V0LCBrZXksIHZhbHVlKTtcbiAgICB9LFxuICAgIC8vIFlvdSBjYW4gYWRkIG1vcmUgbWV0aG9kcyBsaWtlIGhhcywgZGVsZXRlLCBldGMuLCBoZXJlXG4gIH0sXG4gIC8vIEV4cG9zZSBvdGhlciBBUElzIGFzIG5lZWRlZFxuICBnZW5lcmF0ZVJlcG9ydDogYXN5bmMgKHByb21wdHM6IHN0cmluZ1tdLCBzdHVkZW50TmFtZTogc3RyaW5nKSA9PiB7XG4gICAgcmV0dXJuIGlwY1JlbmRlcmVyLmludm9rZSgnZ2VuZXJhdGUtcmVwb3J0JywgcHJvbXB0cywgc3R1ZGVudE5hbWUpO1xuICB9LFxuXG4gIHByb2Nlc3NGdW5jdGlvbjogYXN5bmMgKFxuICAgIGZ1bmN0aW9uTmFtZTogc3RyaW5nLFxuICAgIHN0dWRlbnROYW1lOiBzdHJpbmcsXG4gICAgbW9kYWxJbnB1dHM6IGFueSxcbiAgICBmaWxlcz86IGFueSxcbiAgKSA9PiB7XG4gICAgcmV0dXJuIGlwY1JlbmRlcmVyLmludm9rZSgncHJvY2Vzcy1mdW5jdGlvbicsIGZ1bmN0aW9uTmFtZSwgc3R1ZGVudE5hbWUsIG1vZGFsSW5wdXRzLCBmaWxlcyk7XG4gIH0sXG5cbiAgc2F2ZUZpbGU6IGFzeW5jIChmaWxlQnVmZmVyOiBBcnJheUJ1ZmZlciwgZmlsZU5hbWU6IHN0cmluZykgPT4ge1xuICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoJ3NhdmUtZmlsZScsIGZpbGVCdWZmZXIsIGZpbGVOYW1lKTtcbiAgfSxcbiAgZW5jcnlwdEFuZFN0b3JlOiAodXNlcklkOiBzdHJpbmcsIGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnZW5jcnlwdC1hbmQtc3RvcmUnLCB1c2VySWQsIGtleSwgdmFsdWUpLFxuICByZXRyaWV2ZUFuZERlY3J5cHQ6ICh1c2VySWQ6IHN0cmluZywga2V5OiBzdHJpbmcpID0+XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCdyZXRyaWV2ZS1hbmQtZGVjcnlwdCcsIHVzZXJJZCwga2V5KSxcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9