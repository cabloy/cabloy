import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { l as markRaw } from "./vue-CeNp4lbs.js";
import { d as defineComponent, l as createVNode } from "./vue-t5FcxkD3.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
import { F as celEnvBase, J as init_dist, Q as isNilOrEmptyString } from "./zova-BE4e4PxD.js";
import { d as _objectSpread2, f as init_objectSpread2, m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { F as appResource, H as objectAssignReactive, I as beanFullNameFromOnionName, K as cast, O as createBeanDecorator, R as deepEqual, _ as BeanControllerPageBase, b as BeanControllerBase, c as prepareComponentOptions, g as BeanRenderBase, k as BeanInfo, l as useController, m as BeanScopeBase, z as deepExtend } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { c as Render, i as Scope, s as Controller, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { i as isJsxComponent, n as ZovaJsx, t as init_src$3 } from "./zova-DxkRogHR.js";
import { r as getCoreRowModel, t as createColumnHelper } from "./tanstack-table-F1fQXKo6.js";
import { n as init_lib$1, r as useVueTable, t as FlexRender } from "./tanstack-table-B2-FwNyG.js";
//#region src/suite-vendor/a-zova/modules/a-table/src/lib/beanControllerTableBase.ts
var BeanControllerTableBase;
var init_beanControllerTableBase = __esmMin((() => {
	init_lib$1();
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_asyncToGenerator();
	BeanControllerTableBase = class extends BeanControllerBase {
		constructor(...args) {
			super(...args);
			this.table = void 0;
		}
		$useTable(initialOptions) {
			return this.ctx.util.instanceScope(() => {
				return markRaw(useVueTable(initialOptions));
			});
		}
		refreshMeta() {
			return _asyncToGenerator(function* () {
				throw new Error("should implement refreshMeta");
			})();
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-table/src/component/table/controller.tsx
var _dec$2, _dec2$2, _class$2, _ControllerTable, ControllerTable;
var init_controller = __esmMin((() => {
	init_asyncToGenerator();
	init_objectSpread2();
	init_src$1();
	init_dist();
	init_lib$1();
	init_src$3();
	init_src$2();
	init_beanControllerTableBase();
	ControllerTable = (_dec$2 = Controller(), _dec2$2 = BeanInfo({ module: "a-table" }), _dec$2(_class$2 = _dec2$2(_class$2 = (_ControllerTable = class ControllerTable extends BeanControllerTableBase {
		constructor(...args) {
			super(...args);
			this.properties = void 0;
			this.columns = void 0;
			this.tableMeta = void 0;
			this.zovaJsx = void 0;
			this.columnCelEnv = void 0;
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.bean._setBean("$$table", _this);
				_this.columnCelEnv = _this._getColumnCelEnv();
				_this.zovaJsx = _this.bean._newBeanSimple(ZovaJsx, false, void 0, _this.columnCelEnv);
				_this._createProperties();
				yield _this.refreshMeta();
				_this.$watch(() => _this.$props.schema, function() {
					var _ref = _asyncToGenerator(function* (newValue, oldValue) {
						if (deepEqual(newValue, oldValue)) return;
						yield _this.refreshMeta();
					});
					return function(_x, _x2) {
						return _ref.apply(this, arguments);
					};
				}());
				_this._createTable();
			})();
		}
		get schema() {
			return this.$props.schema;
		}
		get data() {
			return this.$props.data;
		}
		refreshMeta() {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				_this2.tableMeta = yield _this2._createTableMeta();
				_this2.columns = yield _this2._createColumns();
			})();
		}
		_createTable() {
			const self = this;
			const tableOptions = {
				getRowId: (row) => cast(row).id,
				getCoreRowModel: getCoreRowModel(),
				renderFallbackValue: this.scope.config.renderFallbackValue,
				manualPagination: true,
				get data() {
					return self.data || [];
				},
				get columns() {
					return self.columns;
				}
			};
			this.table = this.$useTable(tableOptions);
		}
		_createColumns() {
			var _this3 = this;
			return _asyncToGenerator(function* () {
				if (!_this3.properties) return [];
				if (!_this3.$props.getColumns) return yield _this3._createColumnsMiddle(_this3.tableMeta.properties);
				return yield _this3.$props.getColumns(function() {
					var _ref2 = _asyncToGenerator(function* (properties) {
						return yield _this3._createColumnsMiddle(properties !== null && properties !== void 0 ? properties : _this3.tableMeta.properties);
					});
					return function(_x3) {
						return _ref2.apply(this, arguments);
					};
				}(), function() {
					var _ref3 = _asyncToGenerator(function* (key, render) {
						const columnScope = _this3.getColumnScope(key);
						const jsxRenderContext = _this3.getColumnJsxRenderContext(columnScope);
						const { visible, columnProps } = _this3.getColumnComponentPropsTop(key, columnScope, jsxRenderContext);
						if (visible === false) return;
						return yield _this3._createColumnRender(render, columnProps, columnScope, jsxRenderContext);
					});
					return function(_x4, _x5) {
						return _ref3.apply(this, arguments);
					};
				}(), _this3);
			})();
		}
		_createColumnsMiddle(properties) {
			var _this4 = this;
			return _asyncToGenerator(function* () {
				const tableMeta = _this4.tableMeta;
				const columnHelper = createColumnHelper();
				const columns = [];
				for (const property of properties) {
					const key = property.key;
					columns.push(columnHelper.accessor(key, {
						id: key,
						header: (_props) => {
							return (property === null || property === void 0 ? void 0 : property.title) || key;
						},
						cell: (props) => tableMeta.renders[key](props)
					}));
				}
				return columns;
			})();
		}
		_createProperties() {
			this.properties = this.$computed(() => {
				return this.$sdk.loadSchemaProperties(this.schema, "table");
			});
		}
		_createTableMeta() {
			var _this5 = this;
			return _asyncToGenerator(function* () {
				let properties = [];
				const renders = {};
				if (!_this5.properties) return {
					properties,
					renders
				};
				const promises = [];
				for (const property of _this5.properties) {
					const key = property.key;
					const columnScope = _this5.getColumnScope(key);
					const jsxRenderContext = _this5.getColumnJsxRenderContext(columnScope);
					const { visible, render, columnProps } = _this5.getColumnComponentPropsTop(key, columnScope, jsxRenderContext);
					if (visible === false) continue;
					properties.push(property);
					promises.push(_this5._createColumnRender(render, columnProps, columnScope, jsxRenderContext));
				}
				let res = yield Promise.all(promises);
				properties = properties.filter((_item, index) => !!res[index]);
				res = res.filter((item) => !!item);
				properties.forEach((item, index) => {
					renders[item.key] = res[index];
				});
				return {
					properties,
					renders
				};
			})();
		}
		getColumnJsxRenderContext(celScope) {
			return {
				app: this.app,
				ctx: this.ctx,
				$scene: "tableColumn",
				$host: this,
				$celScope: celScope,
				$jsx: this.zovaJsx,
				$$table: this
			};
		}
		getCellJsxRenderContext(celScope, cellContext) {
			return {
				app: this.app,
				ctx: this.ctx,
				$scene: "tableCell",
				$host: this,
				$celScope: celScope,
				$jsx: this.zovaJsx,
				$$table: this,
				cellContext
			};
		}
		cellRenderPrepare(renders) {
			var _this6 = this;
			return _asyncToGenerator(function* () {
				if (!Array.isArray(renders)) renders = [renders];
				const promises = renders.map((item) => _this6.getRenderProvider(item)).map((renderProvider) => _asyncToGenerator(function* () {
					if (typeof renderProvider === "string" && renderProvider.includes(".tableCell.")) return yield _this6.sys.bean._getBean(renderProvider, true);
				})());
				return yield Promise.all(promises);
			})();
		}
		_createColumnRender(render, columnProps, columnScope, renderContext) {
			var _this7 = this;
			return _asyncToGenerator(function* () {
				const renderProvider = _this7.getRenderProvider(render);
				let beanInstance;
				if (typeof renderProvider === "string" && renderProvider.includes(".tableCell.")) {
					beanInstance = yield _this7.sys.bean._getBean(renderProvider, true);
					const beanOptions = appResource.getBean(renderProvider);
					columnProps = deepExtend({}, beanOptions === null || beanOptions === void 0 ? void 0 : beanOptions.options, columnProps);
					if ((beanInstance === null || beanInstance === void 0 ? void 0 : beanInstance.checkVisible) && !(yield beanInstance.checkVisible(columnProps, renderContext))) return;
				}
				return (cellContext) => {
					if (!cellContext) return;
					return _this7._cellRender(render, columnProps, columnScope, cellContext, renderProvider, beanInstance, void 0, void 0, void 0);
				};
			})();
		}
		cellRender(render, columnProps, renderContext) {
			const cellScope = renderContext.$celScope;
			const renderProvider = this.getRenderProvider(render);
			let beanInstance;
			if (typeof renderProvider === "string" && renderProvider.includes(".tableCell.")) {
				beanInstance = this.sys.bean._getBeanSyncOnly(renderProvider);
				const beanOptions = appResource.getBean(renderProvider);
				columnProps = deepExtend({}, beanOptions === null || beanOptions === void 0 ? void 0 : beanOptions.options, columnProps);
			}
			const cellProps = columnProps;
			return this._cellRender(render, columnProps, void 0, renderContext.cellContext, renderProvider, beanInstance, cellProps, cellScope, renderContext);
		}
		_cellRender(render, columnProps, columnScope, cellContext, renderProvider, beanInstance, cellProps, cellScope, jsxRenderContext) {
			return this.zovaJsx.setTransientObject({ getValue: (name) => {
				return cellContext.row.getValue(name);
			} }, () => {
				return this._cellRenderInner(render, columnProps, columnScope, cellContext, renderProvider, beanInstance, cellProps, cellScope, jsxRenderContext);
			});
		}
		_cellRenderInner(render, columnProps, columnScope, cellContext, renderProvider, beanInstance, cellProps, cellScope, jsxRenderContext) {
			const value = cellContext.getValue();
			const fallbackValue = this.table.options.renderFallbackValue;
			if (!cellScope) cellScope = objectAssignReactive({}, columnScope, {
				value,
				fallbackValue
			});
			if (renderProvider === "text") return isNilOrEmptyString(value) ? fallbackValue : value;
			if (!jsxRenderContext) jsxRenderContext = this.getCellJsxRenderContext(cellScope, cellContext);
			if (beanInstance) {
				if (!cellProps) cellProps = columnProps;
				const cellProps2 = this.zovaJsx.renderJsxProps(cellProps, {}, cellScope, jsxRenderContext);
				if (cellProps2.class || cellProps2.style) {
					cellProps2.class = jsxRenderContext.$host.$cssMerge(cellProps2.class, jsxRenderContext.$host.$style(cellProps2.style));
					delete cellProps2.style;
				}
				return beanInstance.render(cellProps2, jsxRenderContext, () => {
					const children = isJsxComponent(render) && cast(render).children;
					if (children && children.length > 0) return this.zovaJsx.renderJsxChildrenDirect(children, cellScope, jsxRenderContext);
					else return value;
				});
			}
			return this.zovaJsx.render(render, {}, cellScope, jsxRenderContext);
		}
		getColumnProperty(name) {
			if (!this.properties) return;
			return this.properties.find((item) => item.key === name);
		}
		_getColumnCelEnv() {
			const celEnv = celEnvBase.clone();
			celEnv.registerFunction("getProperty(string):dyn", (name) => {
				return this.getColumnProperty(name);
			});
			celEnv.registerFunction("getValue(string):dyn", (name) => {
				return this.zovaJsx.transientObject.getValue(name);
			});
			return celEnv;
		}
		getColumnScope(name, scopeExtra) {
			return objectAssignReactive({}, this.$props.tableScope, _objectSpread2({
				name,
				property: this.getColumnProperty(name)
			}, scopeExtra));
		}
		getColumnComponentPropsTop(name, celScope, renderContext) {
			const property = this.getColumnProperty(name);
			const rest = property === null || property === void 0 ? void 0 : property.rest;
			return this._getColumnComponentPropsTopByRest(rest, name, celScope, renderContext);
		}
		_getColumnComponentPropsTopByRest(rest, name, celScope, _renderContext) {
			var _cast;
			return {
				visible: this.zovaJsx.evaluateExpression(rest === null || rest === void 0 ? void 0 : rest.visible, celScope),
				render: rest === null || rest === void 0 ? void 0 : rest.render,
				columnProps: Object.assign({ key: name }, (_cast = cast(rest)) === null || _cast === void 0 ? void 0 : _cast.columnProps)
			};
		}
		getRenderProvider(render) {
			if (!render) return "text";
			if (typeof render === "string" && render.includes(":")) return beanFullNameFromOnionName(render, "tableCell");
			return render;
		}
	}, _ControllerTable.$propsDefault = {}, _ControllerTable)) || _class$2) || _class$2);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-table/src/component/table/render.tsx
var _dec$1, _dec2$1, _class$1, RenderTable;
var init_render = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_lib$1();
	init_src$2();
	RenderTable = (_dec$1 = Render(), _dec2$1 = BeanInfo({ module: "a-table" }), _dec$1(_class$1 = _dec2$1(_class$1 = class RenderTable extends BeanRenderBase {
		_renderTableDefault() {
			const table = this.table;
			return createVNode("table", { "class": "table" }, [createVNode("thead", null, [createVNode("tr", null, [table.getFlatHeaders().map((header) => {
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
			})])]);
		}
		render() {
			return this.$slotDefault ? this.$slotDefault(this) : this._renderTableDefault();
		}
	}) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-table/src/.metadata/component/table.ts
var ZTable;
var init_table$1 = __esmMin((() => {
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
//#region src/suite-vendor/a-zova/modules/a-table/src/config/config.ts
var config;
var init_config = __esmMin((() => {
	config = (_sys) => {
		return { renderFallbackValue: "--" };
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-table/src/.metadata/index.ts
/** config: end */
/** scope: begin */
var _dec, _dec2, _class, components, ScopeModuleATable;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_controller();
	init_table$1();
	init_table$1();
	init_render();
	init_config();
	init_src$2();
	components = { "table": ZTable };
	ScopeModuleATable = (_dec = Scope(), _dec2 = BeanInfo({ module: "a-table" }), _dec(_class = _dec2(_class = class ScopeModuleATable extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite-vendor/a-zova/modules/a-table/src/lib/beanControllerPageTableBase.ts
var BeanControllerPageTableBase;
var init_beanControllerPageTableBase = __esmMin((() => {
	init_lib$1();
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_asyncToGenerator();
	BeanControllerPageTableBase = class extends BeanControllerPageBase {
		constructor(...args) {
			super(...args);
			this.table = void 0;
		}
		$useTable(initialOptions) {
			return this.ctx.util.instanceScope(() => {
				return markRaw(useVueTable(initialOptions));
			});
		}
		refreshMeta() {
			return _asyncToGenerator(function* () {
				throw new Error("should implement refreshMeta");
			})();
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-table/src/lib/tableCell.ts
function TableCell(options) {
	return createBeanDecorator("tableCell", "sys", true, options);
}
var init_tableCell$1 = __esmMin((() => {
	init_src$1();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-table/src/lib/index.ts
var init_lib = __esmMin((() => {
	init_beanControllerPageTableBase();
	init_beanControllerTableBase();
	init_tableCell$1();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-table/src/types/table.ts
var init_table = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-table/src/types/tableCell.ts
var init_tableCell = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-table/src/types/tableColumn.ts
var init_tableColumn = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-table/src/types/index.ts
var init_types = __esmMin((() => {
	init_table();
	init_tableCell();
	init_tableColumn();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-table/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	BeanControllerPageTableBase: () => BeanControllerPageTableBase,
	BeanControllerTableBase: () => BeanControllerTableBase,
	ControllerTable: () => ControllerTable,
	RenderTable: () => RenderTable,
	ScopeModuleATable: () => ScopeModuleATable,
	TableCell: () => TableCell,
	ZTable: () => ZTable,
	components: () => components,
	config: () => config
});
var init_src = __esmMin((() => {
	init__metadata();
	init_lib();
	init_types();
}));
//#endregion
export { src_exports as n, TableCell as r, init_src as t };
