import { n as __esmMin } from "./rolldown-runtime-lkMnaVCm.js";
import { d as defineComponent, l as createVNode, v as mergeProps } from "./vue-t5FcxkD3.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { b as BeanControllerBase, c as prepareComponentOptions, j as BeanBase, k as BeanInfo, l as useController, m as BeanScopeBase, p as createZovaComponentAsync, w as Use } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, s as Controller, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { r as TableCell, t as init_src$3 } from "./a-table-mWEpgls1.js";
import { n as init_dist, t as Currency } from "./src-CIv_bOyV.js";
//#region src/suite/cabloy-basic/modules/basic-currency/src/lib/utils.ts
function currencyFormat(value, options) {
	if (!value || typeof value !== "number" && typeof value !== "string") return value;
	return new Currency(options).format(value);
}
function currencyUpdate(value, options) {
	return new Currency(options).update(value);
}
var init_utils = __esmMin((() => {
	init_dist();
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-currency/src/component/formFieldCurrency/controller.tsx
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
var _dec$2, _dec2$2, _dec3, _dec4, _class$2, _class2, _descriptor, _ControllerFormFieldCurrency, ZFormFieldPreset, ControllerFormFieldCurrency;
var init_controller = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	init_utils();
	ZFormFieldPreset = createZovaComponentAsync("a-form", "formFieldPreset");
	ControllerFormFieldCurrency = (_dec$2 = Controller(), _dec2$2 = BeanInfo({ module: "basic-currency" }), _dec3 = Use({
		injectionScope: "host",
		beanFullName: "a-form.controller.form"
	}), _dec4 = Reflect.metadata("design:type", typeof ControllerForm === "undefined" ? Object : ControllerForm), _dec$2(_class$2 = _dec2$2(_class$2 = (_class2 = (_ControllerFormFieldCurrency = class ControllerFormFieldCurrency extends BeanControllerBase {
		constructor(...args) {
			super(...args);
			this._valueKeyboardInput = void 0;
			_initializerDefineProperty(this, "$$form", _descriptor, this);
		}
		__init__() {
			return _asyncToGenerator(function* () {})();
		}
		render() {
			const currencyOptions = this.$props.options;
			const value = this._valuePatch(currencyOptions);
			return createVNode(ZFormFieldPreset, mergeProps(this.$props, {
				"render": "basic-input:formFieldInput",
				"options": {
					value,
					onInput: (e) => {
						const value = e.target.value;
						this._valueKeyboardInput = value;
						const valuePatch = currencyUpdate(value, currencyOptions);
						const valueNew = valuePatch !== void 0 ? valuePatch !== null && valuePatch !== void 0 ? valuePatch : void 0 : value;
						this.$$form.setFieldValue(this.$props.name, valueNew);
					},
					onChange: (e) => {
						if (this._valueKeyboardInput !== void 0) {
							const value = e.target.value;
							if (currencyUpdate(value, currencyOptions) !== void 0) this._valueKeyboardInput = void 0;
						}
					}
				}
			}), null);
		}
		_valuePatch(currencyOptions) {
			if (this._valueKeyboardInput === void 0) return this._getValue(currencyOptions);
			const valueInputPatch = currencyUpdate(this._valueKeyboardInput, currencyOptions);
			if (valueInputPatch === void 0) return this._valueKeyboardInput;
			if (valueInputPatch === this.$props.value) return this._valueKeyboardInput;
			return this._getValue(currencyOptions);
		}
		_getValue(currencyOptions) {
			return currencyFormat(this.$props.value, currencyOptions);
		}
	}, _ControllerFormFieldCurrency.$propsDefault = {}, _ControllerFormFieldCurrency.$componentOptions = {
		inheritAttrs: false,
		deepExtendDefault: true
	}, _ControllerFormFieldCurrency), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "$$form", [_dec3, _dec4], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2)) || _class$2) || _class$2);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-currency/src/.metadata/component/formFieldCurrency.ts
var ZFormFieldCurrency;
var init_formFieldCurrency = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller();
	ZFormFieldCurrency = defineComponent((_props) => {
		useController(ControllerFormFieldCurrency, void 0, void 0);
		return () => {};
	}, prepareComponentOptions(ControllerFormFieldCurrency.$componentOptions));
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-currency/src/bean/tableCell.currency.tsx
var _dec$1, _dec2$1, _class$1, TableCellCurrency;
var init_tableCell_currency = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_src$3();
	init_utils();
	TableCellCurrency = (_dec$1 = TableCell(), _dec2$1 = BeanInfo({ module: "basic-currency" }), _dec$1(_class$1 = _dec2$1(_class$1 = class TableCellCurrency extends BeanBase {
		render(options, _renderContext, next) {
			const value = currencyFormat(next(), options);
			if (!options.class) return value;
			return createVNode("div", { "class": options.class }, [value]);
		}
	}) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-currency/src/.metadata/index.ts
/** tableCell: end */
/** scope: begin */
var _dec, _dec2, _class, components, ScopeModuleBasicCurrency;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_controller();
	init_formFieldCurrency();
	init_formFieldCurrency();
	init_tableCell_currency();
	init_src$3();
	init_src$2();
	components = { "formFieldCurrency": ZFormFieldCurrency };
	ScopeModuleBasicCurrency = (_dec = Scope(), _dec2 = BeanInfo({ module: "basic-currency" }), _dec(_class = _dec2(_class = class ScopeModuleBasicCurrency extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite/cabloy-basic/modules/basic-currency/src/lib/index.ts
var init_lib = __esmMin((() => {
	init_utils();
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-currency/src/index.ts
var init_src = __esmMin((() => {
	init__metadata();
	init_lib();
}));
//#endregion
export { ZFormFieldCurrency as a, currencyUpdate as c, TableCellCurrency as i, ScopeModuleBasicCurrency as n, ControllerFormFieldCurrency as o, components as r, currencyFormat as s, init_src as t };
