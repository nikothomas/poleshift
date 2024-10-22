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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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bml0aW9uIiwid2VicGFjazovL3BvbGVzaGlmdC9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZWxlY3Ryb25cIiIsIndlYnBhY2s6Ly9wb2xlc2hpZnQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcG9sZXNoaWZ0L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3BvbGVzaGlmdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcG9sZXNoaWZ0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcG9sZXNoaWZ0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcG9sZXNoaWZ0Ly4vc3JjL21haW4vcHJlbG9hZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoZ2xvYmFsLCAoKSA9PiB7XG5yZXR1cm4gIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHNyYy9tYWluL3ByZWxvYWQudHNcblxuaW1wb3J0IHsgY29udGV4dEJyaWRnZSwgaXBjUmVuZGVyZXIgfSBmcm9tICdlbGVjdHJvbic7XG5cbi8vIERlZmluZSB0aGUgY2hhbm5lbHMgZm9yIGVsZWN0cm9uLXN0b3JlXG5jb25zdCBzdG9yZUNoYW5uZWxzID0ge1xuICBnZXQ6ICdlbGVjdHJvbi1zdG9yZS1nZXQnLFxuICBzZXQ6ICdlbGVjdHJvbi1zdG9yZS1zZXQnLFxuICAvLyBBZGQgbW9yZSBjaGFubmVscyBpZiB5b3UgZXh0ZW5kIGZ1bmN0aW9uYWxpdHlcbn07XG5cbi8vIEV4cG9zZSBBUElzIHRvIHRoZSByZW5kZXJlciBwcm9jZXNzXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKCdlbGVjdHJvbicsIHtcbiAgc3RvcmU6IHtcbiAgICAvKipcbiAgICAgKiBTeW5jaHJvbm91c2x5IHJldHJpZXZlcyBhIHZhbHVlIGZyb20gdGhlIHN0b3JlLlxuICAgICAqIEBwYXJhbSBrZXkgLSBUaGUga2V5IHRvIHJldHJpZXZlLlxuICAgICAqIEByZXR1cm5zIFRoZSB2YWx1ZSBhc3NvY2lhdGVkIHdpdGggdGhlIGtleSBvciBudWxsIGlmIG5vdCBmb3VuZC5cbiAgICAgKi9cbiAgICBnZXQ6IChrZXk6IHN0cmluZyk6IGFueSA9PiB7XG4gICAgICByZXR1cm4gaXBjUmVuZGVyZXIuc2VuZFN5bmMoc3RvcmVDaGFubmVscy5nZXQsIGtleSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBc3luY2hyb25vdXNseSBzZXRzIGEgdmFsdWUgaW4gdGhlIHN0b3JlLlxuICAgICAqIEBwYXJhbSBrZXkgLSBUaGUga2V5IHRvIHNldC5cbiAgICAgKiBAcGFyYW0gdmFsdWUgLSBUaGUgdmFsdWUgdG8gYXNzb2NpYXRlIHdpdGggdGhlIGtleS5cbiAgICAgKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUgcmVzdWx0IG9mIHRoZSBzZXQgb3BlcmF0aW9uLlxuICAgICAqL1xuICAgIHNldDogYXN5bmMgKFxuICAgICAga2V5OiBzdHJpbmcsXG4gICAgICB2YWx1ZTogYW55LFxuICAgICk6IFByb21pc2U8eyBzdWNjZXNzOiBib29sZWFuOyBtZXNzYWdlPzogc3RyaW5nIH0+ID0+IHtcbiAgICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2Uoc3RvcmVDaGFubmVscy5zZXQsIGtleSwgdmFsdWUpO1xuICAgIH0sXG4gICAgLy8gWW91IGNhbiBhZGQgbW9yZSBtZXRob2RzIGxpa2UgaGFzLCBkZWxldGUsIGV0Yy4sIGhlcmVcbiAgfSxcbiAgLy8gRXhwb3NlIG90aGVyIEFQSXMgYXMgbmVlZGVkXG4gIGdlbmVyYXRlUmVwb3J0OiBhc3luYyAocHJvbXB0czogc3RyaW5nW10sIHN0dWRlbnROYW1lOiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKCdnZW5lcmF0ZS1yZXBvcnQnLCBwcm9tcHRzLCBzdHVkZW50TmFtZSk7XG4gIH0sXG5cbiAgcHJvY2Vzc0Z1bmN0aW9uOiBhc3luYyAoXG4gICAgZnVuY3Rpb25OYW1lOiBzdHJpbmcsXG4gICAgc3R1ZGVudE5hbWU6IHN0cmluZyxcbiAgICBtb2RhbElucHV0czogYW55LFxuICAgIGZpbGVzPzogYW55LFxuICApID0+IHtcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKCdwcm9jZXNzLWZ1bmN0aW9uJywgZnVuY3Rpb25OYW1lLCBzdHVkZW50TmFtZSwgbW9kYWxJbnB1dHMsIGZpbGVzKTtcbiAgfSxcblxuICBzYXZlRmlsZTogYXN5bmMgKGZpbGVCdWZmZXI6IEFycmF5QnVmZmVyLCBmaWxlTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgcmV0dXJuIGlwY1JlbmRlcmVyLmludm9rZSgnc2F2ZS1maWxlJywgZmlsZUJ1ZmZlciwgZmlsZU5hbWUpO1xuICB9LFxuICBlbmNyeXB0QW5kU3RvcmU6ICh1c2VySWQ6IHN0cmluZywga2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpID0+XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCdlbmNyeXB0LWFuZC1zdG9yZScsIHVzZXJJZCwga2V5LCB2YWx1ZSksXG4gIHJldHJpZXZlQW5kRGVjcnlwdDogKHVzZXJJZDogc3RyaW5nLCBrZXk6IHN0cmluZykgPT5cbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ3JldHJpZXZlLWFuZC1kZWNyeXB0JywgdXNlcklkLCBrZXkpLFxuXG4gIC8vIEV4cG9zZSB0aGUgdGlsZSBsb2FkaW5nIEFQSVxuICBnZXRHbG9iZVRpbGU6IGFzeW5jICh0aWxlSWQ6IHN0cmluZyk6IFByb21pc2U8eyBzdWNjZXNzOiBib29sZWFuOyBkYXRhPzogc3RyaW5nOyBtZXNzYWdlPzogc3RyaW5nIH0+ID0+IHtcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKCdnZXQtZ2xvYmUtdGlsZScsIHRpbGVJZCk7XG4gIH0sXG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==