import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { _ as isVNode, d as defineComponent, l as createVNode, r as Fragment } from "./vue-t5FcxkD3.js";
import { i as withModifiers } from "./vue-B9B_nSUQ.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
import { d as _objectSpread2, f as init_objectSpread2, m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { C as UseScope, b as BeanControllerBase, c as prepareComponentOptions, g as BeanRenderBase, h as BeanStyleBase, k as BeanInfo, l as useController, m as BeanScopeBase, o as useApp, p as createZovaComponentAsync, u as ClientOnly, w as Use, x as useComputed } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { c as Render, i as Scope, s as Controller, t as init_src$2, u as Style } from "./a-bean-D7Mlzb3d.js";
import { a as Model, i as $QueryAutoLoad, o as BeanModelBase, t as init_src$3 } from "./a-model-Dk4zg8ps.js";
import { i as $iconName, r as $icon, t as init_src$4 } from "./a-icon-CB3HU4Om.js";
import { i as init_lib_es2015, o as classes } from "./typestyle-C2zp2284.js";
//#region src/suite/a-home/modules/home-layouttabs/src/model/layout.ts
function _initializerDefineProperty$5(e, i, r, l) {
	r && Object.defineProperty(e, i, {
		enumerable: r.enumerable,
		configurable: r.configurable,
		writable: r.writable,
		value: r.initializer ? r.initializer.call(l) : void 0
	});
}
function _applyDecoratedDescriptor$5(i, e, r, n, l) {
	var a = {};
	return Object.keys(n).forEach(function(i) {
		a[i] = n[i];
	}), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function(r, n) {
		return n(i, e, r) || r;
	}, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a;
}
var _dec$13, _dec2$13, _dec3$5, _dec4$5, _class$13, _class2$5, _descriptor$5, ModelLayout;
var init_layout = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_src$3();
	ModelLayout = (_dec$13 = Model(), _dec2$13 = BeanInfo({ module: "home-layouttabs" }), _dec3$5 = UseScope("a-ssr"), _dec4$5 = Reflect.metadata("design:type", typeof ScopeModuleASsr === "undefined" ? Object : ScopeModuleASsr), _dec$13(_class$13 = _dec2$13(_class$13 = (_class2$5 = class ModelLayout extends BeanModelBase {
		constructor(...args) {
			super(...args);
			this.leftDrawerOpenPC = void 0;
			_initializerDefineProperty$5(this, "$$scopeSsr", _descriptor$5, this);
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.leftDrawerOpenPC = !_this.$$scopeSsr.config.optimization.bodyReadyObserver ? _this.sys.config.layout.sidebar.leftOpenPC : _this.$useStateLocal({
					queryKey: ["sidebarLeftOpenPC"],
					meta: { defaultData: _this.sys.config.layout.sidebar.leftOpenPC }
				});
			})();
		}
	}, _descriptor$5 = _applyDecoratedDescriptor$5(_class2$5.prototype, "$$scopeSsr", [_dec3$5, _dec4$5], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2$5)) || _class$13) || _class$13);
}));
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/model/menu.ts
var _dec$12, _dec2$12, _class$12, ModelMenu;
var init_menu = __esmMin((() => {
	init_asyncToGenerator();
	init_objectSpread2();
	init_src$1();
	init_src$3();
	ModelMenu = (_dec$12 = Model(), _dec2$12 = BeanInfo({ module: "home-layouttabs" }), _dec$12(_class$12 = _dec2$12(_class$12 = class ModelMenu extends BeanModelBase {
		constructor(...args) {
			super(...args);
			this.menuTree = void 0;
			this._eventSsrHmrReload = void 0;
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.menuTree = _this.$computed(() => {
					const queryMenus = _this.retrieveMenus();
					if (!queryMenus.data) return;
					return _this._prepareMenuTree(queryMenus.data);
				});
				if (_this.sys.config.ssr.hmr) _this._eventSsrHmrReload = _this.sys.meta.event.on("a-ssrhmr:reload", function() {
					var _ref = _asyncToGenerator(function* (_data, next) {
						yield _this.$refetchQueries({ queryKey: ["retrieveMenus"] });
						return next();
					});
					return function(_x, _x2) {
						return _ref.apply(this, arguments);
					};
				}());
				_this.$watch(() => {
					return _this.app.meta.locale.current;
				}, _asyncToGenerator(function* () {
					yield _this.$refetchQueries({ queryKey: ["retrieveMenus"] });
				}));
			})();
		}
		__dispose__() {
			if (this._eventSsrHmrReload) this._eventSsrHmrReload();
		}
		retrieveMenus() {
			var _this2 = this;
			return this.$useStateData({
				queryKey: ["retrieveMenus"],
				queryFn: function() {
					var _ref2 = _asyncToGenerator(function* () {
						var _data$menus;
						const data = yield _this2.$api.homeBaseMenu.retrieveMenus({ params: { publicPath: _this2.sys.env.APP_PUBLIC_PATH } });
						const menus = (_data$menus = data.menus) === null || _data$menus === void 0 || (_data$menus = _data$menus.map((item) => {
							var _item$meta;
							if (item.link && !_this2.$router.isRouterName(item.link) && ((_item$meta = item.meta) === null || _item$meta === void 0 ? void 0 : _item$meta.params)) {
								var _item$meta2;
								const link = _this2.sys.util.apiActionPathTranslate(item.link, (_item$meta2 = item.meta) === null || _item$meta2 === void 0 ? void 0 : _item$meta2.params);
								return _objectSpread2(_objectSpread2({}, item), {}, { link });
							}
							return item;
						})) === null || _data$menus === void 0 ? void 0 : _data$menus.filter((item) => {
							return !item.external || _this2.$router.checkPathValid(item.link);
						});
						return _objectSpread2(_objectSpread2({}, data), {}, { menus });
					});
					return function queryFn() {
						return _ref2.apply(this, arguments);
					};
				}()
			});
		}
		findMenuItem(search) {
			const menus = this.retrieveMenus().data;
			if (!menus || !menus.menus) return;
			return menus.menus.find((item) => item.name && search.name && item.name === search.name || item.link === search.link);
		}
		_prepareMenuTree(menus, groupName) {
			let children = [];
			if (menus.menus) {
				var _menus$menus;
				children = children.concat((_menus$menus = menus.menus) === null || _menus$menus === void 0 ? void 0 : _menus$menus.filter((item) => item.group === groupName || Array.isArray(item.group) && item.group.includes(groupName)).map((item) => {
					return _objectSpread2(_objectSpread2({}, item), {}, { folder: false });
				}));
			}
			if (menus.groups) {
				const groups = menus.groups.filter((item) => item.group === groupName || Array.isArray(item.group) && item.group.includes(groupName)).map((menuGroup) => {
					return Object.assign({}, menuGroup, {
						folder: true,
						children: this._prepareMenuTree(menus, menuGroup.name)
					});
				});
				children = children.concat(groups);
			}
			return children.sort((a, b) => {
				var _a$order, _b$order;
				return ((_a$order = a.order) !== null && _a$order !== void 0 ? _a$order : 0) - ((_b$order = b.order) !== null && _b$order !== void 0 ? _b$order : 0);
			});
		}
	}) || _class$12) || _class$12);
}));
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/component/layoutTabs/controller.tsx
function _initializerDefineProperty$4(e, i, r, l) {
	r && Object.defineProperty(e, i, {
		enumerable: r.enumerable,
		configurable: r.configurable,
		writable: r.writable,
		value: r.initializer ? r.initializer.call(l) : void 0
	});
}
function _applyDecoratedDescriptor$4(i, e, r, n, l) {
	var a = {};
	return Object.keys(n).forEach(function(i) {
		a[i] = n[i];
	}), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function(r, n) {
		return n(i, e, r) || r;
	}, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a;
}
var _dec$11, _dec2$11, _dec3$4, _dec4$4, _dec5$1, _dec6$1, _dec7$1, _dec8$1, _class$11, _class2$4, _descriptor$4, _descriptor2$1, _descriptor3$1, _ControllerLayoutTabs, ControllerLayoutTabs;
var init_controller = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	init_src$3();
	init_layout();
	init_menu();
	ControllerLayoutTabs = (_dec$11 = Controller(), _dec2$11 = BeanInfo({ module: "home-layouttabs" }), _dec3$4 = Use(), _dec4$4 = Reflect.metadata("design:type", typeof ModelMenu === "undefined" ? Object : ModelMenu), _dec5$1 = Use(), _dec6$1 = Reflect.metadata("design:type", typeof ModelLayout === "undefined" ? Object : ModelLayout), _dec7$1 = Use({
		init: { arg: { sidebarLeftOpenPC: true } },
		beanFullName: "home-base.service.ssrLayout"
	}), _dec8$1 = Reflect.metadata("design:type", typeof ServiceSsrLayout === "undefined" ? Object : ServiceSsrLayout), _dec$11(_class$11 = _dec2$11(_class$11 = (_class2$4 = (_ControllerLayoutTabs = class ControllerLayoutTabs extends BeanControllerBase {
		constructor(...args) {
			super(...args);
			this.$$modelTabs = void 0;
			_initializerDefineProperty$4(this, "$$modelMenu", _descriptor$4, this);
			_initializerDefineProperty$4(this, "$$modelLayout", _descriptor2$1, this);
			_initializerDefineProperty$4(this, "$$serviceSsrLayout", _descriptor3$1, this);
			this.leftDrawerOpen = void 0;
			this.leftDrawerOpenMobile = false;
			this.belowBreakpoint = void 0;
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.belowBreakpoint = _this.$computed(() => {
					let width;
					width = document.documentElement.clientWidth;
					return width <= _this.sys.config.layout.sidebar.breakpoint;
				});
				_this.leftDrawerOpen = _this.$customRef(() => {
					const self = _this;
					return {
						get() {
							return self.belowBreakpoint ? self.leftDrawerOpenMobile : self.$$modelLayout.leftDrawerOpenPC;
						},
						set(value) {
							if (self.belowBreakpoint) self.leftDrawerOpenMobile = value;
							else self.$$modelLayout.leftDrawerOpenPC = value;
						}
					};
				});
				yield $QueryAutoLoad(() => _this.$$modelMenu.retrieveMenus());
				yield _this._initTabs();
			})();
		}
		_initTabs() {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				const configTabs = _this2.scope.config.tabs;
				const tabsOptions = {
					max: configTabs.max,
					maxItems: configTabs.maxItems,
					cache: configTabs.cache,
					getInitialTabs: () => {
						if (!_this2.$$modelMenu.retrieveMenus().data) return;
						return [{
							tabKey: "/",
							affix: true
						}];
					},
					getTabInfo: (tabKey) => {
						const queryMenu = _this2.$$modelMenu.retrieveMenus();
						if (!queryMenu.data || queryMenu.isError) return void 0;
						const menuItem = _this2.$$modelMenu.findMenuItem({ link: tabKey });
						if (!menuItem) return void 0;
						return {
							title: menuItem.title,
							icon: menuItem.icon
						};
					}
				};
				_this2.$$modelTabs = yield _this2.bean._getBeanSelector("a-routertabs.model.tabs", true, configTabs.scene, tabsOptions);
				_this2.$watch(() => {
					return _this2.$$modelMenu.retrieveMenus().data;
				}, () => {
					_this2.$$modelTabs.updateAllTabInfos();
				});
			})();
		}
		toggleLeftDrawer() {
			this.leftDrawerOpen = !this.leftDrawerOpen;
		}
	}, _ControllerLayoutTabs.$propsDefault = {}, _ControllerLayoutTabs), _descriptor$4 = _applyDecoratedDescriptor$4(_class2$4.prototype, "$$modelMenu", [_dec3$4, _dec4$4], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _descriptor2$1 = _applyDecoratedDescriptor$4(_class2$4.prototype, "$$modelLayout", [_dec5$1, _dec6$1], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _descriptor3$1 = _applyDecoratedDescriptor$4(_class2$4.prototype, "$$serviceSsrLayout", [_dec7$1, _dec8$1], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2$4)) || _class$11) || _class$11);
}));
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/component/layoutTabs/render.content.tsx
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
var _dec$10, _dec2$10, _dec3$3, _dec4$3, _class$10, _class2$3, _descriptor$3, RenderContent;
var init_render_content = __esmMin((() => {
	init_src$1();
	init_src$2();
	RenderContent = (_dec$10 = Render(), _dec2$10 = BeanInfo({ module: "home-layouttabs" }), _dec3$3 = Use(), _dec4$3 = Reflect.metadata("design:type", typeof RenderLayoutTabs === "undefined" ? Object : RenderLayoutTabs), _dec$10(_class$10 = _dec2$10(_class$10 = (_class2$3 = class RenderContent extends BeanRenderBase {
		constructor(...args) {
			super(...args);
			_initializerDefineProperty$3(this, "$$r", _descriptor$3, this);
		}
		render() {
			return this.$$r.$$renderTabs._renderRouterViewTabs();
		}
	}, _descriptor$3 = _applyDecoratedDescriptor$3(_class2$3.prototype, "$$r", [_dec3$3, _dec4$3], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2$3)) || _class$10) || _class$10);
}));
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/component/layoutTabs/render.header.tsx
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
var _dec$9, _dec2$9, _dec3$2, _dec4$2, _class$9, _class2$2, _descriptor$2, RenderHeader;
var init_render_header = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_src$2();
	RenderHeader = (_dec$9 = Render(), _dec2$9 = BeanInfo({ module: "home-layouttabs" }), _dec3$2 = Use(), _dec4$2 = Reflect.metadata("design:type", typeof RenderLayoutTabs === "undefined" ? Object : RenderLayoutTabs), _dec$9(_class$9 = _dec2$9(_class$9 = (_class2$2 = class RenderHeader extends BeanRenderBase {
		constructor(...args) {
			super(...args);
			_initializerDefineProperty$2(this, "$$r", _descriptor$2, this);
		}
		render() {
			return createVNode(Fragment, null, [createVNode("div", { "class": "navbar bg-base-300 w-full" }, [
				createVNode("div", { "class": "flex-none" }, [createVNode("button", {
					"class": "btn btn-square btn-ghost",
					"onClick": () => {
						this.toggleLeftDrawer();
					}
				}, [createVNode("svg", {
					"xmlns": "http://www.w3.org/2000/svg",
					"fill": "none",
					"viewBox": "0 0 24 24",
					"class": "inline-block h-5 w-5 stroke-current"
				}, [createVNode("path", {
					"strokeLinecap": "round",
					"strokeLinejoin": "round",
					"strokeWidth": "2",
					"d": "M4 6h16M4 12h16M4 18h16"
				}, null)])])]),
				createVNode("div", { "class": "text-xl px-4" }, [this.sys.env.APP_TITLE]),
				createVNode("div", { "class": "mx-2 flex-2 px-2" }, [this.$$r.$$renderTabs.renderTabItems()]),
				createVNode("div", { "class": "hidden flex-none lg:block" }, [createVNode("ul", { "class": "menu menu-horizontal" }, [
					this.$$r.$$renderLocale.render(),
					this.$$r.$$renderTheme.renderThemeDark(),
					this.$$r.$$renderTheme.renderThemeName(),
					this.$$r.$$renderUser.render()
				])])
			]), createVNode("div", { "class": "navbar bg-base-300 w-full" }, [this.$$r.$$renderTabs.renderTabs()])]);
		}
	}, _descriptor$2 = _applyDecoratedDescriptor$2(_class2$2.prototype, "$$r", [_dec3$2, _dec4$2], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2$2)) || _class$9) || _class$9);
}));
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/component/layoutTabs/render.locale.tsx
var _dec$8, _dec2$8, _class$8, RenderLocale;
var init_render_locale = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_src$2();
	init_src$4();
	RenderLocale = (_dec$8 = Render(), _dec2$8 = BeanInfo({ module: "home-layouttabs" }), _dec$8(_class$8 = _dec2$8(_class$8 = class RenderLocale extends BeanRenderBase {
		render() {
			const locales = [{
				name: "en-us",
				title: this.scope.locale.LanguageEnglish()
			}, {
				name: "zh-cn",
				title: this.scope.locale.LanguageChinese()
			}];
			return createVNode("li", null, [createVNode("details", null, [createVNode("summary", null, [$icon("::language", 24)]), createVNode(ClientOnly, null, { default: () => [createVNode("ul", { "class": "bg-base-100 rounded-t-none p-2 w-48" }, [locales.map((item) => {
				return createVNode("li", {
					"key": item.name,
					"class": this.app.meta.locale.current === item.name ? "disabled" : ""
				}, [createVNode("a", { "onClick": () => {
					this.app.meta.locale.current = item.name;
				} }, [$icon(this.app.meta.locale.current === item.name ? "::done" : "::none", 24), item.title])]);
			})])] })])]);
		}
	}) || _class$8) || _class$8);
}));
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/component/layoutTabs/render.menu.tsx
var _dec$7, _dec2$7, _class$7, ZItemLink, RenderMenu;
var init_render_menu = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_src$2();
	ZItemLink = createZovaComponentAsync("home-base", "itemLink");
	RenderMenu = (_dec$7 = Render(), _dec2$7 = BeanInfo({ module: "home-layouttabs" }), _dec$7(_class$7 = _dec2$7(_class$7 = class RenderMenu extends BeanRenderBase {
		_renderMenuItem(item) {
			var _item$title;
			const titleLocale = this.$text((_item$title = item.title) !== null && _item$title !== void 0 ? _item$title : "");
			if (item.folder) return createVNode("li", null, [createVNode("h2", { "class": "menu-title" }, [titleLocale]), createVNode("ul", null, [this._renderMenuItems(item.children)])]);
			if (item.separator) return createVNode("li", null, null);
			let to;
			if (!item.external) {
				var _item$meta, _item$meta3, _item$meta4;
				to = {};
				if (this.$router.isRouterName(item.link)) to.name = item.link;
				else to.path = item.link;
				if (((_item$meta = item.meta) === null || _item$meta === void 0 ? void 0 : _item$meta.params) && to.name) {
					var _item$meta2;
					to.params = (_item$meta2 = item.meta) === null || _item$meta2 === void 0 ? void 0 : _item$meta2.params;
				}
				if ((_item$meta3 = item.meta) === null || _item$meta3 === void 0 ? void 0 : _item$meta3.query) to.query = (_item$meta4 = item.meta) === null || _item$meta4 === void 0 ? void 0 : _item$meta4.query;
			}
			return createVNode("li", { "key": item.title }, [createVNode(ZItemLink, {
				"title": titleLocale,
				"description": item.description,
				"icon": item.icon,
				"href": item.external ? item.link : void 0,
				"to": to
			}, null)]);
		}
		_renderMenuItems(items) {
			if (!items) return;
			const domItems = [];
			for (const item of items) domItems.push(this._renderMenuItem(item));
			return domItems;
		}
		render() {
			const menuTree = this.$$modelMenu.menuTree;
			if (!menuTree) return;
			return createVNode("ul", { "class": "menu bg-base-200 text-base-content min-h-full w-full p-4" }, [this._renderMenuItems(menuTree)]);
		}
	}) || _class$7) || _class$7);
}));
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/component/layoutTabs/render.sidebar.tsx
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
var _dec$6, _dec2$6, _dec3$1, _dec4$1, _class$6, _class2$1, _descriptor$1, RenderSidebar;
var init_render_sidebar = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_src$2();
	RenderSidebar = (_dec$6 = Render(), _dec2$6 = BeanInfo({ module: "home-layouttabs" }), _dec3$1 = Use(), _dec4$1 = Reflect.metadata("design:type", typeof RenderLayoutTabs === "undefined" ? Object : RenderLayoutTabs), _dec$6(_class$6 = _dec2$6(_class$6 = (_class2$1 = class RenderSidebar extends BeanRenderBase {
		constructor(...args) {
			super(...args);
			_initializerDefineProperty$1(this, "$$r", _descriptor$1, this);
		}
		render() {
			return createVNode("div", {
				"class": "drawer-side",
				"style": { width: this.$scopeBase.config.layout.sidebar.width + "px" }
			}, [createVNode("label", {
				"htmlFor": "my-drawer-2",
				"aria-label": "close sidebar",
				"class": "drawer-overlay"
			}, null), this.$$r.$$renderMenu.render()]);
		}
	}, _descriptor$1 = _applyDecoratedDescriptor$1(_class2$1.prototype, "$$r", [_dec3$1, _dec4$1], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2$1)) || _class$6) || _class$6);
}));
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/component/layoutTabs/render.tabs.tsx
function _isSlot(s) {
	return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !isVNode(s);
}
var _dec$5, _dec2$5, _class$5, ZRouterViewTabs, ZIcon, RenderTabs;
var init_render_tabs = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_src$2();
	init_src$4();
	ZRouterViewTabs = createZovaComponentAsync("a-routertabs", "routerViewTabs");
	ZIcon = createZovaComponentAsync("a-icon", "icon");
	RenderTabs = (_dec$5 = Render(), _dec2$5 = BeanInfo({ module: "home-layouttabs" }), _dec$5(_class$5 = _dec2$5(_class$5 = class RenderTabs extends BeanRenderBase {
		renderTabs() {
			const $$modelTabs = this.$$modelTabs;
			if (!$$modelTabs) return;
			const domTabs = [];
			for (const tab of $$modelTabs.tabs) {
				const { tabKey, info } = tab;
				const className = tabKey === $$modelTabs.tabKeyCurrent ? "tab-active text-primary" : "";
				const titleLocale = this.$text((info === null || info === void 0 ? void 0 : info.title) || "");
				const tabIcon = this.getTabIcon(tab);
				const domTab = createVNode("a", {
					"key": tabKey,
					"role": "tab",
					"class": `tab ${className} ${this.cTab}`,
					"onClick": () => {
						$$modelTabs.activeTab(tabKey);
					}
				}, [
					!!tabIcon && createVNode(ZIcon, {
						"name": tabIcon,
						"width": "24",
						"height": "24"
					}, null),
					titleLocale,
					!tab.affix && createVNode(ZIcon, {
						"class": "tab-close hidden hover:bg-slate-400 rounded-sm",
						"name": "::close",
						"width": "16",
						"height": "16",
						"nativeOnClick": withModifiers(() => {
							$$modelTabs.deleteTab(tabKey);
						}, ["stop"])
					}, null)
				]);
				domTabs.push(domTab);
			}
			const domWrapper = createVNode("div", {
				"role": "tablist",
				"class": "tabs tabs-lifted"
			}, [domTabs]);
			if (!this.$$modelTabs.cache) return domWrapper;
			return createVNode(ClientOnly, null, _isSlot(domWrapper) ? domWrapper : { default: () => [domWrapper] });
		}
		renderTabItems() {
			const $$modelTabs = this.$$modelTabs;
			if (!$$modelTabs) return;
			const tabCurrent = $$modelTabs.tabCurrent;
			if (!tabCurrent || !tabCurrent.items) return;
			const tabKey = tabCurrent.tabKey;
			const domTabs = [];
			for (const tabItem of tabCurrent.items) {
				if (tabItem.componentKey === tabKey) continue;
				const { componentKey, pageMeta } = tabItem;
				const className = componentKey === $$modelTabs.componentKeyCurrent ? "tab-active text-primary" : "";
				const pageTitle = (pageMeta === null || pageMeta === void 0 ? void 0 : pageMeta.pageTitle) || "";
				const tabItemIcon = this.getTabItemIcon(tabItem);
				const domTab = createVNode("a", {
					"key": componentKey,
					"role": "tab",
					"class": `tab flex items-center ${className} ${this.cTab}`,
					"onClick": () => {
						$$modelTabs.activeTabItem(tabKey, componentKey);
					}
				}, [
					!!tabItemIcon && createVNode(ZIcon, {
						"name": tabItemIcon,
						"width": "24",
						"height": "24"
					}, null),
					createVNode("div", {
						"class": "overflow-hidden text-ellipsis whitespace-nowrap",
						"style": {
							display: "inline-block",
							maxWidth: this.scope.config.tabItem.maxWidth
						}
					}, [pageTitle]),
					createVNode(ZIcon, {
						"class": "tab-close hidden hover:bg-slate-400 rounded-sm",
						"name": "::close",
						"width": "16",
						"height": "16",
						"nativeOnClick": withModifiers(() => {
							$$modelTabs.deleteTabItem(tabKey, componentKey, false);
						}, ["stop"])
					}, null)
				]);
				domTabs.push(domTab);
			}
			const domWrapper = createVNode("div", {
				"role": "tablist",
				"class": "tabs tabs-border"
			}, [domTabs]);
			if (!this.$$modelTabs.cache) return domWrapper;
			return createVNode(ClientOnly, null, _isSlot(domWrapper) ? domWrapper : { default: () => [domWrapper] });
		}
		getTabIcon(tab) {
			const { info, items } = tab;
			if (items && items.some((item) => {
				var _item$pageMeta;
				return !!((_item$pageMeta = item.pageMeta) === null || _item$pageMeta === void 0 ? void 0 : _item$pageMeta.pageDirty);
			})) return $iconName("::asterisk");
			return (info === null || info === void 0 ? void 0 : info.icon) ? info === null || info === void 0 ? void 0 : info.icon : "";
		}
		getTabItemIcon(tabItem) {
			var _pageMeta$formMeta, _pageMeta$formMeta2;
			const { pageMeta } = tabItem;
			if (pageMeta === null || pageMeta === void 0 ? void 0 : pageMeta.pageDirty) return "::asterisk";
			if ((pageMeta === null || pageMeta === void 0 || (_pageMeta$formMeta = pageMeta.formMeta) === null || _pageMeta$formMeta === void 0 ? void 0 : _pageMeta$formMeta.formScene) === "create") return "::draft-add";
			if ((pageMeta === null || pageMeta === void 0 || (_pageMeta$formMeta2 = pageMeta.formMeta) === null || _pageMeta$formMeta2 === void 0 ? void 0 : _pageMeta$formMeta2.formScene) === "edit") return "::draft-edit";
			return "";
		}
		_renderRouterViewTabs() {
			return createVNode(ZRouterViewTabs, null, null);
		}
	}) || _class$5) || _class$5);
}));
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/component/layoutTabs/render.theme.tsx
var _dec$4, _dec2$4, _class$4, RenderTheme;
var init_render_theme = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_src$2();
	init_src$4();
	RenderTheme = (_dec$4 = Render(), _dec2$4 = BeanInfo({ module: "home-layouttabs" }), _dec$4(_class$4 = _dec2$4(_class$4 = class RenderTheme extends BeanRenderBase {
		renderThemeDark() {
			const themes = [
				{
					mode: false,
					title: this.scope.locale.ThemeLight()
				},
				{
					mode: true,
					title: this.scope.locale.ThemeDark()
				},
				{
					mode: "auto",
					title: this.scope.locale.ThemeAuto()
				}
			];
			return createVNode("li", null, [createVNode("details", null, [createVNode("summary", null, [$icon("::dark-theme", 24)]), createVNode(ClientOnly, null, { default: () => [createVNode("ul", { "class": "bg-base-100 rounded-t-none p-2 w-48" }, [themes.map((item) => {
				return createVNode("li", {
					"key": item.mode.toString(),
					"class": this.$theme.darkMode === item.mode ? "disabled" : ""
				}, [createVNode("a", { "onClick": () => {
					this.$theme.darkMode = item.mode;
				} }, [$icon(this.$theme.darkMode === item.mode ? "::done" : "::none", 24), item.title])]);
			})])] })])]);
		}
		renderThemeName() {
			const themes = [{
				name: "home-theme:default",
				title: this.scope.locale.ThemeDefault()
			}, {
				name: "home-theme:orange",
				title: this.scope.locale.ThemeOrange()
			}];
			return createVNode("li", null, [createVNode("details", null, [createVNode("summary", null, [$icon(":outline:theme-outline", 24)]), createVNode(ClientOnly, null, { default: () => [createVNode("ul", { "class": "bg-base-100 rounded-t-none p-2 w-48" }, [themes.map((item) => {
				return createVNode("li", {
					"key": item.name,
					"class": this.$theme.name === item.name ? "disabled" : ""
				}, [createVNode("a", { "onClick": () => {
					this.$theme.name = item.name;
				} }, [$icon(this.$theme.name === item.name ? "::done" : "::none", 24), item.title])]);
			})])] })])]);
		}
	}) || _class$4) || _class$4);
}));
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/component/layoutTabs/render.user.tsx
var _dec$3, _dec2$3, _class$3, RenderUser;
var init_render_user = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_src$2();
	init_src$4();
	RenderUser = (_dec$3 = Render(), _dec2$3 = BeanInfo({ module: "home-layouttabs" }), _dec$3(_class$3 = _dec2$3(_class$3 = class RenderUser extends BeanRenderBase {
		render() {
			var _this$$passport$user, _this$$passport$user2;
			return createVNode("li", null, [createVNode("details", null, [createVNode("summary", null, [(_this$$passport$user = this.$passport.user) === null || _this$$passport$user === void 0 ? void 0 : _this$$passport$user.name, $icon((_this$$passport$user2 = this.$passport.user) === null || _this$$passport$user2 === void 0 ? void 0 : _this$$passport$user2.avatar, 24)]), createVNode("ul", { "class": "bg-base-100 rounded-t-none p-2 w-32" }, [createVNode("li", null, [createVNode("a", { "onClick": () => {
				this.$passport.logout().mutate();
			} }, [this.scope.locale.Logout()])])])])]);
		}
	}) || _class$3) || _class$3);
}));
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/component/layoutTabs/render.tsx
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
var _dec$2, _dec2$2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec0, _dec1, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _class$2, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, RenderLayoutTabs$1;
var init_render = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_lib_es2015();
	init_src$2();
	init_render_content();
	init_render_header();
	init_render_locale();
	init_render_menu();
	init_render_sidebar();
	init_render_tabs();
	init_render_theme();
	init_render_user();
	RenderLayoutTabs$1 = (_dec$2 = Render(), _dec2$2 = BeanInfo({ module: "home-layouttabs" }), _dec3 = Use(), _dec4 = Reflect.metadata("design:type", typeof RenderHeader === "undefined" ? Object : RenderHeader), _dec5 = Use(), _dec6 = Reflect.metadata("design:type", typeof RenderContent === "undefined" ? Object : RenderContent), _dec7 = Use(), _dec8 = Reflect.metadata("design:type", typeof RenderSidebar === "undefined" ? Object : RenderSidebar), _dec9 = Use(), _dec0 = Reflect.metadata("design:type", typeof RenderMenu === "undefined" ? Object : RenderMenu), _dec1 = Use(), _dec10 = Reflect.metadata("design:type", typeof RenderTabs === "undefined" ? Object : RenderTabs), _dec11 = Use(), _dec12 = Reflect.metadata("design:type", typeof RenderTheme === "undefined" ? Object : RenderTheme), _dec13 = Use(), _dec14 = Reflect.metadata("design:type", typeof RenderLocale === "undefined" ? Object : RenderLocale), _dec15 = Use(), _dec16 = Reflect.metadata("design:type", typeof RenderUser === "undefined" ? Object : RenderUser), _dec$2(_class$2 = _dec2$2(_class$2 = (_class2 = class RenderLayoutTabs extends BeanRenderBase {
		constructor(...args) {
			super(...args);
			_initializerDefineProperty(this, "$$renderHeader", _descriptor, this);
			_initializerDefineProperty(this, "$$renderContent", _descriptor2, this);
			_initializerDefineProperty(this, "$$renderSidebar", _descriptor3, this);
			_initializerDefineProperty(this, "$$renderMenu", _descriptor4, this);
			_initializerDefineProperty(this, "$$renderTabs", _descriptor5, this);
			_initializerDefineProperty(this, "$$renderTheme", _descriptor6, this);
			_initializerDefineProperty(this, "$$renderLocale", _descriptor7, this);
			_initializerDefineProperty(this, "$$renderUser", _descriptor8, this);
		}
		render() {
			return createVNode("div", { "class": classes("drawer", this.leftDrawerOpen ? "drawer-open" : false) }, [
				createVNode("input", {
					"id": "my-drawer-2",
					"type": "checkbox",
					"class": "drawer-toggle"
				}, null),
				createVNode("div", { "class": "drawer-content" }, [this.$$renderHeader.render(), this.$$renderContent.render()]),
				this.$$renderSidebar.render()
			]);
		}
	}, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "$$renderHeader", [_dec3, _dec4], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "$$renderContent", [_dec5, _dec6], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "$$renderSidebar", [_dec7, _dec8], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "$$renderMenu", [_dec9, _dec0], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "$$renderTabs", [_dec1, _dec10], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "$$renderTheme", [_dec11, _dec12], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "$$renderLocale", [_dec13, _dec14], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "$$renderUser", [_dec15, _dec16], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2)) || _class$2) || _class$2);
}));
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/component/layoutTabs/style.ts
var _dec$1, _dec2$1, _class$1, StyleLayoutTabs;
var init_style = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	StyleLayoutTabs = (_dec$1 = Style(), _dec2$1 = BeanInfo({ module: "home-layouttabs" }), _dec$1(_class$1 = _dec2$1(_class$1 = class StyleLayoutTabs extends BeanStyleBase {
		constructor(...args) {
			super(...args);
			this.cTab = void 0;
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.cTab = _this.$style({
					fontSize: "1.0rem",
					$nest: {
						"&:hover .tab-close": { display: "block" },
						".tab-close": {
							position: "absolute",
							top: "-6px",
							right: "-6px"
						}
					}
				});
			})();
		}
	}) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/.metadata/component/layoutTabs.ts
var ZLayoutTabs;
var init_layoutTabs = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller();
	init_render();
	init_style();
	ZLayoutTabs = defineComponent((_props) => {
		useController(ControllerLayoutTabs, RenderLayoutTabs$1, StyleLayoutTabs);
		return () => {};
	}, prepareComponentOptions());
}));
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/config/config.ts
var config;
var init_config = __esmMin((() => {
	config = (_sys) => {
		return {
			tabs: {
				scene: "",
				max: 6,
				maxItems: 3,
				cache: true
			},
			tabItem: { maxWidth: "130px" }
		};
	};
}));
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/.metadata/index.ts
/** config: end */
/** locale: begin */
/** locale: end */
/** scope: begin */
function locale(key) {
	return `home-layouttabs::${key}`;
}
var _dec, _dec2, _class, components, ScopeModuleHomeLayouttabs;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_layout();
	init_menu();
	init_src$3();
	init_controller();
	init_layoutTabs();
	init_layoutTabs();
	init_render_content();
	init_render_header();
	init_render_locale();
	init_render_menu();
	init_render_sidebar();
	init_render_tabs();
	init_render_theme();
	init_render();
	init_render_user();
	init_style();
	init_config();
	init_src$2();
	components = { "layoutTabs": ZLayoutTabs };
	ScopeModuleHomeLayouttabs = (_dec = Scope(), _dec2 = BeanInfo({ module: "home-layouttabs" }), _dec(_class = _dec2(_class = class ScopeModuleHomeLayouttabs extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/config/locale/en-us.ts
var en_us_default;
var init_en_us = __esmMin((() => {
	en_us_default = {
		"Home": "Home",
		"Logout": "Logout",
		"LanguageEnglish": "English",
		"LanguageChinese": "Chinese",
		"ThemeLight": "Light",
		"ThemeDark": "Dark",
		"ThemeAuto": "Auto",
		"ThemeDefault": "Default",
		"ThemeOrange": "Orange",
		"Basic": "Basic",
		"Business": "Business",
		"State": "State",
		"Component": "Component",
		"Route Query": "Route Query",
		"Route Query(2)": "Route Query(2)",
		"Route Params": "Route Params",
		"Locale": "Locale",
		"Todo: CRUD": "Todo: CRUD",
		"Docs": "Docs"
	};
}));
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/config/locale/zh-cn.ts
var zh_cn_default;
var init_zh_cn = __esmMin((() => {
	zh_cn_default = {
		"Home": "首页",
		"Logout": "退出登录",
		"LanguageEnglish": "英语",
		"LanguageChinese": "简体中文",
		"ThemeLight": "亮色",
		"ThemeDark": "暗色",
		"ThemeAuto": "自动",
		"ThemeDefault": "默认",
		"ThemeOrange": "橘色",
		"Basic": "基础",
		"Business": "业务",
		"State": "状态",
		"Component": "组件",
		"Route Query": "路由Query",
		"Route Query(2)": "路由Query(2)",
		"Route Params": "路由Params",
		"Locale": "本地化",
		"Todo: CRUD": "Todo: 增删改查",
		"Docs": "文档"
	};
}));
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/.metadata/locales.ts
function $useLocale(key, ...args) {
	const app = useApp();
	const str = `home-layouttabs::${key}`;
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
//#region src/suite/a-home/modules/home-layouttabs/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	$useLocale: () => $useLocale,
	ControllerLayoutTabs: () => ControllerLayoutTabs,
	ModelLayout: () => ModelLayout,
	ModelMenu: () => ModelMenu,
	RenderContent: () => RenderContent,
	RenderHeader: () => RenderHeader,
	RenderLayoutTabs: () => RenderLayoutTabs$1,
	RenderLocale: () => RenderLocale,
	RenderMenu: () => RenderMenu,
	RenderSidebar: () => RenderSidebar,
	RenderTabs: () => RenderTabs,
	RenderTheme: () => RenderTheme,
	RenderUser: () => RenderUser,
	ScopeModuleHomeLayouttabs: () => ScopeModuleHomeLayouttabs,
	StyleLayoutTabs: () => StyleLayoutTabs,
	ZLayoutTabs: () => ZLayoutTabs,
	components: () => components,
	config: () => config,
	locale: () => locale,
	locales: () => locales
});
var init_src = __esmMin((() => {
	init__metadata();
	init_locales();
}));
//#endregion
export { src_exports as n, init_src as t };
