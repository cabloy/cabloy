import { n as __esmMin } from "./rolldown-runtime-lkMnaVCm.js";
import { d as defineComponent, l as createVNode, v as mergeProps } from "./vue-t5FcxkD3.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { b as BeanControllerBase, c as prepareComponentOptions, j as BeanBase, k as BeanInfo, l as useController, m as BeanScopeBase, p as createZovaComponentAsync } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, s as Controller, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { r as TableCell, t as init_src$3 } from "./a-table-mWEpgls1.js";
import { n as init_luxon, t as DateTime } from "./src-D0e0Xu7M.js";
//#region src/suite/cabloy-basic/modules/basic-date/src/types/date.ts
var init_date = __esmMin((() => {}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-date/src/types/index.ts
var init_types = __esmMin((() => {
	init_date();
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-date/src/lib/utils.ts
function dateFormatUtil(value, options) {
	if (!value) return;
	if (!options) return value;
	const datetime = DateTime.fromJSDate(value);
	if (options.format) return datetime.toFormat(options.format);
	else if (options.preset) return datetime.toLocaleString(DateTime[options.preset]);
	return value;
}
var init_utils = __esmMin((() => {
	init_luxon();
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-date/src/lib/index.ts
var init_lib = __esmMin((() => {
	init_utils();
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-date/src/component/dateRange/controller.tsx
var _dec$4, _dec2$4, _class$4, _ControllerDateRange, ControllerDateRange;
var init_controller$2 = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	ControllerDateRange = (_dec$4 = Controller(), _dec2$4 = BeanInfo({ module: "basic-date" }), _dec$4(_class$4 = _dec2$4(_class$4 = (_ControllerDateRange = class ControllerDateRange extends BeanControllerBase {
		constructor(...args) {
			super(...args);
			this.cSeparator = void 0;
			this.modelValue = void 0;
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.modelValue = _this.$useModel("modelValue");
				_this.cSeparator = _this.$style({
					width: "20px",
					display: "inline-block",
					textAlign: "center"
				});
			})();
		}
		render() {
			const [dateStartStr, dateEndStr] = this._parseValue(this.modelValue);
			return createVNode("div", null, [
				createVNode("input", {
					"style": { width: "130px" },
					"type": "date",
					"value": dateStartStr,
					"onInput": (e) => {
						const value = e.target.value;
						this.modelValue = this._combineValue(value, dateEndStr);
					}
				}, null),
				createVNode("div", { "class": this.cSeparator }, [this.$props.separator]),
				createVNode("input", {
					"style": { width: "130px" },
					"type": "date",
					"value": dateEndStr,
					"onInput": (e) => {
						const value = e.target.value;
						this.modelValue = this._combineValue(dateStartStr, value);
					}
				}, null)
			]);
		}
		_parseValue(value) {
			if (!value) return [];
			return value.split(this.$props.separator);
		}
		_combineValue(dateStartStr, dateEndStr) {
			if (!dateStartStr && !dateEndStr) return void 0;
			return `${dateStartStr !== null && dateStartStr !== void 0 ? dateStartStr : ""}${this.$props.separator}${dateEndStr !== null && dateEndStr !== void 0 ? dateEndStr : ""}`;
		}
	}, _ControllerDateRange.$propsDefault = { separator: "~" }, _ControllerDateRange)) || _class$4) || _class$4);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-date/src/component/formFieldDate/controller.tsx
var _dec$3, _dec2$3, _class$3, _ControllerFormFieldDate, ZFormFieldPreset, ControllerFormFieldDate;
var init_controller$1 = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	init_utils();
	ZFormFieldPreset = createZovaComponentAsync("a-form", "formFieldPreset");
	ControllerFormFieldDate = (_dec$3 = Controller(), _dec2$3 = BeanInfo({ module: "basic-date" }), _dec$3(_class$3 = _dec2$3(_class$3 = (_ControllerFormFieldDate = class ControllerFormFieldDate extends BeanControllerBase {
		__init__() {
			return _asyncToGenerator(function* () {})();
		}
		render() {
			const value = dateFormatUtil(this.$props.value, this.dateFormat);
			return createVNode(ZFormFieldPreset, mergeProps(this.$props, {
				"render": "basic-input:formFieldInput",
				"options": { value }
			}), null);
		}
		get dateFormat() {
			return this.$props.options;
		}
	}, _ControllerFormFieldDate.$propsDefault = { options: { preset: "DATETIME_SHORT" } }, _ControllerFormFieldDate.$componentOptions = {
		inheritAttrs: false,
		deepExtendDefault: true
	}, _ControllerFormFieldDate)) || _class$3) || _class$3);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-date/src/.metadata/component/dateRange.ts
var ZDateRange;
var init_dateRange = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller$2();
	ZDateRange = defineComponent((_props) => {
		useController(ControllerDateRange, void 0, void 0);
		return () => {};
	}, prepareComponentOptions());
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-date/src/component/formFieldDateRange/controller.tsx
var _dec$2, _dec2$2, _class$2, _ControllerFormFieldDateRange, ZFormField, ControllerFormFieldDateRange;
var init_controller = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	init_dateRange();
	ZFormField = createZovaComponentAsync("a-form", "formField");
	ControllerFormFieldDateRange = (_dec$2 = Controller(), _dec2$2 = BeanInfo({ module: "basic-date" }), _dec$2(_class$2 = _dec2$2(_class$2 = (_ControllerFormFieldDateRange = class ControllerFormFieldDateRange extends BeanControllerBase {
		constructor(...args) {
			super(...args);
			this.cContainer = void 0;
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.cContainer = _this.$style({ width: "auto" });
			})();
		}
		render() {
			return createVNode(ZFormField, mergeProps(this.$props, {
				"layout": { class: this.cContainer },
				"slotDefault": ({ propsBucket }, $$formField) => {
					var _this$$props$options;
					return createVNode(ZDateRange, {
						"separator": (_this$$props$options = this.$props.options) === null || _this$$props$options === void 0 ? void 0 : _this$$props$options.separator,
						"modelValue": propsBucket.value,
						"onUpdate:modelValue": (value) => {
							$$formField.setValue(value);
						}
					}, null);
				}
			}), null);
		}
	}, _ControllerFormFieldDateRange.$propsDefault = {}, _ControllerFormFieldDateRange.$componentOptions = {
		inheritAttrs: false,
		deepExtendDefault: true
	}, _ControllerFormFieldDateRange)) || _class$2) || _class$2);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-date/src/.metadata/component/formFieldDate.ts
var ZFormFieldDate;
var init_formFieldDate = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller$1();
	ZFormFieldDate = defineComponent((_props) => {
		useController(ControllerFormFieldDate, void 0, void 0);
		return () => {};
	}, prepareComponentOptions(ControllerFormFieldDate.$componentOptions));
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-date/src/.metadata/component/formFieldDateRange.ts
var ZFormFieldDateRange;
var init_formFieldDateRange = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller();
	ZFormFieldDateRange = defineComponent((_props) => {
		useController(ControllerFormFieldDateRange, void 0, void 0);
		return () => {};
	}, prepareComponentOptions(ControllerFormFieldDateRange.$componentOptions));
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-date/src/bean/tableCell.date.tsx
var _dec$1, _dec2$1, _class$1, TableCellDate;
var init_tableCell_date = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_src$3();
	init_utils();
	TableCellDate = (_dec$1 = TableCell({ preset: "DATETIME_SHORT" }), _dec2$1 = BeanInfo({ module: "basic-date" }), _dec$1(_class$1 = _dec2$1(_class$1 = class TableCellDate extends BeanBase {
		render(options, _renderContext, next) {
			const value = dateFormatUtil(next(), options);
			if (!options.class) return value;
			return createVNode("div", { "class": options.class }, [value]);
		}
	}) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-date/src/.metadata/index.ts
/** tableCell: end */
/** scope: begin */
var _dec, _dec2, _class, components, ScopeModuleBasicDate;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_controller$2();
	init_controller$1();
	init_controller();
	init_dateRange();
	init_dateRange();
	init_formFieldDate();
	init_formFieldDate();
	init_formFieldDateRange();
	init_formFieldDateRange();
	init_tableCell_date();
	init_src$3();
	init_src$2();
	components = {
		"dateRange": ZDateRange,
		"formFieldDate": ZFormFieldDate,
		"formFieldDateRange": ZFormFieldDateRange
	};
	ScopeModuleBasicDate = (_dec = Scope(), _dec2 = BeanInfo({ module: "basic-date" }), _dec(_class = _dec2(_class = class ScopeModuleBasicDate extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite/cabloy-basic/modules/basic-date/src/index.ts
var init_src = __esmMin((() => {
	init_types();
	init_lib();
	init__metadata();
}));
//#endregion
export { ZFormFieldDateRange as a, ZDateRange as c, dateFormatUtil as d, TableCellDate as i, ControllerFormFieldDate as l, ScopeModuleBasicDate as n, ZFormFieldDate as o, components as r, ControllerFormFieldDateRange as s, init_src as t, ControllerDateRange as u };
