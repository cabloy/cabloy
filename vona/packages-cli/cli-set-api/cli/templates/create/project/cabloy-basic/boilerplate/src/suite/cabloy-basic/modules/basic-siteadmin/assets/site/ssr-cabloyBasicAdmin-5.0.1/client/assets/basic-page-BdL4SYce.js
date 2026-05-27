import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { c as createTextVNode, d as defineComponent, l as createVNode, r as Fragment } from "./vue-t5FcxkD3.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
import { F as celEnvBase, J as init_dist, Q as isNilOrEmptyString } from "./zova-BE4e4PxD.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { R as deepEqual, b as BeanControllerBase, c as prepareComponentOptions, k as BeanInfo, l as useController, m as BeanScopeBase, o as useApp, p as createZovaComponentAsync, w as Use, x as useComputed } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, s as Controller, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { n as ZovaJsx, t as init_src$3 } from "./zova-DxkRogHR.js";
import { r as $QueriesAutoLoad, t as init_src$4 } from "./a-model-Dk4zg8ps.js";
import { t as init_src$5 } from "./a-openapi-DFPQpoaJ.js";
import { t as init_src$6 } from "./a-table-mWEpgls1.js";
//#region src/suite/cabloy-basic/modules/basic-page/src/config/locale/en-us.ts
var en_us_default;
var init_en_us = __esmMin((() => {
	en_us_default = {
		Search: "Search",
		Reset: "Reset",
		PagedTotalItems: "Total",
		PagedTotalPages: "Pages"
	};
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/config/locale/zh-cn.ts
var zh_cn_default;
var init_zh_cn = __esmMin((() => {
	zh_cn_default = {
		Search: "搜索",
		Reset: "重置",
		PagedTotalItems: "总条数",
		PagedTotalPages: "总页数"
	};
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/.metadata/locales.ts
function $useLocale(key, ...args) {
	const app = useApp();
	const str = `basic-page::${key}`;
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
//#region src/suite/cabloy-basic/modules/basic-page/src/types/page.ts
var init_page = __esmMin((() => {
	init_src$6();
	init_src$5();
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/types/index.ts
var init_types = __esmMin((() => {
	init_page();
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/component/blockFilter/controller.tsx
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
var _dec$5, _dec2$5, _dec3$3, _dec4$3, _class$5, _class2$3, _descriptor$3, _ControllerBlockFilter, ZForm, ControllerBlockFilter;
var init_controller$4 = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_src$1();
	init_dist();
	init_src$2();
	ZForm = createZovaComponentAsync("a-form", "form");
	ControllerBlockFilter = (_dec$5 = Controller(), _dec2$5 = BeanInfo({ module: "basic-page" }), _dec3$3 = Use({ injectionScope: "host" }), _dec4$3 = Reflect.metadata("design:type", typeof IJsxRenderContextPage === "undefined" ? Object : IJsxRenderContextPage), _dec$5(_class$5 = _dec2$5(_class$5 = (_class2$3 = (_ControllerBlockFilter = class ControllerBlockFilter extends BeanControllerBase {
		constructor(...args) {
			super(...args);
			this.formMeta = void 0;
			this.formFieldLayout = void 0;
			_initializerDefineProperty$3(this, "$$renderContext", _descriptor$3, this);
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.formMeta = { formMode: "edit" };
				_this.formFieldLayout = { inline: true };
			})();
		}
		get schemaFilter() {
			const { $$page } = this.$$renderContext;
			return $$page.schemaFilter;
		}
		submitData(data) {
			this._onFilter(data.value);
		}
		resetData(data) {
			this._onFilter(data);
		}
		_onFilter(dataOld) {
			const { $$page } = this.$$renderContext;
			const dataNew = {};
			for (const key in dataOld) {
				const value = dataOld[key];
				if (!isNilOrEmptyString(value)) dataNew[key] = value;
			}
			$$page.onFilter(dataNew);
		}
		render() {
			const { $$page } = this.$$renderContext;
			return createVNode(ZForm, {
				"class": this.$props.class,
				"inline": true,
				"data": $$page.queryFilterData,
				"schema": this.schemaFilter,
				"schemaScene": "filter",
				"formMeta": this.formMeta,
				"formFieldLayout": this.formFieldLayout,
				"onSubmitData": (data) => this.submitData(data),
				"slotFooter": ($$form) => {
					return createVNode(Fragment, null, [createVNode("button", {
						"class": "btn btn-primary",
						"onClick": () => {
							$$form.submit();
						}
					}, [this.scope.locale.Search()]), createVNode("button", {
						"class": "btn btn-warning",
						"onClick": () => {
							const data = $$form.reset();
							this.resetData(data);
						}
					}, [this.scope.locale.Reset()])]);
				}
			}, null);
		}
	}, _ControllerBlockFilter.$propsDefault = {}, _ControllerBlockFilter.$componentOptions = {
		inheritAttrs: false,
		deepExtendDefault: true
	}, _ControllerBlockFilter), _descriptor$3 = _applyDecoratedDescriptor$3(_class2$3.prototype, "$$renderContext", [_dec3$3, _dec4$3], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2$3)) || _class$5) || _class$5);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/component/blockPage/controller.tsx
var _dec$4, _dec2$4, _class$4, _ControllerBlockPage, ControllerBlockPage;
var init_controller$3 = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_src$1();
	init_dist();
	init_src$3();
	init_src$2();
	init_src$4();
	ControllerBlockPage = (_dec$4 = Controller(), _dec2$4 = BeanInfo({ module: "basic-page" }), _dec$4(_class$4 = _dec2$4(_class$4 = (_ControllerBlockPage = class ControllerBlockPage extends BeanControllerBase {
		constructor(...args) {
			super(...args);
			this.tableRef = void 0;
			this.jsxZova = void 0;
			this.jsxCelScope = void 0;
			this.jsxRenderContext = void 0;
			this.queryFilterData = void 0;
			this.queryPaged = void 0;
			this.query = void 0;
			this.$$modelResource = void 0;
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.$$modelResource = yield _this.bean._getBeanSelector("rest-resource.model.resource", true, _this.resource);
				_this._prepareJsx();
				_this.queryFilterData = {};
				_this.queryPaged = {
					pageNo: 1,
					pageSize: _this.$props.pageSize
				};
				_this.query = _this.$computed(() => {
					return Object.assign({}, _this.queryFilterData, _this.queryPaged);
				});
				yield $QueriesAutoLoad(() => _this.$$modelResource.apiSchemasSelect.sdk, () => _this.queryData);
				_this.$watch(() => _this.permissions, function() {
					var _ref = _asyncToGenerator(function* (newValue, oldValue) {
						var _this$tableRef;
						if (deepEqual(newValue, oldValue)) return;
						yield (_this$tableRef = _this.tableRef) === null || _this$tableRef === void 0 ? void 0 : _this$tableRef.refreshMeta();
					});
					return function(_x, _x2) {
						return _ref.apply(this, arguments);
					};
				}());
			})();
		}
		get resource() {
			return this.$props.resource;
		}
		get queryData() {
			return this.$$modelResource.select(this.query);
		}
		get data() {
			var _this$queryData$data;
			return (_this$queryData$data = this.queryData.data) === null || _this$queryData$data === void 0 ? void 0 : _this$queryData$data.list;
		}
		get paged() {
			return this.queryData.data;
		}
		get schemaFilter() {
			return this.$$modelResource.schemaFilter;
		}
		get schemaRow() {
			return this.$$modelResource.schemaRow;
		}
		get permissions() {
			return this.$$modelResource.permissions;
		}
		gotoPage(pageNo) {
			if (this.queryPaged.pageNo !== pageNo) this.queryPaged.pageNo = pageNo;
		}
		setPageSize(pageSize) {
			if (this.queryPaged.pageSize !== pageSize) this.queryPaged.pageSize = pageSize;
		}
		onFilter(data) {
			this.queryFilterData = data;
		}
		_prepareJsx() {
			const jsxCelEnv = celEnvBase.clone();
			this.jsxZova = this.bean._newBeanSimple(ZovaJsx, false, void 0, jsxCelEnv);
			this.jsxCelScope = this._prepareJsxCelScope();
			this.jsxRenderContext = {
				app: this.app,
				ctx: this.ctx,
				$scene: "page",
				$host: this,
				$celScope: this.jsxCelScope,
				$jsx: this.jsxZova,
				$$page: this
			};
		}
		_prepareJsxCelScope() {
			const self = this;
			const permissions = this.$customRef(() => {
				return {
					get() {
						return self.$$modelResource.permissions;
					},
					set(_value) {}
				};
			});
			return {
				resource: this.resource,
				permissions
			};
		}
		render() {
			return createVNode("div", { "class": this.$props.class }, [this._renderBlocks()]);
		}
		_renderBlocks() {
			const blocks = this.$props.blocks;
			if (!blocks || blocks.length === 0) return;
			let domBlocks = [];
			blocks.forEach((block, index) => {
				const options = Object.assign({ key: index }, block.options);
				const domBlock = this.jsxZova.render(block.render, options, this.jsxCelScope, this.jsxRenderContext);
				if (!domBlock) return;
				if (Array.isArray(domBlock)) domBlocks.push(...domBlock);
				else domBlocks.push(domBlock);
			});
			return domBlocks;
		}
	}, _ControllerBlockPage.$propsDefault = { pageSize: 20 }, _ControllerBlockPage.$componentOptions = {
		inheritAttrs: false,
		deepExtendDefault: true
	}, _ControllerBlockPage)) || _class$4) || _class$4);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/component/blockPager/controller.tsx
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
var _dec$3, _dec2$3, _dec3$2, _dec4$2, _class$3, _class2$2, _descriptor$2, _ControllerBlockPager, ControllerBlockPager;
var init_controller$2 = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	ControllerBlockPager = (_dec$3 = Controller(), _dec2$3 = BeanInfo({ module: "basic-page" }), _dec3$2 = Use({ injectionScope: "host" }), _dec4$2 = Reflect.metadata("design:type", typeof IJsxRenderContextPage === "undefined" ? Object : IJsxRenderContextPage), _dec$3(_class$3 = _dec2$3(_class$3 = (_class2$2 = (_ControllerBlockPager = class ControllerBlockPager extends BeanControllerBase {
		constructor(...args) {
			super(...args);
			_initializerDefineProperty$2(this, "$$renderContext", _descriptor$2, this);
		}
		__init__() {
			return _asyncToGenerator(function* () {})();
		}
		render() {
			const domPager = this._renderPager();
			if (!domPager) return;
			return createVNode("div", { "class": this.$props.class }, [createVNode("div", { "class": "join" }, [domPager])]);
		}
		_renderPager() {
			const { $$page } = this.$$renderContext;
			const { paged } = $$page;
			if (!paged) return;
			return createVNode(Fragment, null, [
				createVNode("button", { "class": "join-item btn btn-disabled" }, [`${this.scope.locale.PagedTotalItems()}: ${paged.total}`]),
				createVNode("button", { "class": "join-item btn btn-disabled" }, [`${this.scope.locale.PagedTotalPages()}: ${paged.pageCount}`]),
				paged.pageNo > 1 && createVNode("button", {
					"class": "join-item btn",
					"onClick": () => {
						$$page.gotoPage($$page.paged.pageNo - 1);
					}
				}, [createTextVNode("«")]),
				paged.pageCount > 0 && createVNode("button", { "class": "join-item btn" }, [paged.pageNo]),
				paged.pageNo < paged.pageCount && createVNode("button", {
					"class": "join-item btn",
					"onClick": () => {
						$$page.gotoPage($$page.paged.pageNo + 1);
					}
				}, [createTextVNode("»")])
			]);
		}
	}, _ControllerBlockPager.$propsDefault = {}, _ControllerBlockPager.$componentOptions = {
		inheritAttrs: false,
		deepExtendDefault: true
	}, _ControllerBlockPager), _descriptor$2 = _applyDecoratedDescriptor$2(_class2$2.prototype, "$$renderContext", [_dec3$2, _dec4$2], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2$2)) || _class$3) || _class$3);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/component/blockTable/controller.tsx
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
var _dec$2, _dec2$2, _dec3$1, _dec4$1, _class$2, _class2$1, _descriptor$1, _ControllerBlockTable, ZTable, ControllerBlockTable;
var init_controller$1 = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	ZTable = createZovaComponentAsync("a-table", "table");
	ControllerBlockTable = (_dec$2 = Controller(), _dec2$2 = BeanInfo({ module: "basic-page" }), _dec3$1 = Use({ injectionScope: "host" }), _dec4$1 = Reflect.metadata("design:type", typeof IJsxRenderContextPage === "undefined" ? Object : IJsxRenderContextPage), _dec$2(_class$2 = _dec2$2(_class$2 = (_class2$1 = (_ControllerBlockTable = class ControllerBlockTable extends BeanControllerBase {
		constructor(...args) {
			super(...args);
			this.tableRef = void 0;
			_initializerDefineProperty$1(this, "$$renderContext", _descriptor$1, this);
		}
		__init__() {
			return _asyncToGenerator(function* () {})();
		}
		get permissions() {
			return this.$$renderContext.$celScope.permissions;
		}
		render() {
			const { $$page } = this.$$renderContext;
			return createVNode(ZTable, {
				"class": this.$props.class,
				"controllerRef": (ref) => {
					this.tableRef = ref;
					$$page.tableRef = ref;
				},
				"data": $$page.data,
				"schema": $$page.schemaRow,
				"tableScope": $$page.jsxCelScope
			}, null);
		}
	}, _ControllerBlockTable.$propsDefault = {}, _ControllerBlockTable.$componentOptions = {
		inheritAttrs: false,
		deepExtendDefault: true
	}, _ControllerBlockTable), _descriptor$1 = _applyDecoratedDescriptor$1(_class2$1.prototype, "$$renderContext", [_dec3$1, _dec4$1], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2$1)) || _class$2) || _class$2);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/component/blockToolbarBulk/controller.tsx
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
var _dec$1, _dec2$1, _dec3, _dec4, _class$1, _class2, _descriptor, _ControllerBlockToolbarBulk, ControllerBlockToolbarBulk;
var init_controller = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	ControllerBlockToolbarBulk = (_dec$1 = Controller(), _dec2$1 = BeanInfo({ module: "basic-page" }), _dec3 = Use({ injectionScope: "host" }), _dec4 = Reflect.metadata("design:type", typeof IJsxRenderContextPage === "undefined" ? Object : IJsxRenderContextPage), _dec$1(_class$1 = _dec2$1(_class$1 = (_class2 = (_ControllerBlockToolbarBulk = class ControllerBlockToolbarBulk extends BeanControllerBase {
		constructor(...args) {
			super(...args);
			_initializerDefineProperty(this, "$$renderContext", _descriptor, this);
		}
		__init__() {
			return _asyncToGenerator(function* () {})();
		}
		get permissions() {
			return this.$$renderContext.$celScope.permissions;
		}
		render() {
			const domActions = this._renderActions();
			if (!domActions || domActions.length === 0) return;
			return createVNode("div", { "class": this.$props.class }, [createVNode("div", { "class": "join" }, [domActions])]);
		}
		_renderActions() {
			const { $jsx, $celScope } = this.$$renderContext;
			const actions = this.$props.actions;
			if (!actions || actions.length === 0) return;
			const domActions = [];
			actions.forEach((action, index) => {
				var _action$options;
				const actionName = action.name;
				const permissionHint = (_action$options = action.options) === null || _action$options === void 0 ? void 0 : _action$options.permission;
				if (!this.$passport.checkPermission(this.permissions, actionName, permissionHint)) return;
				const options = Object.assign({ key: index }, action.options);
				const domAction = $jsx.render(action.render, options, $celScope, this.$$renderContext);
				if (!domAction) return;
				if (Array.isArray(domAction)) domActions.push(...domAction);
				else domActions.push(domAction);
			});
			return domActions;
		}
	}, _ControllerBlockToolbarBulk.$propsDefault = {}, _ControllerBlockToolbarBulk.$componentOptions = {
		inheritAttrs: false,
		deepExtendDefault: true
	}, _ControllerBlockToolbarBulk), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "$$renderContext", [_dec3, _dec4], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2)) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/.metadata/component/blockFilter.ts
var ZBlockFilter;
var init_blockFilter = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller$4();
	ZBlockFilter = defineComponent((_props) => {
		useController(ControllerBlockFilter, void 0, void 0);
		return () => {};
	}, prepareComponentOptions(ControllerBlockFilter.$componentOptions));
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/.metadata/component/blockPage.ts
var ZBlockPage;
var init_blockPage = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller$3();
	ZBlockPage = defineComponent((_props) => {
		useController(ControllerBlockPage, void 0, void 0);
		return () => {};
	}, prepareComponentOptions(ControllerBlockPage.$componentOptions));
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/.metadata/component/blockPager.ts
var ZBlockPager;
var init_blockPager = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller$2();
	ZBlockPager = defineComponent((_props) => {
		useController(ControllerBlockPager, void 0, void 0);
		return () => {};
	}, prepareComponentOptions(ControllerBlockPager.$componentOptions));
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/.metadata/component/blockTable.ts
var ZBlockTable;
var init_blockTable = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller$1();
	ZBlockTable = defineComponent((_props) => {
		useController(ControllerBlockTable, void 0, void 0);
		return () => {};
	}, prepareComponentOptions(ControllerBlockTable.$componentOptions));
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/.metadata/component/blockToolbarBulk.ts
var ZBlockToolbarBulk;
var init_blockToolbarBulk = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller();
	ZBlockToolbarBulk = defineComponent((_props) => {
		useController(ControllerBlockToolbarBulk, void 0, void 0);
		return () => {};
	}, prepareComponentOptions(ControllerBlockToolbarBulk.$componentOptions));
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/.metadata/index.ts
/** components: end */
/** locale: begin */
/** locale: end */
/** scope: begin */
function locale(key) {
	return `basic-page::${key}`;
}
var _dec, _dec2, _class, components, ScopeModuleBasicPage;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_controller$4();
	init_controller$3();
	init_controller$2();
	init_controller$1();
	init_controller();
	init_blockFilter();
	init_blockFilter();
	init_blockPage();
	init_blockPage();
	init_blockPager();
	init_blockPager();
	init_blockTable();
	init_blockTable();
	init_blockToolbarBulk();
	init_blockToolbarBulk();
	init_src$2();
	components = {
		"blockFilter": ZBlockFilter,
		"blockPage": ZBlockPage,
		"blockPager": ZBlockPager,
		"blockTable": ZBlockTable,
		"blockToolbarBulk": ZBlockToolbarBulk
	};
	ScopeModuleBasicPage = (_dec = Scope(), _dec2 = BeanInfo({ module: "basic-page" }), _dec(_class = _dec2(_class = class ScopeModuleBasicPage extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	$useLocale: () => $useLocale,
	ControllerBlockFilter: () => ControllerBlockFilter,
	ControllerBlockPage: () => ControllerBlockPage,
	ControllerBlockPager: () => ControllerBlockPager,
	ControllerBlockTable: () => ControllerBlockTable,
	ControllerBlockToolbarBulk: () => ControllerBlockToolbarBulk,
	ScopeModuleBasicPage: () => ScopeModuleBasicPage,
	ZBlockFilter: () => ZBlockFilter,
	ZBlockPage: () => ZBlockPage,
	ZBlockPager: () => ZBlockPager,
	ZBlockTable: () => ZBlockTable,
	ZBlockToolbarBulk: () => ZBlockToolbarBulk,
	components: () => components,
	locale: () => locale,
	locales: () => locales
});
var init_src = __esmMin((() => {
	init_locales();
	init_types();
	init__metadata();
}));
//#endregion
export { src_exports as n, init_src as t };
