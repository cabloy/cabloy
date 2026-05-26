import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { H as evaluateExpressions, J as init_dist } from "./zova-BE4e4PxD.js";
import { A as BeanAopMethodBase, K as cast, N as SymbolBeanFullName, k as BeanInfo, m as BeanScopeBase } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { a as AopMethod, i as Scope, r as UseAopMethod, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
//#region src/suite-vendor/a-zova/modules/a-logger/src/bean/aopMethod.log.ts
var _dec$1, _dec2$1, _class$1, AopMethodLog;
var init_aopMethod_log = __esmMin((() => {
	init_src$1();
	init_dist();
	init_src$2();
	AopMethodLog = (_dec$1 = AopMethod({ level: "info" }), _dec2$1 = BeanInfo({ module: "a-logger" }), _dec$1(_class$1 = _dec2$1(_class$1 = class AopMethodLog extends BeanAopMethodBase {
		get(options, next, receiver, prop) {
			const context = this._getContext(options, receiver);
			const message = `${receiver[SymbolBeanFullName]}#${prop}(get)`;
			const profiler = this.sys.meta.logger.child(options.childName, options.clientName).startTimer();
			try {
				const res = next();
				this._logResult(profiler, context, res, options, message);
				return res;
			} catch (err) {
				this._logError(profiler, context, err, options, message);
				throw err;
			}
		}
		set(options, value, next, receiver, prop) {
			const context = this._getContext(options, receiver);
			const message = `${receiver[SymbolBeanFullName]}#${prop}(set)`;
			const profiler = this.sys.meta.logger.child(options.childName, options.clientName).startTimer();
			try {
				const res = next();
				this._logValue(profiler, context, value, options, message);
				return res;
			} catch (err) {
				this._logError(profiler, context, err, options, message);
				throw err;
			}
		}
		execute(options, _args, next, receiver, prop) {
			const context = this._getContext(options, receiver);
			const message = `${receiver[SymbolBeanFullName]}#${prop}`;
			const logger = this.sys.meta.logger.child(options.childName, options.clientName);
			if (options.args !== false) {
				const info = {
					level: options.level,
					message
				};
				if (context) info.context = context;
				if (_args.length > 0) info.args = _args;
				logger.log(info);
			}
			const profiler = logger.startTimer();
			try {
				const res = next();
				if (res === null || res === void 0 ? void 0 : res.then) return res.then((res) => {
					options.result !== false && this._logResult(profiler, context, res, options, message);
					return res;
				}).catch((err) => {
					this._logError(profiler, context, err, options, message);
					throw err;
				});
				options.result !== false && this._logResult(profiler, context, res, options, message);
				return res;
			} catch (err) {
				this._logError(profiler, context, err, options, message);
				throw err;
			}
		}
		_getContext(options, receiver) {
			return evaluateExpressions(options.context, {
				self: receiver,
				sys: cast(receiver).sys,
				app: cast(receiver).app,
				ctx: cast(receiver).ctx
			});
		}
		_logValue(profiler, context, value, options, message) {
			const info = {
				level: options.level,
				message
			};
			if (context) info.context = context;
			info.value = value;
			profiler.done(info);
		}
		_logResult(profiler, context, res, options, message) {
			const info = {
				level: options.level,
				message
			};
			if (context) info.context = context;
			if (res !== void 0) info.result = res;
			profiler.done(info);
		}
		_logError(profiler, context, err, _options, message) {
			const info = {
				level: "error",
				message
			};
			if (context) info.context = context;
			if (err) info.error = err;
			profiler.done(info);
		}
	}) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-logger/src/.metadata/index.ts
/** aopMethod: end */
/** scope: begin */
var _dec, _dec2, _class, ScopeModuleALogger;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_aopMethod_log();
	init_src$2();
	ScopeModuleALogger = (_dec = Scope(), _dec2 = BeanInfo({ module: "a-logger" }), _dec(_class = _dec2(_class = class ScopeModuleALogger extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite-vendor/a-zova/modules/a-logger/src/lib/log.ts
function Log(options) {
	return UseAopMethod("a-logger:log", options);
}
var init_log = __esmMin((() => {
	init_src$2();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-logger/src/lib/index.ts
var init_lib = __esmMin((() => {
	init_log();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-logger/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	AopMethodLog: () => AopMethodLog,
	Log: () => Log,
	ScopeModuleALogger: () => ScopeModuleALogger
});
var init_src = __esmMin((() => {
	init__metadata();
	init_lib();
}));
//#endregion
export { src_exports as n, Log as r, init_src as t };
