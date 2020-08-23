(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["cabloy"] = factory();
	else
		root["cabloy"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
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

var Util = __webpack_require__(1);

var Api = __webpack_require__(2);

var Data = __webpack_require__(3);

var Config = __webpack_require__(4);

module.exports = function (app, options) {
  var _util;

  var _api;

  var _data;

  var _config;

  var cabloy = {
    get app() {
      return app;
    },

    get util() {
      if (!_util) {
        _util = Util(this);
      }

      return _util;
    },

    get api() {
      if (!_api) {
        _api = Api(this);
      }

      return _api;
    },

    get data() {
      if (!_data) {
        _data = Data(this);
      }

      return _data;
    },

    get config() {
      if (!_config) {
        _config = Config(this, options);
      }

      return _config;
    },

    set config(value) {
      if (!_config) {
        _config = Config(this, options);
      }

      _config = this.util.extend({}, _config, value);
    }

  };
  return cabloy;
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

module.exports = function (cabloy) {
  return {
    preferredLocale: function preferredLocale(locale) {
      locale = locale.toLowerCase().replace(/_/g, '-');
      var locales = cabloy.config.locales;
      if (locales[locale]) return locale;
      var localeShort = locale.split('-')[0];
      return Object.keys(locales).find(function (item) {
        return item.indexOf(localeShort) === 0;
      });
    },
    login: function login(options) {
      if (cabloy.data.dingtalk) {
        return this.__login_dingtalk(options);
      } else if (cabloy.data.wechat) {
        return this.__login_wechat(options);
      } else if (cabloy.data.wxwork) {
        return this.__login_wxwork(options);
      }
    },
    __login_wechat: function __login_wechat(options) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var scene = cabloy.config.base.scene;

        if (options && options.detail) {
          _this.__login({
            scene: scene,
            code: null,
            detail: options.detail
          }).then(resolve)["catch"](reject);
        } else {
          wx.login({
            success: function success(res) {
              var code = res.code;
              wx.getSetting({
                success: function success(res) {
                  if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                      success: function success(detail) {
                        _this.__login({
                          scene: scene,
                          code: code,
                          detail: detail
                        }).then(resolve)["catch"](reject);
                      }
                    });
                  } else {
                    _this.__login({
                      scene: scene,
                      code: code,
                      detail: null
                    }).then(resolve)["catch"](reject);
                  }
                }
              });
            }
          });
        }
      });
    },
    __login_wxwork: function __login_wxwork(options) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        wx.qy.login({
          success: function success(res) {
            var scene = cabloy.config.base.scene;
            var code = res.code;

            _this2.__login({
              scene: scene,
              code: code
            }).then(resolve)["catch"](reject);
          }
        });
      });
    },
    __login_dingtalk: function __login_dingtalk(options) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        dd.getAuthCode({
          success: function success(res) {
            var scene = cabloy.config.base.scene;
            var code = res.authCode;

            _this3.__login({
              scene: scene,
              code: code
            }).then(resolve)["catch"](reject);
          }
        });
      });
    },
    __login: function __login(_ref) {
      var scene = _ref.scene,
          code = _ref.code,
          detail = _ref.detail;
      var url = "/a/".concat(cabloy.data.container, "/authMini/login?locale=").concat(cabloy.data.locale);
      return cabloy.api.post(url, {
        scene: scene,
        code: code,
        detail: detail
      }).then(function (data) {
        cabloy.data.user = data.user;
        cabloy.data.instance = data.instance;
        cabloy.config = data.config;
        return data.user;
      });
    },
    isObject: function isObject(o) {
      return _typeof(o) === 'object' && o !== null && o.constructor && o.constructor === Object;
    },
    extend: function extend() {
      var deep = true;
      var to;
      var from;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (typeof args[0] === 'boolean') {
        deep = args[0];
        to = args[1];
        args.splice(0, 2);
        from = args;
      } else {
        to = args[0];
        args.splice(0, 1);
        from = args;
      }

      for (var i = 0; i < from.length; i += 1) {
        var nextSource = args[i];

        if (nextSource !== undefined && nextSource !== null) {
          var keysArray = Object.keys(Object(nextSource));

          for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
            var nextKey = keysArray[nextIndex];
            var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

            if (desc !== undefined && desc.enumerable) {
              if (!deep) {
                to[nextKey] = nextSource[nextKey];
              } else if (this.isObject(to[nextKey]) && this.isObject(nextSource[nextKey])) {
                this.extend(to[nextKey], nextSource[nextKey]);
              } else if (!this.isObject(to[nextKey]) && this.isObject(nextSource[nextKey])) {
                to[nextKey] = {};
                this.extend(to[nextKey], nextSource[nextKey]);
              } else {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
      }

      return to;
    }
  };
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = function (cabloy) {
  return {
    request: function request(options) {
      if (options.url.indexOf('/') === 0) {
        options.url = "".concat(cabloy.config.api.baseURL, "/api").concat(options.url);
      }

      if (cabloy.data.dingtalk) {
        if (!options.headers) options.headers = {};
        options.headers.Authorization = "Bearer ".concat(cabloy.data.jwt || '');
      } else {
        if (!options.header) options.header = {};
        options.header.Authorization = "Bearer ".concat(cabloy.data.jwt || '');
      }

      return new Promise(function (resolve, reject) {
        options.success = function (res) {
          var _statusCode = res.statusCode || res.status;

          if (_statusCode !== 200) {
            var error = new Error();
            error.code = _statusCode;
            return reject(error);
          }

          if (res.data.code !== 0) {
            var _error = new Error();

            _error.code = res.data.code;
            _error.message = res.data.message;
            return reject(_error);
          }

          if (res.data['eb-jwt']) {
            cabloy.data.jwt = res.data['eb-jwt'];
          }

          resolve(res.data.data);
        };

        options.fail = function (err) {
          reject(err);
        };

        if (cabloy.data.dingtalk) {
          dd.httpRequest(options);
        } else {
          wx.request(options);
        }
      });
    },
    get: function get(url, options) {
      options = options || {};
      options.url = url;
      options.method = 'GET';
      return this.request(options);
    },
    post: function post(url, data, options) {
      options = options || {};
      options.url = url;
      options.method = 'POST';
      options.data = data;
      return this.request(options);
    }
  };
};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = function (cabloy, options) {
  var _instance = null;
  var _user = null;
  var _jwt = null;
  var _locale = null;

  var _wxSystemInfo = typeof wx !== 'undefined' && wx.getSystemInfoSync();

  var _ddSysmtemInfo = typeof dd !== 'undefined' && dd.getSystemInfoSync();

  var _container;

  if (typeof dd !== 'undefined') {
    _container = 'dingtalk';
  } else if (typeof wx !== 'undefined' && _wxSystemInfo.environment !== 'wxwork') {
    _container = 'wechat';
  } else if (typeof wx !== 'undefined' && _wxSystemInfo.environment === 'wxwork') {
    _container = 'wxwork';
  }

  return {
    get systemInfo() {
      return _wxSystemInfo || _ddSysmtemInfo;
    },

    get container() {
      return _container;
    },

    get dingtalk() {
      return _container === 'dingtalk';
    },

    get wechat() {
      return _container === 'wechat';
    },

    get wxwork() {
      return _container === 'wxwork';
    },

    get jwt() {
      return _jwt;
    },

    set jwt(value) {
      _jwt = value;
    },

    get user() {
      return _user;
    },

    set user(value) {
      _user = value;
    },

    get loggedIn() {
      var user = this.user;
      return user && user.agent.anonymous === 0;
    },

    get instance() {
      return _instance;
    },

    set instance(value) {
      _instance = value;
    },

    get locale() {
      if (!_locale) {
        _locale = cabloy.util.preferredLocale(this.systemInfo.language);
      }

      if (!_locale) {
        _locale = cabloy.config.base.locale;
      }

      if (!_locale) {
        _locale = 'en-us';
      }

      return _locale;
    }

  };
};

/***/ }),
/* 4 */
/***/ (function(module, exports) {

var configDefault = {
  base: {
    scene: 'default',
    locale: 'en-us'
  },
  api: {
    baseURL: ''
  },
  locales: {
    'en-us': 'English',
    'zh-cn': 'Chinese'
  }
};

module.exports = function (cabloy, options) {
  return cabloy.util.extend({}, configDefault, options);
};

/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map