import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { C as UseScope, I as beanFullNameFromOnionName, K as cast, N as SymbolBeanFullName, O as createBeanDecorator, U as BeanSimple, j as BeanBase, k as BeanInfo, m as BeanScopeBase, x as useComputed, z as deepExtend } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, o as Bean, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { o as BeanModelBase, t as init_src$3 } from "./a-model-Dk4zg8ps.js";
import { a as style, i as init_lib_es2015, n as cssRaw, o as classes, r as cssRule, t as createTypeStyle } from "./typestyle-C2zp2284.js";
//#region src/suite-vendor/a-zova/modules/a-style/src/bean/bean.theme.ts
function _initializerDefineProperty(e, i, r, l) {
	r && Object.defineProperty(e, i, {
		enumerable: r.enumerable,
		configurable: r.configurable,
		writable: r.writable,
		value: r.initializer ? r.initializer.call(l) : void 0
	});
}
function _applyDecoratedDescriptor(i, e, r, n, l) {
	var a = {};
	return Object.keys(n).forEach(function(i) {
		a[i] = n[i];
	}), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function(r, n) {
		return n(i, e, r) || r;
	}, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a;
}
var _dec$1, _dec2$1, _dec3, _dec4, _class$1, _class2, _descriptor, BeanTheme;
var init_bean_theme = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	init_src$3();
	BeanTheme = (_dec$1 = Bean(), _dec2$1 = BeanInfo({ module: "a-style" }), _dec3 = UseScope("a-ssr"), _dec4 = Reflect.metadata("design:type", typeof ScopeModuleASsr === "undefined" ? Object : ScopeModuleASsr), _dec$1(_class$1 = _dec2$1(_class$1 = (_class2 = class BeanTheme extends BeanModelBase {
		constructor(...args) {
			super(...args);
			this.name = void 0;
			this.darkMode = void 0;
			this._dark = void 0;
			this.token = void 0;
			this._mediaDark = void 0;
			this._onMediaDarkChange = void 0;
			_initializerDefineProperty(this, "$$scopeSsr", _descriptor, this);
		}
		get dark() {
			return this._dark;
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				const cookieTheme = _this.sys.config.ssr.cookie;
				const cookieThemeDarkDefault = _this.$$scopeSsr.config.cookieThemeDarkDefault;
				_this.name = _this.$useState(cookieTheme ? "cookie" : "local", {
					queryKey: ["themename"],
					meta: {
						persister: { maxAge: _this.scope.config.model.themename.persister.maxAge },
						defaultData: _this.scope.config.defaultTheme
					}
				});
				_this.darkMode = _this.$useState(cookieTheme ? "cookie" : "local", {
					queryKey: ["themedark"],
					meta: {
						persister: {
							maxAge: _this.scope.config.model.themename.persister.maxAge,
							deserialize: (value, deserializeDefault) => {
								if (cookieTheme && value === "auto") value = cookieThemeDarkDefault;
								return deserializeDefault(value);
							}
						},
						defaultData: cookieTheme ? cookieThemeDarkDefault : "auto"
					}
				});
				_this._updateDark();
				_this.$watch(() => _this.darkMode, () => {
					_this._updateDark();
				});
				_this.$watch([() => _this.name, () => _this._dark], () => {
					_this._applyTheme();
				});
				yield _this._applyThemeWrapper();
			})();
		}
		__dispose__() {
			this._listenMediaDarkChange(false);
		}
		_updateDark() {
			this._dark = this._getDarkFromDarkMode(this.darkMode);
		}
		_applyThemeWrapper() {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				yield _this2._applyTheme();
				if (_this2.sys.config.ssr.ignoreCookieOnServer) {
					_this2.toggleDark();
					yield _this2._applyTheme();
				}
			})();
		}
		_applyTheme() {
			var _this3 = this;
			return _asyncToGenerator(function* () {
				var _res$handler;
				const name = _this3.name;
				const dark = _this3._dark;
				const theme = yield _this3._loadThemeBean(name);
				if (!theme) {
					_this3.name = _this3.scope.config.defaultTheme;
					yield _this3._applyTheme();
					return;
				}
				const res = yield theme.apply({
					name,
					dark
				});
				_this3.token = cast(res).token;
				const handler = (_res$handler = res.handler) !== null && _res$handler !== void 0 ? _res$handler : _this3.scope.config.defaultThemeHandler;
				if (handler) yield (yield _this3.bean._getBean(beanFullNameFromOnionName(handler, "meta"), true)).apply({
					name,
					dark,
					token: _this3.token
				});
			})();
		}
		_loadThemeBean(name) {
			var _this4 = this;
			return _asyncToGenerator(function* () {
				const parts = name.split(":");
				if (parts.length === 1) throw new Error(`invalid theme name: ${name}`);
				const moduleName = parts[0];
				if (!_this4.app.meta.module.exists(moduleName)) return;
				return yield _this4.bean._getBean(beanFullNameFromOnionName(name, "theme"), true);
			})();
		}
		toggleDark() {
			this.darkMode = !this._dark;
			this._updateDark();
		}
		_getDarkFromDarkMode(mode) {
			if (mode === void 0) mode = "auto";
			if (mode === "auto") {
				var _this$_mediaDark;
				this._listenMediaDarkChange(true);
				return !!((_this$_mediaDark = this._mediaDark) === null || _this$_mediaDark === void 0 ? void 0 : _this$_mediaDark.matches);
			} else {
				this._listenMediaDarkChange(false);
				return mode;
			}
		}
		_listenMediaDarkChange(listen) {
			var _this5 = this;
			if (listen) {
				if (!this._mediaDark) {
					this._mediaDark = window.matchMedia("(prefers-color-scheme: dark)");
					this._onMediaDarkChange = _asyncToGenerator(function* () {
						_this5._updateDark();
						_this5._applyTheme();
					});
					this._mediaDark.addEventListener("change", this._onMediaDarkChange);
				}
			} else if (this._mediaDark) {
				this._mediaDark.removeEventListener("change", this._onMediaDarkChange);
				this._onMediaDarkChange = void 0;
				this._mediaDark = void 0;
			}
		}
	}, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "$$scopeSsr", [_dec3, _dec4], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2)) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-style/src/config/config.ts
var config;
var init_config = __esmMin((() => {
	config = (_sys) => {
		return {
			defaultCss: "home-theme:base",
			defaultTheme: "home-theme:default",
			defaultThemeHandler: "",
			model: { themename: { persister: { maxAge: Infinity } } }
		};
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-style/src/.metadata/this.ts
var __ThisModule__;
var init_this = __esmMin((() => {
	init__metadata();
	__ThisModule__ = "a-style";
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-style/src/monkey.ts
var Monkey;
var init_monkey = __esmMin((() => {
	init_lib_es2015();
	init_src$1();
	init_this();
	init_bean_theme();
	init_asyncToGenerator();
	Monkey = class extends BeanSimple {
		constructor(...args) {
			super(...args);
			this._beanTheme = void 0;
			this._beanCssBase = void 0;
			this._styleInstance = void 0;
		}
		appInitialize() {
			var _this = this;
			return _asyncToGenerator(function* () {
				if (_this.ctx.meta.$ssr.isRuntimeSsrPreHydration) {
					_this._styleInstance = createTypeStyle();
					_this.ctx.meta.$ssr.onHydrated(() => {
						_this._styleInstance.setStylesTarget(document.getElementById("styles-target"));
					});
				}
			})();
		}
		appInitialized() {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				_this2._beanTheme = yield _this2.bean._getBean(BeanTheme, true);
				const scope = yield _this2.bean.getScope(__ThisModule__);
				_this2._beanCssBase = yield _this2.bean._getBean(beanFullNameFromOnionName(scope.config.defaultCss, "css"), true);
			})();
		}
		beanInit(bean, beanInstance) {
			var _this3 = this;
			return _asyncToGenerator(function* () {
				const self = _this3;
				bean.defineProperty(beanInstance, "$style", {
					enumerable: false,
					configurable: true,
					get() {
						return function(props, ...args) {
							return self._patchStyle(beanInstance, props, ...args);
						};
					}
				});
				bean.defineProperty(beanInstance, "$cssRule", {
					enumerable: false,
					configurable: true,
					get() {
						return function(selector, ...objects) {
							return self._patchCssRule(beanInstance, selector, ...objects);
						};
					}
				});
				bean.defineProperty(beanInstance, "$cssRaw", {
					enumerable: false,
					configurable: true,
					get() {
						return function(mustBeValidCSS) {
							return self._patchCssRaw(beanInstance, mustBeValidCSS);
						};
					}
				});
				bean.defineProperty(beanInstance, "$cssBase", {
					enumerable: false,
					configurable: true,
					get() {
						return self._beanCssBase;
					}
				});
				bean.defineProperty(beanInstance, "$cssMerge", {
					enumerable: false,
					configurable: true,
					get() {
						return function(...args) {
							return self._patchCssMerge(beanInstance, ...args);
						};
					}
				});
				bean.defineProperty(beanInstance, "$theme", {
					enumerable: false,
					configurable: true,
					get() {
						return self._beanTheme;
					}
				});
				bean.defineProperty(beanInstance, "$token", {
					enumerable: false,
					configurable: true,
					get() {
						return useComputed(() => self._beanTheme.token);
					}
				});
			})();
		}
		_patchStyle(beanInstance, props, ...args) {
			if (!props) return void 0;
			if (this.sys.env.META_MODE === "development") {
				if (props && typeof props === "object") props = Object.assign({ $debugName: beanInstance[SymbolBeanFullName].replaceAll(".", "_") }, props);
			}
			if (this._styleInstance) return this._styleInstance.style(props, ...args);
			else return style(props, ...args);
		}
		_patchCssRule(_beanInstance, selector, ...objects) {
			if (this._styleInstance) return this._styleInstance.cssRule(selector, ...objects);
			else return cssRule(selector, ...objects);
		}
		_patchCssRaw(_beanInstance, mustBeValidCSS) {
			if (this._styleInstance) return this._styleInstance.cssRaw(mustBeValidCSS);
			else return cssRaw(mustBeValidCSS);
		}
		_patchCssMerge(beanInstance, ...args) {
			return classes(...args.map((item) => {
				if (Array.isArray(item)) return this._patchCssMerge(beanInstance, ...item);
				else if (typeof item === "string" && item.startsWith("cssBase:")) {
					const varName = item.substring(8);
					return beanInstance.$cssBase[varName];
				}
				return item;
			}));
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-style/src/.metadata/index.ts
/** monkey: end */
/** scope: begin */
var _dec, _dec2, _class, ScopeModuleAStyle;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_bean_theme();
	init_config();
	init_monkey();
	init_src$2();
	ScopeModuleAStyle = (_dec = Scope(), _dec2 = BeanInfo({ module: "a-style" }), _dec(_class = _dec2(_class = class ScopeModuleAStyle extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite-vendor/a-zova/modules/a-style/src/lib/style.ts
function Css(options) {
	return createBeanDecorator("css", "app", true, options);
}
function Theme(options) {
	return createBeanDecorator("theme", "app", true, options);
}
var init_style$1 = __esmMin((() => {
	init_src$1();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-style/src/lib/theme.ts
function $getThemeName(themeName) {
	return themeName;
}
var init_theme$1 = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-style/src/lib/themeBase.ts
var BeanThemeBase;
var init_themeBase = __esmMin((() => {
	init_src$1();
	BeanThemeBase = class extends BeanBase {
		getOptionsToken(params) {
			var _options$token;
			const options = this.$onionOptions;
			return (_options$token = options.token) === null || _options$token === void 0 ? void 0 : _options$token.call(options, params);
		}
		mergeOptionsToken(params, token) {
			const optionsToken = this.getOptionsToken(params);
			if (optionsToken) token = deepExtend(token, optionsToken);
			return token;
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-style/src/lib/index.ts
var init_lib = __esmMin((() => {
	init_style$1();
	init_theme$1();
	init_themeBase();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-style/src/types/css.ts
var init_css = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-style/src/types/style.ts
var init_style = __esmMin((() => {
	init_src$1();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-style/src/types/theme.ts
var init_theme = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-style/src/types/index.ts
var init_types = __esmMin((() => {
	init_css();
	init_style();
	init_theme();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-style/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	$getThemeName: () => $getThemeName,
	BeanTheme: () => BeanTheme,
	BeanThemeBase: () => BeanThemeBase,
	Css: () => Css,
	Monkey: () => Monkey,
	ScopeModuleAStyle: () => ScopeModuleAStyle,
	Theme: () => Theme,
	config: () => config
});
var init_src = __esmMin((() => {
	init__metadata();
	init_lib();
	init_types();
}));
//#endregion
export { Theme as a, Css as i, src_exports as n, BeanThemeBase as r, init_src as t };
