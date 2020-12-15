module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 76:
/***/ ((module) => {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // plugin
  config.plugin = {
    default: 'simple',
    license: {
      link: 'http://creativecommons.org/licenses/by-nc-sa/4.0/',
      version: 'BY-NC-SA 4.0',
      content: null,
    },
    titles: {
      title: 'Title',
      author: 'Author',
      createdAt: 'Created Time',
      updatedAt: 'Modification Time',
      link: 'Link',
      markdown: 'MarkdownSource',
      license: 'CopyrightLicenseTitle',
    },
    values: {
      author: null,
    },
    copyrights: {
      none: null,
      simple: {
        fields: 'author,link,markdown',
      },
      license: {
        fields: 'author,link,markdown,license',
      },
      full: {
        fields: 'title,author,createdAt,updatedAt,link,markdown,license',
      },
    },
  };

  return config;
};


/***/ }),

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {
};


/***/ }),

/***/ 327:
/***/ ((module) => {

module.exports = {
  MarkdownSource: 'Markdown Source',
  CopyrightLicenseTitle: 'Copyright Notice',
  CopyrightLicenseContent: 'All articles in this website are licensed under %s unless stating additionally.',
};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  Title: '标题',
  Author: '作者',
  Link: '链接',
  'Created Time': '创建时间',
  'Modification Time': '修改时间',
  MarkdownSource: 'Markdown源文件',
  CopyrightLicenseTitle: '版权声明',
  CopyrightLicenseContent: '本站所有文章除特别声明外，均采用 %s 许可协议。转载请注明出处！',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 232:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  return schemas;
};


/***/ }),

/***/ 841:
/***/ ((module) => {

module.exports = app => {

  class UtilController extends app.Controller {

    async md() {
      // atomId
      const atomId = this.ctx.params.atomId;
      // article
      const article = await this.ctx.bean.atom.read({ key: { atomId }, user: this.ctx.state.user.op });
      if (!article) this.ctx.throw.module('a-base', 1002);
      // ok
      this.ctx.status = 200;
      this.ctx.body = article.content;
      this.ctx.set('content-type', 'text/x-markdown; charset=UTF-8');
    }

  }
  return UtilController;
};



/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const util = __webpack_require__(841);

module.exports = app => {
  const controllers = {
    util,
  };
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);

module.exports = app => {

  // routes
  const routes = __webpack_require__(825)(app);
  // controllers
  const controllers = __webpack_require__(95)(app);
  // services
  const services = __webpack_require__(214)(app);
  // models
  const models = __webpack_require__(230)(app);
  // meta
  const meta = __webpack_require__(458)(app);

  return {
    routes,
    controllers,
    services,
    models,
    config,
    locales,
    errors,
    meta,
  };

};


/***/ }),

/***/ 458:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = app => {
  const schemas = __webpack_require__(232)(app);
  const meta = {
    base: {
      atoms: {
      },
    },
    validation: {
      validators: {
      },
      keywords: {},
      schemas: {
      },
    },
  };
  return meta;
};


/***/ }),

/***/ 230:
/***/ ((module) => {

module.exports = app => {
  const models = {
  };
  return models;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [
    // util
    { method: 'get', path: 'util/md/:atomId', controller: 'util', action: 'md' },
  ];
  return routes;
};


/***/ }),

/***/ 214:
/***/ ((module) => {


module.exports = app => {
  const services = {
  };
  return services;
};


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
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(421);
/******/ })()
;
//# sourceMappingURL=backend.js.map