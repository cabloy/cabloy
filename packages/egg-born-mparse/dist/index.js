/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
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
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var PREFIX_A = '/api/';
var PREFIX_B = 'egg-born-module-';
var PREFIX_C = './egg-born-module-';
var PREFIX_D = './';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  parseInfo: function parseInfo(moduleName) {
    if (!moduleName) return null;
    if (moduleName.indexOf('://') > -1) return null;
    if (moduleName.charAt(0) === '/') moduleName = moduleName.substr(1);
    var parts = moduleName.split('/').filter(function (item) {
      return item;
    });

    if (parts.length < 2) {
      parts = moduleName.split('-').filter(function (item) {
        return item;
      });
      if (parts.length < 2) return null;
    }

    return {
      pid: parts[0],
      name: parts[1],
      fullName: "egg-born-module-".concat(parts[0], "-").concat(parts[1]),
      relativeName: "".concat(parts[0], "-").concat(parts[1]),
      url: "".concat(parts[0], "/").concat(parts[1]),
      sync: parts[2] === 'sync',
      monkey: parts[2] === 'monkey'
    };
  },
  parseName: function parseName(moduleUrl) {
    if (!moduleUrl) return null;

    if (moduleUrl.indexOf(PREFIX_A) === 0) {
      var posA = PREFIX_A.length;
      var posB = moduleUrl.indexOf('/', posA) + 1;
      if (posB === -1) return null;
      var posC = moduleUrl.indexOf('/', posB);
      if (posC === -1) return null;
      return moduleUrl.substring(posA, posC);
    } else if (moduleUrl.indexOf(PREFIX_B) === 0) {
      return this._parseName(moduleUrl, PREFIX_B);
    } else if (moduleUrl.indexOf(PREFIX_C) === 0) {
      return this._parseName(moduleUrl, PREFIX_C);
    } else if (moduleUrl.indexOf(PREFIX_D) === 0) {
      return this._parseName(moduleUrl, PREFIX_D);
    }

    return null;
  },
  _parseName: function _parseName(moduleUrl, prefix) {
    var posA = prefix.length;
    var posB = moduleUrl.indexOf('/', posA);
    if (posB === -1) posB = moduleUrl.length;
    return moduleUrl.substring(posA, posB);
  }
});
module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map