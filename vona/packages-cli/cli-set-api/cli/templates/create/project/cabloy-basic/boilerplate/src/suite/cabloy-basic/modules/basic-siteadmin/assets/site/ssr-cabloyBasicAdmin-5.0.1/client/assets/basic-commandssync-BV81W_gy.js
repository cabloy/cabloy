import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { J as init_dist, Z as isNil } from "./zova-BE4e4PxD.js";
import { D as Preload, j as BeanBase, k as BeanInfo, m as BeanScopeBase } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { a as Command, t as init_src$3 } from "./a-command-DLmoG0nx.js";
//#region src/suite/cabloy-basic/modules/basic-commandssync/src/bean/command.expr.tsx
var _dec$2, _dec2$2, _dec3$1, _class$2, CommandExpr;
var init_command_expr = __esmMin((() => {
	init_src$1();
	init_src$3();
	CommandExpr = (_dec$2 = Command(), _dec2$2 = Preload(), _dec3$1 = BeanInfo({ module: "basic-commandssync" }), _dec$2(_class$2 = _dec2$2(_class$2 = _dec3$1(_class$2 = class CommandExpr extends BeanBase {
		execute(options, _renderContext, next) {
			return next(options.expression);
		}
	}) || _class$2) || _class$2) || _class$2);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-commandssync/src/bean/command.log.tsx
var _dec$1, _dec2$1, _dec3, _class$1, CommandLog;
var init_command_log = __esmMin((() => {
	init_src$1();
	init_dist();
	init_src$3();
	CommandLog = (_dec$1 = Command(), _dec2$1 = Preload(), _dec3 = BeanInfo({ module: "basic-commandssync" }), _dec$1(_class$1 = _dec2$1(_class$1 = _dec3(_class$1 = class CommandLog extends BeanBase {
		execute(options, _renderContext, next) {
			{
				const name = options.name;
				const message = options.message;
				if (isNil(name)) console.log(message);
				else console.log(name, message);
			}
			return next();
		}
	}) || _class$1) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-commandssync/src/.metadata/index.ts
/** command: end */
/** scope: begin */
var _dec, _dec2, _class, ScopeModuleBasicCommandssync;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_command_expr();
	init_command_log();
	init_src$3();
	init_src$2();
	ScopeModuleBasicCommandssync = (_dec = Scope(), _dec2 = BeanInfo({ module: "basic-commandssync" }), _dec(_class = _dec2(_class = class ScopeModuleBasicCommandssync extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite/cabloy-basic/modules/basic-commandssync/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	CommandExpr: () => CommandExpr,
	CommandLog: () => CommandLog,
	ScopeModuleBasicCommandssync: () => ScopeModuleBasicCommandssync
});
var init_src = __esmMin((() => {
	init__metadata();
}));
//#endregion
export { src_exports as n, init_src as t };
