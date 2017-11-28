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
var PREFIX_A = '/api/';
var PREFIX_B = 'egg-born-module-';
var PREFIX_C = './';
var PREFIX_D = './egg-born-module-';

/* harmony default export */ __webpack_exports__["default"] = ({
  parseInfo: function parseInfo(moduleName) {
    if (!moduleName) return null;
    var parts = moduleName.split('-');
    if (parts.length < 2) {
      if (moduleName.charAt(0) === '/') moduleName = moduleName.substr(1);
      parts = moduleName.split('/');
      if (parts.length < 2) return null;
    }
    return {
      pid: parts[0],
      name: parts[1],
      fullName: 'egg-born-module-' + parts[0] + '-' + parts[1],
      relativeName: parts[0] + '-' + parts[1],
      url: parts[0] + '/' + parts[1],
      sync: parts[2] === 'sync'
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

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map