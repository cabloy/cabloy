(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["cabloy"] = factory();
	else
		root["cabloy"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 380:
/***/ ((module) => {

module.exports = function (cabloy) {
  return {
    request: function request(options) {
      if (options.url.indexOf('/') === 0) {
        options.url = "".concat(cabloy.config.api.baseURL, "/api").concat(options.url);
      }

      var jwt = cabloy.util.getJwtAuthorization();

      if (cabloy.data.dingtalk) {
        if (!options.headers) options.headers = {};
        options.headers.Authorization = "Bearer ".concat(jwt);
      } else {
        if (!options.header) options.header = {};
        options.header.Authorization = "Bearer ".concat(jwt);
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

          if (res.data['eb-jwt-oauth']) {
            cabloy.data.oauth = res.data['eb-jwt-oauth'];
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

/***/ 642:
/***/ ((module) => {

var configDefault = {
  base: {
    providerScene: 'default',
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

/***/ }),

/***/ 793:
/***/ ((module) => {

module.exports = function (cabloy, options) {
  var _instance = null;
  var _user = null;
  var _oauth = null;
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

    get oauth() {
      return _oauth;
    },

    set oauth(value) {
      _oauth = value;
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

/***/ 586:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Util = __webpack_require__(233);

var Api = __webpack_require__(380);

var Data = __webpack_require__(793);

var Config = __webpack_require__(642);

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

/***/ 233:
/***/ ((module) => {

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

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
        var providerScene = cabloy.config.base.providerScene;

        if (options && options.detail) {
          _this.__login({
            providerScene: providerScene,
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
                          providerScene: providerScene,
                          code: code,
                          detail: detail
                        }).then(resolve)["catch"](reject);
                      }
                    });
                  } else {
                    _this.__login({
                      providerScene: providerScene,
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
            var providerScene = cabloy.config.base.providerScene;
            var code = res.code;

            _this2.__login({
              providerScene: providerScene,
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
            var providerScene = cabloy.config.base.providerScene;
            var code = res.authCode;

            _this3.__login({
              providerScene: providerScene,
              code: code
            }).then(resolve)["catch"](reject);
          }
        });
      });
    },
    __login: function __login(_ref) {
      var providerScene = _ref.providerScene,
          code = _ref.code,
          detail = _ref.detail;
      var url = "/a/".concat(cabloy.data.container, "/authMini/login?locale=").concat(cabloy.data.locale);
      return cabloy.api.post(url, {
        providerScene: providerScene,
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
    },
    getJwtAuthorization: function getJwtAuthorization() {
      var oauth = cabloy.data.oauth;
      if (!oauth) return '';
      return oauth.expireTime - Date.now() > 120 * 1000 ? oauth.accessToken : oauth.refreshToken;
    }
  };
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(586);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map