import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { h as ref, p as reactive } from "./vue-CeNp4lbs.js";
import { A as watchEffect, d as defineComponent, l as createVNode } from "./vue-t5FcxkD3.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { L as convertToUnit, P as StateLock, U as BeanSimple, V as isHttpUrl, b as BeanControllerBase, c as prepareComponentOptions, f as sys, j as BeanBase, k as BeanInfo, l as useController, m as BeanScopeBase, w as Use } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { d as Sys, f as Tool, i as Scope, s as Controller, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
//#region src/suite-vendor/a-zova/modules/a-icon/src/lib/iconGroup.ts
var IconGroup;
var init_iconGroup = __esmMin((() => {
	init_src$1();
	IconGroup = class {
		constructor() {
			this.svg = void 0;
			this.loaded = void 0;
			this.loaded = StateLock.create();
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-icon/src/bean/sys.icon.ts
var _dec$3, _dec2$3, _class$3, XMLNS, XMLNS_LINK, SysIcon;
var init_sys_icon = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_vue_runtime_esm_bundler();
	init_src$2();
	init_iconGroup();
	XMLNS = "http://www.w3.org/2000/svg";
	XMLNS_LINK = "http://www.w3.org/1999/xlink";
	SysIcon = (_dec$3 = Sys(), _dec2$3 = BeanInfo({ module: "a-icon" }), _dec$3(_class$3 = _dec2$3(_class$3 = class SysIcon extends BeanBase {
		constructor(...args) {
			super(...args);
			this._iconSymbols = reactive({});
			this._iconMoudles = {};
		}
		parseIconInfoSync(iconName) {
			const meta = this.parseIconMeta(iconName);
			if (!meta) return void 0;
			const iconEmpty = {
				meta,
				symbolId: ""
			};
			const iconOk = {
				meta,
				symbolId: meta.symbolId
			};
			if (this._iconSymbols[meta.fullName]) return iconOk;
			if (document.getElementById(meta.symbolId)) return iconOk;
			if (this._iconSymbols[meta.fullName] === void 0) {
				this.parseIconInfo(iconName);
				return iconEmpty;
			} else if (this._iconSymbols[meta.fullName] === "") return iconEmpty;
		}
		parseIconInfo(iconName) {
			var _this = this;
			return _asyncToGenerator(function* () {
				const meta = _this.parseIconMeta(iconName);
				if (!meta) return void 0;
				if (_this._iconSymbols[meta.fullName]) return {
					meta,
					symbolId: _this._iconSymbols[meta.fullName]
				};
				_this._iconSymbols[meta.fullName] = "";
				if (!(yield _this.parseIconGroup(meta.module, meta.group))) return void 0;
				_this._injectIconClient(meta);
				return {
					meta,
					symbolId: _this._iconSymbols[meta.fullName] = meta.symbolId
				};
			})();
		}
		parseIconGroup(moduleName, groupName) {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				const iconModule = _this2.getIconModule(moduleName);
				if (iconModule[groupName]) {
					yield iconModule[groupName].loaded.wait();
					return iconModule[groupName].svg;
				}
				iconModule[groupName] = new IconGroup();
				const svg = yield _this2._parseIconGroupInner(moduleName, groupName);
				iconModule[groupName].svg = svg;
				iconModule[groupName].loaded.touch();
				return iconModule[groupName].svg;
			})();
		}
		_parseIconGroupInner(moduleName, groupName) {
			var _this3 = this;
			return _asyncToGenerator(function* () {
				const module = yield _this3.sys.meta.module.use(moduleName);
				if (!module) return;
				let groupUrl = module.resource.icons[groupName];
				if (!groupUrl) return;
				if (groupUrl.startsWith("data:image/svg+xml")) throw new Error("inline svg not supported");
				let svg;
				{
					const res = yield fetch(groupUrl);
					if (!res.ok) return;
					svg = yield res.text();
				}
				return svg;
			})();
		}
		_injectIconClient(meta) {
			const iconGroup = this.getIconModule(meta.module)[meta.group];
			let domContainer = document.getElementById("zova-svg-container");
			if (!domContainer) {
				domContainer = document.createElement("div");
				domContainer.style.position = "absolute";
				domContainer.style.width = "0";
				domContainer.style.height = "0";
				domContainer.style.display = "none";
				domContainer.id = "zova-svg-container";
				document.body.appendChild(domContainer);
			}
			let domModule = document.getElementById(`zova-svg-module-${meta.module}`);
			if (!domModule) {
				domModule = document.createElement("div");
				domModule.id = `zova-svg-module-${meta.module}`;
				domContainer.appendChild(domModule);
			}
			let domGroup = document.getElementById(`zova-svg-group-${meta.module}-${meta.group}`);
			if (!domGroup) {
				domGroup = document.createElementNS(XMLNS, "svg");
				domGroup.id = `zova-svg-group-${meta.module}-${meta.group}`;
				domGroup.setAttribute("xmlns", XMLNS);
				domGroup.setAttribute("xmlns:link", XMLNS_LINK);
				domModule.appendChild(domGroup);
			}
			if (!document.getElementById(meta.symbolId)) {
				const iconContent = this.extractIconContent(iconGroup.svg, meta.symbolId);
				if (iconContent) domGroup.insertAdjacentHTML("beforeend", iconContent);
			}
		}
		extractIconContent(svg, symbolId) {
			if (!svg) return void 0;
			let pos = svg.indexOf(`'${symbolId}'`);
			if (pos === -1) pos = svg.indexOf(`"${symbolId}"`);
			if (pos === -1) return void 0;
			const posB = svg.indexOf("</symbol>", pos);
			const posA = svg.lastIndexOf("<symbol", pos);
			return svg.substring(posA, posB + 9);
		}
		getIconModule(moduleName) {
			if (!this._iconMoudles[moduleName]) this._iconMoudles[moduleName] = {};
			return this._iconMoudles[moduleName];
		}
		parseIconMeta(iconName) {
			if (!iconName) return;
			const parts = iconName.split(":");
			if (parts.length !== 3) return;
			const module = parts[0] || this.scope.config.defaultModule;
			const group = parts[1] || "default";
			const name = parts[2] || "";
			if (!module.includes("-") || !name) return;
			return {
				module,
				group,
				name,
				fullName: this._getFullName(module, group, name),
				symbolId: this._getSymbolId(module, group, name)
			};
		}
		_getSymbolId(module, group, name) {
			return `zova-svg-icon-${module}-${group}-${name}`;
		}
		_getFullName(module, group, name) {
			return `${module}:${group}:${name}`;
		}
	}) || _class$3) || _class$3);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-icon/src/bean/tool.icon.ts
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
var _dec$2, _dec2$2, _dec3$1, _dec4$1, _class$2, _class2$1, _descriptor$1, ToolIcon;
var init_tool_icon = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	init_sys_icon();
	ToolIcon = (_dec$2 = Tool(), _dec2$2 = BeanInfo({ module: "a-icon" }), _dec3$1 = Use(), _dec4$1 = Reflect.metadata("design:type", typeof SysIcon === "undefined" ? Object : SysIcon), _dec$2(_class$2 = _dec2$2(_class$2 = (_class2$1 = class ToolIcon extends BeanBase {
		constructor(...args) {
			super(...args);
			this._iconSSR = {};
			_initializerDefineProperty$1(this, "$$sysIcon", _descriptor$1, this);
		}
		__init__() {
			return _asyncToGenerator(function* () {})();
		}
		parseIconInfo(iconName) {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				const iconInfo = yield _this2.$$sysIcon.parseIconInfo(iconName);
				if (!iconInfo) return iconInfo;
				_this2._injectIconSSR(iconInfo.meta);
				return iconInfo;
			})();
		}
		_onRendered() {
			this.ctx.meta.$ssr.context._meta.bodyTags += this._renderSSRContainer();
		}
		_renderSSRContainer() {
			return `<div id="zova-svg-container" style="position: absolute; width: 0px; height: 0px; display: none;">${this._renderSSRModules()}</div>`;
		}
		_renderSSRModules() {
			return Object.keys(this._iconSSR).map((moduleName) => {
				return `<div id="${`zova-svg-module-${moduleName}`}">${this._renderSSRGroups(this._iconSSR[moduleName], moduleName)}</div>`;
			}).join("");
		}
		_renderSSRGroups(iconSSRGroups, moduleName) {
			return Object.keys(iconSSRGroups).map((groupName) => {
				return `<svg id="${`zova-svg-group-${moduleName}-${groupName}`}" xmlns="http://www.w3.org/2000/svg" xmlns:link="http://www.w3.org/1999/xlink">${this._renderSSRIcons(iconSSRGroups[groupName])}</svg>`;
			}).join("");
		}
		_renderSSRIcons(iconSSRIcons) {
			return Object.keys(iconSSRIcons).map((symbolId) => {
				return iconSSRIcons[symbolId];
			}).join("");
		}
		_injectIconSSR(meta) {}
	}, _descriptor$1 = _applyDecoratedDescriptor$1(_class2$1.prototype, "$$sysIcon", [_dec3$1, _dec4$1], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2$1)) || _class$2) || _class$2);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-icon/src/lib/useZovaIcon.ts
function $getZovaIcon(iconName) {
	return sys.meta.$icon.parseIconInfoSync(iconName);
}
function $useZovaIcon(iconGetter) {
	const iconInfo = ref();
	watchEffect(() => {
		iconInfo.value = $getZovaIcon(iconGetter());
	});
	return { iconInfo };
}
var init_useZovaIcon = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-icon/src/component/icon/controller.tsx
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
var _dec$1, _dec2$1, _dec3, _dec4, _class$1, _class2, _descriptor, _ControllerIcon, ControllerIcon;
var init_controller = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	init_tool_icon();
	init_useZovaIcon();
	ControllerIcon = (_dec$1 = Controller(), _dec2$1 = BeanInfo({ module: "a-icon" }), _dec3 = Use(), _dec4 = Reflect.metadata("design:type", typeof ToolIcon === "undefined" ? Object : ToolIcon), _dec$1(_class$1 = _dec2$1(_class$1 = (_class2 = (_ControllerIcon = class ControllerIcon extends BeanControllerBase {
		constructor(...args) {
			super(...args);
			_initializerDefineProperty(this, "$$toolIcon", _descriptor, this);
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				yield _this._load();
			})();
		}
		_load() {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				const name = _this2.$props.name;
				if (name === "none" || !name) return;
				if (isHttpUrl(name)) return;
				yield _this2.$$toolIcon.parseIconInfo(name);
			})();
		}
		render() {
			var _this$$props$width, _this$$props$height;
			const width = (_this$$props$width = this.$props.width) !== null && _this$$props$width !== void 0 ? _this$$props$width : this.$props.height;
			const height = (_this$$props$height = this.$props.height) !== null && _this$$props$height !== void 0 ? _this$$props$height : this.$props.width;
			const href = this._parseHref();
			if (isHttpUrl(href) && !(href === null || href === void 0 ? void 0 : href.endsWith(".svg"))) return createVNode("img", {
				"class": "zova-icon__img",
				"style": {
					width: convertToUnit(width),
					height: convertToUnit(height)
				},
				"src": href
			}, null);
			return createVNode("svg", {
				"class": "zova-icon__svg",
				"xmlns": "http://www.w3.org/2000/svg",
				"viewBox": "0 0 24 24",
				"fill": "currentColor",
				"role": "img",
				"aria-hidden": "true",
				"style": {
					width: convertToUnit(width),
					height: convertToUnit(height),
					color: this.$props.color
				}
			}, [createVNode("use", { "xlink:href": href }, null)]);
		}
		_parseHref() {
			let href = this.$props.href;
			const name = this.$props.name;
			if (href) return href;
			if (isHttpUrl(name)) return name;
			const iconInfo = $getZovaIcon(name);
			href = `#${(iconInfo === null || iconInfo === void 0 ? void 0 : iconInfo.symbolId) || ""}`;
			return href;
		}
	}, _ControllerIcon.$propsDefault = {}, _ControllerIcon), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "$$toolIcon", [_dec3, _dec4], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2)) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-icon/src/.metadata/component/icon.ts
var ZIcon;
var init_icon$1 = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller();
	ZIcon = defineComponent((_props) => {
		useController(ControllerIcon, void 0, void 0);
		return () => {};
	}, prepareComponentOptions());
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-icon/src/config/config.ts
var config;
var init_config = __esmMin((() => {
	config = (_sys) => {
		return { defaultModule: "home-icon" };
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-icon/src/monkeySys.ts
var MonkeySys;
var init_monkeySys = __esmMin((() => {
	init_src$1();
	init_sys_icon();
	init_asyncToGenerator();
	MonkeySys = class extends BeanSimple {
		sysInitialize() {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.sys.meta.$icon = yield _this.bean._getBean(SysIcon, false);
			})();
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-icon/src/.metadata/index.ts
/** monkeySys: end */
/** scope: begin */
var _dec, _dec2, _class, components, ScopeModuleAIcon;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_sys_icon();
	init_tool_icon();
	init_controller();
	init_icon$1();
	init_icon$1();
	init_config();
	init_monkeySys();
	init_src$2();
	components = { "icon": ZIcon };
	ScopeModuleAIcon = (_dec = Scope(), _dec2 = BeanInfo({ module: "a-icon" }), _dec(_class = _dec2(_class = class ScopeModuleAIcon extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite-vendor/a-zova/modules/a-icon/src/lib/utils.ts
function $icon(name, size, color) {
	return createVNode(ZIcon, {
		name,
		color,
		width: size,
		height: size
	});
}
function $iconName(name) {
	return name;
}
var init_utils = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init__metadata();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-icon/src/lib/index.ts
var init_lib = __esmMin((() => {
	init_iconGroup();
	init_useZovaIcon();
	init_utils();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-icon/src/types/icon.ts
var init_icon = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-icon/src/types/index.ts
var init_types = __esmMin((() => {
	init_icon();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-icon/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	$getZovaIcon: () => $getZovaIcon,
	$icon: () => $icon,
	$iconName: () => $iconName,
	$useZovaIcon: () => $useZovaIcon,
	ControllerIcon: () => ControllerIcon,
	IconGroup: () => IconGroup,
	MonkeySys: () => MonkeySys,
	ScopeModuleAIcon: () => ScopeModuleAIcon,
	SysIcon: () => SysIcon,
	ToolIcon: () => ToolIcon,
	ZIcon: () => ZIcon,
	components: () => components,
	config: () => config
});
var init_src = __esmMin((() => {
	init__metadata();
	init_lib();
	init_types();
}));
//#endregion
export { $iconName as i, src_exports as n, $icon as r, init_src as t };
