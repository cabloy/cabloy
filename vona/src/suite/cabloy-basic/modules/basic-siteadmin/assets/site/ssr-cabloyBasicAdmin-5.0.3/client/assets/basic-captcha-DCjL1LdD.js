import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { d as defineComponent, l as createVNode, r as Fragment, v as mergeProps } from "./vue-t5FcxkD3.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
import { d as _objectSpread2, f as init_objectSpread2, m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { b as BeanControllerBase, c as prepareComponentOptions, k as BeanInfo, l as useController, m as BeanScopeBase, o as useApp, p as createZovaComponentAsync, u as ClientOnly, w as Use, x as useComputed } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, s as Controller, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { i as init_lib_es2015, o as classes } from "./typestyle-C2zp2284.js";
//#region src/suite/cabloy-basic/modules/basic-captcha/src/config/locale/en-us.ts
var en_us_default;
var init_en_us = __esmMin((() => {
	en_us_default = { InputCaptcha: "Please input captcha" };
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-captcha/src/config/locale/zh-cn.ts
var zh_cn_default;
var init_zh_cn = __esmMin((() => {
	zh_cn_default = { InputCaptcha: "请输入验证码" };
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-captcha/src/.metadata/locales.ts
function $useLocale(key, ...args) {
	const app = useApp();
	const str = `basic-captcha::${key}`;
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
//#region src/suite/cabloy-basic/modules/basic-captcha/src/component/formFieldCaptcha/controller.tsx
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
var _dec$1, _dec2$1, _dec3, _dec4, _class$1, _class2, _descriptor, _ControllerFormFieldCaptcha, ZFormField, ControllerFormFieldCaptcha;
var init_controller = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_objectSpread2();
	init_src$1();
	init_lib_es2015();
	init_src$2();
	ZFormField = createZovaComponentAsync("a-form", "formField");
	ControllerFormFieldCaptcha = (_dec$1 = Controller(), _dec2$1 = BeanInfo({ module: "basic-captcha" }), _dec3 = Use({
		injectionScope: "host",
		beanFullName: "a-form.controller.form"
	}), _dec4 = Reflect.metadata("design:type", typeof ControllerForm === "undefined" ? Object : ControllerForm), _dec$1(_class$1 = _dec2$1(_class$1 = (_class2 = (_ControllerFormFieldCaptcha = class ControllerFormFieldCaptcha extends BeanControllerBase {
		constructor(...args) {
			super(...args);
			this.eventFormSubmission = void 0;
			this.captchaData = void 0;
			_initializerDefineProperty(this, "$$form", _descriptor, this);
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.eventFormSubmission = _this.app.meta.event.on("a-form:formSubmission", (data, next) => {
					if (data.form.formId === _this.$$form.form.formId && data.error) _this.refreshCaptchaData();
					return next();
				});
				_this.createCaptchaData();
			})();
		}
		__dispose__() {
			if (this.eventFormSubmission) this.eventFormSubmission();
		}
		get captchaScene() {
			return this.$props.options.scene;
		}
		createCaptchaData() {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				_this2.captchaData = yield _this2.$api.captcha.create({ scene: _this2.captchaScene }, { authToken: false });
				_this2.setFieldCaptchaData();
			})();
		}
		refreshCaptchaData() {
			var _this3 = this;
			return _asyncToGenerator(function* () {
				_this3.captchaData = yield _this3.$api.captcha.refresh({
					id: _this3.captchaData.id,
					scene: _this3.captchaScene
				}, { authToken: false });
				_this3.setFieldCaptchaData();
			})();
		}
		setFieldCaptchaData() {
			var _this$captchaData, _this$captchaData2;
			this.$$form.setFieldValue(this.$props.name, {
				id: (_this$captchaData = this.captchaData) === null || _this$captchaData === void 0 ? void 0 : _this$captchaData.id,
				token: (_this$captchaData2 = this.captchaData) === null || _this$captchaData2 === void 0 ? void 0 : _this$captchaData2.token
			});
		}
		render() {
			return createVNode(Fragment, null, [createVNode(ZFormField, mergeProps(this.$props, { "slotDefault": ({ propsBucket, props }, $$formField) => {
				var _this$captchaData4;
				const className = !propsBucket.needHandleBorder ? props.class : classes(props.class, "input", !$$formField.field.state.meta.isValid && "input-error");
				return createVNode("input", _objectSpread2(_objectSpread2({
					type: "text",
					placeholder: this.scope.locale.InputCaptcha(),
					onInput: (e) => {
						var _this$captchaData3;
						const token = e.target.value;
						if (this.captchaData) this.captchaData.token = token;
						$$formField.setValue({
							id: (_this$captchaData3 = this.captchaData) === null || _this$captchaData3 === void 0 ? void 0 : _this$captchaData3.id,
							token
						});
					},
					onBlur: () => {
						$$formField.handleBlur();
					},
					value: (_this$captchaData4 = this.captchaData) === null || _this$captchaData4 === void 0 ? void 0 : _this$captchaData4.token
				}, props), {}, { class: className }), null);
			} }), null), createVNode("label", {
				"class": "flex items-center gap-2 w-full",
				"style": { height: "50px" }
			}, [createVNode(ClientOnly, null, { default: () => {
				var _this$captchaData5;
				return [((_this$captchaData5 = this.captchaData) === null || _this$captchaData5 === void 0 ? void 0 : _this$captchaData5.payload) && createVNode("img", {
					"class": "cursor-pointer",
					"src": this.captchaData.payload,
					"onClick": () => {
						this.refreshCaptchaData();
					}
				}, null)];
			} })])]);
		}
	}, _ControllerFormFieldCaptcha.$propsDefault = { options: { scene: "captcha-simple:simple" } }, _ControllerFormFieldCaptcha.$componentOptions = {
		inheritAttrs: false,
		deepExtendDefault: true
	}, _ControllerFormFieldCaptcha), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "$$form", [_dec3, _dec4], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2)) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-captcha/src/.metadata/component/formFieldCaptcha.ts
var ZFormFieldCaptcha;
var init_formFieldCaptcha = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller();
	ZFormFieldCaptcha = defineComponent((_props) => {
		useController(ControllerFormFieldCaptcha, void 0, void 0);
		return () => {};
	}, prepareComponentOptions(ControllerFormFieldCaptcha.$componentOptions));
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-captcha/src/.metadata/index.ts
/** components: end */
/** locale: begin */
/** locale: end */
/** scope: begin */
function locale(key) {
	return `basic-captcha::${key}`;
}
var _dec, _dec2, _class, components, ScopeModuleBasicCaptcha;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_controller();
	init_formFieldCaptcha();
	init_formFieldCaptcha();
	init_src$2();
	components = { "formFieldCaptcha": ZFormFieldCaptcha };
	ScopeModuleBasicCaptcha = (_dec = Scope(), _dec2 = BeanInfo({ module: "basic-captcha" }), _dec(_class = _dec2(_class = class ScopeModuleBasicCaptcha extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite/cabloy-basic/modules/basic-captcha/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	$useLocale: () => $useLocale,
	ControllerFormFieldCaptcha: () => ControllerFormFieldCaptcha,
	ScopeModuleBasicCaptcha: () => ScopeModuleBasicCaptcha,
	ZFormFieldCaptcha: () => ZFormFieldCaptcha,
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
