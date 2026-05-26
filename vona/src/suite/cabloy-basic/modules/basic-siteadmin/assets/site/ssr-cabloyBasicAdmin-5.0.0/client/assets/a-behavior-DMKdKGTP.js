import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { b as toRaw } from "./vue-CeNp4lbs.js";
import { d as defineComponent, l as createVNode } from "./vue-t5FcxkD3.js";
import { n as init_vue_runtime_esm_bundler, t as init_jsx_runtime } from "./vue-CmE1HVn9.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { B as disposeInstance, K as cast, O as createBeanDecorator, R as deepEqual, S as Virtual, b as BeanControllerBase, c as prepareComponentOptions, j as BeanBase, k as BeanInfo, l as useController, m as BeanScopeBase, w as Use, y as SymbolControllerRefDisable } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, l as Service, o as Bean, s as Controller, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { r as Log, t as init_src$3 } from "./a-logger-DsuLTQOg.js";
//#region src/suite-vendor/a-zova/modules/a-behavior/src/service/composer.ts
function _initializerDefineProperty$3(e, i, r, l) {
	r && Object.defineProperty(e, i, {
		enumerable: r.enumerable,
		configurable: r.configurable,
		writable: r.writable,
		value: r.initializer ? r.initializer.call(l) : void 0
	});
}
function _applyDecoratedDescriptor$3(i, e, r, n, l) {
	var a = {};
	return Object.keys(n).forEach(function(i) {
		a[i] = n[i];
	}), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function(r, n) {
		return n(i, e, r) || r;
	}, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a;
}
var _dec$6, _dec2$6, _dec3$3, _dec4$3, _class$6, _class2$3, _descriptor$3, SymbolSliceOptionsOriginal, ServiceComposer;
var init_composer = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	SymbolSliceOptionsOriginal = Symbol("SymbolSliceOptionsOriginal");
	ServiceComposer = (_dec$6 = Service(), _dec2$6 = BeanInfo({ module: "a-behavior" }), _dec3$3 = Use("a-bean.sys.onion"), _dec4$3 = Reflect.metadata("design:type", typeof SysOnion === "undefined" ? Object : SysOnion), _dec$6(_class$6 = _dec2$6(_class$6 = (_class2$3 = class ServiceComposer extends BeanBase {
		constructor(...args) {
			super(...args);
			this._composer = void 0;
			this._onionSlicesOriginal = void 0;
			_initializerDefineProperty$3(this, "$$sysOnion", _descriptor$3, this);
		}
		__init__(behaviors) {
			var _this = this;
			return _asyncToGenerator(function* () {
				yield _this.load(behaviors);
			})();
		}
		__dispose__() {
			if (this._onionSlicesOriginal) for (const onionSlice of this._onionSlicesOriginal) disposeInstance(onionSlice.beanInstance);
		}
		load(behaviors) {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				yield _this2.$renderFreezeScope(_asyncToGenerator(function* () {
					yield _this2._loadInner(behaviors);
				}));
			})();
		}
		_loadInner(behaviors) {
			var _this3 = this;
			return _asyncToGenerator(function* () {
				const onionItems = _this3._prepareOnionItems(behaviors);
				const onionSlices = yield _this3.$$sysOnion.behavior.loadOnions(onionItems);
				for (const onionSlice of onionSlices) {
					var _this$_onionSlicesOri;
					const onionSliceOriginal = (_this$_onionSlicesOri = _this3._onionSlicesOriginal) === null || _this$_onionSlicesOri === void 0 ? void 0 : _this$_onionSlicesOri.find((item) => item.beanFullName === onionSlice.beanFullName);
					if (onionSliceOriginal) {
						onionSlice.beanInstance = onionSliceOriginal.beanInstance;
						if (!deepEqual(onionSliceOriginal[SymbolSliceOptionsOriginal], onionSlice.options)) yield cast(onionSlice.beanInstance).onOptionsChange(onionSlice.options);
					} else onionSlice.beanInstance = yield _this3.bean._newBean(onionSlice.beanFullName, true, onionSlice.options);
					onionSlice[SymbolSliceOptionsOriginal] = onionSlice.options;
				}
				if (_this3._onionSlicesOriginal) {
					for (const onionSlice of _this3._onionSlicesOriginal) if (!onionSlices.find((item) => item.beanFullName === onionSlice.beanFullName)) disposeInstance(onionSlice.beanInstance);
				}
				_this3._onionSlicesOriginal = onionSlices;
				_this3._composer = _this3.$$sysOnion.behavior.compose(onionSlices, (onionSlice, props, next) => {
					return cast(cast(onionSlice.beanInstance)).render(props, next);
				});
			})();
		}
		render(props, next) {
			return this._composer(props, next);
		}
		_prepareOnionItems(behaviors) {
			return this._prepareOnionItemsInner([], behaviors);
		}
		_prepareOnionItemsInner(onionItems, behaviors) {
			const behaviors2 = Array.isArray(behaviors) ? behaviors : [behaviors];
			for (const behaviorItem of behaviors2) if (typeof behaviorItem === "string") onionItems.push({
				name: behaviorItem,
				options: void 0
			});
			else if (Array.isArray(behaviorItem)) this._prepareOnionItemsInner(onionItems, behaviorItem);
			else if (typeof behaviorItem === "object") for (const key in behaviorItem) {
				let options = behaviorItem[key];
				if (options === false) continue;
				if (options === true) options = void 0;
				onionItems.push({
					name: key,
					options
				});
			}
			return onionItems;
		}
	}, _descriptor$3 = _applyDecoratedDescriptor$3(_class2$3.prototype, "$$sysOnion", [_dec3$3, _dec4$3], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2$3)) || _class$6) || _class$6);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-behavior/src/bean/bean.behavior.ts
var _dec$5, _dec2$5, _class$5, BeanBehavior$1;
var init_bean_behavior = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	init_composer();
	BeanBehavior$1 = (_dec$5 = Bean(), _dec2$5 = BeanInfo({ module: "a-behavior" }), _dec$5(_class$5 = _dec2$5(_class$5 = class BeanBehavior extends BeanBase {
		createComposer(behaviors) {
			var _this = this;
			return _asyncToGenerator(function* () {
				return yield _this.bean._newBean(ServiceComposer, true, behaviors);
			})();
		}
	}) || _class$5) || _class$5);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-behavior/src/bean/bean.behaviorBase.ts
function _initializerDefineProperty$2(e, i, r, l) {
	r && Object.defineProperty(e, i, {
		enumerable: r.enumerable,
		configurable: r.configurable,
		writable: r.writable,
		value: r.initializer ? r.initializer.call(l) : void 0
	});
}
function _applyDecoratedDescriptor$2(i, e, r, n, l) {
	var a = {};
	return Object.keys(n).forEach(function(i) {
		a[i] = n[i];
	}), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function(r, n) {
		return n(i, e, r) || r;
	}, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a;
}
var _dec$4, _dec2$4, _dec3$2, _dec4$2, _dec5$1, _dec6$1, _dec7$1, _dec8, _dec9, _class$4, _class2$2, _descriptor$2, _descriptor2, BeanBehaviorBase;
var init_bean_behaviorBase = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	BeanBehaviorBase = (_dec$4 = Bean(), _dec2$4 = Virtual(), _dec3$2 = BeanInfo({ module: "a-behavior" }), _dec4$2 = Reflect.metadata("design:type", Function), _dec5$1 = Reflect.metadata("design:paramtypes", [typeof OPTIONS === "undefined" ? Object : OPTIONS]), _dec6$1 = Use({ injectionScope: "host" }), _dec7$1 = Reflect.metadata("design:type", typeof BeanBehavior === "undefined" ? Object : BeanBehavior), _dec8 = Use({ injectionScope: "host" }), _dec9 = Reflect.metadata("design:type", typeof IBehaviorTag === "undefined" ? Object : IBehaviorTag), _dec$4(_class$4 = _dec2$4(_class$4 = _dec3$2(_class$4 = _dec4$2(_class$4 = _dec5$1(_class$4 = (_class2$2 = class BeanBehaviorBase extends BeanBase {
		constructor(options) {
			super();
			this.$options = void 0;
			_initializerDefineProperty$2(this, "$$beanBehavior", _descriptor$2, this);
			_initializerDefineProperty$2(this, "$$behaviorTag", _descriptor2, this);
			this.$options = options;
		}
		onOptionsChange(options) {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.$options = options;
			})();
		}
		createComposer(behaviors) {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				return yield _this2.$$beanBehavior.createComposer(behaviors);
			})();
		}
		render(_props, next) {
			return next();
		}
	}, _descriptor$2 = _applyDecoratedDescriptor$2(_class2$2.prototype, "$$beanBehavior", [_dec6$1, _dec7$1], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _descriptor2 = _applyDecoratedDescriptor$2(_class2$2.prototype, "$$behaviorTag", [_dec8, _dec9], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2$2)) || _class$4) || _class$4) || _class$4) || _class$4) || _class$4);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-behavior/src/lib/useBehavior.ts
function $UseBehavior(behaviorName, options) {
	return { [behaviorName]: options };
}
function $UseBehaviorTag(component) {
	return {
		component,
		name: typeof component === "string" ? component : void 0
	};
}
var init_useBehavior = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-behavior/src/bean/bean.behaviorsHolder.ts
function _initializerDefineProperty$1(e, i, r, l) {
	r && Object.defineProperty(e, i, {
		enumerable: r.enumerable,
		configurable: r.configurable,
		writable: r.writable,
		value: r.initializer ? r.initializer.call(l) : void 0
	});
}
function _applyDecoratedDescriptor$1(i, e, r, n, l) {
	var a = {};
	return Object.keys(n).forEach(function(i) {
		a[i] = n[i];
	}), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function(r, n) {
		return n(i, e, r) || r;
	}, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a;
}
var _dec$3, _dec2$3, _dec3$1, _dec4$1, _dec5, _dec6, _dec7, _class$3, _class2$1, _descriptor$1, BeanBehaviorsHolder;
var init_bean_behaviorsHolder = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_vue_runtime_esm_bundler();
	init_src$2();
	init_src$3();
	init_useBehavior();
	init_bean_behavior();
	BeanBehaviorsHolder = (_dec$3 = Bean(), _dec2$3 = BeanInfo({ module: "a-behavior" }), _dec3$1 = Use(), _dec4$1 = Reflect.metadata("design:type", typeof BeanBehavior$1 === "undefined" ? Object : BeanBehavior$1), _dec5 = Log({
		args: false,
		childName: "behavior",
		level: "debug"
	}), _dec6 = Reflect.metadata("design:type", Function), _dec7 = Reflect.metadata("design:paramtypes", [typeof IBehaviors === "undefined" ? Object : IBehaviors]), _dec$3(_class$3 = _dec2$3(_class$3 = (_class2$1 = class BeanBehaviorsHolder extends BeanBase {
		constructor(...args) {
			super(...args);
			this.options = void 0;
			this.composer = void 0;
			_initializerDefineProperty$1(this, "$$beanBehavior", _descriptor$1, this);
		}
		initialize(options) {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.options = options;
				_this.bean._setBean("$$behaviorTag", _this.options.behaviorTag);
				_this.composer = yield _this.$$beanBehavior.createComposer(_this._getBehaviorRoot());
				const behaviors = _this.options.behaviors;
				if (typeof behaviors === "function") _this.$watch(behaviors, function() {
					var _ref = _asyncToGenerator(function* (newValue, oldValue) {
						if (deepEqual(newValue, oldValue)) return;
						yield _this.composer.load(_this._getBehaviorRoot(newValue));
					});
					return function(_x, _x2) {
						return _ref.apply(this, arguments);
					};
				}());
			})();
		}
		__dispose__() {
			disposeInstance(this.composer);
		}
		_getBehaviors() {
			let behaviors = this.options.behaviors;
			if (typeof behaviors === "function") behaviors = behaviors();
			return behaviors;
		}
		_getBehaviorRoot(behaviors) {
			if (!behaviors) behaviors = this._getBehaviors();
			return $UseBehavior("a-behavior:root", { behaviors });
		}
		render(vNodeDefault, propsCustom) {
			const { props, children } = this.ctx.instance.vnode;
			const propsNew = Object.assign({}, propsCustom !== null && propsCustom !== void 0 ? propsCustom : props);
			delete propsNew.behaviorTag;
			delete propsNew.behaviors;
			return this.composer.render(propsNew, (propsNew) => {
				if (vNodeDefault) return vNodeDefault(propsNew);
				return createVNode(toRaw(this.options.behaviorTag.component), propsNew, children);
			});
		}
	}, _descriptor$1 = _applyDecoratedDescriptor$1(_class2$1.prototype, "$$beanBehavior", [_dec3$1, _dec4$1], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _applyDecoratedDescriptor$1(_class2$1.prototype, "_getBehaviorRoot", [
		_dec5,
		_dec6,
		_dec7
	], Object.getOwnPropertyDescriptor(_class2$1.prototype, "_getBehaviorRoot"), _class2$1.prototype), _class2$1)) || _class$3) || _class$3);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-behavior/src/component/behavior/controller.tsx
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
var _dec$2, _dec2$2, _dec3, _dec4, _class$2, _class2, _descriptor, _ControllerBehavior, ControllerBehavior;
var init_controller = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	init_bean_behaviorsHolder();
	ControllerBehavior = (_dec$2 = Controller(), _dec2$2 = BeanInfo({ module: "a-behavior" }), _dec3 = Use(), _dec4 = Reflect.metadata("design:type", typeof BeanBehaviorsHolder === "undefined" ? Object : BeanBehaviorsHolder), _dec$2(_class$2 = _dec2$2(_class$2 = (_class2 = (_ControllerBehavior = class ControllerBehavior extends BeanControllerBase {
		constructor(...args) {
			super(...args);
			this[SymbolControllerRefDisable] = true;
			_initializerDefineProperty(this, "$$beanBehaviorsHolder", _descriptor, this);
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				yield _this.$$beanBehaviorsHolder.initialize({
					behaviorTag: _this.$props.behaviorTag,
					behaviors: () => {
						return _this.$props.behaviors;
					}
				});
			})();
		}
		render() {
			return this.$$beanBehaviorsHolder.render();
		}
	}, _ControllerBehavior.$propsDefault = {}, _ControllerBehavior.$componentOptions = { inheritAttrs: false }, _ControllerBehavior), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "$$beanBehaviorsHolder", [_dec3, _dec4], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2)) || _class$2) || _class$2);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-behavior/src/.metadata/component/behavior.ts
var ZBehavior;
var init_behavior$2 = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller();
	ZBehavior = defineComponent((_props) => {
		useController(ControllerBehavior, void 0, void 0);
		return () => {};
	}, prepareComponentOptions(ControllerBehavior.$componentOptions));
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-behavior/src/lib/behavior.ts
function Behavior(options) {
	return createBeanDecorator("behavior", "new", true, options);
}
var init_behavior$1 = __esmMin((() => {
	init_src$1();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-behavior/src/bean/behavior.root_.ts
var _dec$1, _dec2$1, _class$1, BehaviorRoot;
var init_behavior_root_ = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_behavior$1();
	init_bean_behaviorBase();
	BehaviorRoot = (_dec$1 = Behavior(), _dec2$1 = BeanInfo({ module: "a-behavior" }), _dec$1(_class$1 = _dec2$1(_class$1 = class BehaviorRoot extends BeanBehaviorBase {
		constructor(...args) {
			super(...args);
			this.composer = void 0;
		}
		__init__(options) {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.composer = yield _this.createComposer(options.behaviors);
			})();
		}
		__dispose__() {
			disposeInstance(this.composer);
		}
		onOptionsChange(options) {
			var _superprop_getOnOptionsChange = () => super.onOptionsChange, _this2 = this;
			return _asyncToGenerator(function* () {
				yield _superprop_getOnOptionsChange().call(_this2, options);
				yield _this2.composer.load(options.behaviors);
			})();
		}
		render(props, next) {
			return this.composer.render(props, next);
		}
	}) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-behavior/src/.metadata/index.ts
/** behaviors: end */
/** scope: begin */
var _dec, _dec2, _class, components, ScopeModuleABehavior;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_bean_behavior();
	init_bean_behaviorBase();
	init_bean_behaviorsHolder();
	init_composer();
	init_src$2();
	init_controller();
	init_behavior$2();
	init_behavior$2();
	init_behavior_root_();
	init_src();
	init_vue_runtime_esm_bundler();
	init_jsx_runtime();
	components = { "behavior": ZBehavior };
	ScopeModuleABehavior = (_dec = Scope(), _dec2 = BeanInfo({ module: "a-behavior" }), _dec(_class = _dec2(_class = class ScopeModuleABehavior extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite-vendor/a-zova/modules/a-behavior/src/lib/index.ts
var init_lib = __esmMin((() => {
	init_behavior$1();
	init_useBehavior();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-behavior/src/types/behavior.ts
var init_behavior = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_jsx_runtime();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-behavior/src/types/index.ts
var init_types = __esmMin((() => {
	init_behavior();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-behavior/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	$UseBehavior: () => $UseBehavior,
	$UseBehaviorTag: () => $UseBehaviorTag,
	BeanBehavior: () => BeanBehavior$1,
	BeanBehaviorBase: () => BeanBehaviorBase,
	BeanBehaviorsHolder: () => BeanBehaviorsHolder,
	Behavior: () => Behavior,
	BehaviorRoot: () => BehaviorRoot,
	ControllerBehavior: () => ControllerBehavior,
	ScopeModuleABehavior: () => ScopeModuleABehavior,
	ServiceComposer: () => ServiceComposer,
	ZBehavior: () => ZBehavior,
	components: () => components
});
var init_src = __esmMin((() => {
	init__metadata();
	init_lib();
	init_types();
}));
//#endregion
export { BeanBehaviorBase as i, src_exports as n, Behavior as r, init_src as t };
