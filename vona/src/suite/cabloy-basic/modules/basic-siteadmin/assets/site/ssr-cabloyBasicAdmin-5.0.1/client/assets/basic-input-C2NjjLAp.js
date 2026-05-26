import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { d as defineComponent, l as createVNode, v as mergeProps } from "./vue-t5FcxkD3.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
import { d as _objectSpread2, f as init_objectSpread2, m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { b as BeanControllerBase, c as prepareComponentOptions, k as BeanInfo, l as useController, m as BeanScopeBase, p as createZovaComponentAsync } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, s as Controller, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { i as init_lib_es2015, o as classes } from "./typestyle-C2zp2284.js";
//#region src/suite/cabloy-basic/modules/basic-input/src/component/formFieldInput/controller.tsx
var _dec$1, _dec2$1, _class$1, _ControllerFormFieldInput, ZFormField, ControllerFormFieldInput;
var init_controller = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_objectSpread2();
	init_src$1();
	init_lib_es2015();
	init_src$2();
	ZFormField = createZovaComponentAsync("a-form", "formField");
	ControllerFormFieldInput = (_dec$1 = Controller(), _dec2$1 = BeanInfo({ module: "basic-input" }), _dec$1(_class$1 = _dec2$1(_class$1 = (_ControllerFormFieldInput = class ControllerFormFieldInput extends BeanControllerBase {
		__init__() {
			return _asyncToGenerator(function* () {})();
		}
		render() {
			return createVNode(ZFormField, mergeProps(this.$props, { "slotDefault": ({ propsBucket, props }, $$formField) => {
				const className = !propsBucket.needHandleBorder ? props.class : classes(props.class, "input", !$$formField.field.state.meta.isValid && "input-error");
				return createVNode("input", _objectSpread2(_objectSpread2(_objectSpread2({
					type: "text",
					placeholder: void 0,
					onInput: (e) => {
						$$formField.setValue(e.target.value, propsBucket.disableNotifyChanged);
					},
					onBlur: () => {
						$$formField.handleBlur();
					},
					value: propsBucket.value
				}, propsBucket.options), props), {}, { class: className }), null);
			} }), null);
		}
	}, _ControllerFormFieldInput.$propsDefault = {}, _ControllerFormFieldInput.$componentOptions = {
		inheritAttrs: false,
		deepExtendDefault: true
	}, _ControllerFormFieldInput)) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-input/src/.metadata/component/formFieldInput.ts
var ZFormFieldInput;
var init_formFieldInput = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller();
	ZFormFieldInput = defineComponent((_props) => {
		useController(ControllerFormFieldInput, void 0, void 0);
		return () => {};
	}, prepareComponentOptions(ControllerFormFieldInput.$componentOptions));
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-input/src/.metadata/index.ts
/** components: end */
/** scope: begin */
var _dec, _dec2, _class, components, ScopeModuleBasicInput;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_controller();
	init_formFieldInput();
	init_formFieldInput();
	init_src$2();
	components = { "formFieldInput": ZFormFieldInput };
	ScopeModuleBasicInput = (_dec = Scope(), _dec2 = BeanInfo({ module: "basic-input" }), _dec(_class = _dec2(_class = class ScopeModuleBasicInput extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite/cabloy-basic/modules/basic-input/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	ControllerFormFieldInput: () => ControllerFormFieldInput,
	ScopeModuleBasicInput: () => ScopeModuleBasicInput,
	ZFormFieldInput: () => ZFormFieldInput,
	components: () => components
});
var init_src = __esmMin((() => {
	init__metadata();
}));
//#endregion
export { src_exports as n, init_src as t };
