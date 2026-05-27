import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { d as defineComponent, l as createVNode, v as mergeProps } from "./vue-t5FcxkD3.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
import { J as init_dist, Z as isNil } from "./zova-BE4e4PxD.js";
import { d as _objectSpread2, f as init_objectSpread2, m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { b as BeanControllerBase, c as prepareComponentOptions, j as BeanBase, k as BeanInfo, l as useController, m as BeanScopeBase, p as createZovaComponentAsync } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, s as Controller, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { i as init_lib_es2015, o as classes } from "./typestyle-C2zp2284.js";
import { r as TableCell, t as init_src$3 } from "./a-table-mWEpgls1.js";
//#region src/suite/cabloy-basic/modules/basic-select/src/component/select/controller.tsx
var _dec$3, _dec2$3, _class$3, _ControllerSelect, ControllerSelect;
var init_controller$1 = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_src$1();
	init_dist();
	init_src$2();
	ControllerSelect = (_dec$3 = Controller(), _dec2$3 = BeanInfo({ module: "basic-select" }), _dec$3(_class$3 = _dec2$3(_class$3 = (_ControllerSelect = class ControllerSelect extends BeanControllerBase {
		constructor(...args) {
			super(...args);
			this.modelValue = void 0;
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.modelValue = _this.$useModel("modelValue");
			})();
		}
		render() {
			const domOptions = [];
			if (this.$props.items) for (const item of this.$props.items) {
				const title = item[this.$props.itemTitle];
				const value = item[this.$props.itemValue];
				domOptions.push(createVNode("option", {
					"key": value,
					"value": value,
					"selected": String(this.modelValue) === String(value)
				}, [title]));
			}
			return createVNode("select", { "onChange": (e) => {
				var _this$$props$items;
				const selectedValue = e.target.value;
				const item = (_this$$props$items = this.$props.items) === null || _this$$props$items === void 0 ? void 0 : _this$$props$items.find((item) => String(item[this.$props.itemValue]) === selectedValue);
				const value = item ? item[this.$props.itemValue] : void 0;
				this.modelValue = value;
			} }, [!!this.$props.placeholder && createVNode("option", {
				"disabled": true,
				"selected": isNil(this.modelValue)
			}, [this.$props.placeholder]), domOptions]);
		}
	}, _ControllerSelect.$propsDefault = {
		itemValue: "value",
		itemTitle: "title"
	}, _ControllerSelect)) || _class$3) || _class$3);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-select/src/.metadata/component/select.ts
var ZSelect;
var init_select = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller$1();
	ZSelect = defineComponent((_props) => {
		useController(ControllerSelect, void 0, void 0);
		return () => {};
	}, prepareComponentOptions());
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-select/src/component/formFieldSelect/controller.tsx
var _dec$2, _dec2$2, _class$2, _ControllerFormFieldSelect, ZFormFieldPreset, ZFormField, ControllerFormFieldSelect;
var init_controller = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_objectSpread2();
	init_src$1();
	init_lib_es2015();
	init_src$2();
	init_select();
	ZFormFieldPreset = createZovaComponentAsync("a-form", "formFieldPreset");
	ZFormField = createZovaComponentAsync("a-form", "formField");
	ControllerFormFieldSelect = (_dec$2 = Controller(), _dec2$2 = BeanInfo({ module: "basic-select" }), _dec$2(_class$2 = _dec2$2(_class$2 = (_ControllerFormFieldSelect = class ControllerFormFieldSelect extends BeanControllerBase {
		__init__() {
			return _asyncToGenerator(function* () {})();
		}
		render() {
			if (this.$props.readonly) return createVNode(ZFormFieldPreset, mergeProps(this.$props, {
				"render": "basic-input:formFieldInput",
				"options": { value: this._getValueByItems() }
			}), null);
			return createVNode(ZFormField, mergeProps(this.$props, { "slotDefault": ({ propsBucket, props }, $$formField) => {
				const className = !propsBucket.needHandleBorder ? classes(props.class, "select select-ghost") : classes(props.class, "select", !$$formField.field.state.meta.isValid && "select-error");
				return createVNode(ZSelect, _objectSpread2(_objectSpread2(_objectSpread2({
					"modelValue": propsBucket.value,
					"onUpdate:modelValue": (value) => {
						$$formField.setValue(value, propsBucket.disableNotifyChanged);
					}
				}, propsBucket.options), props), {}, { "class": className }), null);
			} }), null);
		}
		_getValueByItems() {
			var _this$$props$options$;
			const value = this.$props.value;
			const item = (_this$$props$options$ = this.$props.options.items) === null || _this$$props$options$ === void 0 ? void 0 : _this$$props$options$.find((item) => String(item[String(this.$props.options.itemValue)]) === String(value));
			return item === null || item === void 0 ? void 0 : item[String(this.$props.options.itemTitle)];
		}
	}, _ControllerFormFieldSelect.$propsDefault = { options: {
		itemValue: "value",
		itemTitle: "title"
	} }, _ControllerFormFieldSelect.$componentOptions = {
		inheritAttrs: false,
		deepExtendDefault: true
	}, _ControllerFormFieldSelect)) || _class$2) || _class$2);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-select/src/.metadata/component/formFieldSelect.ts
var ZFormFieldSelect;
var init_formFieldSelect = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller();
	ZFormFieldSelect = defineComponent((_props) => {
		useController(ControllerFormFieldSelect, void 0, void 0);
		return () => {};
	}, prepareComponentOptions(ControllerFormFieldSelect.$componentOptions));
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-select/src/bean/tableCell.select.tsx
var _dec$1, _dec2$1, _class$1, TableCellSelect;
var init_tableCell_select = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_src$3();
	TableCellSelect = (_dec$1 = TableCell({
		itemValue: "value",
		itemTitle: "title"
	}), _dec2$1 = BeanInfo({ module: "basic-select" }), _dec$1(_class$1 = _dec2$1(_class$1 = class TableCellSelect extends BeanBase {
		render(options, _renderContext, next) {
			var _options$items;
			const value = next();
			const item = (_options$items = options.items) === null || _options$items === void 0 ? void 0 : _options$items.find((item) => String(item[String(options.itemValue)]) === String(value));
			const value2 = item === null || item === void 0 ? void 0 : item[String(options.itemTitle)];
			if (!options.class) return value2;
			return createVNode("div", { "class": options.class }, [value2]);
		}
	}) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-select/src/.metadata/index.ts
/** tableCell: end */
/** scope: begin */
var _dec, _dec2, _class, components, ScopeModuleBasicSelect;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_controller();
	init_controller$1();
	init_formFieldSelect();
	init_formFieldSelect();
	init_select();
	init_select();
	init_tableCell_select();
	init_src$3();
	init_src$2();
	components = {
		"formFieldSelect": ZFormFieldSelect,
		"select": ZSelect
	};
	ScopeModuleBasicSelect = (_dec = Scope(), _dec2 = BeanInfo({ module: "basic-select" }), _dec(_class = _dec2(_class = class ScopeModuleBasicSelect extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite/cabloy-basic/modules/basic-select/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	ControllerFormFieldSelect: () => ControllerFormFieldSelect,
	ControllerSelect: () => ControllerSelect,
	ScopeModuleBasicSelect: () => ScopeModuleBasicSelect,
	TableCellSelect: () => TableCellSelect,
	ZFormFieldSelect: () => ZFormFieldSelect,
	ZSelect: () => ZSelect,
	components: () => components
});
var init_src = __esmMin((() => {
	init__metadata();
}));
//#endregion
export { src_exports as n, init_src as t };
