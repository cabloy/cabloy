import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { _ as shallowReactive } from "./vue-CeNp4lbs.js";
import { d as defineComponent, g as inject, i as KeepAlive, l as createVNode, p as h } from "./vue-t5FcxkD3.js";
import { t as Transition } from "./vue-B9B_nSUQ.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
import { B as combineQueries, J as init_dist$1, d as parseName, l as init_dist, u as parseInfo, z as combineParamsAndQuery } from "./zova-BE4e4PxD.js";
import { d as _objectSpread2, f as init_objectSpread2, m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { K as cast, S as Virtual, U as BeanSimple, V as isHttpUrl, _ as BeanControllerPageBase, b as BeanControllerBase, c as prepareComponentOptions, j as BeanBase, k as BeanInfo, l as useController, m as BeanScopeBase, w as Use, x as useComputed, z as deepExtend } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { d as Sys, i as Scope, l as Service, o as Bean, s as Controller, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { a as Model, o as BeanModelBase, t as init_src$3 } from "./a-model-Dk4zg8ps.js";
import { a as createWebHistory, i as createWebHashHistory, n as RouterView, o as init_vue_router, r as createRouter, s as routerViewLocationKey } from "./vue-router-DATdBaOJ.js";
//#region src/suite-vendor/a-zova/modules/a-router/src/model/pageData.ts
var _dec$6, _dec2$6, _class$6, ModelPageData;
var init_pageData = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_src$3();
	ModelPageData = (_dec$6 = Model(), _dec2$6 = BeanInfo({ module: "a-router" }), _dec$6(_class$6 = _dec2$6(_class$6 = class ModelPageData extends BeanModelBase {
		constructor(...args) {
			super(...args);
			this._pageDataInner = void 0;
			this.current = void 0;
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				if (_this.$ssr.isRuntimeSsrPreHydration) _this.current = _this.$ssr.state.pageData;
				else {
					const route = _this.$pageRoute;
					_this.current = route ? _this.getPageData(route.path) : void 0;
				}
			})();
		}
		getPageData(pagePath) {
			return this.$useStateMem({ queryKey: ["pageData", pagePath] });
		}
	}) || _class$6) || _class$6);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-router/src/lib/const.ts
var pageRouteKey, routerViewKey;
var init_const = __esmMin((() => {
	pageRouteKey = "$$pageRoute";
	routerViewKey = "$$routerView";
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-router/src/lib/utils.ts
function getRouteMatched(route) {
	let match = route.matched.find((item) => item.aliasOf);
	if (match) match = match.aliasOf;
	else match = route.matched[route.matched.length - 1];
	return match;
}
function getRealRouteName(name) {
	if (!name) return void 0;
	name = String(name);
	if (name.startsWith("$:")) return void 0;
	return name;
}
function isRouterName(name) {
	return !!name && name.includes(":") && !name.includes("/");
}
function getPageRoute(ctx) {
	return ctx.bean._getBeanFromHost({ name: pageRouteKey });
}
function getCurrentRoute(ctx) {
	return ctx.util.instanceScope(() => {
		return inject(routerViewLocationKey);
	});
}
var scrollBehavior;
var init_utils$1 = __esmMin((() => {
	init_vue_router();
	init_vue_runtime_esm_bundler();
	init_const();
	scrollBehavior = (to, _from, savedPosition) => {
		if (savedPosition) return new Promise((resolve) => {
			setTimeout(() => {
				resolve(savedPosition);
			}, 100);
		});
		else if (to.hash) return new Promise((resolve) => {
			setTimeout(() => {
				resolve({ el: to.hash });
			}, 200);
		});
		else return {
			left: 0,
			top: 0
		};
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-router/src/types/utils.ts
var SymbolRouterHistory;
var init_utils = __esmMin((() => {
	SymbolRouterHistory = Symbol("SymbolRouterHistory");
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-router/src/bean/sys.router.ts
var _dec$5, _dec2$5, _class$5, SysRouter;
var init_sys_router = __esmMin((() => {
	init_asyncToGenerator();
	init_objectSpread2();
	init_src$1();
	init_dist();
	init_dist$1();
	init_vue_router();
	init_src$2();
	init_utils$1();
	init_utils();
	SysRouter = (_dec$5 = Sys(), _dec2$5 = BeanInfo({ module: "a-router" }), _dec$5(_class$5 = _dec2$5(_class$5 = class SysRouter extends BeanBase {
		constructor(...args) {
			super(...args);
			this._vueRouterSys = void 0;
		}
		get router() {
			return this._vueRouterSys;
		}
		__get__(prop) {
			return this._vueRouterSys && this._vueRouterSys[prop];
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this._vueRouterSys = _this.createRouter();
				_this._loadConfigRoutes();
				_this._loadLegacyRoutes();
			})();
		}
		createRouter(options) {
			options = Object.assign({}, options);
			if (!options.matcher) {
				var _this$_vueRouterSys;
				options.matcher = (_this$_vueRouterSys = this._vueRouterSys) === null || _this$_vueRouterSys === void 0 ? void 0 : _this$_vueRouterSys.matcher;
			}
			if (!options.routes) {
				if (!this._vueRouterSys) options.routes = [];
			}
			if (!options.scrollBehavior) options.scrollBehavior = this.scope.config.scrollBehavior;
			if (!options.history) {
				const createHistory = this.sys.env.ROUTER_MODE === "history" ? createWebHistory : createWebHashHistory;
				const routeBase = this.sys.env.ROUTER_MODE === "history" ? this.sys.env.APP_PUBLIC_PATH : void 0;
				options.history = createHistory(routeBase);
			}
			const router = createRouter(options);
			cast(router).__hasDevtools = true;
			router[SymbolRouterHistory] = options.history;
			return router;
		}
		createAsyncComponent(component) {
			if (typeof component !== "string") return component;
			return this.sys.meta.component.createAsyncComponent(component);
		}
		getPagePath(path, options, absolute) {
			const pagePath = combineParamsAndQuery(path, {
				params: options === null || options === void 0 ? void 0 : options.params,
				query: options === null || options === void 0 ? void 0 : options.query
			});
			return absolute ? this.sys.util.getAbsoluteUrlFromPagePath(pagePath) : pagePath;
		}
		resolveRoute(url, check404, checkAliasOf) {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				const pagePath = _this2.sys.util.getPagePathFromAbsoluteUrl(url);
				let route = yield _this2.ensureRoute(pagePath);
				if (check404 && route.name === "$:/:catchAll(.*)*") return;
				if (checkAliasOf) {
					const matchItem = route.matched.find((item) => item.aliasOf);
					if (matchItem) route = matchItem.aliasOf;
					if (check404 && route.name === "$:/:catchAll(.*)*") return;
				}
				return route;
			})();
		}
		checkPathValid(to) {
			var _to$name;
			const _name = to && typeof to === "object" ? to.name : void 0;
			const _path = to && typeof to === "object" ? (_to$name = to.name) !== null && _to$name !== void 0 ? _to$name : to.path : to;
			if (this._findLegacyRoute(_name, _path)) return true;
			if (!_path) return true;
			const moduleName = parseName(_path);
			if (!moduleName) return true;
			return this.sys.meta.module.exists(moduleName);
		}
		ensureRoute(pagePath) {
			var _this3 = this;
			return _asyncToGenerator(function* () {
				let route = _this3._vueRouterSys.resolve(pagePath);
				if (route && route.name !== "$:/:catchAll(.*)*") return route;
				const moduleName = parseName(pagePath);
				if (moduleName) {
					if (_this3.sys.meta.module.exists(moduleName)) {
						if (!_this3.sys.meta.module.get(moduleName)) {
							yield _this3.sys.meta.module.use(moduleName);
							route = _this3._vueRouterSys.resolve(pagePath);
						}
					}
				}
				return route;
			})();
		}
		/** @internal */
		_registerRoutes(module) {
			if (!module.resource.routes) return;
			for (const route of module.resource.routes) this._registerRoute(route, module);
		}
		/** @internal */
		_findConfigRoute(name, path) {
			name = this.getRealRouteName(name);
			return name ? this.sys.config.routes.name[name] : this.sys.config.routes.path[path];
		}
		/** @internal */
		_findLegacyRoute(name, path) {
			const legacyRoutes = cast(this.sys.meta).legacyRoutes;
			if (!legacyRoutes) return;
			name = this.getRealRouteName(name);
			return legacyRoutes.find((item) => {
				return name ? item.name === name : item.path === path;
			});
		}
		getRouteMatched(route) {
			return getRouteMatched(route);
		}
		getRealRouteName(name) {
			return getRealRouteName(name);
		}
		isRouterName(name) {
			return isRouterName(name);
		}
		resolveName(name, options) {
			var _cast, _cast2;
			const params = (_cast = cast(options)) === null || _cast === void 0 ? void 0 : _cast.params;
			const query = (_cast2 = cast(options)) === null || _cast2 === void 0 ? void 0 : _cast2.query;
			return this._resolveNameOrPath(query, (query) => {
				return this.router.resolve({
					name,
					params,
					query
				}).fullPath;
			});
		}
		resolvePath(path, query) {
			return this._resolveNameOrPath(query, (query) => {
				return this.router.resolve({
					path,
					query
				}).fullPath;
			});
		}
		_resolveNameOrPath(query, fn) {
			const query1 = {};
			const query2 = [];
			if (query) for (const key in query) {
				const value = query[key];
				if (value && typeof value === "object") query2.push([key, value]);
				else query1[key] = value;
			}
			const fullPath = fn(query1);
			const query2str = query2.map(([key, value]) => {
				return `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`;
			}).join("&");
			if (!query2str) return fullPath;
			return `${fullPath}${Object.keys(query1).length > 0 ? "&" : "?"}${query2str}`;
		}
		_loadConfigRoutes() {
			const routesPath = this.sys.config.routes.path;
			for (const key in routesPath) {
				const route = routesPath[key];
				if (!route) continue;
				this._loadConfigRoute(_objectSpread2(_objectSpread2({}, route), {}, {
					path: key,
					name: `$:${key}`
				}));
			}
			const routesName = this.sys.config.routes.name;
			for (const key in routesName) {
				const route = routesName[key];
				if (!route) continue;
				this._loadConfigRoute(_objectSpread2(_objectSpread2({}, route), {}, {
					path: route.path || route.alias,
					name: key
				}));
			}
		}
		_loadLegacyRoutes() {
			const legacyRoutes = cast(this.sys.meta).legacyRoutes;
			if (!legacyRoutes) return;
			for (const route of legacyRoutes) this._registerRoute(route);
		}
		_loadConfigRoute(route) {
			this.router.addRoute(route);
		}
		_registerRoute(route, module) {
			let path;
			if (route.path !== void 0) {
				var _route$meta;
				if (!module || ((_route$meta = route.meta) === null || _route$meta === void 0 ? void 0 : _route$meta.absolute) === true) path = route.path;
				else path = route.path ? `/${module.info.pid}/${module.info.name}/${route.path}` : `/${module.info.pid}/${module.info.name}`;
			}
			let name;
			if (route.name) {
				var _route$meta2;
				if (!module || ((_route$meta2 = route.meta) === null || _route$meta2 === void 0 ? void 0 : _route$meta2.absolute) === true) name = String(route.name);
				else name = `${module.info.relativeName}:${String(route.name)}`;
			}
			const configRoute = name ? this.sys.config.routes.name[name] : this.sys.config.routes.path[path];
			if (configRoute) route = deepExtend({}, route, configRoute);
			if (name && (configRoute === null || configRoute === void 0 ? void 0 : configRoute.alias)) this.router.addRoute({
				name: `$alias:${name}`,
				path: `/__alias__${configRoute === null || configRoute === void 0 ? void 0 : configRoute.alias}`,
				redirect: ""
			});
			if (!name) name = `$:${path}`;
			const meta = route.meta;
			const component = route.component;
			let layout = meta === null || meta === void 0 ? void 0 : meta.layout;
			let routeData;
			let routeNameParent;
			if (layout === false) routeData = _objectSpread2(_objectSpread2({}, route), {}, {
				name,
				path,
				component,
				meta
			});
			else {
				if (layout === void 0 || layout === "default") layout = this.sys.config.layout.component.default;
				else if (layout === "empty") layout = this.sys.config.layout.component.empty;
				routeNameParent = `$:${name}`;
				routeData = {
					name: routeNameParent,
					path,
					component: this.createAsyncComponent(layout),
					children: [_objectSpread2(_objectSpread2({}, route), {}, {
						name,
						path: "",
						component,
						meta
					})]
				};
			}
			if (this.router.hasRoute(routeNameParent)) this.router.removeRoute(routeNameParent);
			if (this.router.hasRoute(name)) this.router.removeRoute(name);
			this.router.addRoute(routeData);
		}
	}) || _class$5) || _class$5);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-router/src/bean/bean.router.ts
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
var _dec$4, _dec2$4, _dec3$1, _dec4, _dec5, _dec6, _class$4, _class2, _descriptor, _descriptor2, BeanRouter;
var init_bean_router = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	init_pageData();
	init_sys_router();
	BeanRouter = (_dec$4 = Bean(), _dec2$4 = BeanInfo({ module: "a-router" }), _dec3$1 = Use(), _dec4 = Reflect.metadata("design:type", typeof SysRouter === "undefined" ? Object : SysRouter), _dec5 = Use(), _dec6 = Reflect.metadata("design:type", typeof ModelPageData === "undefined" ? Object : ModelPageData), _dec$4(_class$4 = _dec2$4(_class$4 = (_class2 = class BeanRouter extends BeanBase {
		constructor(...args) {
			super(...args);
			this._vueRouterApp = void 0;
			this._eventRouterGuards = [];
			this._routerViews = [];
			_initializerDefineProperty(this, "$$sysRouter", _descriptor, this);
			_initializerDefineProperty(this, "$$modelPageData", _descriptor2, this);
		}
		get router() {
			return this._vueRouterApp;
		}
		__dispose__() {
			for (const fn of this._eventRouterGuards) fn();
		}
		__get__(prop) {
			var _this$_vueRouterApp, _this$$$sysRouter;
			const value = (_this$_vueRouterApp = this._vueRouterApp) === null || _this$_vueRouterApp === void 0 ? void 0 : _this$_vueRouterApp[prop];
			if (value !== void 0) return value;
			return (_this$$$sysRouter = this.$$sysRouter) === null || _this$$$sysRouter === void 0 ? void 0 : _this$$$sysRouter[prop];
		}
		__init__(mainRouter) {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this._vueRouterApp = _this.$$sysRouter.createRouter();
				if (!mainRouter) yield _this.app.meta.event.emit("a-router:routerGuards", _this);
			})();
		}
		addRouterView(routerView) {
			this._routerViews.push(routerView);
		}
		removeRouterView(routerView) {
			const index = this._routerViews.findIndex((item) => item === routerView);
			if (index > -1) this._routerViews.splice(index, 1);
		}
		afterEachBackRoute(route) {
			for (const routerView of this._routerViews) if (routerView.backRoute(route)) break;
		}
		afterEachForwardRoute(route) {
			for (const routerView of this._routerViews) if (routerView.forwardRoute(route)) break;
		}
		beforeEach(guard) {
			const fn = this._vueRouterApp.beforeEach(guard);
			this._eventRouterGuards.push(fn);
			return fn;
		}
		beforeResolve(guard) {
			const fn = this._vueRouterApp.beforeResolve(guard);
			this._eventRouterGuards.push(fn);
			return fn;
		}
		afterEach(guard) {
			const fn = this._vueRouterApp.afterEach(guard);
			this._eventRouterGuards.push(fn);
			return fn;
		}
		onError(handler) {
			const fn = this._vueRouterApp.onError(handler);
			this._eventRouterGuards.push(fn);
			return fn;
		}
		setPageMeta(route, pageMeta) {
			for (const routerView of this._routerViews) routerView.setPageMeta(route, pageMeta);
		}
	}, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "$$sysRouter", [_dec3$1, _dec4], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "$$modelPageData", [_dec5, _dec6], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2)) || _class$4) || _class$4);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-router/src/bean/bean.routerGuardsBase.ts
var _dec$3, _dec2$3, _dec3, _class$3, BeanRouterGuardsBase;
var init_bean_routerGuardsBase = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	BeanRouterGuardsBase = (_dec$3 = Bean(), _dec2$3 = Virtual(), _dec3 = BeanInfo({ module: "a-router" }), _dec$3(_class$3 = _dec2$3(_class$3 = _dec3(_class$3 = class BeanRouterGuardsBase extends BeanBase {
		constructor(...args) {
			super(...args);
			this._eventRouterGuards = void 0;
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this._eventRouterGuards = _this.app.meta.event.on("a-router:routerGuards", function() {
					var _ref = _asyncToGenerator(function* (router, next) {
						_this.onRouterGuards(router);
						return yield next();
					});
					return function(_x, _x2) {
						return _ref.apply(this, arguments);
					};
				}());
			})();
		}
		__dispose__() {
			this.dispose();
		}
		dispose() {
			if (this._eventRouterGuards) this._eventRouterGuards();
		}
		onRouterGuards(_router) {}
	}) || _class$3) || _class$3) || _class$3);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-router/src/types/router.ts
var NavigationType, NavigationDirection;
var init_router = __esmMin((() => {
	NavigationType = /* @__PURE__ */ function(NavigationType) {
		NavigationType["pop"] = "pop";
		NavigationType["push"] = "push";
		return NavigationType;
	}({});
	NavigationDirection = /* @__PURE__ */ function(NavigationDirection) {
		NavigationDirection["back"] = "back";
		NavigationDirection["forward"] = "forward";
		NavigationDirection["unknown"] = "";
		return NavigationDirection;
	}({});
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-router/src/service/routerGuards.ts
var _dec$2, _dec2$2, _class$2, ServiceRouterGuards;
var init_routerGuards = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_dist();
	init_src$2();
	init_bean_routerGuardsBase();
	init_router();
	ServiceRouterGuards = (_dec$2 = Service(), _dec2$2 = BeanInfo({ module: "a-router" }), _dec$2(_class$2 = _dec2$2(_class$2 = class ServiceRouterGuards extends BeanRouterGuardsBase {
		onRouterGuards(router) {
			var _this = this;
			const self = this;
			router.beforeEach(function() {
				var _ref = _asyncToGenerator(function* (to) {
					let match = to.matched.find((item) => item.aliasOf);
					if (match) match = match.aliasOf;
					else {
						match = to.matched[to.matched.length - 1];
						if (!(yield _this._prepareCheck(match === null || match === void 0 ? void 0 : match.path, to.path))) return to.fullPath;
						if (router._findLegacyRoute(match === null || match === void 0 ? void 0 : match.name, match === null || match === void 0 ? void 0 : match.path)) return;
						const configRoute = router._findConfigRoute(match === null || match === void 0 ? void 0 : match.name, match === null || match === void 0 ? void 0 : match.path);
						const alias = configRoute === null || configRoute === void 0 ? void 0 : configRoute.alias;
						if (alias) {
							const resLoadModule = yield _this._forceLoadModule(router, match === null || match === void 0 ? void 0 : match.name, match === null || match === void 0 ? void 0 : match.path);
							if (resLoadModule && resLoadModule !== true) return resLoadModule;
							if (resLoadModule === false) return to.fullPath;
							if (router.getRealRouteName(match === null || match === void 0 ? void 0 : match.name)) {
								const routeAlias = router.resolveName(`$alias:${match === null || match === void 0 ? void 0 : match.name}`, {
									params: to.params,
									query: to.query
								});
								return (routeAlias.startsWith("/__alias__") ? routeAlias.substring(10) : routeAlias) || "/";
							} else return {
								path: Array.isArray(alias) ? alias[0] : alias,
								params: to.params,
								query: to.query
							};
						}
					}
					const resLoadModule = yield _this._forceLoadModule(router, match === null || match === void 0 ? void 0 : match.name, match === null || match === void 0 ? void 0 : match.path);
					if (resLoadModule === true) return;
					if (resLoadModule) return resLoadModule;
					return to.fullPath;
				});
				return function(_x) {
					return _ref.apply(this, arguments);
				};
			}());
			router.afterEach(function(to, from, error) {
				if (error) return;
				const info = arguments[3];
				if (from.fullPath !== to.fullPath) self._afterEachFrom(router, from, info);
				router.afterEachForwardRoute(to);
			});
		}
		_afterEachFrom(router, from, info) {
			if (!info) return;
			if (!(info.type === NavigationType.pop && info.direction === NavigationDirection.back || info.type === NavigationType.push && info.replace)) return;
			router.afterEachBackRoute(from);
		}
		_prepareCheck(pathMatched, pathTo) {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				if (pathMatched === "/:catchAll(.*)*") {
					const moduleInfo = parseInfo(parseName(pathTo));
					if (moduleInfo && _this2.app.meta.module.exists(moduleInfo.relativeName) && !_this2.app.meta.module.get(moduleInfo.relativeName, false)) {
						yield _this2.app.meta.module.use(moduleInfo.relativeName);
						return false;
					}
				}
				return true;
			})();
		}
		_forceLoadModule(router, name, path) {
			var _this3 = this;
			return _asyncToGenerator(function* () {
				const moduleInfo = parseInfo(parseName(router.getRealRouteName(name) || path));
				if (!moduleInfo) return true;
				const moduleName = moduleInfo.relativeName;
				if (!_this3.app.meta.module.exists(moduleName)) return "/404";
				if (_this3.app.meta.module.get(moduleName, false)) return true;
				yield _this3.app.meta.module.use(moduleName);
				return false;
			})();
		}
	}) || _class$2) || _class$2);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-router/src/lib/routerViewBase.tsx
var BeanRouterViewBase;
var init_routerViewBase = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_vue_router();
	init_src$1();
	init_const();
	init_asyncToGenerator();
	BeanRouterViewBase = class extends BeanControllerBase {
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.bean._setBean(routerViewKey, _this);
				_this.$router.addRouterView(_this);
			})();
		}
		__dispose__() {
			this.$router.removeRouterView(this);
		}
		backRoute(_route) {
			return false;
		}
		forwardRoute(_route) {
			return false;
		}
		setPageMeta(_route, _pageMeta) {}
		prepareRouteMeta(_route) {
			throw new Error("Not Implemented");
		}
		getKeepAliveInclude() {
			throw new Error("Not Implemented");
		}
		render() {
			return createVNode(RouterView, null, { default: (component) => {
				const routeMeta = this.prepareRouteMeta(component.route);
				return h(Transition, null, { default: () => {
					const vnode = h(component.Component, { key: routeMeta.componentKey });
					cast(vnode).zovaHostProviders = { [pageRouteKey]: component.route };
					return [h(KeepAlive, { include: this.getKeepAliveInclude() }, [vnode])];
				} });
			} });
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-router/src/component/routerViewEmpty/controller.tsx
var _dec$1, _dec2$1, _class$1, ControllerRouterViewEmpty;
var init_controller = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_src$1();
	init_vue_router();
	init_src$2();
	init_const();
	init_routerViewBase();
	ControllerRouterViewEmpty = (_dec$1 = Controller(), _dec2$1 = BeanInfo({ module: "a-router" }), _dec$1(_class$1 = _dec2$1(_class$1 = class ControllerRouterViewEmpty extends BeanRouterViewBase {
		__init__() {
			return _asyncToGenerator(function* () {})();
		}
		render() {
			return createVNode(RouterView, null, { default: (component) => {
				const vnode = h(component.Component);
				cast(vnode).zovaHostProviders = { ["$$pageRoute"]: component.route };
				return vnode;
			} });
		}
	}) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-router/src/.metadata/component/routerViewEmpty.ts
var ZRouterViewEmpty;
var init_routerViewEmpty = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller();
	ZRouterViewEmpty = defineComponent((_props) => {
		useController(ControllerRouterViewEmpty, void 0, void 0);
		return () => {};
	}, prepareComponentOptions());
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-router/src/config/config.ts
var config;
var init_config = __esmMin((() => {
	init_utils$1();
	config = (_sys) => {
		return { scrollBehavior };
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-router/src/monkey.ts
var Monkey;
var init_monkey = __esmMin((() => {
	init_dist();
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_const();
	init_utils$1();
	init_routerGuards();
	init_utils();
	init_asyncToGenerator();
	Monkey = class extends BeanSimple {
		constructor(...args) {
			super(...args);
			this._beanRouter = void 0;
			this.serviceRouterGuards = void 0;
		}
		getBeanRouter() {
			var _this = this;
			return _asyncToGenerator(function* () {
				if (!_this._beanRouter) _this._beanRouter = _this.app.meta.$router = yield _this.bean._getBean("a-router.bean.router", true, true);
				return _this._beanRouter;
			})();
		}
		appInitialize() {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				_this2.serviceRouterGuards = yield _this2.bean._newBean(ServiceRouterGuards, false);
				_this2._ssrErrorHandler();
			})();
		}
		appInitialized() {
			var _this3 = this;
			return _asyncToGenerator(function* () {
				const beanRouter = yield _this3.getBeanRouter();
				yield _this3.app.meta.event.emit("a-router:routerGuards", beanRouter);
			})();
		}
		appClose() {
			if (this.serviceRouterGuards) this.serviceRouterGuards.dispose();
		}
		appReady() {
			var _this4 = this;
			return _asyncToGenerator(function* () {
				const beanRouter = yield _this4.getBeanRouter();
				if (_this4.ctx.meta.$ssr.isRuntimeSsrPreHydration) {
					const pagePathFull = _this4.ctx.meta.$ssr.state.pagePathFull;
					if (pagePathFull) beanRouter.router[SymbolRouterHistory].push(pagePathFull);
				}
				_this4.app.vue.use(beanRouter);
				if (_this4.ctx.meta.$ssr.isRuntimeSsrPreHydration) yield beanRouter.isReady();
			})();
		}
		beanInit(bean, beanInstance) {
			return _asyncToGenerator(function* () {
				bean.defineProperty(beanInstance, "$router", {
					enumerable: false,
					configurable: true,
					get() {
						return bean._getBeanFromHost("a-router.bean.router");
					}
				});
				bean.defineProperty(beanInstance, "$routerView", {
					enumerable: false,
					configurable: true,
					get() {
						return bean._getBeanFromHost({ name: routerViewKey });
					}
				});
				bean.defineProperty(beanInstance, "$pageRoute", {
					enumerable: false,
					configurable: true,
					get() {
						return useComputed(() => {
							return getPageRoute(cast(bean).ctx);
						});
					}
				});
				bean.defineProperty(beanInstance, "$currentRoute", {
					enumerable: false,
					configurable: true,
					get() {
						return useComputed(() => {
							return getCurrentRoute(cast(bean).ctx);
						});
					}
				});
			})();
		}
		controllerDataPrepare(controllerData, ctx) {
			controllerData.context.route = getPageRoute(ctx);
		}
		controllerDataInit(controllerData, controller) {
			if (!(controller instanceof BeanControllerPageBase)) return;
			const route = controllerData.context.route;
			this._initControllerRoute(route, controller);
		}
		controllerDataUpdate(controller) {
			if (!(controller instanceof BeanControllerPageBase)) return;
			const route = getPageRoute(cast(cast(controller).ctx));
			this._initControllerRoute(route, controller);
		}
		_initControllerRoute(route, controller) {
			if (!route) return;
			const routeMatched = getRouteMatched(route);
			if (!routeMatched) return;
			if (controller.$routeMatched && !this._checkIfRouteSame(routeMatched, controller.$routeMatched)) return;
			if (!(!controller.$route || controller.$route.fullPath !== route.fullPath)) return;
			controller.$route = route;
			controller.$routeMatched = routeMatched;
			const routeName = getRealRouteName(routeMatched.name);
			const schemaKey = routeName || String(routeMatched.path);
			let schemas;
			const moduleInfo = parseInfo(parseName(schemaKey));
			if (!moduleInfo) return;
			if (!this.app.meta.module.exists(moduleInfo.relativeName)) return;
			const module = this.app.meta.module.get(moduleInfo.relativeName);
			if (routeName) {
				var _module$resource$page;
				schemas = (_module$resource$page = module.resource.pageNameSchemas) === null || _module$resource$page === void 0 ? void 0 : _module$resource$page[schemaKey];
			} else {
				var _module$resource$page2;
				schemas = (_module$resource$page2 = module.resource.pagePathSchemas) === null || _module$resource$page2 === void 0 ? void 0 : _module$resource$page2[schemaKey];
			}
			if (schemas === null || schemas === void 0 ? void 0 : schemas.params) {
				const params = schemas.params.parse(route.params);
				if (!controller.$params) controller.$params = shallowReactive(params);
				else Object.assign(controller.$params, params);
			}
			if (schemas === null || schemas === void 0 ? void 0 : schemas.query) {
				const query = schemas.query.parse(route.query);
				if (!controller.$query) controller.$query = shallowReactive(query);
				else Object.assign(controller.$query, query);
			}
		}
		_checkIfRouteSame(route1, route2) {
			return route1.name && route1.name === route2.name || route1.path === route2.path;
		}
		_ssrErrorHandler() {
			this.app.meta.event.on("app:errorHandler", (data, next) => {
				const err = next();
				if (!err || !(err instanceof Error)) return err;
				return this._errorHandlerDefaultClient(err, data);
			});
		}
		_errorHandlerDefaultClient(err, _data) {
			if ([301, 302].includes(Number(err.code))) {
				this.app.$gotoPage(err.pagePath);
				return;
			}
			if (err.code === 600) return;
			if (err.code === 401) {
				this.app.$gotoLogin();
				return;
			}
			return err;
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-router/src/monkeySys.ts
var MonkeySys;
var init_monkeySys = __esmMin((() => {
	init_dist$1();
	init_src$1();
	init_asyncToGenerator();
	MonkeySys = class extends BeanSimple {
		constructor(moduleSelf) {
			super();
			this._moduleSelf = void 0;
			this._sysRouter = void 0;
			this._moduleSelf = moduleSelf;
		}
		getSysRouter() {
			var _this = this;
			return _asyncToGenerator(function* () {
				if (!_this._sysRouter) _this._sysRouter = yield _this.bean._getBean("a-router.sys.router", false);
				return _this._sysRouter;
			})();
		}
		moduleLoading(module) {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				if (_this2._moduleSelf === module) return;
				if (!module.resource.routes) return;
				(yield _this2.getSysRouter())._registerRoutes(module);
			})();
		}
		moduleLoaded(_module) {
			return _asyncToGenerator(function* () {})();
		}
		configLoaded(_module, _config) {
			return _asyncToGenerator(function* () {})();
		}
		sysApplicationInitialize(app) {
			app.$redirect = (pagePath, status) => {
				const error = /* @__PURE__ */ new Error();
				error.code = status !== null && status !== void 0 ? status : 302;
				if (isHttpUrl(pagePath)) {
					error.pagePath = pagePath;
					error.url = pagePath;
				} else {
					error.pagePath = pagePath;
					error.url = app.sys.util.getAbsoluteUrlFromPagePath(pagePath, true);
				}
				error.message = error.pagePath;
				throw error;
			};
			app.$gotoPage = (pagePath, options) => {
				var _options$query;
				const query = (_options$query = options === null || options === void 0 ? void 0 : options.query) !== null && _options$query !== void 0 ? _options$query : {};
				if (options === null || options === void 0 ? void 0 : options.returnTo) {
					const returnTo = typeof (options === null || options === void 0 ? void 0 : options.returnTo) === "string" ? options === null || options === void 0 ? void 0 : options.returnTo : app.$getCurrentPagePath();
					if (returnTo !== app.sys.env.ROUTER_PAGE_HOME) query[app.sys.env.ROUTER_KEY_RETURNTO] = returnTo;
				}
				pagePath = combineQueries(pagePath, query);
				if (options === null || options === void 0 ? void 0 : options.forceRedirect) return app.$redirect(pagePath);
				if (isHttpUrl(pagePath)) window.location[(options === null || options === void 0 ? void 0 : options.replace) ? "replace" : "assign"](pagePath);
				else return app.meta.$router[(options === null || options === void 0 ? void 0 : options.replace) ? "replace" : "push"](pagePath);
			};
			app.$gotoHome = () => {
				return app.$gotoPage(app.sys.env.ROUTER_PAGE_HOME);
			};
			app.$gotoLogin = (returnTo, cause) => {
				var _cast;
				if (!returnTo && ((_cast = cast(app.meta.$router.currentRoute)) === null || _cast === void 0 ? void 0 : _cast.path) === app.sys.env.ROUTER_PAGE_LOGIN) return;
				const query = {};
				if (cause) query.cause = cause;
				const returnTo2 = returnTo === app.sys.env.ROUTER_PAGE_LOGIN ? void 0 : returnTo !== null && returnTo !== void 0 ? returnTo : true;
				return app.$gotoPage(app.sys.env.ROUTER_PAGE_LOGIN, {
					query,
					returnTo: returnTo2
				});
			};
			app.$gotoReturnTo = (returnTo) => {
				const pagePath = app.$getReturnTo(returnTo);
				return app.$gotoPage(pagePath, { replace: true });
			};
			app.$getReturnTo = (returnTo) => {
				var _cast2;
				return returnTo || ((_cast2 = cast(app.meta.$router.currentRoute)) === null || _cast2 === void 0 || (_cast2 = _cast2.query) === null || _cast2 === void 0 ? void 0 : _cast2[app.sys.env.ROUTER_KEY_RETURNTO]) || app.sys.env.ROUTER_PAGE_HOME;
			};
			app.$getCurrentPagePath = () => {
				var _cast3;
				return (_cast3 = cast(app.meta.$router.currentRoute)) === null || _cast3 === void 0 ? void 0 : _cast3.fullPath;
			};
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-router/src/.metadata/index.ts
/** monkeySys: end */
/** scope: begin */
var _dec, _dec2, _class, components, ScopeModuleARouter;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_pageData();
	init_src$3();
	init_sys_router();
	init_bean_router();
	init_bean_routerGuardsBase();
	init_routerGuards();
	init_src$2();
	init_controller();
	init_routerViewEmpty();
	init_routerViewEmpty();
	init_config();
	init_monkey();
	init_monkeySys();
	components = { "routerViewEmpty": ZRouterViewEmpty };
	ScopeModuleARouter = (_dec = Scope(), _dec2 = BeanInfo({ module: "a-router" }), _dec(_class = _dec2(_class = class ScopeModuleARouter extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite-vendor/a-zova/modules/a-router/src/lib/index.ts
var init_lib = __esmMin((() => {
	init_const();
	init_routerViewBase();
	init_utils$1();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-router/src/types/pageMeta.ts
var init_pageMeta = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-router/src/types/routerView.ts
var init_routerView = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-router/src/types/index.ts
var init_types = __esmMin((() => {
	init_pageMeta();
	init_router();
	init_routerView();
	init_utils();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-router/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	BeanRouter: () => BeanRouter,
	BeanRouterGuardsBase: () => BeanRouterGuardsBase,
	BeanRouterViewBase: () => BeanRouterViewBase,
	ControllerRouterViewEmpty: () => ControllerRouterViewEmpty,
	ModelPageData: () => ModelPageData,
	Monkey: () => Monkey,
	MonkeySys: () => MonkeySys,
	NavigationDirection: () => NavigationDirection,
	NavigationType: () => NavigationType,
	ScopeModuleARouter: () => ScopeModuleARouter,
	ServiceRouterGuards: () => ServiceRouterGuards,
	SymbolRouterHistory: () => SymbolRouterHistory,
	SysRouter: () => SysRouter,
	ZRouterViewEmpty: () => ZRouterViewEmpty,
	components: () => components,
	config: () => config,
	getCurrentRoute: () => getCurrentRoute,
	getPageRoute: () => getPageRoute,
	getRealRouteName: () => getRealRouteName,
	getRouteMatched: () => getRouteMatched,
	isRouterName: () => isRouterName,
	pageRouteKey: () => pageRouteKey,
	routerViewKey: () => routerViewKey,
	scrollBehavior: () => scrollBehavior
});
var init_src = __esmMin((() => {
	init__metadata();
	init_lib();
	init_types();
}));
//#endregion
export { BeanRouterGuardsBase as i, src_exports as n, BeanRouterViewBase as r, init_src as t };
