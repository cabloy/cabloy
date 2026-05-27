import { n as __esmMin } from "./rolldown-runtime-lkMnaVCm.js";
import { m as init_dist, p as getText } from "./zova-BE4e4PxD.js";
import { n as init_fecha, t as fecha } from "./fecha-DmopMB3M.js";
//#region packages-utils/logger/src/cascade.ts
/**
* Refactored by zhennann
* (C) 2010 Charlie Robbins
* MIT LICENCE
*/
function isValidFormat(fmt) {
	if (typeof fmt.transform !== "function") throw new TypeError([
		"No transform function found on format. Did you create a format instance?",
		"const myFormat = format(formatFn);",
		"const instance = myFormat();"
	].join("\n"));
	return true;
}
function cascade(formats) {
	if (!formats.every(isValidFormat)) throw new Error("have not valid format");
	return (info) => {
		let obj = info;
		for (let i = 0; i < formats.length; i++) {
			obj = formats[i].transform(obj, formats[i].options);
			if (!obj) return false;
		}
		return obj;
	};
}
var init_cascade = __esmMin((() => {}));
//#endregion
//#region packages-utils/logger/src/types.ts
var LEVEL, MESSAGE, SPLAT, NpmConfigSetLevels;
var init_types = __esmMin((() => {
	LEVEL = Symbol("LEVEL");
	MESSAGE = Symbol("MESSAGE");
	SPLAT = Symbol("SPLAT");
	NpmConfigSetLevels = /* @__PURE__ */ function(NpmConfigSetLevels) {
		NpmConfigSetLevels[NpmConfigSetLevels["error"] = 0] = "error";
		NpmConfigSetLevels[NpmConfigSetLevels["warn"] = 1] = "warn";
		NpmConfigSetLevels[NpmConfigSetLevels["info"] = 2] = "info";
		NpmConfigSetLevels[NpmConfigSetLevels["http"] = 3] = "http";
		NpmConfigSetLevels[NpmConfigSetLevels["verbose"] = 4] = "verbose";
		NpmConfigSetLevels[NpmConfigSetLevels["debug"] = 5] = "debug";
		NpmConfigSetLevels[NpmConfigSetLevels["silly"] = 6] = "silly";
		return NpmConfigSetLevels;
	}({});
}));
//#endregion
//#region packages-utils/logger/src/colorize.ts
function colorize(color, text) {
	if (!text) return text;
	const code = codes[allColors[color]];
	if (!code) return text;
	return `${`\x1B[${code[0]}m`}${text}${`\x1B[${code[1]}m`}`;
}
function colorizer(opts) {
	return new Colorizer(opts);
}
var codes, allColors, Colorizer;
var init_colorize = __esmMin((() => {
	init_types();
	codes = {
		black: [30, 39],
		red: [31, 39],
		green: [32, 39],
		yellow: [33, 39],
		blue: [34, 39],
		magenta: [35, 39],
		cyan: [36, 39],
		white: [37, 39],
		gray: [90, 39],
		grey: [90, 39]
	};
	allColors = {
		error: "red",
		warn: "yellow",
		info: "green",
		http: "green",
		verbose: "cyan",
		debug: "blue",
		silly: "magenta",
		tip: "gray"
	};
	Colorizer = class {
		constructor(opts = {}) {
			this.options = void 0;
			if (opts.colors) allColors = Object.assign({}, allColors, opts.colors);
			this.options = opts;
		}
		colorize(lookup, level, message) {
			if (typeof message === "undefined") message = level;
			return colorize(lookup, message);
		}
		transform(info, opts) {
			if (opts.all && typeof info[MESSAGE] === "string") info[MESSAGE] = this.colorize(info[LEVEL], info.level, info[MESSAGE]);
			if (opts.level || opts.all || !opts.message) info.level = this.colorize(info[LEVEL], info.level);
			if (opts.all || opts.message) info.message = this.colorize(info[LEVEL], info.level, info.message);
			return info;
		}
	};
}));
//#endregion
//#region packages-utils/logger/src/format.ts
function format(transform) {
	return (opts) => {
		return new Format(transform, opts);
	};
}
var Format;
var init_format = __esmMin((() => {
	Format = class {
		constructor(transform, opts) {
			this.transform = void 0;
			this.options = void 0;
			this.transform = transform;
			this.options = opts;
		}
	};
}));
//#endregion
//#region packages-utils/logger/src/combine.ts
function combine(...formats) {
	return format(cascade(formats))();
}
var init_combine = __esmMin((() => {
	init_cascade();
	init_format();
}));
//#endregion
//#region packages-utils/logger/src/errors.ts
var errors;
var init_errors = __esmMin((() => {
	init_format();
	init_types();
	errors = format((einfo, { stack, cause }) => {
		if (einfo instanceof Error) {
			const info = Object.assign({}, einfo, {
				level: einfo.level,
				[LEVEL]: einfo[LEVEL] || einfo.level,
				message: einfo.message,
				[MESSAGE]: einfo[MESSAGE] || einfo.message
			});
			if (stack) info.stack = einfo.stack;
			if (cause) info.cause = einfo.cause;
			return info;
		}
		if (!(einfo.message instanceof Error)) return einfo;
		const err = einfo.message;
		Object.assign(einfo, err);
		einfo.message = err.message;
		einfo[MESSAGE] = err.message;
		if (stack) einfo.stack = err.stack;
		if (cause) einfo.cause = err.cause;
		return einfo;
	});
}));
//#endregion
//#region packages-utils/logger/src/profiler.ts
var Profiler;
var init_profiler = __esmMin((() => {
	Profiler = class {
		constructor(logger) {
			this.logger = void 0;
			this.start = void 0;
			this.logger = logger;
			this.start = Date.now();
		}
		done(...args) {
			if (typeof args[args.length - 1] === "function") {
				console.warn("Callback function no longer supported as of winston@3.0.0");
				args.pop();
			}
			const info = typeof args[args.length - 1] === "object" ? args.pop() : {};
			info.level = info.level || "info";
			info.durationMs = Date.now() - this.start;
			return this.logger.log(info);
		}
	};
}));
//#endregion
//#region packages-utils/logger/src/logger.ts
var formatRegExp$1, Logger;
var init_logger = __esmMin((() => {
	init_profiler();
	init_types();
	formatRegExp$1 = /%[scdjifoO%]/g;
	Logger = class Logger {
		constructor(options, defaultMeta) {
			this.options = void 0;
			this.defaultMeta = void 0;
			this.options = options;
			this.defaultMeta = defaultMeta;
		}
		child(defaultMeta) {
			const defaultMetaNew = Object.assign({}, this.defaultMeta, defaultMeta);
			return new Logger(this.options, defaultMetaNew);
		}
		error(msg, ...splat) {
			return this.log("error", msg, ...splat);
		}
		warn(msg, ...splat) {
			return this.log("warn", msg, ...splat);
		}
		info(msg, ...splat) {
			return this.log("info", msg, ...splat);
		}
		http(msg, ...splat) {
			return this.log("http", msg, ...splat);
		}
		verbose(msg, ...splat) {
			return this.log("verbose", msg, ...splat);
		}
		debug(msg, ...splat) {
			return this.log("debug", msg, ...splat);
		}
		silly(msg, ...splat) {
			return this.log("silly", msg, ...splat);
		}
		log(level, msg, ...splat) {
			if (arguments.length === 1) {
				level[LEVEL] = level.level;
				this._addDefaultMeta(level);
				this.write(level);
				return this;
			}
			if (arguments.length === 2) {
				if (msg && typeof msg === "object") {
					msg[LEVEL] = msg.level = level;
					this._addDefaultMeta(msg);
					this.write(msg);
					return this;
				}
				msg = {
					[LEVEL]: level,
					level,
					message: msg
				};
				this._addDefaultMeta(msg);
				this.write(msg);
				return this;
			}
			const [meta] = splat;
			if (typeof meta === "object" && meta !== null) {
				if (!(msg && msg.match && msg.match(formatRegExp$1))) {
					const info = Object.assign({}, this.defaultMeta, meta, {
						[LEVEL]: level,
						[SPLAT]: splat,
						level,
						message: msg
					});
					if (meta.message) info.message = `${info.message} ${meta.message}`;
					if (meta.stack) info.stack = meta.stack;
					if (meta.cause) info.cause = meta.cause;
					this.write(info);
					return this;
				}
			}
			this.write(Object.assign({}, this.defaultMeta, {
				[LEVEL]: level,
				[SPLAT]: splat,
				level,
				message: msg
			}));
			return this;
		}
		write(logInfo) {
			const info = this.options.format.transform(logInfo, this.options.format.options);
			if (!info) return;
			const message = info[MESSAGE];
			if (Array.isArray(message)) console.log(...message);
			else console.log(message);
		}
		startTimer() {
			return new Profiler(this);
		}
		_addDefaultMeta(logInfo) {
			if (this.defaultMeta) Object.assign(logInfo, this.defaultMeta);
		}
		end() {}
	};
}));
//#endregion
//#region packages-utils/logger/src/printf.ts
function print(opts) {
	return new Printf(opts);
}
var Printf;
var init_printf = __esmMin((() => {
	init_types();
	Printf = class {
		constructor(templateFn) {
			this.template = void 0;
			this.template = templateFn;
		}
		transform(info) {
			info[MESSAGE] = this.template(info);
			return info;
		}
	};
}));
//#endregion
//#region packages-utils/logger/src/splatter.ts
function splatter(opts) {
	return new Splatter(opts);
}
var formatRegExp, escapedPercent, Splatter;
var init_splatter = __esmMin((() => {
	init_dist();
	init_types();
	formatRegExp = /%[scdjifoO%]/g;
	escapedPercent = /%%/g;
	Splatter = class {
		constructor(opts) {
			this.options = void 0;
			this.options = opts;
		}
		_splat(info, tokens) {
			const msg = info.message;
			const splat = info[SPLAT] || info.splat || [];
			const percents = msg.match(escapedPercent);
			const escapes = percents && percents.length || 0;
			const extraSplat = tokens.length - escapes - splat.length;
			const metas = extraSplat < 0 ? splat.splice(extraSplat, -1 * extraSplat) : [];
			const metalen = metas.length;
			if (metalen) for (let i = 0; i < metalen; i++) Object.assign(info, metas[i]);
			info.message = getText(msg, ...splat);
			return info;
		}
		transform(info) {
			const msg = info.message;
			const splat = info[SPLAT] || info.splat;
			if (!splat || !splat.length) return info;
			const tokens = msg && msg.match && msg.match(formatRegExp);
			if (!tokens && (splat || splat.length)) {
				const metas = splat.length > 1 ? splat.splice(0) : splat;
				const metalen = metas.length;
				if (metalen) for (let i = 0; i < metalen; i++) Object.assign(info, metas[i]);
				return info;
			}
			if (tokens) return this._splat(info, tokens);
			return info;
		}
	};
}));
//#endregion
//#region packages-utils/logger/src/timestamp.ts
var timestamp;
var init_timestamp = __esmMin((() => {
	init_fecha();
	init_format();
	timestamp = format((info, opts = {}) => {
		if (opts.format) info.timestamp = typeof opts.format === "function" ? opts.format() : fecha.format(/* @__PURE__ */ new Date(), opts.format);
		if (!info.timestamp) info.timestamp = (/* @__PURE__ */ new Date()).toISOString();
		if (opts.alias) info[opts.alias] = info.timestamp;
		return info;
	});
}));
//#endregion
//#region packages-utils/logger/src/index.ts
var init_src = __esmMin((() => {
	init_cascade();
	init_colorize();
	init_combine();
	init_errors();
	init_format();
	init_logger();
	init_printf();
	init_profiler();
	init_splatter();
	init_timestamp();
	init_types();
}));
//#endregion
export { Logger as a, format as c, NpmConfigSetLevels as d, print as i, colorize as l, timestamp as n, errors as o, splatter as r, combine as s, init_src as t, colorizer as u };
