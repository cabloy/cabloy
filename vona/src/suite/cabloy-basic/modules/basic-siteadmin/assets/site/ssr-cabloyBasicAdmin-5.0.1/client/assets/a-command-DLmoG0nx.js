import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { J as init_dist, Z as isNil } from "./zova-BE4e4PxD.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { I as beanFullNameFromOnionName, K as cast, O as createBeanDecorator, U as BeanSimple, j as BeanBase, k as BeanInfo, m as BeanScopeBase, z as deepExtend } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
//#region src/suite-vendor/a-zova/modules/a-command/src/lib/performCommand.ts
function $performCommand(sys, commandName, options, renderContext, next) {
	if (!next) next = (commandRes) => {
		return commandRes;
	};
	const beanFullName = beanFullNameFromOnionName(commandName, "command");
	const beanInstance = sys.bean._getBeanSyncOnly(beanFullName);
	if (beanInstance) return _renderEventCommandNormal_inner(beanInstance, options, renderContext, next);
	return sys.bean._getBean(beanFullName, false).then((beanInstance) => {
		return _renderEventCommandNormal_inner(beanInstance, options, renderContext, next);
	});
}
function _renderEventCommandNormal_inner(beanInstance, options, renderContext, next) {
	const onionOptions = beanInstance.$onionOptions;
	const props = onionOptions ? deepExtend({}, onionOptions, options) : options !== null && options !== void 0 ? options : {};
	return beanInstance.execute(props, renderContext, next);
}
var init_performCommand$1 = __esmMin((() => {
	init_src$1();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-command/src/monkey.ts
var Monkey;
var init_monkey = __esmMin((() => {
	init_src$1();
	init_performCommand$1();
	init_asyncToGenerator();
	Monkey = class extends BeanSimple {
		beanInit(bean, beanInstance) {
			var _this = this;
			return _asyncToGenerator(function* () {
				const self = _this;
				bean.defineProperty(beanInstance, "$performCommand", {
					enumerable: false,
					configurable: true,
					get() {
						return function(commandName, options, renderContext, next) {
							renderContext = Object.assign({
								app: cast(beanInstance).app,
								ctx: cast(beanInstance).ctx,
								$host: beanInstance
							}, renderContext);
							return $performCommand(self.sys, commandName, options, renderContext, next);
						};
					}
				});
			})();
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-command/src/.metadata/index.ts
/** monkey: end */
/** scope: begin */
var _dec, _dec2, _class, ScopeModuleACommand;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_monkey();
	init_src$2();
	ScopeModuleACommand = (_dec = Scope(), _dec2 = BeanInfo({ module: "a-command" }), _dec(_class = _dec2(_class = class ScopeModuleACommand extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite-vendor/a-zova/modules/a-command/src/lib/command.ts
function Command(options) {
	return createBeanDecorator("command", "sys", true, options);
}
var init_command$1 = __esmMin((() => {
	init_src$1();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-command/src/lib/beanCommandBulkBase.ts
var BeanCommandBulkBase;
var init_beanCommandBulkBase = __esmMin((() => {
	init_src$1();
	BeanCommandBulkBase = class extends BeanBase {
		getResource(options, renderContext) {
			let resource = options.resource;
			if (renderContext.$scene === "page") {
				var _resource;
				const { $celScope } = renderContext;
				resource = (_resource = resource) !== null && _resource !== void 0 ? _resource : $celScope.resource;
			}
			if (!resource) throw new Error(`should specify resource in scene: ${renderContext.$scene}`);
			return { resource };
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-command/src/lib/beanCommandRowBase.ts
var BeanCommandRowBase;
var init_beanCommandRowBase = __esmMin((() => {
	init_dist();
	init_src$1();
	BeanCommandRowBase = class extends BeanBase {
		getResourceAndId(options, renderContext) {
			let resource = options.resource;
			let id = options.id;
			if (renderContext.$scene === "tableCell") {
				var _resource, _id;
				const { $celScope, cellContext } = renderContext;
				resource = (_resource = resource) !== null && _resource !== void 0 ? _resource : $celScope.resource;
				id = (_id = id) !== null && _id !== void 0 ? _id : cellContext.row.id;
			}
			if (isNil(resource) || isNil(id)) throw new Error(`should specify resource or id in scene: ${renderContext.$scene}`);
			return {
				resource,
				id
			};
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-command/src/lib/index.ts
var init_lib = __esmMin((() => {
	init_command$1();
	init_performCommand$1();
	init_beanCommandBulkBase();
	init_beanCommandRowBase();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-command/src/types/command.ts
var SymbolCommandResult;
var init_command = __esmMin((() => {
	SymbolCommandResult = Symbol("SymbolCommandResult");
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-command/src/types/performCommand.ts
var init_performCommand = __esmMin((() => {
	init_src$1();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-command/src/types/commandJsx.ts
var init_commandJsx = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-command/src/types/index.ts
var init_types = __esmMin((() => {
	init_command();
	init_performCommand();
	init_commandJsx();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-command/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	$performCommand: () => $performCommand,
	BeanCommandBulkBase: () => BeanCommandBulkBase,
	BeanCommandRowBase: () => BeanCommandRowBase,
	Command: () => Command,
	Monkey: () => Monkey,
	ScopeModuleACommand: () => ScopeModuleACommand,
	SymbolCommandResult: () => SymbolCommandResult
});
var init_src = __esmMin((() => {
	init__metadata();
	init_lib();
	init_types();
}));
//#endregion
export { Command as a, BeanCommandBulkBase as i, src_exports as n, BeanCommandRowBase as r, init_src as t };
