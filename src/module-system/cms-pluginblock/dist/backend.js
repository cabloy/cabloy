/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 888:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const block = {
    validator: {
      module: moduleInfo.relativeName,
      validator: 'blockAudio',
    },
    // async output({ ctx, block, data }) {
    //   return data;
    // },
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
  return block;
};


/***/ }),

/***/ 175:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const block = {
    validator: {
      module: moduleInfo.relativeName,
      validator: 'blockIFrame',
    },
    render({ md, options, block, token, index, content }) {
      const url = md.utils.escapeHtml(content.url);
      const width = md.utils.escapeHtml(content.width || '100%');
      const height = md.utils.escapeHtml(content.height || '300px');
      return `<div class="block block-iframe" style="width:${width};height:${height};"><iframe width="100%" height="100%" scrolling="auto" frameborder="0" src="${url}"></iframe></div>\n`;
    },
  };
  return block;
};


/***/ }),

/***/ 746:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = app => {
  const blockAudio = __webpack_require__(888)(app);
  const blockIFrame = __webpack_require__(175)(app);
  return {
    blockAudio,
    blockIFrame,
  };
};


/***/ }),

/***/ 76:
/***/ ((module) => {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // plugin
  config.plugin = {
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

/***/ 72:
/***/ ((module) => {

module.exports = {
  'Load Error, Try Again': '加载失败，请重试',
  'Embed Page': '内嵌页面',
  Audio: '音频',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 429:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // cms block
    {
      atomName: 'Audio',
      atomStaticKey: 'blockAudio',
      atomRevision: 0,
      atomCategoryId: 'a-cms:block.General',
      resourceType: 'a-cms:block',
      resourceConfig: JSON.stringify({
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
        validator: {
          module: moduleInfo.relativeName,
          validator: 'blockAudio',
        },
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Embed Page',
      atomStaticKey: 'blockIFrame',
      atomRevision: 0,
      atomCategoryId: 'a-cms:block.General',
      resourceType: 'a-cms:block',
      resourceConfig: JSON.stringify({
        default: {
          url: '',
          width: '',
          height: '',
        },
        validator: {
          module: moduleInfo.relativeName,
          validator: 'blockIFrame',
        },
      }),
      resourceRoles: 'root',
    },
  ];
  return resources;
};


/***/ }),

/***/ 232:
/***/ ((module) => {

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
      // audio
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
      // options
      groupOptions: {
        type: 'null',
        ebType: 'group-flatten',
        ebTitle: 'Options',
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


/***/ }),

/***/ 95:
/***/ ((module) => {


module.exports = app => {
  const controllers = {
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
  const blocks = __webpack_require__(746)(app);
  const staticResources = __webpack_require__(429)(app);
  const meta = {
    base: {
      atoms: {
      },
      statics: {
        'a-base.resource': {
          items: staticResources,
        },
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(421);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=backend.js.map