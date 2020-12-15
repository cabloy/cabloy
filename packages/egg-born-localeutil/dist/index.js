module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 121:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var CIRCULAR_ERROR_MESSAGE;

function tryStringify(arg) {
  try {
    return JSON.stringify(arg);
  } catch (err) {
    if (!CIRCULAR_ERROR_MESSAGE) {
      try {
        var a = {};
        a.a = a;
        JSON.stringify(a);
      } catch (err) {
        CIRCULAR_ERROR_MESSAGE = err.message;
      }
    }

    if (err.name === 'TypeError' && err.message === CIRCULAR_ERROR_MESSAGE) {
      return '[Circular]';
    }

    throw err;
  }
}

function format(f) {
  if (arguments.length === 1) return f;
  var str = '';
  var a = 1;
  var lastPos = 0;

  for (var i = 0; i < f.length;) {
    if (f.charCodeAt(i) === 37 && i + 1 < f.length) {
      if (f.charCodeAt(i + 1) !== 37 && a >= arguments.length) {
        ++i;
        continue;
      }

      switch (f.charCodeAt(i + 1)) {
        case 100:
          if (lastPos < i) {
            str += f.slice(lastPos, i);
          }

          str += Number(arguments[a++]);
          break;

        case 105:
          if (lastPos < i) {
            str += f.slice(lastPos, i);
          }

          str += parseInt(arguments[a++]);
          break;

        case 102:
          if (lastPos < i) {
            str += f.slice(lastPos, i);
          }

          str += parseFloat(arguments[a++]);
          break;

        case 106:
          if (lastPos < i) {
            str += f.slice(lastPos, i);
          }

          str += tryStringify(arguments[a++]);
          break;

        case 115:
          if (lastPos < i) {
            str += f.slice(lastPos, i);
          }

          str += String(arguments[a++]);
          break;

        case 37:
          if (lastPos < i) {
            str += f.slice(lastPos, i);
          }

          str += '%';
          break;

        default:
          if (lastPos < i) {
            str += f.slice(lastPos, i);
          }

          str += '%';
          lastPos = i = i + 1;
          continue;
      }

      lastPos = i = i + 2;
      continue;
    }

    ++i;
  }

  if (lastPos === 0) {
    str = f;
  } else if (lastPos < f.length) {
    str += f.slice(lastPos);
  }

  while (a < arguments.length) {
    var x = arguments[a++];

    if (x === null || _typeof(x) !== 'object' && _typeof(x) !== 'symbol') {
      str += " ".concat(x);
    } else {}
  }

  return str;
}

function getText(text, value) {
  if (arguments.length === 0) return '';
  if (!text) return '';

  if (arguments.length === 1) {
    return text;
  }

  if (arguments.length === 2) {
    if (isObject(value)) {
      return formatWithObject(text, value);
    }

    if (Array.isArray(value)) {
      return formatWithArray(text, value);
    }

    return format(text, value);
  }

  var args = new Array(arguments.length);
  args[0] = text;

  for (var i = 1; i < args.length; i++) {
    args[i] = arguments[i];
  }

  return format.apply(null, args);
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

var ARRAY_INDEX_RE = /\{(\d+)\}/g;

function formatWithArray(text, values) {
  return text.replace(ARRAY_INDEX_RE, function (orignal, matched) {
    var index = parseInt(matched);

    if (index < values.length) {
      return values[index];
    }

    return orignal;
  });
}

var Object_INDEX_RE = /\{(.+?)\}/g;

function formatWithObject(text, values) {
  return text.replace(Object_INDEX_RE, function (orignal, matched) {
    var value = values[matched];

    if (value) {
      return value;
    }

    return orignal;
  });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  format: format,
  getText: getText
});

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
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
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
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
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(121);
/******/ })()
;
//# sourceMappingURL=index.js.map