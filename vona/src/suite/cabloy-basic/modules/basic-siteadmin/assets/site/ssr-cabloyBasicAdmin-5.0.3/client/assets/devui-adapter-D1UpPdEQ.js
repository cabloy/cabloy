import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { C as UseScope, U as BeanSimple, j as BeanBase, k as BeanInfo, m as BeanScopeBase } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { r as Meta, t as init_src$3 } from "./a-meta-aEcgk2xd.js";
//#region src/suite/a-devui/modules/devui-adapter/src/bean/meta.themeHandler.ts
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
var _dec$1, _dec2$1, _dec3, _dec4, _class$1, _class2, _descriptor, MetaThemeHandler;
var init_meta_themeHandler = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_src$3();
	MetaThemeHandler = (_dec$1 = Meta(), _dec2$1 = BeanInfo({ module: "devui-adapter" }), _dec3 = UseScope("a-ssr"), _dec4 = Reflect.metadata("design:type", typeof ScopeModuleASsr === "undefined" ? Object : ScopeModuleASsr), _dec$1(_class$1 = _dec2$1(_class$1 = (_class2 = class MetaThemeHandler extends BeanBase {
		constructor(...args) {
			super(...args);
			_initializerDefineProperty(this, "$$scopeSsr", _descriptor, this);
		}
		apply({ name: _name, dark, token }) {
			var _this = this;
			return _asyncToGenerator(function* () {
				const themeName = dark ? "dark" : "light";
				const colorPrimary = token.color.primary;
				{
					var _window;
					_this.$useMeta({ bodyAttr: { "data-theme": themeName } });
					const body = (_window = window) === null || _window === void 0 || (_window = _window.document) === null || _window === void 0 ? void 0 : _window.body;
					if (body) body.style.setProperty("--color-primary", colorPrimary);
				}
			})();
		}
	}, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "$$scopeSsr", [_dec3, _dec4], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2)) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite/a-devui/modules/devui-adapter/src/monkeySys.ts
var MonkeySys;
var init_monkeySys = __esmMin((() => {
	init_src$1();
	init_asyncToGenerator();
	MonkeySys = class extends BeanSimple {
		sysInitialize() {
			var _this = this;
			return _asyncToGenerator(function* () {
				const scopeStyleConfig = _this.sys.util.getModuleConfigSafe("a-style");
				if (!scopeStyleConfig.defaultThemeHandler) scopeStyleConfig.defaultThemeHandler = "devui-adapter:themeHandler";
			})();
		}
	};
}));
//#endregion
//#region src/suite/a-devui/modules/devui-adapter/src/.metadata/index.ts
/** monkeySys: end */
/** scope: begin */
var _dec, _dec2, _class, ScopeModuleDevuiAdapter;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_meta_themeHandler();
	init_src$3();
	init_monkeySys();
	init_src$2();
	ScopeModuleDevuiAdapter = (_dec = Scope(), _dec2 = BeanInfo({ module: "devui-adapter" }), _dec(_class = _dec2(_class = class ScopeModuleDevuiAdapter extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite/a-devui/modules/devui-adapter/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	MetaThemeHandler: () => MetaThemeHandler,
	MonkeySys: () => MonkeySys,
	ScopeModuleDevuiAdapter: () => ScopeModuleDevuiAdapter
});
var init_src = __esmMin((() => {
	init__metadata();
}));
//#endregion
export { src_exports as n, init_src as t };
