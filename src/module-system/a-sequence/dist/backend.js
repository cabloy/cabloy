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

const services = __webpack_require__(1);
const config = __webpack_require__(4);
const locales = __webpack_require__(5);
const errors = __webpack_require__(7);
const middlewares = __webpack_require__(8);

// eslint-disable-next-line
module.exports = app => {

  // meta
  const meta = __webpack_require__(11)(app);
  const routes = __webpack_require__(12)(app);

  return {
    routes,
    services,
    config,
    locales,
    errors,
    middlewares,
    meta,
  };

};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(2);
const sequence = __webpack_require__(3);
module.exports = {
  version,
  sequence,
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = app => {

  class Version extends app.Service {

    async update(options) {
      if (options.version === 1) {
        // create table: aSequence
        const sql = `
          CREATE TABLE aSequence (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            module varchar(255) DEFAULT NULL,
            name varchar(255) DEFAULT NULL,
            value json DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
      }
    }

  }

  return Version;
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = app => {

  class Sequence extends app.Service {

    // next
    async next({ module, name }) {
      const res = await this.ctx.meta.sequence.module(module)._next(name);
      return res;
    }

  }

  return Sequence;
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    sequence: {
      global: true,
      dependencies: 'instance',
    },
  };

  // queues
  config.queues = {
    sequence: {
      path: 'sequence/next',
    },
  };

  return config;
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'zh-cn': __webpack_require__(6),
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = {
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const sequence = __webpack_require__(9);

module.exports = {
  sequence,
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const SequenceFn = __webpack_require__(10);
const SEQUENCE = Symbol('CTX#__SEQUENCE');

module.exports = () => {
  return async function sequence(ctx, next) {
    ctx.meta = ctx.meta || {};
    Object.defineProperty(ctx.meta, 'sequence', {
      get() {
        if (ctx.meta[SEQUENCE] === undefined) {
          ctx.meta[SEQUENCE] = new (SequenceFn(ctx))();
        }
        return ctx.meta[SEQUENCE];
      },
    });

    // next
    await next();
  };
};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Sequence {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    // other module's sequence
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    async reset(name) {
      const provider = this._findSequenceProvider(name);
      const sequence = await this._get(name);
      await ctx.db.update('aSequence', {
        id: sequence.id,
        value: JSON.stringify(provider.start),
      });
    }

    async current(name) {
      const sequence = await this._get(name);
      if (sequence) return JSON.parse(sequence.value);
      const provider = this._findSequenceProvider(name);
      return provider.start;
    }

    async next(name) {
      const res = await ctx.app.meta.queue.pushAsync({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'sequence',
        data: {
          module: this.moduleName,
          name,
        },
      });
      return res;
    }

    async _next(name) {
      const provider = this._findSequenceProvider(name);
      const sequence = await this._get(name);

      // current
      let current;
      if (sequence) {
        current = JSON.parse(sequence.value);
      } else {
        current = provider.start;
      }

      // next
      const value = await provider.expression({ ctx, value: current });

      // save
      if (sequence) {
        await ctx.db.update('aSequence', {
          id: sequence.id,
          value: JSON.stringify(value),
        });
      }
      // insert
      else {
        await ctx.db.insert('aSequence', {
          iid: ctx.instance.id,
          module: this.moduleName,
          name,
          value: JSON.stringify(value),
        });
      }

      return value;
    }

    async _get(name) {
      // get
      const sequence = await ctx.db.get('aSequence', {
        iid: ctx.instance.id,
        module: this.moduleName,
        name,
      });
      return sequence;
    }

    _findSequenceProvider(name) {
      const meta = ctx.app.meta.modules[this.moduleName].main.meta;
      return meta.sequence.providers[name];
    }

  }

  return Sequence;
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = app => {
  const meta = {};
  if (app.meta.isTest || app.meta.isLocal) {
    // meta
    Object.assign(meta, {
      sequence: {
        providers: {
          test: {
            start: 0,
            expression({ ctx, value }) {
              return ++value;
            },
          },
        },
      },
    });
  }
  return meta;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(13);
const sequence = __webpack_require__(14);
const test = __webpack_require__(15);

module.exports = app => {
  let routes = [
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'sequence/next', controller: sequence, middlewares: 'inner', meta: { auth: { enable: false } } },
  ];
  if (app.meta.isTest || app.meta.isLocal) {
    routes = routes.concat([
      { method: 'get', path: 'test/sequence', controller: test, middlewares: 'test' },
    ]);
  }
  return routes;
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = app => {
  class VersionController extends app.Controller {

    async update() {
      await this.service.version.update(this.ctx.request.body);
      this.ctx.success();
    }

  }
  return VersionController;
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = app => {

  class SequenceController extends app.Controller {

    async next() {
      const res = await this.ctx.service.sequence.next(this.ctx.request.body);
      this.ctx.success(res);
    }

  }

  return SequenceController;
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(16);
const assert = require3('assert');

module.exports = app => {
  const pMap = __webpack_require__(17);
  class TestController extends app.Controller {

    async sequence() {

      // current
      let current = await this.ctx.meta.sequence.current('test');
      assert(current === 0);

      // next
      let next = await this.ctx.meta.sequence.next('test');
      assert(next === 1);

      // current
      current = await this.ctx.meta.sequence.current('test');
      assert(current === 1);

      // reset
      await this.ctx.meta.sequence.reset('test');

      // other module's sequence
      const moduleSequence = this.ctx.meta.sequence.module(this.ctx.module.info.relativeName);

      // next
      next = await moduleSequence.next('test');
      assert(next === 1);

      // current
      current = await moduleSequence.current('test');
      assert(current === 1);

      // reset
      await moduleSequence.reset('test');

      // concurrency
      const results = await pMap([ 1, 2, 3, 4, 5 ], async () => {
        return await moduleSequence.next('test');
      });
      assert(results.join(',') === '1,2,3,4,5');

      // reset
      await moduleSequence.reset('test');

      this.ctx.success();
    }

  }
  return TestController;
};



/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("require3");

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = (iterable, mapper, opts) => new Promise((resolve, reject) => {
	opts = Object.assign({
		concurrency: Infinity
	}, opts);

	if (typeof mapper !== 'function') {
		throw new TypeError('Mapper function is required');
	}

	const concurrency = opts.concurrency;

	if (!(typeof concurrency === 'number' && concurrency >= 1)) {
		throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${concurrency}\` (${typeof concurrency})`);
	}

	const ret = [];
	const iterator = iterable[Symbol.iterator]();
	let isRejected = false;
	let iterableDone = false;
	let resolvingCount = 0;
	let currentIdx = 0;

	const next = () => {
		if (isRejected) {
			return;
		}

		const nextItem = iterator.next();
		const i = currentIdx;
		currentIdx++;

		if (nextItem.done) {
			iterableDone = true;

			if (resolvingCount === 0) {
				resolve(ret);
			}

			return;
		}

		resolvingCount++;

		Promise.resolve(nextItem.value)
			.then(el => mapper(el, i))
			.then(
				val => {
					ret[i] = val;
					resolvingCount--;
					next();
				},
				err => {
					isRejected = true;
					reject(err);
				}
			);
	};

	for (let i = 0; i < concurrency; i++) {
		next();

		if (iterableDone) {
			break;
		}
	}
});


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map