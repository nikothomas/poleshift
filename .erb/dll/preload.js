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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlbG9hZC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7OztBQ1ZBOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7QUNOQSxzQkFBc0I7QUFFZ0M7QUFHdEQseUNBQXlDO0FBQ3pDLE1BQU0sYUFBYSxHQUFHO0lBQ3BCLEdBQUcsRUFBRSxvQkFBb0I7SUFDekIsR0FBRyxFQUFFLG9CQUFvQjtJQUN6QixnREFBZ0Q7Q0FDakQsQ0FBQztBQUVGLHNDQUFzQztBQUN0QyxtREFBYSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsRUFBRTtJQUMxQyxLQUFLLEVBQUU7UUFDTDs7OztXQUlHO1FBQ0gsR0FBRyxFQUFFLENBQUMsR0FBVyxFQUFPLEVBQUU7WUFDeEIsT0FBTyxpREFBVyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RELENBQUM7UUFDRDs7Ozs7V0FLRztRQUNILEdBQUcsRUFBRSxLQUFLLEVBQ1IsR0FBVyxFQUNYLEtBQVUsRUFDdUMsRUFBRTtZQUNuRCxPQUFPLGlEQUFXLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzNELENBQUM7UUFDRCx3REFBd0Q7S0FDekQ7SUFDRCw4QkFBOEI7SUFDOUIsY0FBYyxFQUFFLEtBQUssRUFBRSxPQUFpQixFQUFFLFdBQW1CLEVBQUUsRUFBRTtRQUMvRCxPQUFPLGlEQUFXLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBRUQsZUFBZSxFQUFFLEtBQUssRUFDcEIsWUFBb0IsRUFDcEIsV0FBbUIsRUFDbkIsV0FBZ0IsRUFDaEIsS0FBVyxFQUNYLEVBQUU7UUFDRixPQUFPLGlEQUFXLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQy9GLENBQUM7SUFFRCxRQUFRLEVBQUUsS0FBSyxFQUFFLFVBQXVCLEVBQUUsUUFBZ0IsRUFBRSxFQUFFO1FBQzVELE9BQU8saURBQVcsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBQ0QsZUFBZSxFQUFFLENBQUMsTUFBYyxFQUFFLEdBQVcsRUFBRSxLQUFhLEVBQUUsRUFBRSxDQUM5RCxpREFBVyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQztJQUM3RCxrQkFBa0IsRUFBRSxDQUFDLE1BQWMsRUFBRSxHQUFXLEVBQUUsRUFBRSxDQUNsRCxpREFBVyxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDO0NBQzFELENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2VsZWN0cm9uLXJlYWN0LWJvaWxlcnBsYXRlL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9lbGVjdHJvbi1yZWFjdC1ib2lsZXJwbGF0ZS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZWxlY3Ryb25cIiIsIndlYnBhY2s6Ly9lbGVjdHJvbi1yZWFjdC1ib2lsZXJwbGF0ZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9lbGVjdHJvbi1yZWFjdC1ib2lsZXJwbGF0ZS93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9lbGVjdHJvbi1yZWFjdC1ib2lsZXJwbGF0ZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZWxlY3Ryb24tcmVhY3QtYm9pbGVycGxhdGUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9lbGVjdHJvbi1yZWFjdC1ib2lsZXJwbGF0ZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2VsZWN0cm9uLXJlYWN0LWJvaWxlcnBsYXRlLy4vc3JjL21haW4vcHJlbG9hZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoZ2xvYmFsLCAoKSA9PiB7XG5yZXR1cm4gIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHNyYy9tYWluL3ByZWxvYWQudHNcblxuaW1wb3J0IHsgY29udGV4dEJyaWRnZSwgaXBjUmVuZGVyZXIgfSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQgeyBQcm9jZXNzZWRUZXN0RGF0YSB9IGZyb20gJy4uL2NvbW1vbi90eXBlcy90ZXN0RGF0YVR5cGVzJztcblxuLy8gRGVmaW5lIHRoZSBjaGFubmVscyBmb3IgZWxlY3Ryb24tc3RvcmVcbmNvbnN0IHN0b3JlQ2hhbm5lbHMgPSB7XG4gIGdldDogJ2VsZWN0cm9uLXN0b3JlLWdldCcsXG4gIHNldDogJ2VsZWN0cm9uLXN0b3JlLXNldCcsXG4gIC8vIEFkZCBtb3JlIGNoYW5uZWxzIGlmIHlvdSBleHRlbmQgZnVuY3Rpb25hbGl0eVxufTtcblxuLy8gRXhwb3NlIEFQSXMgdG8gdGhlIHJlbmRlcmVyIHByb2Nlc3NcbmNvbnRleHRCcmlkZ2UuZXhwb3NlSW5NYWluV29ybGQoJ2VsZWN0cm9uJywge1xuICBzdG9yZToge1xuICAgIC8qKlxuICAgICAqIFN5bmNocm9ub3VzbHkgcmV0cmlldmVzIGEgdmFsdWUgZnJvbSB0aGUgc3RvcmUuXG4gICAgICogQHBhcmFtIGtleSAtIFRoZSBrZXkgdG8gcmV0cmlldmUuXG4gICAgICogQHJldHVybnMgVGhlIHZhbHVlIGFzc29jaWF0ZWQgd2l0aCB0aGUga2V5IG9yIG51bGwgaWYgbm90IGZvdW5kLlxuICAgICAqL1xuICAgIGdldDogKGtleTogc3RyaW5nKTogYW55ID0+IHtcbiAgICAgIHJldHVybiBpcGNSZW5kZXJlci5zZW5kU3luYyhzdG9yZUNoYW5uZWxzLmdldCwga2V5KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFzeW5jaHJvbm91c2x5IHNldHMgYSB2YWx1ZSBpbiB0aGUgc3RvcmUuXG4gICAgICogQHBhcmFtIGtleSAtIFRoZSBrZXkgdG8gc2V0LlxuICAgICAqIEBwYXJhbSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBhc3NvY2lhdGUgd2l0aCB0aGUga2V5LlxuICAgICAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSByZXN1bHQgb2YgdGhlIHNldCBvcGVyYXRpb24uXG4gICAgICovXG4gICAgc2V0OiBhc3luYyAoXG4gICAgICBrZXk6IHN0cmluZyxcbiAgICAgIHZhbHVlOiBhbnksXG4gICAgKTogUHJvbWlzZTx7IHN1Y2Nlc3M6IGJvb2xlYW47IG1lc3NhZ2U/OiBzdHJpbmcgfT4gPT4ge1xuICAgICAgcmV0dXJuIGlwY1JlbmRlcmVyLmludm9rZShzdG9yZUNoYW5uZWxzLnNldCwga2V5LCB2YWx1ZSk7XG4gICAgfSxcbiAgICAvLyBZb3UgY2FuIGFkZCBtb3JlIG1ldGhvZHMgbGlrZSBoYXMsIGRlbGV0ZSwgZXRjLiwgaGVyZVxuICB9LFxuICAvLyBFeHBvc2Ugb3RoZXIgQVBJcyBhcyBuZWVkZWRcbiAgZ2VuZXJhdGVSZXBvcnQ6IGFzeW5jIChwcm9tcHRzOiBzdHJpbmdbXSwgc3R1ZGVudE5hbWU6IHN0cmluZykgPT4ge1xuICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoJ2dlbmVyYXRlLXJlcG9ydCcsIHByb21wdHMsIHN0dWRlbnROYW1lKTtcbiAgfSxcblxuICBwcm9jZXNzRnVuY3Rpb246IGFzeW5jIChcbiAgICBmdW5jdGlvbk5hbWU6IHN0cmluZyxcbiAgICBzdHVkZW50TmFtZTogc3RyaW5nLFxuICAgIG1vZGFsSW5wdXRzOiBhbnksXG4gICAgZmlsZXM/OiBhbnksXG4gICkgPT4ge1xuICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoJ3Byb2Nlc3MtZnVuY3Rpb24nLCBmdW5jdGlvbk5hbWUsIHN0dWRlbnROYW1lLCBtb2RhbElucHV0cywgZmlsZXMpO1xuICB9LFxuICBcbiAgc2F2ZUZpbGU6IGFzeW5jIChmaWxlQnVmZmVyOiBBcnJheUJ1ZmZlciwgZmlsZU5hbWU6IHN0cmluZykgPT4ge1xuICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoJ3NhdmUtZmlsZScsIGZpbGVCdWZmZXIsIGZpbGVOYW1lKTtcbiAgfSxcbiAgZW5jcnlwdEFuZFN0b3JlOiAodXNlcklkOiBzdHJpbmcsIGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnZW5jcnlwdC1hbmQtc3RvcmUnLCB1c2VySWQsIGtleSwgdmFsdWUpLFxuICByZXRyaWV2ZUFuZERlY3J5cHQ6ICh1c2VySWQ6IHN0cmluZywga2V5OiBzdHJpbmcpID0+XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCdyZXRyaWV2ZS1hbmQtZGVjcnlwdCcsIHVzZXJJZCwga2V5KSxcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9