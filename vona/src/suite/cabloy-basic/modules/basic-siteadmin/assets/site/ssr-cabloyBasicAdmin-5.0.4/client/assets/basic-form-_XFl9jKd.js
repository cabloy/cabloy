import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { d as defineComponent, l as createVNode, r as Fragment } from "./vue-t5FcxkD3.js";
import { n as init_vue_runtime_esm_bundler, t as init_jsx_runtime } from "./vue-CmE1HVn9.js";
import { J as init_dist, Z as isNil } from "./zova-BE4e4PxD.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { K as cast, b as BeanControllerBase, c as prepareComponentOptions, k as BeanInfo, l as useController, m as BeanScopeBase, o as useApp, w as Use, x as useComputed } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, s as Controller, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { r as invokeProp, t as init_src$3 } from "./zova-DxkRogHR.js";
import { i as BeanBehaviorBase, r as Behavior, t as init_src$4 } from "./a-behavior-DMKdKGTP.js";
import { i as init_lib_es2015, o as classes } from "./typestyle-C2zp2284.js";
//#region src/suite/cabloy-basic/modules/basic-form/src/config/locale/en-us.ts
var en_us_default;
var init_en_us = __esmMin((() => {
	en_us_default = {
		Back: "Back",
		Submit: "Submit"
	};
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-form/src/config/locale/zh-cn.ts
var zh_cn_default;
var init_zh_cn = __esmMin((() => {
	zh_cn_default = {
		Back: "回退",
		Submit: "提交"
	};
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-form/src/.metadata/locales.ts
function $useLocale(key, ...args) {
	const app = useApp();
	const str = `basic-form::${key}`;
	return useComputed(() => {
		return app.meta.text(str, ...args);
	});
}
var locales;
var init_locales = __esmMin((() => {
	init_src$1();
	init_en_us();
	init_zh_cn();
	locales = {
		"en-us": en_us_default,
		"zh-cn": zh_cn_default
	};
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-form/src/component/actionBack/controller.tsx
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
var _dec$4, _dec2$4, _dec3$3, _dec4$3, _class$4, _class2$3, _descriptor$3, _ControllerActionBack, ControllerActionBack;
var init_controller$1 = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_src$1();
	init_lib_es2015();
	init_src$2();
	ControllerActionBack = (_dec$4 = Controller(), _dec2$4 = BeanInfo({ module: "basic-form" }), _dec3$3 = Use({ injectionScope: "host" }), _dec4$3 = Reflect.metadata("design:type", typeof IJsxRenderContextPageEntry === "undefined" ? Object : IJsxRenderContextPageEntry), _dec$4(_class$4 = _dec2$4(_class$4 = (_class2$3 = (_ControllerActionBack = class ControllerActionBack extends BeanControllerBase {
		constructor(...args) {
			super(...args);
			_initializerDefineProperty$3(this, "$$renderContext", _descriptor$3, this);
		}
		__init__() {
			return _asyncToGenerator(function* () {})();
		}
		render() {
			const { $$pageEntry } = this.$$renderContext;
			const formRef = $$pageEntry.formRef;
			const isSubmitting = formRef === null || formRef === void 0 ? void 0 : formRef.formState.isSubmitting;
			return createVNode("button", {
				"class": classes(this.$props.class, isSubmitting && "btn-disabled"),
				"type": "button",
				"onClick": () => {
					this.$router.back();
				}
			}, [this.scope.locale.Back()]);
		}
	}, _ControllerActionBack.$propsDefault = { class: "btn btn-secondary join-item" }, _ControllerActionBack.$componentOptions = {
		inheritAttrs: false,
		deepExtendDefault: true
	}, _ControllerActionBack), _descriptor$3 = _applyDecoratedDescriptor$3(_class2$3.prototype, "$$renderContext", [_dec3$3, _dec4$3], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2$3)) || _class$4) || _class$4);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-form/src/component/actionSubmit/controller.tsx
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
var _dec$3, _dec2$3, _dec3$2, _dec4$2, _class$3, _class2$2, _descriptor$2, _ControllerActionSubmit, ControllerActionSubmit;
var init_controller = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_src$1();
	init_dist();
	init_lib_es2015();
	init_src$2();
	ControllerActionSubmit = (_dec$3 = Controller(), _dec2$3 = BeanInfo({ module: "basic-form" }), _dec3$2 = Use({ injectionScope: "host" }), _dec4$2 = Reflect.metadata("design:type", typeof IJsxRenderContextPageEntry === "undefined" ? Object : IJsxRenderContextPageEntry), _dec$3(_class$3 = _dec2$3(_class$3 = (_class2$2 = (_ControllerActionSubmit = class ControllerActionSubmit extends BeanControllerBase {
		constructor(...args) {
			super(...args);
			_initializerDefineProperty$2(this, "$$renderContext", _descriptor$2, this);
		}
		__init__() {
			return _asyncToGenerator(function* () {})();
		}
		render() {
			var _this = this;
			const { $$pageEntry } = this.$$renderContext;
			const formRef = $$pageEntry.formRef;
			const isSubmitting = formRef === null || formRef === void 0 ? void 0 : formRef.formState.isSubmitting;
			return createVNode(Fragment, null, [isSubmitting && createVNode("span", { "class": "loading loading-spinner text-primary" }, null), createVNode("button", {
				"class": classes(this.$props.class, isSubmitting && "btn-disabled"),
				"type": "submit",
				"onClick": function() {
					var _ref = _asyncToGenerator(function* (e) {
						e.preventDefault();
						e.stopPropagation();
						_this.onClick(e);
					});
					return function onClick(_x) {
						return _ref.apply(this, arguments);
					};
				}()
			}, [this.scope.locale.Submit()])]);
		}
		onClick(e) {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				const { $host, $$pageEntry } = _this2.$$renderContext;
				if (!(yield $$pageEntry.formRef.submit())) return;
				if (cast(e).pointerType) {
					_this2.$router.back();
					return;
				}
				if (!isNil($$pageEntry.entryId)) return;
				yield $host.$performCommand("basic-commands:edit", {
					replace: true,
					resource: $$pageEntry.resource,
					id: $$pageEntry.entryIdCreated
				}, _this2.$$renderContext);
			})();
		}
	}, _ControllerActionSubmit.$propsDefault = { class: "btn btn-primary join-item" }, _ControllerActionSubmit.$componentOptions = {
		inheritAttrs: false,
		deepExtendDefault: true
	}, _ControllerActionSubmit), _descriptor$2 = _applyDecoratedDescriptor$2(_class2$2.prototype, "$$renderContext", [_dec3$2, _dec4$2], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2$2)) || _class$3) || _class$3);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-form/src/.metadata/component/actionBack.ts
var ZActionBack;
var init_actionBack = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller$1();
	ZActionBack = defineComponent((_props) => {
		useController(ControllerActionBack, void 0, void 0);
		return () => {};
	}, prepareComponentOptions(ControllerActionBack.$componentOptions));
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-form/src/.metadata/component/actionSubmit.ts
var ZActionSubmit;
var init_actionSubmit = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller();
	ZActionSubmit = defineComponent((_props) => {
		useController(ControllerActionSubmit, void 0, void 0);
		return () => {};
	}, prepareComponentOptions(ControllerActionSubmit.$componentOptions));
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-form/src/bean/behavior.formField.ts
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
var _dec$2, _dec2$2, _dec3$1, _dec4$1, _class$2, _class2$1, _descriptor$1, BehaviorFormField;
var init_behavior_formField = __esmMin((() => {
	init_src$1();
	init_src$4();
	BehaviorFormField = (_dec$2 = Behavior(), _dec2$2 = BeanInfo({ module: "basic-form" }), _dec3$1 = Use({ injectionScope: "host" }), _dec4$1 = Reflect.metadata("design:type", typeof ControllerFormField === "undefined" ? Object : ControllerFormField), _dec$2(_class$2 = _dec2$2(_class$2 = (_class2$1 = class BehaviorFormField extends BeanBehaviorBase {
		constructor(...args) {
			super(...args);
			_initializerDefineProperty$1(this, "$$formField", _descriptor$1, this);
		}
		render(renderContext, next) {
			return next(renderContext);
		}
	}, _descriptor$1 = _applyDecoratedDescriptor$1(_class2$1.prototype, "$$formField", [_dec3$1, _dec4$1], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2$1)) || _class$2) || _class$2);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-form/src/bean/behavior.formFieldLayout.tsx
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
var _dec$1, _dec2$1, _dec3, _dec4, _class$1, _class2, _descriptor, BehaviorFormFieldLayout;
var init_behavior_formFieldLayout = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_src$1();
	init_lib_es2015();
	init_src$3();
	init_src$4();
	BehaviorFormFieldLayout = (_dec$1 = Behavior(), _dec2$1 = BeanInfo({ module: "basic-form" }), _dec3 = Use({ injectionScope: "host" }), _dec4 = Reflect.metadata("design:type", typeof ControllerFormField === "undefined" ? Object : ControllerFormField), _dec$1(_class$1 = _dec2$1(_class$1 = (_class2 = class BehaviorFormFieldLayout extends BeanBehaviorBase {
		constructor(...args) {
			super(...args);
			this.cFieldRequired = void 0;
			_initializerDefineProperty(this, "$$formField", _descriptor, this);
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.cFieldRequired = _this.$style({ $nest: { "& > .fieldset-legend::after": {
					content: "\" *\"",
					color: "var(--color-error)",
					fontSize: "1rem"
				} } });
			})();
		}
		render(renderContext, next) {
			const field = this.$$formField.field;
			const layout = renderContext.propsBucket.layout;
			renderContext.propsBucket.needHandleBorder = (layout === null || layout === void 0 ? void 0 : layout.disable) || !(layout === null || layout === void 0 ? void 0 : layout.inline);
			const vnode = next(renderContext);
			if (layout === null || layout === void 0 ? void 0 : layout.disable) return vnode;
			const error = field.state.meta.errors[0];
			if (layout === null || layout === void 0 ? void 0 : layout.inline) return this._renderInline(renderContext, vnode, field, error);
			return this._renderBlock(renderContext, vnode, field, error);
		}
		_renderInline(renderContext, vnode, field, error) {
			const layout = renderContext.propsBucket.layout;
			const label = layout === null || layout === void 0 ? void 0 : layout.label;
			return createVNode("label", { "class": classes("input", layout === null || layout === void 0 ? void 0 : layout.class, !field.state.meta.isValid && "input-error") }, [
				label,
				vnode,
				!field.state.meta.isValid && createVNode("div", { "class": "label" }, [createVNode("span", { "class": "label-text-alt text-error" }, [error === null || error === void 0 ? void 0 : error.message])])
			]);
		}
		_renderBlock(renderContext, vnode, field, error) {
			const { propsBucket } = renderContext;
			const layout = propsBucket.layout;
			const label = layout === null || layout === void 0 ? void 0 : layout.label;
			return createVNode("fieldset", { "class": classes("fieldset", propsBucket.required && this.cFieldRequired, layout === null || layout === void 0 ? void 0 : layout.class) }, [
				!!label && createVNode("legend", { "class": "fieldset-legend" }, [label]),
				invokeProp(layout === null || layout === void 0 ? void 0 : layout.header),
				vnode,
				!field.state.meta.isValid && createVNode("div", { "class": "label" }, [createVNode("span", { "class": "label-text-alt text-error" }, [error === null || error === void 0 ? void 0 : error.message])]),
				invokeProp(layout === null || layout === void 0 ? void 0 : layout.footer)
			]);
		}
	}, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "$$formField", [_dec3, _dec4], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2)) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-form/src/.metadata/index.ts
/** behaviors: end */
/** locale: begin */
/** locale: end */
/** scope: begin */
function locale(key) {
	return `basic-form::${key}`;
}
var _dec, _dec2, _class, components, ScopeModuleBasicForm;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_controller$1();
	init_controller();
	init_actionBack();
	init_actionBack();
	init_actionSubmit();
	init_actionSubmit();
	init_behavior_formField();
	init_behavior_formFieldLayout();
	init_src$4();
	init_vue_runtime_esm_bundler();
	init_jsx_runtime();
	init_src$2();
	components = {
		"actionBack": ZActionBack,
		"actionSubmit": ZActionSubmit
	};
	ScopeModuleBasicForm = (_dec = Scope(), _dec2 = BeanInfo({ module: "basic-form" }), _dec(_class = _dec2(_class = class ScopeModuleBasicForm extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite/cabloy-basic/modules/basic-form/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	$useLocale: () => $useLocale,
	BehaviorFormField: () => BehaviorFormField,
	BehaviorFormFieldLayout: () => BehaviorFormFieldLayout,
	ControllerActionBack: () => ControllerActionBack,
	ControllerActionSubmit: () => ControllerActionSubmit,
	ScopeModuleBasicForm: () => ScopeModuleBasicForm,
	ZActionBack: () => ZActionBack,
	ZActionSubmit: () => ZActionSubmit,
	components: () => components,
	locale: () => locale,
	locales: () => locales
});
var init_src = __esmMin((() => {
	init_locales();
	init__metadata();
}));
//#endregion
export { src_exports as n, init_src as t };
