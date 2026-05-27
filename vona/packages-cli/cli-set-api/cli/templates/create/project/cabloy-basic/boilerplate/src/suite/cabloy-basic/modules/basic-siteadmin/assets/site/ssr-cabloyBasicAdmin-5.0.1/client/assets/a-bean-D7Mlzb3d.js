import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { A as compose, J as init_dist$3, L as checkMeta, Z as isNil, c as getOnionScenesMeta, j as init_dist, l as init_dist$2, o as init_dist$1, s as swapDeps, tt as matchSelector } from "./zova-BE4e4PxD.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { E as ProxyDisable, F as appResource, G as appMetadata, K as cast, O as createBeanDecorator, U as BeanSimple, W as registerMappedClassMetadataKey, j as BeanBase, k as BeanInfo, m as BeanScopeBase, w as Use, z as deepExtend } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
//#region src/suite-vendor/a-zova/modules/a-bean/src/lib/bean.ts
function Sys() {
	return createBeanDecorator("sys", "sys");
}
function Bean() {
	return createBeanDecorator("bean", "ctx");
}
function Service() {
	return createBeanDecorator("service", "ctx");
}
function Tool() {
	return createBeanDecorator("tool", "app");
}
function Data() {
	return createBeanDecorator("data", "new");
}
function Controller() {
	return createBeanDecorator("controller", "ctx");
}
function Render() {
	return createBeanDecorator("render", "ctx");
}
function Style() {
	return createBeanDecorator("style", "ctx");
}
function Aop(options) {
	return createBeanDecorator("aop", "sys", true, options);
}
function AopMethod(options) {
	return createBeanDecorator("aopMethod", "sys", true, options);
}
var init_bean$1 = __esmMin((() => {
	init_src$1();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-bean/src/service/onion_.ts
var _dec$3, _dec2$3, _dec3$2, _class$3, ServiceOnion;
var init_onion_ = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_dist();
	init_dist$1();
	init_dist$2();
	init_bean$1();
	ServiceOnion = (_dec$3 = ProxyDisable(), _dec2$3 = Service(), _dec3$2 = BeanInfo({ module: "a-bean" }), _dec$3(_class$3 = _dec2$3(_class$3 = _dec3$2(_class$3 = class ServiceOnion extends BeanSimple {
		constructor(...args) {
			super(...args);
			this.sysOnion = void 0;
			this.sceneName = void 0;
			this.sceneMeta = void 0;
			this.onionsAll = void 0;
		}
		__init__(sceneName, sysOnion) {
			this.sysOnion = sysOnion;
			this.sceneName = sceneName;
			this.sceneMeta = getOnionScenesMeta(this.sys.meta.module.modulesMeta.modules)[this.sceneName];
			if (this.sceneMeta.optionsPackage) {
				this._initOnionsAll();
				this._swapOnions(this.onionsAll);
			}
		}
		_initOnionsAll() {
			this.onionsAll = [];
			for (const moduleName in this.sys.meta.module.modulesMeta.modules) {
				var _module$info$onionsMe;
				const nodeItems = (_module$info$onionsMe = this.sys.meta.module.modulesMeta.modules[moduleName].info.onionsMeta) === null || _module$info$onionsMe === void 0 || (_module$info$onionsMe = _module$info$onionsMe.onionsConfig) === null || _module$info$onionsMe === void 0 ? void 0 : _module$info$onionsMe[this.sceneName];
				if (!nodeItems) continue;
				for (const itemName in nodeItems) {
					var _this$sys$config$onio;
					let itemOptions = nodeItems[itemName];
					const onionName = `${moduleName}:${itemName}`;
					const optionsConfig = (_this$sys$config$onio = this.sys.config.onions[this.sceneName]) === null || _this$sys$config$onio === void 0 ? void 0 : _this$sys$config$onio[onionName];
					if (optionsConfig) itemOptions = deepExtend({}, itemOptions, optionsConfig);
					this.onionsAll.push({
						name: onionName,
						options: itemOptions
					});
				}
			}
		}
		_swapOnions(onions) {
			swapDeps(onions, {
				name: "name",
				dependencies: (item) => {
					return cast(item).options.dependencies;
				},
				dependents: (item) => {
					return cast(item).options.dependents;
				}
			});
		}
		loadOnionsFromPackage(selector, matchThis, ...matchArgs) {
			var _this = this;
			return _asyncToGenerator(function* () {
				const onionItems = _this.getOnionsEnabled(_this.onionsAll, selector, matchThis, ...matchArgs);
				return yield _this.loadOnions(onionItems, selector, matchThis, ...matchArgs);
			})();
		}
		loadOnions(onionItems, selector, matchThis, ...matchArgs) {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				if (!Array.isArray(onionItems)) onionItems = [onionItems];
				if (onionItems.length === 0) return [];
				const moduleNames = onionItems.map((item) => item.name.split(":")[0]);
				yield _this2._loadModules(moduleNames);
				const onionSlices = [];
				for (const item of onionItems) {
					const beanFullName = item.name.replace(":", `.${_this2.sceneName}.`);
					const beanOptions = appResource.getBean(beanFullName);
					if (!beanOptions) throw new Error(`behavior not found: ${beanFullName}`);
					let options;
					if (beanOptions.optionsPrimitive) options = item.options !== void 0 ? item.options : beanOptions.options;
					else options = item.options !== void 0 ? deepExtend({}, beanOptions.options, item.options) : beanOptions.options;
					onionSlices.push({
						name: item.name,
						options,
						beanFullName
					});
				}
				if (_this2.sceneMeta.optionsPackage) return onionSlices;
				_this2._swapOnions(onionSlices);
				return _this2.getOnionsEnabled(onionSlices, selector, matchThis, ...matchArgs);
			})();
		}
		getOnionsEnabled(onions, selector, matchThis, ...matchArgs) {
			if (!onions) return [];
			return onions.filter((onionItem) => {
				const onionOptions = onionItem.options;
				return this.sysOnion.checkOnionOptionsEnabled(onionOptions, selector, matchThis, ...matchArgs);
			});
		}
		compose(onions, executeCustom) {
			const fns = [];
			for (const item of onions) fns.push(this._wrapOnion(item, executeCustom));
			return compose(fns);
		}
		_loadModules(moduleNames) {
			var _this3 = this;
			return _asyncToGenerator(function* () {
				moduleNames = Array.from(new Set(moduleNames)).filter((item) => !_this3.sys.meta.module.get(item));
				yield _this3.sys.meta.module.loadModules(moduleNames);
			})();
		}
		/** internal */
		_wrapOnion(item, executeCustom) {
			const fn = (data, next) => {
				return executeCustom(item, data, next);
			};
			fn._name = item.name;
			return fn;
		}
	}) || _class$3) || _class$3) || _class$3);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-bean/src/bean/sys.onion.ts
function __onionMatchSelector(match, selector, matchThis, ...matchArgs) {
	return matchSelector(match, selector, matchThis, ...matchArgs);
}
var _dec$2, _dec2$2, _dec3$1, _class$2, SysOnion;
var init_sys_onion = __esmMin((() => {
	init_src$1();
	init_dist$3();
	init_bean$1();
	init_onion_();
	SysOnion = (_dec$2 = ProxyDisable(), _dec2$2 = Sys(), _dec3$1 = BeanInfo({ module: "a-bean" }), _dec$2(_class$2 = _dec2$2(_class$2 = _dec3$1(_class$2 = class SysOnion extends BeanBase {
		constructor(...args) {
			super(...args);
			this.__instances = {};
		}
		__get__(prop) {
			if (!this.__instances[prop]) this.__instances[prop] = this.bean._newBeanSimple(ServiceOnion, false, prop, this);
			return this.__instances[prop];
		}
		checkOnionOptionsEnabled(options, selector, matchThis, ...matchArgs) {
			if (options.enable === false) return false;
			if (!this.checkOnionOptionsMeta(options.meta)) return false;
			if (isNil(selector) || selector === false) return true;
			if (isNil(options.match) && isNil(options.ignore)) return true;
			return !isNil(options.match) && __onionMatchSelector(options.match, selector, matchThis, ...matchArgs) || !isNil(options.ignore) && !__onionMatchSelector(options.ignore, selector, matchThis, ...matchArgs);
		}
		checkOnionOptionsMeta(meta) {
			return checkMeta(meta, this.sys.config.meta);
		}
	}) || _class$2) || _class$2) || _class$2);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-bean/src/types/aopMethod.ts
var SymbolDecoratorUseAopMethod;
var init_aopMethod = __esmMin((() => {
	SymbolDecoratorUseAopMethod = Symbol("SymbolDecoratorUseAopMethod");
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-bean/src/service/aop.ts
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
var _dec$1, _dec2$1, _dec3, _dec4, _dec5, _class$1, _class2, _descriptor, ServiceAop;
var init_aop$1 = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_sys_onion();
	init_bean$1();
	init_aopMethod();
	ServiceAop = (_dec$1 = ProxyDisable(), _dec2$1 = Service(), _dec3 = BeanInfo({ module: "a-bean" }), _dec4 = Use(), _dec5 = Reflect.metadata("design:type", typeof SysOnion === "undefined" ? Object : SysOnion), _dec$1(_class$1 = _dec2$1(_class$1 = _dec3(_class$1 = (_class2 = class ServiceAop extends BeanBase {
		constructor(...args) {
			super(...args);
			_initializerDefineProperty(this, "$$sysOnion", _descriptor, this);
		}
		findAopsMatched(beanFullName) {
			var _this = this;
			return _asyncToGenerator(function* () {
				const beanOptions = appResource.getBean(beanFullName);
				if (!beanOptions) return;
				return yield _this.$$sysOnion.aop.loadOnionsFromPackage(beanOptions.beanFullName);
			})();
		}
		findAopMethodsMatched(beanFullName) {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				const beanOptions = appResource.getBean(beanFullName);
				if (!beanOptions) return;
				const aopMethodsMatchedAll = {};
				const uses = appMetadata.getMetadata(SymbolDecoratorUseAopMethod, beanOptions.beanClass.prototype);
				for (const prop in uses) {
					const onionItems = [];
					const aopMethods = uses[prop];
					for (const aopMethod of aopMethods) onionItems.push({
						name: aopMethod.onionName,
						options: aopMethod.options
					});
					const onionSlices = yield _this2.$$sysOnion.aopMethod.loadOnions(onionItems);
					const aopMethodsMatched = [];
					for (const onionSlice of onionSlices) {
						const beanInstance = yield _this2.sys.bean._getBean(onionSlice.beanFullName, true);
						aopMethodsMatched.push({
							onionName: onionSlice.name,
							beanInstance,
							options: onionSlice.options
						});
					}
					aopMethodsMatchedAll[prop] = aopMethodsMatched;
				}
				return Object.keys(aopMethodsMatchedAll).length === 0 ? void 0 : aopMethodsMatchedAll;
			})();
		}
	}, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "$$sysOnion", [_dec4, _dec5], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2)) || _class$1) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-bean/src/monkeySys.ts
var MonkeySys;
var init_monkeySys = __esmMin((() => {
	init_src$1();
	init_asyncToGenerator();
	MonkeySys = class extends BeanSimple {
		sysInitialize() {
			var _this = this;
			return _asyncToGenerator(function* () {
				let beansPreload = [];
				for (const moduleName in _this.sys.meta.module.modulesMeta.modules) {
					var _module$info$onionsMe, _module$info$onionsMe2;
					const module = _this.sys.meta.module.modulesMeta.modules[moduleName];
					if (!((_module$info$onionsMe = module.info.onionsMeta) === null || _module$info$onionsMe === void 0 ? void 0 : _module$info$onionsMe.beansPreload)) continue;
					beansPreload = beansPreload.concat((_module$info$onionsMe2 = module.info.onionsMeta) === null || _module$info$onionsMe2 === void 0 ? void 0 : _module$info$onionsMe2.beansPreload);
				}
				const promises = beansPreload.map((item) => {
					return _this.sys.bean._getBean(item, false);
				});
				yield Promise.all(promises);
			})();
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-bean/src/lib/scope.ts
function Scope() {
	return createBeanDecorator("scope", "app", false);
}
var init_scope = __esmMin((() => {
	init_src$1();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-bean/src/.metadata/index.ts
/** monkeySys: end */
/** scope: begin */
var _dec, _dec2, _class, ScopeModuleABean;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_sys_onion();
	init_aop$1();
	init_onion_();
	init_src();
	init_monkeySys();
	init_scope();
	ScopeModuleABean = (_dec = Scope(), _dec2 = BeanInfo({ module: "a-bean" }), _dec(_class = _dec2(_class = class ScopeModuleABean extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite-vendor/a-zova/modules/a-bean/src/lib/useAopMethod.ts
function UseAopMethod(aopMethodName, options) {
	return function(target, prop, descriptor) {
		registerMappedClassMetadataKey(target, SymbolDecoratorUseAopMethod);
		const uses = appMetadata.getOwnMetadataMap(true, SymbolDecoratorUseAopMethod, target);
		if (!uses[prop]) uses[prop] = [];
		uses[prop].push({
			onionName: aopMethodName,
			options
		});
		return descriptor;
	};
}
var init_useAopMethod = __esmMin((() => {
	init_src$1();
	init_aopMethod();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-bean/src/lib/utils.ts
var init_utils = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-bean/src/lib/index.ts
var init_lib = __esmMin((() => {
	init_bean$1();
	init_scope();
	init_useAopMethod();
	init_utils();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-bean/src/types/aop.ts
var init_aop = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-bean/src/types/bean.ts
var init_bean = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-bean/src/types/onion.ts
var SymbolUseOnionLocal, SymbolUseOnionOptions;
var init_onion = __esmMin((() => {
	SymbolUseOnionLocal = Symbol("SymbolUseOnionLocal");
	SymbolUseOnionOptions = Symbol("SymbolUseOnionOptions");
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-bean/src/types/service.ts
var init_service = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-bean/src/types/component.ts
var init_component = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-bean/src/types/index.ts
var init_types = __esmMin((() => {
	init_aop();
	init_aopMethod();
	init_bean();
	init_onion();
	init_service();
	init_component();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-bean/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	Aop: () => Aop,
	AopMethod: () => AopMethod,
	Bean: () => Bean,
	Controller: () => Controller,
	Data: () => Data,
	MonkeySys: () => MonkeySys,
	Render: () => Render,
	Scope: () => Scope,
	ScopeModuleABean: () => ScopeModuleABean,
	Service: () => Service,
	ServiceAop: () => ServiceAop,
	ServiceOnion: () => ServiceOnion,
	Style: () => Style,
	SymbolDecoratorUseAopMethod: () => SymbolDecoratorUseAopMethod,
	SymbolUseOnionLocal: () => SymbolUseOnionLocal,
	SymbolUseOnionOptions: () => SymbolUseOnionOptions,
	Sys: () => Sys,
	SysOnion: () => SysOnion,
	Tool: () => Tool,
	UseAopMethod: () => UseAopMethod
});
var init_src = __esmMin((() => {
	init__metadata();
	init_lib();
	init_types();
}));
//#endregion
export { AopMethod as a, Render as c, Sys as d, Tool as f, Scope as i, Service as l, src_exports as n, Bean as o, UseAopMethod as r, Controller as s, init_src as t, Style as u };
