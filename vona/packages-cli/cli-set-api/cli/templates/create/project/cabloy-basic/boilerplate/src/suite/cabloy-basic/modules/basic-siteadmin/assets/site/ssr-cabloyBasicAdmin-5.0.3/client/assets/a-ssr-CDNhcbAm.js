import { n as __esmMin } from "./rolldown-runtime-lkMnaVCm.js";
import { H as normalizeClass, U as normalizeStyle, a as includeBooleanAttr, c as isString, l as stringifyStyle, o as init_shared_esm_bundler, s as isBooleanAttr } from "./vue-CvF_GLFp.js";
import { h as ref } from "./vue-CeNp4lbs.js";
import { S as onDeactivated, b as onActivated, k as watch, o as computed, w as onUnmounted } from "./vue-t5FcxkD3.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
import { M as extend, N as init_dist } from "./zova-BE4e4PxD.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { K as cast, U as BeanSimple, j as BeanBase, k as BeanInfo, m as BeanScopeBase } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { d as Sys, i as Scope, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { i as init_defu, n as uneval, r as defu, t as init_devalue } from "./src-D42w_OAV.js";
//#region src/suite-vendor/a-zova/modules/a-ssr/src/bean/sys.ssrState.ts
var _dec$1, _dec2$1, _class$1, SymbolSSRState$1, SymbolSSRStateDefer, SysSsrState;
var init_sys_ssrState = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	SymbolSSRState$1 = Symbol("SymbolSSRState");
	SymbolSSRStateDefer = Symbol("SymbolSSRStateDefer");
	SysSsrState = (_dec$1 = Sys(), _dec2$1 = BeanInfo({ module: "a-ssr" }), _dec$1(_class$1 = _dec2$1(_class$1 = class SysSsrState extends BeanBase {
		constructor(...args) {
			super(...args);
			this[SymbolSSRState$1] = void 0;
			this[SymbolSSRStateDefer] = void 0;
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				if (cast(window).__INITIAL_STATE__) {
					var _document$getElementB;
					_this[SymbolSSRState$1] = cast(window).__INITIAL_STATE__;
					delete cast(window).__INITIAL_STATE__;
					(_document$getElementB = document.getElementById("ssr-state-init")) === null || _document$getElementB === void 0 || _document$getElementB.remove();
				} else _this[SymbolSSRState$1] = {};
				if (cast(window).__INITIAL_STATE_DEFER__) {
					var _document$getElementB2;
					_this[SymbolSSRStateDefer] = cast(window).__INITIAL_STATE_DEFER__;
					delete cast(window).__INITIAL_STATE_DEFER__;
					(_document$getElementB2 = document.getElementById("ssr-state-defer-init")) === null || _document$getElementB2 === void 0 || _document$getElementB2.remove();
				} else _this[SymbolSSRStateDefer] = {};
			})();
		}
		get state() {
			return this[SymbolSSRState$1];
		}
		get stateDefer() {
			return this[SymbolSSRStateDefer];
		}
	}) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-ssr/src/config/config.ts
function _normalizeExpires(expires) {
	if (!expires) return 0;
	if (!Number.isNaN(Number(expires))) return Number(expires);
	return expires;
}
var config;
var init_config$1 = __esmMin((() => {
	config = (sys) => {
		return {
			cookieThemeDarkDefault: sys.env.SSR_COOKIE_THEMEDARK_DEFAULT === "true",
			optimization: { bodyReadyObserver: sys.env.SSR_BODYREADYOBSERVER === "true" },
			transferCache: sys.env.SSR_TRANSFERCACHE === "false" ? false : { expires: _normalizeExpires(sys.env.SSR_TRANSFERCACHE_EXPIRES) }
		};
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-ssr/src/lib/useMeta.ts
function useMeta(ctx, metaOptions) {
	{
		const meta = { active: true };
		if (typeof metaOptions === "function") {
			const content = computed(metaOptions);
			meta.val = content.value;
			watch(content, (val) => {
				meta.val = val;
				meta.active === true && ctx.meta.$ssr.metaStore.planClientUpdate();
			});
		} else meta.val = metaOptions;
		ctx.meta.$ssr.metaStore.addMetaOptions(meta);
		ctx.meta.$ssr.metaStore.planClientUpdate();
		onActivated(() => {
			try {
				meta.active = true;
				ctx.meta.$ssr.metaStore.planClientUpdate();
			} catch (_err) {}
		});
		onDeactivated(() => {
			try {
				meta.active = false;
				ctx.meta.$ssr.metaStore.planClientUpdate();
			} catch (_err) {}
		});
		onUnmounted(() => {
			try {
				ctx.meta.$ssr.metaStore.removeMetaOptions(meta);
				ctx.meta.$ssr.metaStore.planClientUpdate();
			} catch (_err) {}
		});
	}
}
var init_useMeta = __esmMin((() => {
	init_vue_runtime_esm_bundler();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-ssr/src/monkey.ts
var Monkey;
var init_monkey = __esmMin((() => {
	init_src$1();
	init_useMeta();
	init_asyncToGenerator();
	Monkey = class extends BeanSimple {
		appContextInitialize(ctx) {
			ctx.meta.$ssr = ctx.app.ctx.meta.$ssr;
		}
		appInitialize() {
			return _asyncToGenerator(function* () {})();
		}
		moduleLoading(_module) {
			return _asyncToGenerator(function* () {})();
		}
		moduleLoaded(module) {
			return _asyncToGenerator(function* () {})();
		}
		beanInit(bean, beanInstance) {
			var _this3 = this;
			return _asyncToGenerator(function* () {
				const self = _this3;
				bean.defineProperty(beanInstance, "$ssr", {
					enumerable: false,
					configurable: true,
					get() {
						return self.app.ctx.meta.$ssr;
					}
				});
				bean.defineProperty(beanInstance, "$useMeta", {
					enumerable: false,
					configurable: true,
					get() {
						return function(options) {
							const ctx = cast(this).ctx;
							ctx.util.instanceScope(() => {
								useMeta(ctx, options);
							});
						};
					}
				});
			})();
		}
		_ssrErrorHandler() {}
		_errorHandlerDefaultServer(err) {
			return err;
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-ssr/src/lib/utils.ts
function unevalPatch(value) {
	return uneval(value);
}
var init_utils = __esmMin((() => {
	init_devalue();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-ssr/src/lib/ssrMetaStore.ts
function normalize(meta) {
	if (meta.title) {
		meta.title = meta.titleTemplate ? meta.titleTemplate(meta.title) : meta.title;
		delete meta.titleTemplate;
	}
	[["meta", "content"], ["link", "href"]].forEach((type) => {
		const metaType = meta[type[0]];
		const metaProp = type[1];
		for (const name in metaType) {
			const metaLink = metaType[name];
			if (metaLink.template) if (Object.keys(metaLink).length === 1) delete metaType[name];
			else {
				metaLink[metaProp] = metaLink.template(metaLink[metaProp] || "");
				delete metaLink.template;
			}
		}
	});
}
function changed(old, def) {
	if (Object.keys(old).length !== Object.keys(def).length) return true;
	for (const key in old) if (old[key] !== def[key]) return true;
}
function bodyFilter(name) {
	return ["class", "style"].includes(name) === false;
}
function htmlFilter(_name) {
	return true;
}
function diff(meta, other) {
	const add = {};
	const remove = {};
	if (meta === void 0) return {
		add: other,
		remove
	};
	if (meta.title !== other.title) add.title = other.title;
	[
		"meta",
		"link",
		"script",
		"htmlAttr",
		"bodyAttr"
	].forEach((type) => {
		const old = meta[type];
		const cur = other[type];
		remove[type] = [];
		if (old === void 0 || old === null) {
			add[type] = cur;
			return;
		}
		add[type] = {};
		for (const key in old) if (Object.prototype.hasOwnProperty.call(cur, key) === false) remove[type].push(key);
		for (const key in cur) if (Object.prototype.hasOwnProperty.call(old, key) === false) add[type][key] = cur[key];
		else if (changed(old[key], cur[key]) === true) {
			remove[type].push(key);
			add[type][key] = cur[key];
		}
	});
	return {
		add,
		remove
	};
}
function apply({ add, remove }) {
	if (add.title) document.title = add.title;
	if (Object.keys(remove).length !== 0) {
		[
			"meta",
			"link",
			"script"
		].forEach((type) => {
			remove[type].forEach((name) => {
				var _document$head$queryS;
				(_document$head$queryS = document.head.querySelector(`${type}[data-qmeta="${name}"]`)) === null || _document$head$queryS === void 0 || _document$head$queryS.remove();
			});
		});
		remove.htmlAttr.filter(htmlFilter).forEach((name) => {
			document.documentElement.removeAttribute(name);
		});
		remove.bodyAttr.filter(bodyFilter).forEach((name) => {
			document.body.removeAttribute(name);
		});
	}
	[
		"meta",
		"link",
		"script"
	].forEach((type) => {
		const metaType = add[type];
		for (const name in metaType) {
			const tag = document.createElement(type);
			for (const att in metaType[name]) if (att !== "innerHTML") tag.setAttribute(att, metaType[name][att]);
			tag.setAttribute("data-qmeta", name);
			if (type === "script") tag.innerHTML = metaType[name].innerHTML || "";
			document.head.appendChild(tag);
		}
	});
	Object.keys(add.htmlAttr).filter(htmlFilter).forEach((name) => {
		document.documentElement.setAttribute(name, add.htmlAttr[name] || "");
	});
	Object.keys(add.bodyAttr).filter(bodyFilter).forEach((name) => {
		document.body.setAttribute(name, add.bodyAttr[name] || "");
	});
}
function getAttr(seed) {
	return (att) => {
		const val = seed[att];
		return att + (val !== true && val !== void 0 ? `="${val}"` : "");
	};
}
function getHead(meta) {
	let output = "";
	if (meta.title) output += `<title>${meta.title}</title>`;
	[
		"meta",
		"link",
		"script"
	].forEach((type) => {
		const metaType = meta[type];
		for (const att in metaType) {
			const attrs = Object.keys(metaType[att]).filter((att) => att !== "innerHTML").map(getAttr(metaType[att]));
			output += `<${type} ${attrs.join(" ")} data-qmeta="${att}">`;
			if (type === "script") output += `${metaType[att].innerHTML || ""}<\/script>`;
		}
	});
	return output;
}
var CtxSSRMetaStore;
var init_ssrMetaStore = __esmMin((() => {
	init_dist();
	init_src$1();
	init_utils();
	CtxSSRMetaStore = class extends BeanSimple {
		constructor(...args) {
			super(...args);
			this._updateId = 0;
			this._currentClientMeta = void 0;
			this._clientList = [];
		}
		__init__() {
			if (this.ctx.meta.$ssr.isRuntimeSsrPreHydration) {
				var _document$getElementB;
				this._currentClientMeta = cast(window).__Q_META__;
				(_document$getElementB = document.getElementById("ssr-meta-init")) === null || _document$getElementB === void 0 || _document$getElementB.remove();
			}
		}
		_onRenderedLast(err) {
			if (!err) {
				const ssrContext = this.ctx.meta.$ssr.context;
				this._injectContextState(ssrContext);
				this._injectContextStateDefer(ssrContext);
				this._injectServerMeta(ssrContext);
			}
			this.app.close();
		}
		addMetaOptions(metaOptionsWrapper) {
			this._clientList.push(metaOptionsWrapper);
		}
		removeMetaOptions(metaOptionsWrapper) {
			this._clientList.splice(this._clientList.indexOf(metaOptionsWrapper), 1);
		}
		planClientUpdate() {
			if (this._updateId !== 0) clearTimeout(this._updateId);
			this._updateId = window.setTimeout(() => {
				this._updateId = 0;
				this._updateClientMeta();
			}, 50);
		}
		_updateClientMeta() {
			const data = {
				title: "",
				titleTemplate: void 0,
				meta: {},
				link: {},
				script: {},
				htmlAttr: {},
				bodyAttr: {}
			};
			for (let i = 0; i < this._clientList.length; i++) {
				const { active, val } = this._clientList[i];
				if (active === true) extend(true, data, val);
			}
			normalize(data);
			apply(diff(this._currentClientMeta, data));
			this._currentClientMeta = data;
		}
		_injectServerMeta(ssrContext) {
			const data = {
				title: "",
				titleTemplate: void 0,
				meta: {},
				link: {},
				htmlAttr: {},
				bodyAttr: {},
				bodyStyle: {},
				bodyClass: {},
				noscript: {}
			};
			const list = ssrContext.__qMetaList;
			for (let i = 0; i < list.length; i++) extend(true, data, list[i]);
			normalize(data);
			const nonce = ssrContext.nonce !== void 0 ? ` nonce="${ssrContext.nonce}"` : "";
			const ctx = ssrContext._meta;
			const htmlAttr = Object.keys(data.htmlAttr).filter(htmlFilter);
			if (htmlAttr.length !== 0) ctx.htmlAttrs += (ctx.htmlAttrs.length !== 0 ? " " : "") + htmlAttr.map(getAttr(data.htmlAttr)).join(" ");
			ctx.headTags += getHead(data);
			const bodyAttr = Object.keys(data.bodyAttr).filter(bodyFilter);
			if (bodyAttr.length !== 0) ctx.bodyAttrs += (ctx.bodyAttrs.length !== 0 ? " " : "") + bodyAttr.map(getAttr(data.bodyAttr)).join(" ");
			const bodyStyle = Object.keys(data.bodyStyle).filter((name) => !!data.bodyStyle[name]).map((name) => `${name}:${data.bodyStyle[name]};`).join("");
			if (bodyStyle) ctx.bodyAttrs += `${ctx.bodyAttrs.length !== 0 ? " " : ""}style="${bodyStyle}"`;
			const _bodyClass = ctx.bodyClasses.split(" ").filter((item) => !!item);
			const bodyClass = {};
			_bodyClass.forEach((item) => bodyClass[item] = true);
			extend(true, bodyClass, data.bodyClass);
			ctx.bodyClasses = Object.keys(bodyClass).filter((name) => bodyClass[name]).map((name) => name).join(" ");
			data.title = "'\"`";
			ctx.endingHeadTags += `${Object.keys(data.noscript).map((name) => `<noscript data-qmeta="${name}">${data.noscript[name]}</noscript>`).join("")}<script${nonce} id="ssr-meta-init">window.__Q_META__=${delete data.bodyStyle && delete data.bodyClass && delete data.noscript && unevalPatch(data)}<\/script>`;
			let ssr_local_themedark = this.sys.config.ssr.cookie ? `let ssr_cookie_themedark=document.cookie.split('; ')?.find(item=>item.indexOf('themedark=')>-1)?.split('=')[1];
        ssr_cookie_themedark=ssr_cookie_themedark==='true'?true:ssr_cookie_themedark==='false'?false:${this.sys.env.SSR_COOKIE_THEMEDARK_DEFAULT};
        window.ssr_themedark=window.ssr_cookie_themedark=ssr_cookie_themedark;` : `let ssr_local_themedark=window.ssr_load_local('themedark');
        if(ssr_local_themedark===undefined || ssr_local_themedark==='auto'){
          ssr_local_themedark=window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        window.ssr_themedark=window.ssr_local_themedark=ssr_local_themedark;`;
			ssr_local_themedark += `Object.defineProperty(window, 'ssr_themedark_data', {
          get: () => {
            let _data=document.body.getAttribute('data-ssr-theme-dark-'+window.ssr_themedark);
            if(_data===undefined || _data===null){
              _data=window.__INITIAL_STATE__ && window.__INITIAL_STATE__['data-ssr-theme-dark-'+window.ssr_themedark];
            }
            return _data;
          },
        });`;
			const ssr_local_themename = this.sys.config.ssr.cookie ? "" : "window.ssr_local_themename=window.ssr_load_local('themename');";
			ctx.endingHeadTags += `<script id="ssr-prefers-color-schema-dark">
        window.ssr_load_local=function(key){
          const __ssr_local=localStorage.getItem(key);
          return __ssr_local?JSON.parse(__ssr_local):undefined;
        };
        ${ssr_local_themedark}
        ${ssr_local_themename}
        document.querySelector('#ssr-prefers-color-schema-dark').remove();
    <\/script>`.replaceAll("\n", "");
			if (this.sys.env.SSR_BODYREADYOBSERVER === "true") ctx.bodyTags += `<script id="ssr-body-ready-observer">
        window.ssr_bodyReadyObserverClear=()=>{
          if(window.ssr_bodyReadyObserver){
            window.ssr_body_ready_condition=undefined;
            window.ssr_body_ready_callback=undefined;
            window.ssr_bodyReadyObserver.disconnect();
            window.ssr_bodyReadyObserver=undefined;
            document.body.style.display='block';
            document.querySelector('#ssr-body-ready-observer').remove();
          }
        };
        window.ssr_bodyReadyObserver = new MutationObserver(() => {
          if(window.ssr_body_ready_condition && window.ssr_body_ready_condition()){
            window.ssr_body_ready_callback();
            window.ssr_bodyReadyObserverClear();
          }
        });
        window.ssr_bodyReadyObserver.observe(document.body, {
          subtree: true,
          childList: true,
        });
        document.addEventListener("DOMContentLoaded", () => {
          window.ssr_bodyReadyObserverClear();
        });
      <\/script>`.replaceAll("\n", "");
		}
		_injectContextState(ssrContext) {
			const ctx = ssrContext._meta;
			const nonce = ssrContext.nonce !== void 0 ? ` nonce="${ssrContext.nonce}"` : "";
			ctx.endingHeadTags += `<script${nonce} id="ssr-state-init">window.__INITIAL_STATE__=${unevalPatch(ssrContext.state)}<\/script>`;
		}
		_injectContextStateDefer(ssrContext) {
			const ctx = ssrContext._meta;
			const nonce = ssrContext.nonce !== void 0 ? ` nonce="${ssrContext.nonce}"` : "";
			ctx.endingBodyTags += `<script${nonce} id="ssr-state-defer-init">window.__INITIAL_STATE_DEFER__=${unevalPatch(ssrContext.stateDefer)}<\/script>`;
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-ssr/src/lib/ssr.ts
var SymbolIsRuntimeSsrPreHydration, SymbolSSRContext, SymbolSSRState, SymbolOnHydrateds, SymbolOnHydratePropHasMismatches, SymbolInstanceUpdates, SymbolHydratingCounter, CtxSSR;
var init_ssr$1 = __esmMin((() => {
	init_shared_esm_bundler();
	init_defu();
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_ssrMetaStore();
	SymbolIsRuntimeSsrPreHydration = Symbol("SymbolIsRuntimeSsrPreHydration");
	SymbolSSRContext = Symbol("SymbolSSRContext");
	SymbolSSRState = Symbol("SymbolSSRState");
	SymbolOnHydrateds = Symbol("SymbolOnHydrateds");
	SymbolOnHydratePropHasMismatches = Symbol("SymbolOnHydratePropHasMismatches");
	SymbolInstanceUpdates = Symbol("SymbolInstanceUpdates");
	SymbolHydratingCounter = Symbol("SymbolHydratingCounter");
	CtxSSR = class extends BeanSimple {
		constructor(...args) {
			super(...args);
			this[SymbolIsRuntimeSsrPreHydration] = ref(false);
			this[SymbolSSRContext] = void 0;
			this[SymbolSSRState] = void 0;
			this[SymbolOnHydrateds] = [];
			this[SymbolOnHydratePropHasMismatches] = [];
			this[SymbolInstanceUpdates] = [];
			this[SymbolHydratingCounter] = 0;
			this.metaStore = void 0;
		}
		/** @internal */
		initialize() {
			this[SymbolSSRState] = this.sys.bean._getBeanSyncOnly("a-ssr.sys.ssrState");
			if (document.body.getAttribute("data-server-rendered") !== null) this[SymbolIsRuntimeSsrPreHydration].value = true;
			if (this.isRuntimeSsrPreHydration) this.onHydratePropHasMismatch((el, key, clientValue, vnode, instance) => {
				return this._onHydratePropHasMismatchDefault(el, key, clientValue, vnode, instance);
			});
			this.metaStore = this.bean._newBeanSimple(CtxSSRMetaStore, false);
			if (this.isRuntimeSsrPreHydration) this.onHydrated(() => {
				document.querySelectorAll("style[vite-css-module-id]").forEach((node) => node.remove());
			});
		}
		get isRuntimeSsrPreHydration() {
			return this[SymbolIsRuntimeSsrPreHydration].value;
		}
		set isRuntimeSsrPreHydration(value) {
			this[SymbolIsRuntimeSsrPreHydration].value = value;
		}
		get context() {
			throw new Error("cannot called in client");
		}
		get state() {
			return this[SymbolSSRState].state;
		}
		get stateDefer() {
			return this[SymbolSSRState].stateDefer;
		}
		get renderSSRError() {
			return this.context._meta.renderError;
		}
		set renderSSRError(err) {
			this.context._meta.renderError = err;
		}
		getPerformAction(baseURL) {}
		_initContext() {
			const ssrContext = this[SymbolSSRContext];
			ssrContext._meta = defu(ssrContext._meta, {
				htmlAttrs: "",
				headTags: "",
				endingHeadTags: "",
				bodyClasses: "",
				bodyAttrs: "data-server-rendered",
				bodyTags: "",
				endingBodyTags: "",
				baseUrl: this.sys.util.getAbsoluteUrlFromPagePath(void 0, false, true)
			});
			ssrContext.state = ssrContext.state || {};
			ssrContext.stateDefer = ssrContext.stateDefer || {};
		}
		onHydrated(fn) {
			this[SymbolOnHydrateds].push(fn);
		}
		onHydratePropHasMismatch(fn) {
			this[SymbolOnHydratePropHasMismatches].push(fn);
		}
		handleDirectOrOnHydrated(fn) {
			if (this.isRuntimeSsrPreHydration) this.onHydrated(fn);
			else return fn();
		}
		_onHydratePropHasMismatchDefault(el, key, clientValue, _vnode, _instance) {
			let ignore = false;
			let expected;
			if (key === "class") {
				ignore = true;
				if (clientValue !== void 0) {
					expected = normalizeClass(clientValue);
					el.setAttribute(key, expected);
				}
			} else if (key === "style") {
				ignore = true;
				if (clientValue !== void 0) {
					expected = isString(clientValue) ? clientValue : stringifyStyle(normalizeStyle(clientValue));
					el.setAttribute(key, expected);
				}
			} else if ([
				"id",
				"name",
				"for",
				"d"
			].includes(key)) {
				ignore = true;
				if (clientValue !== void 0) {
					expected = String(clientValue);
					el.setAttribute(key, expected);
				}
			} else if (key === "value") {
				ignore = true;
				if (clientValue !== void 0) {
					expected = String(clientValue);
					if (el.tagName === "TEXTAREA") el.value = expected;
					else el.setAttribute(key, expected);
				}
			} else if (isBooleanAttr(key)) {
				ignore = true;
				if (clientValue !== void 0) if (includeBooleanAttr(clientValue)) el.setAttribute(key, "");
				else el.removeAttribute(key);
			} else if (el.getAttribute(`data-hydrate-ignore-${key}`) !== null) {
				ignore = true;
				if (clientValue !== void 0) {
					expected = String(clientValue);
					el.setAttribute(key, expected);
				}
			}
			if (!ignore) return { clientValue };
			return { ignore: true };
		}
		_hydrated() {
			if (!this.isRuntimeSsrPreHydration) return;
			this.isRuntimeSsrPreHydration = false;
			this[SymbolInstanceUpdates].forEach((instance) => {
				if (!instance.isUnmounted && instance.zova) try {
					instance.update();
				} catch (err) {
					if (!err.message.includes("'insertBefore'")) throw err;
				}
			});
			this[SymbolInstanceUpdates] = [];
			this[SymbolOnHydrateds].forEach((fn) => fn());
			this[SymbolOnHydrateds] = [];
			this[SymbolOnHydratePropHasMismatches] = [];
		}
		/** @internal */
		_hydratePropHasMismatch(el, key, clientValue, vnode, instance) {
			for (const fn of this[SymbolOnHydratePropHasMismatches]) {
				const res = fn(el, key, clientValue, vnode, instance);
				if (res.ignore) return res;
				clientValue = res.clientValue;
			}
			return {
				ignore: false,
				clientValue
			};
		}
		/** @internal */
		_hydratingInc() {
			++this[SymbolHydratingCounter];
		}
		/** @internal */
		_hydratingDec() {
			if (--this[SymbolHydratingCounter] === 0) this._hydrated();
		}
		/** @internal */
		_hydratingInstanceRecord(instance) {
			if (!this[SymbolInstanceUpdates].includes(instance)) {
				this[SymbolInstanceUpdates].push(instance);
				return true;
			}
			return false;
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-ssr/src/monkeySys.ts
var MonkeySys;
var init_monkeySys = __esmMin((() => {
	init_src$1();
	init_ssr$1();
	init_asyncToGenerator();
	MonkeySys = class extends BeanSimple {
		constructor(moduleSelf) {
			super();
			this._moduleSelf = void 0;
			this._sysSsrState = void 0;
			this._moduleSelf = moduleSelf;
		}
		getSysSsrState() {
			var _this = this;
			return _asyncToGenerator(function* () {
				if (!_this._sysSsrState) _this._sysSsrState = yield _this.bean._getBean("a-ssr.sys.ssrState", false);
				return _this._sysSsrState;
			})();
		}
		moduleLoading(module) {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				if (_this2._moduleSelf === module) return;
				yield _this2.getSysSsrState();
			})();
		}
		moduleLoaded(_module) {
			return _asyncToGenerator(function* () {})();
		}
		configLoaded(_module, _config) {
			return _asyncToGenerator(function* () {})();
		}
		sysContextInitialize(ctx) {
			ctx.meta.$ssr = ctx.bean._newBeanSimple(CtxSSR, false);
			ctx.meta.$ssr.initialize();
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-ssr/src/.metadata/index.ts
/** monkeySys: end */
/** scope: begin */
var _dec, _dec2, _class, ScopeModuleASsr;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_sys_ssrState();
	init_config$1();
	init_monkey();
	init_monkeySys();
	init_src$2();
	ScopeModuleASsr = (_dec = Scope(), _dec2 = BeanInfo({ module: "a-ssr" }), _dec(_class = _dec2(_class = class ScopeModuleASsr extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite-vendor/a-zova/modules/a-ssr/src/lib/index.ts
var init_lib = __esmMin((() => {
	init_ssr$1();
	init_ssrMetaStore();
	init_utils();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-ssr/src/types/config.ts
var init_config = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-ssr/src/types/ssr.ts
var init_ssr = __esmMin((() => {
	init_src$1();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-ssr/src/types/index.ts
var init_types = __esmMin((() => {
	init_config();
	init_ssr();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-ssr/src/index.ts
var init_src = __esmMin((() => {
	init__metadata();
	init_lib();
	init_types();
}));
//#endregion
export { CtxSSRMetaStore as a, config as c, CtxSSR as i, SysSsrState as l, ScopeModuleASsr as n, unevalPatch as o, MonkeySys as r, Monkey as s, init_src as t };
