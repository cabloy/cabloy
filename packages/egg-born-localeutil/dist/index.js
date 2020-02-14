module.exports =
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
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var CIRCULAR_ERROR_MESSAGE = void 0;

function tryStringify(arg) {
  try {
    return JSON.stringify(arg);
  } catch (err) {
    if (!CIRCULAR_ERROR_MESSAGE) {
      try {
        var a = {};a.a = a;JSON.stringify(a);
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
    if (x === null || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) !== 'object' && (typeof x === 'undefined' ? 'undefined' : _typeof(x)) !== 'symbol') {
      str += ' ' + x;
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

/* harmony default export */ __webpack_exports__["default"] = ({
  format: format,
  getText: getText
});

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map