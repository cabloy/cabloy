import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { d as defineComponent, l as createVNode } from "./vue-t5FcxkD3.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
import { F as celEnvBase, J as init_dist, Z as isNil } from "./zova-BE4e4PxD.js";
import { d as _objectSpread2, f as init_objectSpread2, m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { R as deepEqual, b as BeanControllerBase, c as prepareComponentOptions, k as BeanInfo, l as useController, m as BeanScopeBase, o as useApp, p as createZovaComponentAsync, w as Use, x as useComputed } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, s as Controller, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { n as ZovaJsx, t as init_src$3 } from "./zova-DxkRogHR.js";
import { r as $QueriesAutoLoad, t as init_src$4 } from "./a-model-Dk4zg8ps.js";
import { t as init_src$5 } from "./a-openapi-DFPQpoaJ.js";
import { r as formMetaFromFormScene, t as init_src$6 } from "./a-form-DY36e9U7.js";
//#region src/suite/cabloy-basic/modules/basic-pageentry/src/config/locale/en-us.ts
var en_us_default;
var init_en_us = __esmMin((() => {
	en_us_default = { EntryNotExist: "The entry does not exist" };
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-pageentry/src/config/locale/zh-cn.ts
var zh_cn_default;
var init_zh_cn = __esmMin((() => {
	zh_cn_default = { EntryNotExist: "该条目不存在" };
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-pageentry/src/.metadata/locales.ts
function $useLocale(key, ...args) {
	const app = useApp();
	const str = `basic-pageentry::${key}`;
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
//#region src/suite/cabloy-basic/modules/basic-pageentry/src/types/pageEntry.ts
var init_pageEntry = __esmMin((() => {
	init_src$6();
	init_src$5();
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-pageentry/src/types/index.ts
var init_types = __esmMin((() => {
	init_pageEntry();
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockForm/controller.tsx
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
var _dec$3, _dec2$3, _dec3$1, _dec4$1, _class$3, _class2$1, _descriptor$1, _ControllerBlockForm, ZForm, ControllerBlockForm;
var init_controller$2 = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	ZForm = createZovaComponentAsync("a-form", "form");
	ControllerBlockForm = (_dec$3 = Controller(), _dec2$3 = BeanInfo({ module: "basic-pageentry" }), _dec3$1 = Use({ injectionScope: "host" }), _dec4$1 = Reflect.metadata("design:type", typeof IJsxRenderContextPageEntry === "undefined" ? Object : IJsxRenderContextPageEntry), _dec$3(_class$3 = _dec2$3(_class$3 = (_class2$1 = (_ControllerBlockForm = class ControllerBlockForm extends BeanControllerBase {
		constructor(...args) {
			super(...args);
			this.formRef = void 0;
			_initializerDefineProperty$1(this, "$$renderContext", _descriptor$1, this);
		}
		__init__() {
			return _asyncToGenerator(function* () {})();
		}
		render() {
			const { $$pageEntry } = this.$$renderContext;
			return createVNode(ZForm, {
				"class": this.$props.class,
				"controllerRef": (ref) => {
					this.formRef = ref;
					$$pageEntry.formRef = ref;
				},
				"formTag": "div",
				"data": $$pageEntry.formData,
				"schema": $$pageEntry.formSchema,
				"schemaScene": $$pageEntry.schemaScene,
				"formMeta": $$pageEntry.formMeta,
				"formProvider": $$pageEntry.formProvider,
				"formScope": $$pageEntry.jsxCelScope,
				"onSubmitData": (data) => $$pageEntry.submitData(data),
				"onShowError": ({ error }) => {
					window.alert(error.message);
				},
				"onChanged": (data) => {
					$$pageEntry.setPageMeta(data, true);
				}
			}, null);
		}
	}, _ControllerBlockForm.$propsDefault = {}, _ControllerBlockForm.$componentOptions = {
		inheritAttrs: false,
		deepExtendDefault: true
	}, _ControllerBlockForm), _descriptor$1 = _applyDecoratedDescriptor$1(_class2$1.prototype, "$$renderContext", [_dec3$1, _dec4$1], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2$1)) || _class$3) || _class$3);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx
var _dec$2, _dec2$2, _class$2, _ControllerBlockPageEntry, ControllerBlockPageEntry;
var init_controller$1 = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_objectSpread2();
	init_asyncToGenerator();
	init_src$1();
	init_dist();
	init_src$3();
	init_src$2();
	init_src$6();
	init_src$4();
	ControllerBlockPageEntry = (_dec$2 = Controller(), _dec2$2 = BeanInfo({ module: "basic-pageentry" }), _dec$2(_class$2 = _dec2$2(_class$2 = (_ControllerBlockPageEntry = class ControllerBlockPageEntry extends BeanControllerBase {
		constructor(...args) {
			super(...args);
			this.entryIdCreated = void 0;
			this.formRef = void 0;
			this.formMeta = void 0;
			this.formProvider = void 0;
			this.formSchema = void 0;
			this.formData = void 0;
			this.jsxZova = void 0;
			this.jsxCelScope = void 0;
			this.jsxRenderContext = void 0;
			this.$$modelResource = void 0;
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.$$modelResource = yield _this.bean._getBeanSelector("rest-resource.model.resource", true, _this.resource);
				_this.formMeta = _this.$computed(() => {
					const formScene = _this.formScene;
					return _objectSpread2(_objectSpread2({}, formMetaFromFormScene(formScene)), {}, { formScene });
				});
				_this.formProvider = _this.$computed(() => {
					return _this.$$modelResource.formProvider;
				});
				_this.formSchema = _this.$computed(() => {
					return _this.$$modelResource.getFormSchema(_this.formMeta);
				});
				_this.formData = _this.$computed(() => {
					return _this.$$modelResource.getFormData(_this.formMeta, _this.entryId);
				});
				_this._prepareJsx();
				yield $QueriesAutoLoad(() => {
					var _this$$$modelResource;
					return (_this$$$modelResource = _this.$$modelResource.getFormApiSchemas(_this.formMeta)) === null || _this$$$modelResource === void 0 ? void 0 : _this$$$modelResource.sdk;
				}, () => _this.queryData);
				_this.setPageMeta(_this.formData, false);
				_this.$watch(() => _this.formData, (newValue, oldValue) => {
					if (deepEqual(newValue, oldValue)) return;
					_this.setPageMeta(newValue, false);
				});
			})();
		}
		get resource() {
			return this.$props.resource;
		}
		get entryId() {
			return this.$props.id;
		}
		get formScene() {
			var _this$$props$formScen;
			return (_this$$props$formScen = this.$props.formScene) !== null && _this$$props$formScen !== void 0 ? _this$$props$formScen : isNil(this.entryId) ? "create" : "view";
		}
		get schemaScene() {
			if (this.formMeta.formMode === "view") return "form-view";
			if (this.formMeta.editMode === "create") return "form-create";
			return "form";
		}
		get queryData() {
			if (isNil(this.entryId)) return;
			return this.$$modelResource.view(this.entryId);
		}
		_prepareJsx() {
			const jsxCelEnv = celEnvBase.clone();
			this.jsxZova = this.bean._newBeanSimple(ZovaJsx, false, this.formProvider.components, jsxCelEnv);
			this.jsxCelScope = this._prepareJsxCelScope();
			this.jsxRenderContext = {
				app: this.app,
				ctx: this.ctx,
				$scene: "pageEntry",
				$host: this,
				$celScope: this.jsxCelScope,
				$jsx: this.jsxZova,
				$$pageEntry: this
			};
		}
		_prepareJsxCelScope() {
			var _this$entryId;
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
				id: (_this$entryId = this.entryId) !== null && _this$entryId !== void 0 ? _this$entryId : null,
				permissions
			};
		}
		submitData(data) {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				const mutationSubmit = _this2.$$modelResource.getFormMutationSubmit(_this2.formMeta, _this2.entryId);
				_this2.entryIdCreated = yield mutationSubmit === null || mutationSubmit === void 0 ? void 0 : mutationSubmit.mutateAsync(data.value);
				_this2.setPageMeta(data.value, false);
			})();
		}
		setPageMeta(data, pageDirty) {
			if (!this.$pageRoute) return;
			const pageTitle = data === null || data === void 0 ? void 0 : data[this.$props.pageTitleKey];
			this.$router.setPageMeta(this.$pageRoute, {
				pageTitle,
				pageDirty,
				formMeta: this.formMeta
			});
		}
		render() {
			if (!this.formData) return createVNode("div", null, [this.scope.locale.EntryNotExist()]);
			return createVNode("div", { "class": this.$props.class }, [this._renderFormWrapper()]);
		}
		_renderFormWrapper() {
			return createVNode("form", { "onSubmit": (e) => {
				var _this$formRef;
				e.preventDefault();
				e.stopPropagation();
				(_this$formRef = this.formRef) === null || _this$formRef === void 0 || _this$formRef.submit();
			} }, [this._renderBlocks(), createVNode("button", {
				"type": "submit",
				"style": { display: "none" }
			}, null)]);
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
	}, _ControllerBlockPageEntry.$propsDefault = { pageTitleKey: "name" }, _ControllerBlockPageEntry.$componentOptions = {
		inheritAttrs: false,
		deepExtendDefault: true
	}, _ControllerBlockPageEntry)) || _class$2) || _class$2);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockToolbarRow/controller.tsx
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
var _dec$1, _dec2$1, _dec3, _dec4, _class$1, _class2, _descriptor, _ControllerBlockToolbarRow, ControllerBlockToolbarRow;
var init_controller = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	ControllerBlockToolbarRow = (_dec$1 = Controller(), _dec2$1 = BeanInfo({ module: "basic-pageentry" }), _dec3 = Use({ injectionScope: "host" }), _dec4 = Reflect.metadata("design:type", typeof IJsxRenderContextPageEntry === "undefined" ? Object : IJsxRenderContextPageEntry), _dec$1(_class$1 = _dec2$1(_class$1 = (_class2 = (_ControllerBlockToolbarRow = class ControllerBlockToolbarRow extends BeanControllerBase {
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
				if (!this._checkFormScene(permissionHint)) return;
				if (!this.$passport.checkPermission(this.permissions, actionName, permissionHint)) return;
				const options = Object.assign({ key: index }, action.options);
				const domAction = $jsx.render(action.render, options, $celScope, this.$$renderContext);
				if (!domAction) return;
				if (Array.isArray(domAction)) domActions.push(...domAction);
				else domActions.push(domAction);
			});
			return domActions;
		}
		_checkFormScene(permissionHint) {
			const { $$pageEntry } = this.$$renderContext;
			const formScene = $$pageEntry.formMeta.formScene;
			const formSceneHint = permissionHint === null || permissionHint === void 0 ? void 0 : permissionHint.formScene;
			if (!formSceneHint) return true;
			if (Array.isArray(formSceneHint) && formSceneHint.includes(formScene)) return true;
			if (formSceneHint === formScene) return true;
			return false;
		}
	}, _ControllerBlockToolbarRow.$propsDefault = {}, _ControllerBlockToolbarRow.$componentOptions = {
		inheritAttrs: false,
		deepExtendDefault: true
	}, _ControllerBlockToolbarRow), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "$$renderContext", [_dec3, _dec4], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2)) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-pageentry/src/.metadata/component/blockForm.ts
var ZBlockForm;
var init_blockForm = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller$2();
	ZBlockForm = defineComponent((_props) => {
		useController(ControllerBlockForm, void 0, void 0);
		return () => {};
	}, prepareComponentOptions(ControllerBlockForm.$componentOptions));
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-pageentry/src/.metadata/component/blockPageEntry.ts
var ZBlockPageEntry;
var init_blockPageEntry = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller$1();
	ZBlockPageEntry = defineComponent((_props) => {
		useController(ControllerBlockPageEntry, void 0, void 0);
		return () => {};
	}, prepareComponentOptions(ControllerBlockPageEntry.$componentOptions));
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-pageentry/src/.metadata/component/blockToolbarRow.ts
var ZBlockToolbarRow;
var init_blockToolbarRow = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller();
	ZBlockToolbarRow = defineComponent((_props) => {
		useController(ControllerBlockToolbarRow, void 0, void 0);
		return () => {};
	}, prepareComponentOptions(ControllerBlockToolbarRow.$componentOptions));
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-pageentry/src/.metadata/index.ts
/** components: end */
/** locale: begin */
/** locale: end */
/** scope: begin */
function locale(key) {
	return `basic-pageentry::${key}`;
}
var _dec, _dec2, _class, components, ScopeModuleBasicPageentry;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_controller$2();
	init_controller$1();
	init_controller();
	init_blockForm();
	init_blockForm();
	init_blockPageEntry();
	init_blockPageEntry();
	init_blockToolbarRow();
	init_blockToolbarRow();
	init_src$2();
	components = {
		"blockForm": ZBlockForm,
		"blockPageEntry": ZBlockPageEntry,
		"blockToolbarRow": ZBlockToolbarRow
	};
	ScopeModuleBasicPageentry = (_dec = Scope(), _dec2 = BeanInfo({ module: "basic-pageentry" }), _dec(_class = _dec2(_class = class ScopeModuleBasicPageentry extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite/cabloy-basic/modules/basic-pageentry/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	$useLocale: () => $useLocale,
	ControllerBlockForm: () => ControllerBlockForm,
	ControllerBlockPageEntry: () => ControllerBlockPageEntry,
	ControllerBlockToolbarRow: () => ControllerBlockToolbarRow,
	ScopeModuleBasicPageentry: () => ScopeModuleBasicPageentry,
	ZBlockForm: () => ZBlockForm,
	ZBlockPageEntry: () => ZBlockPageEntry,
	ZBlockToolbarRow: () => ZBlockToolbarRow,
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
