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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlbG9hZC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7OztBQ1ZBOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7QUNOQSxzQkFBc0I7QUFFZ0M7QUFFdEQseUNBQXlDO0FBQ3pDLE1BQU0sYUFBYSxHQUFHO0lBQ3BCLEdBQUcsRUFBRSxvQkFBb0I7SUFDekIsR0FBRyxFQUFFLG9CQUFvQjtJQUN6QixnREFBZ0Q7Q0FDakQsQ0FBQztBQUVGLHNDQUFzQztBQUN0QyxtREFBYSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsRUFBRTtJQUMxQyxLQUFLLEVBQUU7UUFDTDs7OztXQUlHO1FBQ0gsR0FBRyxFQUFFLENBQUMsR0FBVyxFQUFPLEVBQUU7WUFDeEIsT0FBTyxpREFBVyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RELENBQUM7UUFDRDs7Ozs7V0FLRztRQUNILEdBQUcsRUFBRSxLQUFLLEVBQ1IsR0FBVyxFQUNYLEtBQVUsRUFDdUMsRUFBRTtZQUNuRCxPQUFPLGlEQUFXLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzNELENBQUM7UUFDRCx3REFBd0Q7S0FDekQ7SUFDRCw4QkFBOEI7SUFDOUIsY0FBYyxFQUFFLEtBQUssRUFBRSxPQUFpQixFQUFFLFdBQW1CLEVBQUUsRUFBRTtRQUMvRCxPQUFPLGlEQUFXLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBRUQsZUFBZSxFQUFFLEtBQUssRUFDcEIsWUFBb0IsRUFDcEIsV0FBbUIsRUFDbkIsV0FBZ0IsRUFDaEIsS0FBVyxFQUNYLEVBQUU7UUFDRixPQUFPLGlEQUFXLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQy9GLENBQUM7SUFFRCxRQUFRLEVBQUUsS0FBSyxFQUFFLFVBQXVCLEVBQUUsUUFBZ0IsRUFBRSxFQUFFO1FBQzVELE9BQU8saURBQVcsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBQ0QsZUFBZSxFQUFFLENBQUMsTUFBYyxFQUFFLEdBQVcsRUFBRSxLQUFhLEVBQUUsRUFBRSxDQUM5RCxpREFBVyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQztJQUM3RCxrQkFBa0IsRUFBRSxDQUFDLE1BQWMsRUFBRSxHQUFXLEVBQUUsRUFBRSxDQUNsRCxpREFBVyxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDO0NBQzFELENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3BvbGVzaGlmdC93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vcG9sZXNoaWZ0L2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJlbGVjdHJvblwiIiwid2VicGFjazovL3BvbGVzaGlmdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wb2xlc2hpZnQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vcG9sZXNoaWZ0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9wb2xlc2hpZnQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9wb2xlc2hpZnQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wb2xlc2hpZnQvLi9zcmMvbWFpbi9wcmVsb2FkLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KShnbG9iYWwsICgpID0+IHtcbnJldHVybiAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3JjL21haW4vcHJlbG9hZC50c1xuXG5pbXBvcnQgeyBjb250ZXh0QnJpZGdlLCBpcGNSZW5kZXJlciB9IGZyb20gJ2VsZWN0cm9uJztcblxuLy8gRGVmaW5lIHRoZSBjaGFubmVscyBmb3IgZWxlY3Ryb24tc3RvcmVcbmNvbnN0IHN0b3JlQ2hhbm5lbHMgPSB7XG4gIGdldDogJ2VsZWN0cm9uLXN0b3JlLWdldCcsXG4gIHNldDogJ2VsZWN0cm9uLXN0b3JlLXNldCcsXG4gIC8vIEFkZCBtb3JlIGNoYW5uZWxzIGlmIHlvdSBleHRlbmQgZnVuY3Rpb25hbGl0eVxufTtcblxuLy8gRXhwb3NlIEFQSXMgdG8gdGhlIHJlbmRlcmVyIHByb2Nlc3NcbmNvbnRleHRCcmlkZ2UuZXhwb3NlSW5NYWluV29ybGQoJ2VsZWN0cm9uJywge1xuICBzdG9yZToge1xuICAgIC8qKlxuICAgICAqIFN5bmNocm9ub3VzbHkgcmV0cmlldmVzIGEgdmFsdWUgZnJvbSB0aGUgc3RvcmUuXG4gICAgICogQHBhcmFtIGtleSAtIFRoZSBrZXkgdG8gcmV0cmlldmUuXG4gICAgICogQHJldHVybnMgVGhlIHZhbHVlIGFzc29jaWF0ZWQgd2l0aCB0aGUga2V5IG9yIG51bGwgaWYgbm90IGZvdW5kLlxuICAgICAqL1xuICAgIGdldDogKGtleTogc3RyaW5nKTogYW55ID0+IHtcbiAgICAgIHJldHVybiBpcGNSZW5kZXJlci5zZW5kU3luYyhzdG9yZUNoYW5uZWxzLmdldCwga2V5KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFzeW5jaHJvbm91c2x5IHNldHMgYSB2YWx1ZSBpbiB0aGUgc3RvcmUuXG4gICAgICogQHBhcmFtIGtleSAtIFRoZSBrZXkgdG8gc2V0LlxuICAgICAqIEBwYXJhbSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBhc3NvY2lhdGUgd2l0aCB0aGUga2V5LlxuICAgICAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSByZXN1bHQgb2YgdGhlIHNldCBvcGVyYXRpb24uXG4gICAgICovXG4gICAgc2V0OiBhc3luYyAoXG4gICAgICBrZXk6IHN0cmluZyxcbiAgICAgIHZhbHVlOiBhbnksXG4gICAgKTogUHJvbWlzZTx7IHN1Y2Nlc3M6IGJvb2xlYW47IG1lc3NhZ2U/OiBzdHJpbmcgfT4gPT4ge1xuICAgICAgcmV0dXJuIGlwY1JlbmRlcmVyLmludm9rZShzdG9yZUNoYW5uZWxzLnNldCwga2V5LCB2YWx1ZSk7XG4gICAgfSxcbiAgICAvLyBZb3UgY2FuIGFkZCBtb3JlIG1ldGhvZHMgbGlrZSBoYXMsIGRlbGV0ZSwgZXRjLiwgaGVyZVxuICB9LFxuICAvLyBFeHBvc2Ugb3RoZXIgQVBJcyBhcyBuZWVkZWRcbiAgZ2VuZXJhdGVSZXBvcnQ6IGFzeW5jIChwcm9tcHRzOiBzdHJpbmdbXSwgc3R1ZGVudE5hbWU6IHN0cmluZykgPT4ge1xuICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoJ2dlbmVyYXRlLXJlcG9ydCcsIHByb21wdHMsIHN0dWRlbnROYW1lKTtcbiAgfSxcblxuICBwcm9jZXNzRnVuY3Rpb246IGFzeW5jIChcbiAgICBmdW5jdGlvbk5hbWU6IHN0cmluZyxcbiAgICBzdHVkZW50TmFtZTogc3RyaW5nLFxuICAgIG1vZGFsSW5wdXRzOiBhbnksXG4gICAgZmlsZXM/OiBhbnksXG4gICkgPT4ge1xuICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoJ3Byb2Nlc3MtZnVuY3Rpb24nLCBmdW5jdGlvbk5hbWUsIHN0dWRlbnROYW1lLCBtb2RhbElucHV0cywgZmlsZXMpO1xuICB9LFxuXG4gIHNhdmVGaWxlOiBhc3luYyAoZmlsZUJ1ZmZlcjogQXJyYXlCdWZmZXIsIGZpbGVOYW1lOiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKCdzYXZlLWZpbGUnLCBmaWxlQnVmZmVyLCBmaWxlTmFtZSk7XG4gIH0sXG4gIGVuY3J5cHRBbmRTdG9yZTogKHVzZXJJZDogc3RyaW5nLCBrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZykgPT5cbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ2VuY3J5cHQtYW5kLXN0b3JlJywgdXNlcklkLCBrZXksIHZhbHVlKSxcbiAgcmV0cmlldmVBbmREZWNyeXB0OiAodXNlcklkOiBzdHJpbmcsIGtleTogc3RyaW5nKSA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgncmV0cmlldmUtYW5kLWRlY3J5cHQnLCB1c2VySWQsIGtleSksXG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==