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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const config = __webpack_require__(1);
const locales = __webpack_require__(2);
const errors = __webpack_require__(4);
const middlewares = __webpack_require__(5);

module.exports = app => {

  // routes
  const routes = __webpack_require__(6)(app);
  // services
  const services = __webpack_require__(8)(app);
  // models
  const models = __webpack_require__(10)(app);
  // meta
  const meta = __webpack_require__(11)(app);

  return {
    routes,
    services,
    models,
    config,
    locales,
    errors,
    middlewares,
    meta,
  };

};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // plugin
  config.plugin = {
  };

  return config;
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'zh-cn': __webpack_require__(3),
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = {
  'Load error, try again': '加载失败，请重试',
  'Embed Page': '内嵌页面',
  Audio: '音频',
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = {
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(7);

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
  ];
  return routes;
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = app => {
  class VersionController extends app.Controller {

    async update() {
      await this.service.version.update(this.ctx.request.body);
      this.ctx.success();
    }

    async init() {
      await this.service.version.init(this.ctx.request.body);
      this.ctx.success();
    }

    async test() {
      await this.service.version.test(this.ctx.request.body);
      this.ctx.success();
    }

  }
  return VersionController;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(9);

module.exports = app => {
  const services = {
    version,
  };
  return services;
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = app => {

  class Version extends app.Service {

    async update(options) {
    }

    async init(options) {
    }

    async test() {
    }

  }

  return Version;
};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = app => {
  const models = {
  };
  return models;
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const blocks = __webpack_require__(12);

module.exports = app => {
  const schemas = __webpack_require__(15)(app);
  const meta = {
    base: {
      atoms: {
      },
      functions: {
      },
    },
    validation: {
      validators: {
        blockIFrame: {
          schemas: 'blockIFrame',
        },
        blockAudio: {
          schemas: 'blockAudio',
        },
      },
      keywords: {},
      schemas: {
        blockIFrame: schemas.blockIFrame,
        blockAudio: schemas.blockAudio,
      },
    },
    cms: {
      plugin: {
        blocks,
      },
    },
  };
  return meta;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const iframe = __webpack_require__(13);
const audio = __webpack_require__(14);

module.exports = {
  iframe,
  audio,
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = {
  meta: {
    name: 'iframe',
    title: 'Embed Page',
    validator: 'blockIFrame',
  },
  data: {
    default: {
      url: '',
      width: '',
      height: '',
    },
  },
  render({ md, options, block, token, index, content }) {
    const url = md.utils.escapeHtml(content.url);
    const width = md.utils.escapeHtml(content.width || '100%');
    const height = md.utils.escapeHtml(content.height || '300px');
    return `<div class="block block-iframe" style="width:${width};height:${height};"><iframe width="100%" height="100%" scrolling="auto" frameborder="0" src="${url}"></iframe></div>\n`;
  },
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = {
  meta: {
    name: 'audio',
    title: 'Audio',
    validator: 'blockAudio',
  },
  data: {
    default: {
      audio: {
        name: '',
        url: '',
        artist: '',
        cover: '',
      },
      autoplay: false,
      loop: true,
    },
    // async output({ ctx, block, data }) {
    //   return data;
    // },
  },
  render({ md, options, block, token, index, content }) {
    content = content || {};
    content.audio = content.audio || {};
    const content2 = {
      audio: {
        name: md.utils.escapeHtml(content.audio.name),
        url: md.utils.escapeHtml(content.audio.url),
        artist: md.utils.escapeHtml(content.audio.artist),
        cover: md.utils.escapeHtml(content.audio.cover),
      },
      autoplay: !!content.autoplay,
      loop: content.loop ? 'all' : 'none',
    };
    // element
    return `<div class="block block-audio block-audio-aplayer">
    <script type="text/template" class="template">
    ${JSON.stringify(content2, null, 2)}
    </script>
    <div class="aplayer"></div></div>
    `;
  },
};


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = app => {
  const schemas = { };
  // block iframe
  schemas.blockIFrame = {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'URL',
        format: 'uri',
        notEmpty: true,
      },
      width: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Width',
      },
      height: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Height',
      },
    },
  };
  // block audio
  schemas.blockAudio = {
    type: 'object',
    properties: {
      audio: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Audio',
        properties: {
          name: {
            type: 'string',
            ebType: 'text',
            ebTitle: 'Name',
            notEmpty: true,
          },
          url: {
            type: 'string',
            ebType: 'file',
            ebTitle: 'URL',
            ebParams: { mode: 3 },
            format: 'uri',
            notEmpty: true,
          },
          artist: {
            type: 'string',
            ebType: 'text',
            ebTitle: 'Artist',
          },
          cover: {
            type: 'string',
            ebType: 'file',
            ebTitle: 'AudioCover',
            ebParams: { mode: 1 },
          },
        },
      },
      autoplay: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Auto Play',
      },
      loop: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Loop',
      },
    },
  };

  return schemas;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map