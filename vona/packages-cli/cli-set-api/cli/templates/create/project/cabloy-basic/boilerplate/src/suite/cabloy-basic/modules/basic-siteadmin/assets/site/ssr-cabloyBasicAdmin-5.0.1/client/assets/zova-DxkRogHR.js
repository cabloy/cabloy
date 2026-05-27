import { n as __esmMin } from "./rolldown-runtime-lkMnaVCm.js";
import { c as createTextVNode, p as h } from "./vue-t5FcxkD3.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
import { $ as isPromise, A as compose, F as celEnvBase, H as evaluateExpressions, J as init_dist$1, K as getProperty, X as isEmptyObject, Z as isNil, j as init_dist } from "./zova-BE4e4PxD.js";
import { d as _objectSpread2, f as init_objectSpread2 } from "./fecha-DmopMB3M.js";
import { H as objectAssignReactive, K as cast, U as BeanSimple, t as init_src$1 } from "./zova-DNf1Cx1D.js";
import { s as toUpperCaseFirstChar, t as init_src$2 } from "./zova-6Abekb1F.js";
//#region packages-utils/zova-jsx/src/lib/const.ts
var renderFieldJsxPropsSystem;
var init_const = __esmMin((() => {
	renderFieldJsxPropsSystem = [
		"children",
		"v-slot",
		"v-slot-scope",
		"v-if",
		"v-for",
		"v-each"
	];
}));
//#endregion
//#region packages-utils/zova-jsx/src/lib/utils.ts
function isNativeElement(Component) {
	return typeof Component === "string" && !Component.includes(":") && Component.charAt(0) >= "a" && Component.charAt(0) <= "z";
}
function isZovaComponent(Component) {
	return typeof Component === "string" && Component.includes(":");
}
function isJsxComponent(Component) {
	return typeof Component === "object" && (Component === null || Component === void 0 ? void 0 : Component.$$typeof) === "zova-jsx:component";
}
function isJsxEvent(Component) {
	return typeof Component === "object" && (Component === null || Component === void 0 ? void 0 : Component.$$typeof) === "zova-jsx:event";
}
function invokeProp(prop) {
	if (typeof prop === "function") return prop();
	return prop;
}
function normalizePropName(name) {
	var _propsMapper$name;
	return (_propsMapper$name = __propsMapper[name]) !== null && _propsMapper$name !== void 0 ? _propsMapper$name : name;
}
var __propsMapper;
var init_utils = __esmMin((() => {
	__propsMapper = { className: "class" };
}));
//#endregion
//#region packages-utils/zova-jsx/src/lib/zovaJsx.ts
var ZovaJsx;
var init_zovaJsx = __esmMin((() => {
	init_dist();
	init_dist$1();
	init_src$2();
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_const();
	init_utils();
	init_objectSpread2();
	ZovaJsx = class extends BeanSimple {
		constructor(components, celEnv) {
			super();
			this._components = void 0;
			this._celEnv = void 0;
			this._transientObject = void 0;
			this._components = components;
			this._celEnv = this._prepareCelEnv(celEnv !== null && celEnv !== void 0 ? celEnv : celEnvBase);
		}
		_prepareCelEnv(celEnv) {
			celEnv = celEnv.clone();
			celEnv.registerFunction("getEvent():dyn", () => {
				var _this$transientObject;
				return (_this$transientObject = this.transientObject.eventObject) !== null && _this$transientObject !== void 0 ? _this$transientObject : null;
			});
			celEnv.registerFunction("getEventProp(string):dyn", (prop) => {
				var _getProperty;
				return (_getProperty = getProperty(this.transientObject.eventObject, prop)) !== null && _getProperty !== void 0 ? _getProperty : null;
			});
			return celEnv;
		}
		setTransientObject(transientObject, fnMethod) {
			const transientObjectPrev = this._transientObject;
			this._transientObject = transientObject;
			try {
				return fnMethod();
			} finally {
				this._transientObject = transientObjectPrev;
			}
		}
		get transientObject() {
			return this._transientObject;
		}
		get event() {
			var _this$transientObject2;
			return (_this$transientObject2 = this.transientObject) === null || _this$transientObject2 === void 0 ? void 0 : _this$transientObject2.eventObject;
		}
		get components() {
			return this._components;
		}
		get celEnv() {
			return this._celEnv;
		}
		evaluateExpression(expression, celScope) {
			return evaluateExpressions(expression, celScope, this.celEnv);
		}
		renderJsxOrCel(componentJsx, props, celScope, renderContext) {
			if (isJsxComponent(componentJsx)) {
				const transientObject = this.transientObject;
				const renderFn = () => {
					return this.setTransientObject(transientObject, () => {
						return this.render(componentJsx, props, celScope, renderContext);
					});
				};
				renderFn["zova-jsx:component"] = componentJsx.type;
				return renderFn;
			}
			if (isJsxEvent(componentJsx)) {
				let transientObject = this.transientObject;
				return (event) => {
					transientObject = _objectSpread2(_objectSpread2({}, transientObject), {}, { eventObject: event });
					return this.setTransientObject(transientObject, () => {
						return this.renderEvent(event, componentJsx, celScope, renderContext);
					});
				};
			}
			return this.evaluateExpression(componentJsx, celScope);
		}
		renderEvent(event, componentJsx, celScope, renderContext) {
			if (event && event instanceof Event) {
				const props = this.renderJsxProps(componentJsx.props, {}, celScope, renderContext);
				if (props.stop) event.stopPropagation();
				if (props.prevent) event.preventDefault();
			}
			const eventRes = [];
			celScope = objectAssignReactive({}, celScope, { res: eventRes });
			return this.renderEventDirect(componentJsx, celScope, renderContext, eventRes);
		}
		renderEventDirect(componentJsx, celScope, renderContext, eventRes, next) {
			const actions = this._collectEventActions(componentJsx, celScope, renderContext, eventRes);
			if (!actions || actions.length === 0) return next ? next(void 0) : void 0;
			const transientObject = this.transientObject;
			return compose(actions)(void 0, (actionRes) => {
				if (!next) return actionRes;
				return this.setTransientObject(transientObject, () => {
					return next(actionRes);
				});
			});
		}
		_collectEventActions(componentJsx, celScope, renderContext, eventRes) {
			var _componentJsx$props;
			let actionChildren = (_componentJsx$props = componentJsx.props) === null || _componentJsx$props === void 0 ? void 0 : _componentJsx$props.children;
			if (!actionChildren) return;
			if (!Array.isArray(actionChildren)) actionChildren = [actionChildren];
			const actions = [];
			const transientObject = this.transientObject;
			for (let index = 0; index < actionChildren.length; index++) {
				const actionChild = actionChildren[index];
				const action = (actionRes, next) => {
					if (isPromise(actionRes)) return actionRes.then((actionRes) => {
						return this._actionHandler(index, actionChild, actionRes, next, actionChildren, celScope, renderContext, eventRes, transientObject);
					});
					else return this._actionHandler(index, actionChild, actionRes, next, actionChildren, celScope, renderContext, eventRes, transientObject);
				};
				actions.push(action);
			}
			return actions;
		}
		_actionHandler(index, actionChild, actionRes, next, actionChildren, celScope, renderContext, eventRes, transientObject) {
			return this.setTransientObject(transientObject, () => {
				var _actionChild$props;
				if (index > 0) {
					var _cast;
					if (actionRes === void 0) actionRes = null;
					eventRes[index - 1] = actionRes;
					const actionChildPrev = actionChildren[index - 1];
					const resName = (_cast = cast(actionChildPrev.props)) === null || _cast === void 0 ? void 0 : _cast.res;
					if (resName) celScope[resName] = actionRes;
				}
				if (this.evaluateExpression((_actionChild$props = actionChild.props) === null || _actionChild$props === void 0 ? void 0 : _actionChild$props["v-if"], celScope) === false) return next(void 0);
				if (actionChild.type === "ZovaCommands") {
					eventRes[index] = [];
					return this.renderEventDirect(actionChild, objectAssignReactive({}, celScope), renderContext, eventRes[index], next);
				} else return this._renderEventActionNormal(actionChild, celScope, renderContext, next);
			});
		}
		_renderEventActionNormal(actionChild, celScope, renderContext, next) {
			const beanFullName = actionChild.type;
			const beanInstance = this.sys.bean._getBeanSyncOnly(beanFullName);
			if (beanInstance) return this._renderEventActionNormal_inner(beanInstance, actionChild, celScope, renderContext, next);
			const transientObject = this.transientObject;
			return this.sys.bean._getBean(beanFullName, false).then((beanInstance) => {
				return this.setTransientObject(transientObject, () => {
					return this._renderEventActionNormal_inner(beanInstance, actionChild, celScope, renderContext, next);
				});
			});
		}
		_renderEventActionNormal_inner(beanInstance, actionChild, celScope, renderContext, next) {
			const onionOptions = beanInstance.$onionOptions;
			let props = this.renderJsxProps(cast(actionChild.props).options, {}, celScope, renderContext);
			if (!isEmptyObject(onionOptions)) props = Object.assign({}, onionOptions, props);
			if (!renderContext) throw new Error("should provide renderContext");
			return beanInstance.execute(props, renderContext, next);
		}
		render(componentJsx, propsInit, celScope, renderContext) {
			if (!componentJsx) throw new Error(`render component should not ${componentJsx}`);
			componentJsx = this.normalizeComponenJsx(componentJsx, propsInit);
			const componentProps = componentJsx.props;
			const props = {};
			if (this.evaluateExpression(componentProps === null || componentProps === void 0 ? void 0 : componentProps["v-if"], celScope) === false) return;
			const Component = this.normalizeComponent(componentJsx.type);
			const vFor = this.evaluateExpression(componentProps === null || componentProps === void 0 ? void 0 : componentProps["v-for"], celScope);
			if (!vFor) return this._renderJsxSingle(Component, componentJsx, props, celScope, renderContext);
			const children = [];
			for (let index = 0; index < vFor.length; index++) {
				var _this$evaluateExpress, _componentJsx$props2;
				const each = vFor[index];
				const eachName = (_this$evaluateExpress = this.evaluateExpression((_componentJsx$props2 = componentJsx.props) === null || _componentJsx$props2 === void 0 ? void 0 : _componentJsx$props2["v-each"], celScope)) !== null && _this$evaluateExpress !== void 0 ? _this$evaluateExpress : "each";
				const celScopeEach = objectAssignReactive({}, celScope, {
					[eachName]: each,
					[`${eachName}Index`]: index
				});
				const propsEach = _objectSpread2({}, props);
				const child = this._renderJsxSingle(Component, componentJsx, propsEach, celScopeEach, renderContext);
				if (child) children.push(child);
			}
			return children;
		}
		normalizeComponenJsx(componentJsx, propsInit) {
			if (typeof componentJsx === "object") {
				var _cast$key, _cast2;
				return Object.assign({}, componentJsx, {
					key: (_cast$key = (_cast2 = cast(propsInit)) === null || _cast2 === void 0 ? void 0 : _cast2.key) !== null && _cast$key !== void 0 ? _cast$key : componentJsx.key,
					props: Object.assign({}, componentJsx.props, propsInit)
				});
			}
			return {
				type: componentJsx,
				props: propsInit
			};
		}
		normalizeComponent(type) {
			if (typeof type === "function") return type;
			if (typeof type === "string" && !isNativeElement(type)) {
				var _this$components$type, _this$components;
				type = (_this$components$type = (_this$components = this.components) === null || _this$components === void 0 ? void 0 : _this$components[type]) !== null && _this$components$type !== void 0 ? _this$components$type : type;
			}
			if (typeof type === "string" && [
				"script",
				"style",
				"link"
			].includes(type)) throw new Error(`not valid zova jsx component: ${type}`);
			return type;
		}
		_renderJsxSingle(Component, componentJsx, props, celScope, renderContext) {
			var _componentJsx$props3;
			const _isZovaComponent = isZovaComponent(Component);
			if (!isNil(componentJsx.key)) cast(props).key = this.evaluateExpression(componentJsx.key, celScope);
			this.renderJsxProps(componentJsx.props, props, celScope, renderContext);
			if (cast(props).class || cast(props).style) {
				const controller = this.ctx.bean._getBeanSyncOnly("$$c");
				cast(props).class = controller.$cssMerge(cast(props).class, controller.$style(cast(props).style));
				delete cast(props).style;
			}
			let children;
			if (!((_componentJsx$props3 = componentJsx.props) === null || _componentJsx$props3 === void 0 ? void 0 : _componentJsx$props3.children)) children = void 0;
			else if (isNativeElement(Component)) children = this.renderJsxChildrenDirect(componentJsx.props.children, celScope, renderContext);
			else {
				const childrenCollect = this._renderJsxChildrenCollect(componentJsx.props.children, celScope, renderContext);
				if (_isZovaComponent) for (const key in childrenCollect) {
					const slot = childrenCollect[key];
					if (key === "default") children = slot;
					else props[`slot${toUpperCaseFirstChar(key)}`] = slot;
				}
				else children = childrenCollect;
			}
			if (_isZovaComponent) Component = this.sys.meta.component.getZovaComponent(Component);
			const vnode = h(Component, props, children);
			if (_isZovaComponent && renderContext) cast(vnode).zovaHostProviders = { $$renderContext: renderContext };
			return vnode;
		}
		renderJsxProps(jsxProps, props, celScope, renderContext) {
			if (!jsxProps) return props;
			const keys = Object.keys(jsxProps).filter((item) => !renderFieldJsxPropsSystem.includes(item));
			if (keys.length === 0) return props;
			for (const key of keys) {
				const keyValue = this.renderJsxOrCel(jsxProps[key], void 0, celScope, renderContext);
				const propName = normalizePropName(key);
				props[propName] = keyValue;
			}
			return props;
		}
		_renderJsxChildrenCollect(jsxChildren, celScope, renderContext) {
			if (!Array.isArray(jsxChildren)) jsxChildren = [jsxChildren];
			const children = [];
			const slots = {};
			const transientObject = this.transientObject;
			for (const jsxChild of jsxChildren) {
				var _jsxChild$props;
				if (jsxChild && typeof jsxChild === "object" && ((_jsxChild$props = jsxChild.props) === null || _jsxChild$props === void 0 ? void 0 : _jsxChild$props["v-slot"])) {
					var _jsxChild$props2, _jsxChild$props3;
					const slotName = (_jsxChild$props2 = jsxChild.props) === null || _jsxChild$props2 === void 0 ? void 0 : _jsxChild$props2["v-slot"];
					const slotScopeName = (_jsxChild$props3 = jsxChild.props) === null || _jsxChild$props3 === void 0 ? void 0 : _jsxChild$props3["v-slot-scope"];
					let slot;
					if (slotScopeName) slot = (slotScope) => {
						return this.setTransientObject(transientObject, () => {
							const celScopeSub = objectAssignReactive({}, celScope, { [slotScopeName]: slotScope });
							return this.renderJsxChildrenDirect(jsxChild, celScopeSub, renderContext);
						});
					};
					else slot = () => {
						return this.setTransientObject(transientObject, () => {
							return this.renderJsxChildrenDirect(jsxChild, celScope, renderContext);
						});
					};
					slots[slotName] = slot;
				} else children.push(jsxChild);
			}
			const slotDefault = children.length === 0 ? void 0 : () => {
				return this.setTransientObject(transientObject, () => {
					return this.renderJsxChildrenDirect(children, celScope, renderContext);
				});
			};
			return _objectSpread2(_objectSpread2({}, slots), {}, { default: slotDefault });
		}
		renderJsxChildrenDirect(jsxChildren, celScope, renderContext) {
			if (!Array.isArray(jsxChildren)) jsxChildren = [jsxChildren];
			const children = [];
			for (let index = 0; index < jsxChildren.length; index++) {
				const jsxChild = jsxChildren[index];
				let child;
				if (isJsxComponent(jsxChild)) if (jsxChild.type === "var") {
					const props = this.renderJsxProps(jsxChild.props, {}, celScope, renderContext);
					celScope[cast(props).name] = cast(props).value;
					child = void 0;
				} else if (jsxChild.type === "log") {
					{
						const props = this.renderJsxProps(jsxChild.props, {}, celScope, renderContext);
						const name = cast(props).name;
						const message = cast(props).message;
						if (isNil(name)) console.log(message);
						else console.log(name, message);
					}
					child = void 0;
				} else {
					var _jsxChild$key;
					const propsInit = { key: (_jsxChild$key = jsxChild.key) !== null && _jsxChild$key !== void 0 ? _jsxChild$key : index };
					child = this.render(jsxChild, propsInit, celScope, renderContext);
				}
				else {
					const childText = this.evaluateExpression(jsxChild, celScope);
					child = createTextVNode(childText !== null && childText !== void 0 ? childText : "");
				}
				if (child) if (Array.isArray(child)) children.push(...child);
				else children.push(child);
			}
			return children;
		}
	};
}));
//#endregion
//#region packages-utils/zova-jsx/src/lib/index.ts
var init_lib = __esmMin((() => {
	init_const();
	init_utils();
	init_zovaJsx();
}));
//#endregion
//#region packages-utils/zova-jsx/src/types/rest.ts
var init_rest = __esmMin((() => {}));
//#endregion
//#region packages-utils/zova-jsx/src/types/index.ts
var init_types = __esmMin((() => {
	init_rest();
}));
//#endregion
//#region packages-utils/zova-jsx/src/index.ts
var init_src = __esmMin((() => {
	init_lib();
	init_types();
}));
//#endregion
export { isJsxComponent as i, ZovaJsx as n, invokeProp as r, init_src as t };
