import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { d as defineComponent, l as createVNode, v as mergeProps } from "./vue-t5FcxkD3.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
import { d as _objectSpread2, f as init_objectSpread2, m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { b as BeanControllerBase, c as prepareComponentOptions, j as BeanBase, k as BeanInfo, l as useController, m as BeanScopeBase, p as createZovaComponentAsync } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, s as Controller, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { i as init_lib_es2015, o as classes } from "./typestyle-C2zp2284.js";
import { r as TableCell, t as init_src$3 } from "./a-table-mWEpgls1.js";
//#region src/suite/cabloy-basic/modules/basic-text/src/component/formFieldTextarea/controller.tsx
var _dec$3, _dec2$3, _class$3, _ControllerFormFieldTextarea, ZFormField, ControllerFormFieldTextarea;
var init_controller = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_objectSpread2();
	init_src$1();
	init_lib_es2015();
	init_src$2();
	ZFormField = createZovaComponentAsync("a-form", "formField");
	ControllerFormFieldTextarea = (_dec$3 = Controller(), _dec2$3 = BeanInfo({ module: "basic-text" }), _dec$3(_class$3 = _dec2$3(_class$3 = (_ControllerFormFieldTextarea = class ControllerFormFieldTextarea extends BeanControllerBase {
		__init__() {
			return _asyncToGenerator(function* () {})();
		}
		render() {
			createVNode(ZFormField, mergeProps(this.$props, { "slotDefault": ({ propsBucket, props }, $$formField) => {
				const className = !propsBucket.needHandleBorder ? classes(props.class, "textarea textarea-ghost") : classes(props.class, "textarea", !$$formField.field.state.meta.isValid && "textarea-error");
				return createVNode("textarea", _objectSpread2(_objectSpread2(_objectSpread2({
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
	}, _ControllerFormFieldTextarea.$propsDefault = {}, _ControllerFormFieldTextarea.$componentOptions = {
		inheritAttrs: false,
		deepExtendDefault: true
	}, _ControllerFormFieldTextarea)) || _class$3) || _class$3);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-text/src/.metadata/component/formFieldTextarea.ts
var ZFormFieldTextarea;
var init_formFieldTextarea = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller();
	ZFormFieldTextarea = defineComponent((_props) => {
		useController(ControllerFormFieldTextarea, void 0, void 0);
		return () => {};
	}, prepareComponentOptions(ControllerFormFieldTextarea.$componentOptions));
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-text/src/bean/tableCell.text.tsx
var _dec$2, _dec2$2, _class$2, TableCellText;
var init_tableCell_text = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_src$3();
	TableCellText = (_dec$2 = TableCell(), _dec2$2 = BeanInfo({ module: "basic-text" }), _dec$2(_class$2 = _dec2$2(_class$2 = class TableCellText extends BeanBase {
		render(options, _renderContext, next) {
			const value = next();
			if (!options.class) return value;
			return createVNode("div", { "class": options.class }, [value]);
		}
	}) || _class$2) || _class$2);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-text/src/bean/tableCell.textarea.tsx
var _dec$1, _dec2$1, _class$1, TableCellTextarea;
var init_tableCell_textarea = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_src$3();
	TableCellTextarea = (_dec$1 = TableCell(), _dec2$1 = BeanInfo({ module: "basic-text" }), _dec$1(_class$1 = _dec2$1(_class$1 = class TableCellTextarea extends BeanBase {
		render(options, _renderContext, next) {
			const value = next();
			if (!options.class) return value;
			return createVNode("div", { "class": options.class }, [value]);
		}
	}) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-text/src/.metadata/index.ts
/** tableCell: end */
/** scope: begin */
var _dec, _dec2, _class, components, ScopeModuleBasicText;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_controller();
	init_formFieldTextarea();
	init_formFieldTextarea();
	init_tableCell_text();
	init_tableCell_textarea();
	init_src$3();
	init_src$2();
	components = { "formFieldTextarea": ZFormFieldTextarea };
	ScopeModuleBasicText = (_dec = Scope(), _dec2 = BeanInfo({ module: "basic-text" }), _dec(_class = _dec2(_class = class ScopeModuleBasicText extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite/cabloy-basic/modules/basic-text/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	ControllerFormFieldTextarea: () => ControllerFormFieldTextarea,
	ScopeModuleBasicText: () => ScopeModuleBasicText,
	TableCellText: () => TableCellText,
	TableCellTextarea: () => TableCellTextarea,
	ZFormFieldTextarea: () => ZFormFieldTextarea,
	components: () => components
});
var init_src = __esmMin((() => {
	init__metadata();
}));
//#endregion
export { src_exports as n, init_src as t };
