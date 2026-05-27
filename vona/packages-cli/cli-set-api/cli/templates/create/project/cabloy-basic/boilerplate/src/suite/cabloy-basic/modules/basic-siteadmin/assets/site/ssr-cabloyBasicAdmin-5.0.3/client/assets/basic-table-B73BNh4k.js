import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { d as defineComponent, l as createVNode, v as mergeProps } from "./vue-t5FcxkD3.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { b as BeanControllerBase, c as prepareComponentOptions, g as BeanRenderBase, j as BeanBase, k as BeanInfo, l as useController, m as BeanScopeBase, o as useApp, p as createZovaComponentAsync, w as Use, x as useComputed } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { c as Render, i as Scope, s as Controller, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { n as init_lib, t as FlexRender } from "./tanstack-table-B2-FwNyG.js";
import { r as TableCell, t as init_src$3 } from "./a-table-mWEpgls1.js";
//#region src/suite/cabloy-basic/modules/basic-table/src/component/actionCreate/controller.tsx
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
var _dec$7, _dec2$7, _dec3, _dec4, _class$7, _class2, _descriptor, _ControllerActionCreate, ControllerActionCreate;
var init_controller$1 = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	ControllerActionCreate = (_dec$7 = Controller(), _dec2$7 = BeanInfo({ module: "basic-table" }), _dec3 = Use({ injectionScope: "host" }), _dec4 = Reflect.metadata("design:type", typeof IJsxRenderContextPage === "undefined" ? Object : IJsxRenderContextPage), _dec$7(_class$7 = _dec2$7(_class$7 = (_class2 = (_ControllerActionCreate = class ControllerActionCreate extends BeanControllerBase {
		constructor(...args) {
			super(...args);
			_initializerDefineProperty(this, "$$renderContext", _descriptor, this);
		}
		__init__() {
			return _asyncToGenerator(function* () {})();
		}
		render() {
			var _this = this;
			return createVNode("button", {
				"class": this.$props.class,
				"type": "button",
				"onClick": function() {
					var _ref = _asyncToGenerator(function* () {
						yield _this.$performCommand("basic-commands:create", _this.$props, _this.$$renderContext);
					});
					return function onClick() {
						return _ref.apply(this, arguments);
					};
				}()
			}, [this.scope.locale.Create()]);
		}
	}, _ControllerActionCreate.$propsDefault = { class: "btn btn-primary join-item" }, _ControllerActionCreate.$componentOptions = {
		inheritAttrs: false,
		deepExtendDefault: true
	}, _ControllerActionCreate), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "$$renderContext", [_dec3, _dec4], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2)) || _class$7) || _class$7);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-table/src/component/table/controller.tsx
var _dec$6, _dec2$6, _class$6, _ControllerTable, ControllerTable;
var init_controller = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	ControllerTable = (_dec$6 = Controller(), _dec2$6 = BeanInfo({ module: "basic-table" }), _dec$6(_class$6 = _dec2$6(_class$6 = (_ControllerTable = class ControllerTable extends BeanControllerBase {
		__init__() {
			return _asyncToGenerator(function* () {})();
		}
	}, _ControllerTable.$propsDefault = {}, _ControllerTable)) || _class$6) || _class$6);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-table/src/.metadata/component/actionCreate.ts
var ZActionCreate;
var init_actionCreate = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller$1();
	ZActionCreate = defineComponent((_props) => {
		useController(ControllerActionCreate, void 0, void 0);
		return () => {};
	}, prepareComponentOptions(ControllerActionCreate.$componentOptions));
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-table/src/component/table/render.tsx
var _dec$5, _dec2$5, _class$5, ZTable$1, RenderTable;
var init_render = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_lib();
	init_src$2();
	ZTable$1 = createZovaComponentAsync("a-table", "table");
	RenderTable = (_dec$5 = Render(), _dec2$5 = BeanInfo({ module: "basic-table" }), _dec$5(_class$5 = _dec2$5(_class$5 = class RenderTable extends BeanRenderBase {
		render() {
			return createVNode(ZTable$1, mergeProps(this.$props, { "slotDefault": ($$table) => {
				return this._renderTable($$table);
			} }), null);
		}
		_renderTable($$table) {
			const table = $$table.table;
			return createVNode("div", { "class": "overflow-x-auto" }, [createVNode("table", { "class": "table" }, [createVNode("thead", null, [createVNode("tr", null, [table.getFlatHeaders().map((header) => {
				return createVNode("th", { "key": header.id }, [createVNode(FlexRender, {
					"render": header.column.columnDef.header,
					"props": header.getContext()
				}, null)]);
			})])]), createVNode("tbody", null, [table.getRowModel().rows.map((row) => {
				return createVNode("tr", { "key": row.id }, [row.getVisibleCells().map((cell) => {
					return createVNode("td", { "key": cell.id }, [createVNode(FlexRender, {
						"render": cell.column.columnDef.cell,
						"props": cell.getContext()
					}, null)]);
				})]);
			})])])]);
		}
	}) || _class$5) || _class$5);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-table/src/.metadata/component/table.ts
var ZTable;
var init_table = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller();
	init_render();
	ZTable = defineComponent((_props) => {
		useController(ControllerTable, RenderTable, void 0);
		return () => {};
	}, prepareComponentOptions());
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-table/src/bean/tableCell.actionDelete.tsx
var _dec$4, _dec2$4, _class$4, ZIcon$1, TableCellActionDelete;
var init_tableCell_actionDelete = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_src$1();
	init_src$3();
	ZIcon$1 = createZovaComponentAsync("a-icon", "icon");
	TableCellActionDelete = (_dec$4 = TableCell({ class: "btn btn-outline btn-error join-item" }), _dec2$4 = BeanInfo({ module: "basic-table" }), _dec$4(_class$4 = _dec2$4(_class$4 = class TableCellActionDelete extends BeanBase {
		render(options, renderContext, _next) {
			var _this = this;
			const { $host } = renderContext;
			return createVNode("button", {
				"class": options.class,
				"type": "button",
				"onClick": function() {
					var _ref = _asyncToGenerator(function* () {
						if (!window.confirm(_this.scope.locale.DeleteConfirm())) return;
						yield $host.$performCommand("basic-commands:delete", options, renderContext);
					});
					return function onClick() {
						return _ref.apply(this, arguments);
					};
				}()
			}, [createVNode(ZIcon$1, {
				"name": "::delete",
				"width": 24
			}, null)]);
		}
	}) || _class$4) || _class$4);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-table/src/bean/tableCell.actionOperationsRow.tsx
var _dec$3, _dec2$3, _class$3, TableCellActionOperationsRow;
var init_tableCell_actionOperationsRow = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_src$1();
	init_src$3();
	TableCellActionOperationsRow = (_dec$3 = TableCell({ class: "join" }), _dec2$3 = BeanInfo({ module: "basic-table" }), _dec$3(_class$3 = _dec2$3(_class$3 = class TableCellActionOperationsRow extends BeanBase {
		checkVisible(options, renderContext) {
			return _asyncToGenerator(function* () {
				const { $celScope, $host, $$table } = renderContext;
				const permissions = $celScope.permissions;
				let actions = options.actions;
				if (!actions || actions.length === 0) return false;
				const renders = [];
				for (const action of actions) {
					var _action$options;
					const actionName = action.name;
					const actionRender = action.render;
					const permissionHint = (_action$options = action.options) === null || _action$options === void 0 ? void 0 : _action$options.permission;
					if ($host.$passport.checkPermission(permissions, actionName, permissionHint)) {
						if (!actionRender) throw new Error(`should specify action render: ${actionName}`);
						renders.push(actionRender);
					}
				}
				yield $$table.cellRenderPrepare(renders);
				return renders.length > 0;
			})();
		}
		render(options, renderContext, _next) {
			const { $celScope, $host, $$table } = renderContext;
			const permissions = $celScope.permissions;
			const actions = options.actions;
			if (!actions || actions.length === 0) return;
			const domActions = [];
			actions.forEach((action, index) => {
				var _action$options2;
				const actionName = action.name;
				const permissionHint = (_action$options2 = action.options) === null || _action$options2 === void 0 ? void 0 : _action$options2.permission;
				if (!$host.$passport.checkPermission(permissions, actionName, permissionHint)) return;
				const options2 = Object.assign({ key: index }, action.options);
				domActions.push($$table.cellRender(action.render, options2, renderContext));
			});
			return createVNode("div", { "class": options.class }, [domActions]);
		}
	}) || _class$3) || _class$3);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-table/src/bean/tableCell.actionUpdate.tsx
var _dec$2, _dec2$2, _class$2, ZIcon, TableCellActionUpdate;
var init_tableCell_actionUpdate = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_src$1();
	init_src$3();
	ZIcon = createZovaComponentAsync("a-icon", "icon");
	TableCellActionUpdate = (_dec$2 = TableCell({ class: "btn btn-outline btn-primary join-item" }), _dec2$2 = BeanInfo({ module: "basic-table" }), _dec$2(_class$2 = _dec2$2(_class$2 = class TableCellActionUpdate extends BeanBase {
		render(options, renderContext, _next) {
			const { $host } = renderContext;
			return createVNode("button", {
				"class": options.class,
				"type": "button",
				"onClick": function() {
					var _ref = _asyncToGenerator(function* () {
						yield $host.$performCommand("basic-commands:edit", options, renderContext);
					});
					return function onClick() {
						return _ref.apply(this, arguments);
					};
				}()
			}, [createVNode(ZIcon, {
				"name": "::draft",
				"width": 24
			}, null)]);
		}
	}) || _class$2) || _class$2);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-table/src/bean/tableCell.actionView.tsx
var _dec$1, _dec2$1, _class$1, TableCellActionView;
var init_tableCell_actionView = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_src$1();
	init_src$3();
	TableCellActionView = (_dec$1 = TableCell({ class: "hover:text-blue-500" }), _dec2$1 = BeanInfo({ module: "basic-table" }), _dec$1(_class$1 = _dec2$1(_class$1 = class TableCellActionView extends BeanBase {
		render(options, renderContext, next) {
			const { $host } = renderContext;
			const value = next();
			return createVNode("a", {
				"class": options.class,
				"href": "#",
				"onClick": function() {
					var _ref = _asyncToGenerator(function* (e) {
						e.preventDefault();
						e.stopPropagation();
						yield $host.$performCommand("basic-commands:view", options, renderContext);
					});
					return function onClick(_x) {
						return _ref.apply(this, arguments);
					};
				}()
			}, [value]);
		}
	}) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-table/src/.metadata/index.ts
/** tableCell: end */
/** locale: begin */
/** locale: end */
/** scope: begin */
function locale(key) {
	return `basic-table::${key}`;
}
var _dec, _dec2, _class, components, ScopeModuleBasicTable;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_controller$1();
	init_controller();
	init_actionCreate();
	init_actionCreate();
	init_table();
	init_table();
	init_render();
	init_tableCell_actionDelete();
	init_tableCell_actionOperationsRow();
	init_tableCell_actionUpdate();
	init_tableCell_actionView();
	init_src$3();
	init_src$2();
	components = {
		"actionCreate": ZActionCreate,
		"table": ZTable
	};
	ScopeModuleBasicTable = (_dec = Scope(), _dec2 = BeanInfo({ module: "basic-table" }), _dec(_class = _dec2(_class = class ScopeModuleBasicTable extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite/cabloy-basic/modules/basic-table/src/config/locale/en-us.ts
var en_us_default;
var init_en_us = __esmMin((() => {
	en_us_default = {
		Create: "Create",
		DeleteConfirm: "Are you sure you want to delete this item?"
	};
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-table/src/config/locale/zh-cn.ts
var zh_cn_default;
var init_zh_cn = __esmMin((() => {
	zh_cn_default = {
		Create: "创建",
		DeleteConfirm: "您确认要删除本数据吗？"
	};
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-table/src/.metadata/locales.ts
function $useLocale(key, ...args) {
	const app = useApp();
	const str = `basic-table::${key}`;
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
//#region src/suite/cabloy-basic/modules/basic-table/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	$useLocale: () => $useLocale,
	ControllerActionCreate: () => ControllerActionCreate,
	ControllerTable: () => ControllerTable,
	RenderTable: () => RenderTable,
	ScopeModuleBasicTable: () => ScopeModuleBasicTable,
	TableCellActionDelete: () => TableCellActionDelete,
	TableCellActionOperationsRow: () => TableCellActionOperationsRow,
	TableCellActionUpdate: () => TableCellActionUpdate,
	TableCellActionView: () => TableCellActionView,
	ZActionCreate: () => ZActionCreate,
	ZTable: () => ZTable,
	components: () => components,
	locale: () => locale,
	locales: () => locales
});
var init_src = __esmMin((() => {
	init__metadata();
	init_locales();
}));
//#endregion
export { src_exports as n, init_src as t };
