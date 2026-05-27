import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { n as init_vue_runtime_esm_bundler, t as init_jsx_runtime } from "./vue-CmE1HVn9.js";
import { d as _objectSpread2, f as init_objectSpread2 } from "./fecha-DmopMB3M.js";
import { k as BeanInfo, m as BeanScopeBase } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { i as BeanBehaviorBase, r as Behavior, t as init_src$3 } from "./a-behavior-DMKdKGTP.js";
//#region src/suite-vendor/a-zova/modules/a-behaviors/src/bean/behavior.focus.ts
var _dec$1, _dec2$1, _class$1, BehaviorFocus;
var init_behavior_focus = __esmMin((() => {
	init_objectSpread2();
	init_src$1();
	init_src$3();
	BehaviorFocus = (_dec$1 = Behavior(), _dec2$1 = BeanInfo({ module: "a-behaviors" }), _dec$1(_class$1 = _dec2$1(_class$1 = class BehaviorFocus extends BeanBehaviorBase {
		constructor(...args) {
			super(...args);
			this.inputRef = void 0;
		}
		render(props, next) {
			const refOuter = props === null || props === void 0 ? void 0 : props.ref;
			props = _objectSpread2(_objectSpread2({}, props), {}, { ref: (ref) => {
				if (this.$options.always || !this.inputRef) {
					var _ref$focus;
					(_ref$focus = ref.focus) === null || _ref$focus === void 0 || _ref$focus.call(ref);
				}
				this.inputRef = ref;
				refOuter === null || refOuter === void 0 || refOuter(ref);
			} });
			return next(props);
		}
	}) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-behaviors/src/.metadata/index.ts
/** behaviors: end */
/** scope: begin */
var _dec, _dec2, _class, ScopeModuleABehaviors;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_behavior_focus();
	init_src$3();
	init_vue_runtime_esm_bundler();
	init_jsx_runtime();
	init_src$2();
	ScopeModuleABehaviors = (_dec = Scope(), _dec2 = BeanInfo({ module: "a-behaviors" }), _dec(_class = _dec2(_class = class ScopeModuleABehaviors extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite-vendor/a-zova/modules/a-behaviors/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	BehaviorFocus: () => BehaviorFocus,
	ScopeModuleABehaviors: () => ScopeModuleABehaviors
});
var init_src = __esmMin((() => {
	init__metadata();
}));
//#endregion
export { src_exports as n, init_src as t };
