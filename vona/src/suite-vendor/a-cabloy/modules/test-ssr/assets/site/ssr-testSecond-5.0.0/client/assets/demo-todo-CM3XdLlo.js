import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { N as withDirectives, c as createTextVNode, l as createVNode } from "./vue-1Y5FbPzj.js";
import { a as withModifiers, i as vModelText } from "./vue-ChEE2n-Y.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-C-LVj1DU.js";
import { A as string, C as init_zod, k as object } from "./zova-BYPEGx1T.js";
import { d as _objectSpread2, f as init_objectSpread2, m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DvkbkxAQ.js";
import { G as uuid, _ as BeanControllerPageBase, k as BeanInfo, m as BeanScopeBase, p as createZovaComponentAsync, s as createZovaComponentPage, w as Use } from "./zova-DQbBsEtS.js";
import { t as init_src$1 } from "./zova-CoRfsquu.js";
import { c as Controller, i as Scope, t as init_src$2 } from "./a-bean-qjOwLLml.js";
import { a as Model, i as $QueryAutoLoad, o as BeanModelBase, t as init_src$3 } from "./a-model-Ds17NAa5.js";
import { a as BeanApiBase, r as Api, t as init_src$4 } from "./a-api-DmsK4zNw.js";
import { o as init_vue_router, t as RouterLink } from "./vue-router-COfHCB5q.js";
//#region src/suite/a-demo/modules/demo-todo/src/model/todo.ts
var _dec$4, _dec2$4, _class$4, ModelTodo;
var init_todo$2 = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_src$3();
	ModelTodo = (_dec$4 = Model(), _dec2$4 = BeanInfo({ module: "demo-todo" }), _dec$4(_class$4 = _dec2$4(_class$4 = class ModelTodo extends BeanModelBase {
		findAll() {
			var _this = this;
			return this.$useStateData({
				queryKey: ["list"],
				queryFn: function() {
					var _ref = _asyncToGenerator(function* () {
						return _this.scope.api.todo.findAll();
					});
					return function queryFn() {
						return _ref.apply(this, arguments);
					};
				}()
			});
		}
		findOne(id) {
			var _this2 = this;
			if (!id) return void 0;
			return this.$useStateData({
				queryKey: ["item", id],
				queryFn: function() {
					var _ref2 = _asyncToGenerator(function* () {
						return _this2.scope.api.todo.findOne(id);
					});
					return function queryFn() {
						return _ref2.apply(this, arguments);
					};
				}()
			});
		}
		create() {
			var _this3 = this;
			return this.$useMutationData({
				mutationKey: ["create"],
				mutationFn: function() {
					var _ref3 = _asyncToGenerator(function* (body) {
						return _this3.scope.api.todo.create(body);
					});
					return function mutationFn(_x) {
						return _ref3.apply(this, arguments);
					};
				}(),
				onSuccess: () => {
					this.$invalidateQueries({ queryKey: ["list"] });
				}
			});
		}
		update(id) {
			var _this4 = this;
			return this.$useMutationData({
				mutationKey: ["update", id],
				mutationFn: function() {
					var _ref4 = _asyncToGenerator(function* (body) {
						return _this4.scope.api.todo.update(id, body);
					});
					return function mutationFn(_x2) {
						return _ref4.apply(this, arguments);
					};
				}(),
				onSuccess: (_data, _params) => {
					this.$invalidateQueries({ queryKey: ["list"] });
					this.$invalidateQueries({ queryKey: ["item", id] });
				}
			});
		}
		delete(id) {
			var _this5 = this;
			return this.$useMutationData({
				mutationKey: ["delete", id],
				mutationFn: function() {
					var _ref5 = _asyncToGenerator(function* () {
						return _this5.scope.api.todo.delete(id);
					});
					return function mutationFn() {
						return _ref5.apply(this, arguments);
					};
				}(),
				onSuccess: (_data, _params) => {
					this.$invalidateQueries({ queryKey: ["list"] });
					this.$invalidateQueries({ queryKey: ["item", id] });
				}
			});
		}
	}) || _class$4) || _class$4);
}));
//#endregion
//#region src/suite/a-demo/modules/demo-todo/src/api/todo.ts
var _dec$3, _dec2$3, _class$3, ApiTodo;
var init_todo$1 = __esmMin((() => {
	init_src$1();
	init_src$4();
	ApiTodo = (_dec$3 = Api(), _dec2$3 = BeanInfo({ module: "demo-todo" }), _dec$3(_class$3 = _dec2$3(_class$3 = class ApiTodo extends BeanApiBase {
		findAll() {
			return this.$fetch.get("/demo/todo");
		}
		findOne(id) {
			return this.$fetch.get(this.$pathTranslate("/demo/todo/{id}", { id }));
		}
		create(body) {
			return this.$fetch.post("/demo/todo", body);
		}
		update(id, body) {
			return this.$fetch.patch(this.$pathTranslate("/demo/todo/{id}", { id }), body);
		}
		delete(id) {
			return this.$fetch.delete(this.$pathTranslate("/demo/todo/{id}", { id }));
		}
	}) || _class$3) || _class$3);
}));
//#endregion
//#region src/suite/a-demo/modules/demo-todo/src/page/item/controller.tsx
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
var _dec$2, _dec2$2, _dec3$1, _dec4$1, _class$2, _class2$1, _descriptor$1, ZPage$1, ControllerPageItemSchemaParams, ControllerPageItemSchemaQuery, ControllerPageItem;
var init_controller$1 = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_src$1();
	init_zod();
	init_src$2();
	init_todo$2();
	ZPage$1 = createZovaComponentAsync("home-base", "page");
	ControllerPageItemSchemaParams = object({ id: string() });
	ControllerPageItemSchemaQuery = object({});
	ControllerPageItem = (_dec$2 = Controller(), _dec2$2 = BeanInfo({ module: "demo-todo" }), _dec3$1 = Use(), _dec4$1 = Reflect.metadata("design:type", typeof ModelTodo === "undefined" ? Object : ModelTodo), _dec$2(_class$2 = _dec2$2(_class$2 = (_class2$1 = class ControllerPageItem extends BeanControllerPageBase {
		constructor(...args) {
			super(...args);
			_initializerDefineProperty$1(this, "$$modelTodo", _descriptor$1, this);
			this.currentTodoId = void 0;
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.currentTodoId = _this.$computed(() => {
					return _this.$params.id;
				});
			})();
		}
		render() {
			const todoCurrent = this.$$modelTodo.findOne(this.currentTodoId);
			return createVNode(ZPage$1, null, { default: () => {
				var _todoCurrent$data, _todoCurrent$error;
				return [(todoCurrent === null || todoCurrent === void 0 ? void 0 : todoCurrent.data) && createVNode("div", {
					"role": "alert",
					"class": "alert alert-info"
				}, [createVNode("div", null, [createTextVNode("Current:"), todoCurrent === null || todoCurrent === void 0 || (_todoCurrent$data = todoCurrent.data) === null || _todoCurrent$data === void 0 ? void 0 : _todoCurrent$data.title])]), !!(todoCurrent === null || todoCurrent === void 0 ? void 0 : todoCurrent.error) && createVNode("div", {
					"role": "alert",
					"class": "alert alert-error"
				}, [createVNode("span", null, [todoCurrent === null || todoCurrent === void 0 || (_todoCurrent$error = todoCurrent.error) === null || _todoCurrent$error === void 0 ? void 0 : _todoCurrent$error.message])])];
			} });
		}
	}, _descriptor$1 = _applyDecoratedDescriptor$1(_class2$1.prototype, "$$modelTodo", [_dec3$1, _dec4$1], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2$1)) || _class$2) || _class$2);
}));
//#endregion
//#region src/suite/a-demo/modules/demo-todo/src/page/todo/controller.tsx
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
var _dec$1, _dec2$1, _dec3, _dec4, _class$1, _class2, _descriptor, ZPage, ControllerPageTodo;
var init_controller = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_objectSpread2();
	init_src$1();
	init_vue_router();
	init_src$2();
	init_src$3();
	init_todo$2();
	ZPage = createZovaComponentAsync("home-base", "page");
	ControllerPageTodo = (_dec$1 = Controller(), _dec2$1 = BeanInfo({ module: "demo-todo" }), _dec3 = Use(), _dec4 = Reflect.metadata("design:type", typeof ModelTodo === "undefined" ? Object : ModelTodo), _dec$1(_class$1 = _dec2$1(_class$1 = (_class2 = class ControllerPageTodo extends BeanControllerPageBase {
		constructor(...args) {
			super(...args);
			_initializerDefineProperty(this, "$$modelTodo", _descriptor, this);
			this.newTitle = void 0;
			this.currentTodoId = void 0;
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				yield $QueryAutoLoad(() => _this.queryTodos);
			})();
		}
		get queryTodos() {
			return this.$$modelTodo.findAll();
		}
		get queryTodoCurrent() {
			return this.$$modelTodo.findOne(this.currentTodoId);
		}
		addTodo() {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				const todo = {
					id: uuid(),
					title: _this2.newTitle,
					done: false
				};
				yield _this2.$$modelTodo.create().mutateAsync(todo);
				_this2.newTitle = "";
			})();
		}
		completeTodo(item) {
			var _this3 = this;
			return _asyncToGenerator(function* () {
				const todo = _objectSpread2(_objectSpread2({}, item), {}, {
					title: `${item.title}!`,
					done: true
				});
				yield _this3.$$modelTodo.update(item.id).mutateAsync(todo);
			})();
		}
		deleteTodo(item) {
			var _this4 = this;
			return _asyncToGenerator(function* () {
				yield _this4.$$modelTodo.delete(item.id).mutateAsync();
			})();
		}
		render() {
			const queryTodoCurrent = this.queryTodoCurrent;
			const queryTodos = this.queryTodos;
			return createVNode(ZPage, null, { default: () => {
				var _queryTodoCurrent$dat, _queryTodoCurrent$err, _queryTodos$data;
				return [
					(queryTodoCurrent === null || queryTodoCurrent === void 0 ? void 0 : queryTodoCurrent.data) && createVNode("div", {
						"role": "alert",
						"class": "alert alert-success"
					}, [createVNode("div", null, [
						createTextVNode("Current:"),
						" ",
						createVNode(RouterLink, { "to": this.$router.getPagePath("/demo/todo/item/:id", { params: { id: queryTodoCurrent === null || queryTodoCurrent === void 0 || (_queryTodoCurrent$dat = queryTodoCurrent.data) === null || _queryTodoCurrent$dat === void 0 ? void 0 : _queryTodoCurrent$dat.id } }) }, { default: () => {
							var _queryTodoCurrent$dat2;
							return [queryTodoCurrent === null || queryTodoCurrent === void 0 || (_queryTodoCurrent$dat2 = queryTodoCurrent.data) === null || _queryTodoCurrent$dat2 === void 0 ? void 0 : _queryTodoCurrent$dat2.title];
						} })
					])]),
					!!(queryTodoCurrent === null || queryTodoCurrent === void 0 ? void 0 : queryTodoCurrent.error) && createVNode("div", {
						"role": "alert",
						"class": "alert alert-error"
					}, [createVNode("span", null, [queryTodoCurrent === null || queryTodoCurrent === void 0 || (_queryTodoCurrent$err = queryTodoCurrent.error) === null || _queryTodoCurrent$err === void 0 ? void 0 : _queryTodoCurrent$err.message])]),
					createVNode("form", null, [createVNode("div", { "class": "card bg-base-100 shadow-xl" }, [createVNode("div", { "class": "card-body flex-row" }, [withDirectives(createVNode("input", {
						"type": "text",
						"class": "input w-full max-w-xs",
						"onUpdate:modelValue": ($event) => this.newTitle = $event
					}, null), [[vModelText, this.newTitle]]), createVNode("button", {
						"class": "btn btn-primary",
						"type": "submit",
						"onClick": withModifiers(() => {
							this.addTodo();
						}, ["prevent"])
					}, [createTextVNode("Create")])])])]),
					createVNode("div", { "class": "overflow-x-auto" }, [createVNode("table", { "class": "table" }, [createVNode("thead", null, [createVNode("tr", null, [
						createVNode("th", null, [createTextVNode("Title")]),
						createVNode("th", null, [createTextVNode("Done")]),
						createVNode("th", null, null)
					])]), createVNode("tbody", null, [(_queryTodos$data = queryTodos.data) === null || _queryTodos$data === void 0 ? void 0 : _queryTodos$data.map((item) => {
						return createVNode("tr", null, [
							createVNode("td", null, [createVNode("a", {
								"class": "link link-primary",
								"href": "#",
								"onClick": withModifiers(() => {
									this.currentTodoId = item.id;
								}, ["prevent"])
							}, [item.title])]),
							createVNode("td", null, [item.done && createVNode("input", {
								"type": "checkbox",
								"checked": true,
								"class": "checkbox checkbox-success"
							}, null)]),
							createVNode("td", null, [createVNode("button", {
								"class": "btn btn-error btn-sm",
								"onClick": () => {
									this.deleteTodo(item);
								}
							}, [createTextVNode("Delete")]), !item.done && createVNode("button", {
								"class": "btn btn-success btn-sm",
								"onClick": () => {
									this.completeTodo(item);
								}
							}, [createTextVNode("Complete")])])
						]);
					})])])])
				];
			} });
		}
	}, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "$$modelTodo", [_dec3, _dec4], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2)) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite/a-demo/modules/demo-todo/src/.metadata/page/item.ts
var NSControllerPageItem, ZPageItem;
var init_item = __esmMin((() => {
	init_src$1();
	init_controller$1();
	(function(_NSControllerPageItem) {
		_NSControllerPageItem.paramsSchema = ControllerPageItemSchemaParams;
		_NSControllerPageItem.querySchema = ControllerPageItemSchemaQuery;
	})(NSControllerPageItem || (NSControllerPageItem = {}));
	ZPageItem = createZovaComponentPage(ControllerPageItem, void 0, void 0);
}));
//#endregion
//#region src/suite/a-demo/modules/demo-todo/src/.metadata/page/todo.ts
var ZPageTodo;
var init_todo = __esmMin((() => {
	init_src$1();
	init_controller();
	ZPageTodo = createZovaComponentPage(ControllerPageTodo, void 0, void 0);
}));
//#endregion
//#region src/suite/a-demo/modules/demo-todo/src/routes.ts
var routes;
var init_routes = __esmMin((() => {
	init_item();
	init_todo();
	routes = [{
		path: "todo",
		component: ZPageTodo
	}, {
		name: "item",
		path: "item/:id",
		component: ZPageItem
	}];
}));
//#endregion
//#region src/suite/a-demo/modules/demo-todo/src/.metadata/index.ts
/** api: end */
/** api: begin */
/** pages: end */
/** scope: begin */
var _dec, _dec2, _class, pagePathSchemas, pageNameSchemas, ScopeModuleDemoTodo;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_todo$2();
	init_src$3();
	init_todo$1();
	init_controller$1();
	init_controller();
	init_item();
	init_item();
	init_todo();
	init_routes();
	init_src$2();
	pagePathSchemas = {};
	pageNameSchemas = { "demo-todo:item": {
		params: NSControllerPageItem.paramsSchema,
		query: NSControllerPageItem.querySchema
	} };
	ScopeModuleDemoTodo = (_dec = Scope(), _dec2 = BeanInfo({ module: "demo-todo" }), _dec(_class = _dec2(_class = class ScopeModuleDemoTodo extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite/a-demo/modules/demo-todo/src/types.ts
var init_types = __esmMin((() => {}));
//#endregion
//#region src/suite/a-demo/modules/demo-todo/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	ApiTodo: () => ApiTodo,
	ControllerPageItem: () => ControllerPageItem,
	ControllerPageItemSchemaParams: () => ControllerPageItemSchemaParams,
	ControllerPageItemSchemaQuery: () => ControllerPageItemSchemaQuery,
	ControllerPageTodo: () => ControllerPageTodo,
	ModelTodo: () => ModelTodo,
	NSControllerPageItem: () => NSControllerPageItem,
	ScopeModuleDemoTodo: () => ScopeModuleDemoTodo,
	ZPageItem: () => ZPageItem,
	ZPageTodo: () => ZPageTodo,
	pageNameSchemas: () => pageNameSchemas,
	pagePathSchemas: () => pagePathSchemas,
	routes: () => routes
});
var init_src = __esmMin((() => {
	init__metadata();
	init_types();
}));
//#endregion
export { src_exports as n, init_src as t };
