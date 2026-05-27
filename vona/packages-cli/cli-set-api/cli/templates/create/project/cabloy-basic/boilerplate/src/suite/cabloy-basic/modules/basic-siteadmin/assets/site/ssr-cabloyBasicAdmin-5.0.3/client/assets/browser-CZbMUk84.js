import { n as __esmMin } from "./rolldown-runtime-lkMnaVCm.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/nodes/identity.js
function isCollection(node) {
	if (node && typeof node === "object") switch (node[NODE_TYPE]) {
		case MAP:
		case SEQ: return true;
	}
	return false;
}
function isNode(node) {
	if (node && typeof node === "object") switch (node[NODE_TYPE]) {
		case ALIAS:
		case MAP:
		case SCALAR:
		case SEQ: return true;
	}
	return false;
}
var ALIAS, DOC, MAP, PAIR, SCALAR, SEQ, NODE_TYPE, isAlias, isDocument, isMap, isPair, isScalar, isSeq, hasAnchor;
var init_identity = __esmMin((() => {
	ALIAS = Symbol.for("yaml.alias");
	DOC = Symbol.for("yaml.document");
	MAP = Symbol.for("yaml.map");
	PAIR = Symbol.for("yaml.pair");
	SCALAR = Symbol.for("yaml.scalar");
	SEQ = Symbol.for("yaml.seq");
	NODE_TYPE = Symbol.for("yaml.node.type");
	isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS;
	isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC;
	isMap = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP;
	isPair = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR;
	isScalar = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR;
	isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
	hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/visit.js
/**
* Apply a visitor to an AST node or document.
*
* Walks through the tree (depth-first) starting from `node`, calling a
* `visitor` function with three arguments:
*   - `key`: For sequence values and map `Pair`, the node's index in the
*     collection. Within a `Pair`, `'key'` or `'value'`, correspondingly.
*     `null` for the root node.
*   - `node`: The current node.
*   - `path`: The ancestry of the current node.
*
* The return value of the visitor may be used to control the traversal:
*   - `undefined` (default): Do nothing and continue
*   - `visit.SKIP`: Do not visit the children of this node, continue with next
*     sibling
*   - `visit.BREAK`: Terminate traversal completely
*   - `visit.REMOVE`: Remove the current node, then continue with the next one
*   - `Node`: Replace the current node, then continue by visiting it
*   - `number`: While iterating the items of a sequence or map, set the index
*     of the next step. This is useful especially if the index of the current
*     node has changed.
*
* If `visitor` is a single function, it will be called with all values
* encountered in the tree, including e.g. `null` values. Alternatively,
* separate visitor functions may be defined for each `Map`, `Pair`, `Seq`,
* `Alias` and `Scalar` node. To define the same visitor function for more than
* one node type, use the `Collection` (map and seq), `Value` (map, seq & scalar)
* and `Node` (alias, map, seq & scalar) targets. Of all these, only the most
* specific defined one will be used for each node.
*/
function visit$1(node, visitor) {
	const visitor_ = initVisitor(visitor);
	if (isDocument(node)) {
		if (visit_(null, node.contents, visitor_, Object.freeze([node])) === REMOVE$1) node.contents = null;
	} else visit_(null, node, visitor_, Object.freeze([]));
}
function visit_(key, node, visitor, path) {
	const ctrl = callVisitor(key, node, visitor, path);
	if (isNode(ctrl) || isPair(ctrl)) {
		replaceNode(key, path, ctrl);
		return visit_(key, ctrl, visitor, path);
	}
	if (typeof ctrl !== "symbol") {
		if (isCollection(node)) {
			path = Object.freeze(path.concat(node));
			for (let i = 0; i < node.items.length; ++i) {
				const ci = visit_(i, node.items[i], visitor, path);
				if (typeof ci === "number") i = ci - 1;
				else if (ci === BREAK$1) return BREAK$1;
				else if (ci === REMOVE$1) {
					node.items.splice(i, 1);
					i -= 1;
				}
			}
		} else if (isPair(node)) {
			path = Object.freeze(path.concat(node));
			const ck = visit_("key", node.key, visitor, path);
			if (ck === BREAK$1) return BREAK$1;
			else if (ck === REMOVE$1) node.key = null;
			const cv = visit_("value", node.value, visitor, path);
			if (cv === BREAK$1) return BREAK$1;
			else if (cv === REMOVE$1) node.value = null;
		}
	}
	return ctrl;
}
/**
* Apply an async visitor to an AST node or document.
*
* Walks through the tree (depth-first) starting from `node`, calling a
* `visitor` function with three arguments:
*   - `key`: For sequence values and map `Pair`, the node's index in the
*     collection. Within a `Pair`, `'key'` or `'value'`, correspondingly.
*     `null` for the root node.
*   - `node`: The current node.
*   - `path`: The ancestry of the current node.
*
* The return value of the visitor may be used to control the traversal:
*   - `Promise`: Must resolve to one of the following values
*   - `undefined` (default): Do nothing and continue
*   - `visit.SKIP`: Do not visit the children of this node, continue with next
*     sibling
*   - `visit.BREAK`: Terminate traversal completely
*   - `visit.REMOVE`: Remove the current node, then continue with the next one
*   - `Node`: Replace the current node, then continue by visiting it
*   - `number`: While iterating the items of a sequence or map, set the index
*     of the next step. This is useful especially if the index of the current
*     node has changed.
*
* If `visitor` is a single function, it will be called with all values
* encountered in the tree, including e.g. `null` values. Alternatively,
* separate visitor functions may be defined for each `Map`, `Pair`, `Seq`,
* `Alias` and `Scalar` node. To define the same visitor function for more than
* one node type, use the `Collection` (map and seq), `Value` (map, seq & scalar)
* and `Node` (alias, map, seq & scalar) targets. Of all these, only the most
* specific defined one will be used for each node.
*/
function visitAsync(_x, _x2) {
	return _visitAsync.apply(this, arguments);
}
function _visitAsync() {
	_visitAsync = _asyncToGenerator(function* (node, visitor) {
		const visitor_ = initVisitor(visitor);
		if (isDocument(node)) {
			if ((yield visitAsync_(null, node.contents, visitor_, Object.freeze([node]))) === REMOVE$1) node.contents = null;
		} else yield visitAsync_(null, node, visitor_, Object.freeze([]));
	});
	return _visitAsync.apply(this, arguments);
}
function visitAsync_(_x3, _x4, _x5, _x6) {
	return _visitAsync_.apply(this, arguments);
}
function _visitAsync_() {
	_visitAsync_ = _asyncToGenerator(function* (key, node, visitor, path) {
		const ctrl = yield callVisitor(key, node, visitor, path);
		if (isNode(ctrl) || isPair(ctrl)) {
			replaceNode(key, path, ctrl);
			return visitAsync_(key, ctrl, visitor, path);
		}
		if (typeof ctrl !== "symbol") {
			if (isCollection(node)) {
				path = Object.freeze(path.concat(node));
				for (let i = 0; i < node.items.length; ++i) {
					const ci = yield visitAsync_(i, node.items[i], visitor, path);
					if (typeof ci === "number") i = ci - 1;
					else if (ci === BREAK$1) return BREAK$1;
					else if (ci === REMOVE$1) {
						node.items.splice(i, 1);
						i -= 1;
					}
				}
			} else if (isPair(node)) {
				path = Object.freeze(path.concat(node));
				const ck = yield visitAsync_("key", node.key, visitor, path);
				if (ck === BREAK$1) return BREAK$1;
				else if (ck === REMOVE$1) node.key = null;
				const cv = yield visitAsync_("value", node.value, visitor, path);
				if (cv === BREAK$1) return BREAK$1;
				else if (cv === REMOVE$1) node.value = null;
			}
		}
		return ctrl;
	});
	return _visitAsync_.apply(this, arguments);
}
function initVisitor(visitor) {
	if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) return Object.assign({
		Alias: visitor.Node,
		Map: visitor.Node,
		Scalar: visitor.Node,
		Seq: visitor.Node
	}, visitor.Value && {
		Map: visitor.Value,
		Scalar: visitor.Value,
		Seq: visitor.Value
	}, visitor.Collection && {
		Map: visitor.Collection,
		Seq: visitor.Collection
	}, visitor);
	return visitor;
}
function callVisitor(key, node, visitor, path) {
	var _visitor$Map, _visitor$Seq, _visitor$Pair, _visitor$Scalar, _visitor$Alias;
	if (typeof visitor === "function") return visitor(key, node, path);
	if (isMap(node)) return (_visitor$Map = visitor.Map) === null || _visitor$Map === void 0 ? void 0 : _visitor$Map.call(visitor, key, node, path);
	if (isSeq(node)) return (_visitor$Seq = visitor.Seq) === null || _visitor$Seq === void 0 ? void 0 : _visitor$Seq.call(visitor, key, node, path);
	if (isPair(node)) return (_visitor$Pair = visitor.Pair) === null || _visitor$Pair === void 0 ? void 0 : _visitor$Pair.call(visitor, key, node, path);
	if (isScalar(node)) return (_visitor$Scalar = visitor.Scalar) === null || _visitor$Scalar === void 0 ? void 0 : _visitor$Scalar.call(visitor, key, node, path);
	if (isAlias(node)) return (_visitor$Alias = visitor.Alias) === null || _visitor$Alias === void 0 ? void 0 : _visitor$Alias.call(visitor, key, node, path);
}
function replaceNode(key, path, node) {
	const parent = path[path.length - 1];
	if (isCollection(parent)) parent.items[key] = node;
	else if (isPair(parent)) if (key === "key") parent.key = node;
	else parent.value = node;
	else if (isDocument(parent)) parent.contents = node;
	else {
		const pt = isAlias(parent) ? "alias" : "scalar";
		throw new Error(`Cannot replace node with ${pt} parent`);
	}
}
var BREAK$1, SKIP$1, REMOVE$1;
var init_visit = __esmMin((() => {
	init_identity();
	init_asyncToGenerator();
	BREAK$1 = Symbol("break visit");
	SKIP$1 = Symbol("skip children");
	REMOVE$1 = Symbol("remove node");
	/** Terminate visit traversal completely */
	visit$1.BREAK = BREAK$1;
	/** Do not visit the children of the current node */
	visit$1.SKIP = SKIP$1;
	/** Remove the current node */
	visit$1.REMOVE = REMOVE$1;
	/** Terminate visit traversal completely */
	visitAsync.BREAK = BREAK$1;
	/** Do not visit the children of the current node */
	visitAsync.SKIP = SKIP$1;
	/** Remove the current node */
	visitAsync.REMOVE = REMOVE$1;
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/doc/directives.js
var escapeChars, escapeTagName, Directives;
var init_directives = __esmMin((() => {
	init_identity();
	init_visit();
	escapeChars = {
		"!": "%21",
		",": "%2C",
		"[": "%5B",
		"]": "%5D",
		"{": "%7B",
		"}": "%7D"
	};
	escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);
	Directives = class Directives {
		constructor(yaml, tags) {
			/**
			* The directives-end/doc-start marker `---`. If `null`, a marker may still be
			* included in the document's stringified representation.
			*/
			this.docStart = null;
			/** The doc-end marker `...`.  */
			this.docEnd = false;
			this.yaml = Object.assign({}, Directives.defaultYaml, yaml);
			this.tags = Object.assign({}, Directives.defaultTags, tags);
		}
		clone() {
			const copy = new Directives(this.yaml, this.tags);
			copy.docStart = this.docStart;
			return copy;
		}
		/**
		* During parsing, get a Directives instance for the current document and
		* update the stream state according to the current version's spec.
		*/
		atDocument() {
			const res = new Directives(this.yaml, this.tags);
			switch (this.yaml.version) {
				case "1.1":
					this.atNextDocument = true;
					break;
				case "1.2":
					this.atNextDocument = false;
					this.yaml = {
						explicit: Directives.defaultYaml.explicit,
						version: "1.2"
					};
					this.tags = Object.assign({}, Directives.defaultTags);
					break;
			}
			return res;
		}
		/**
		* @param onError - May be called even if the action was successful
		* @returns `true` on success
		*/
		add(line, onError) {
			if (this.atNextDocument) {
				this.yaml = {
					explicit: Directives.defaultYaml.explicit,
					version: "1.1"
				};
				this.tags = Object.assign({}, Directives.defaultTags);
				this.atNextDocument = false;
			}
			const parts = line.trim().split(/[ \t]+/);
			const name = parts.shift();
			switch (name) {
				case "%TAG": {
					if (parts.length !== 2) {
						onError(0, "%TAG directive should contain exactly two parts");
						if (parts.length < 2) return false;
					}
					const [handle, prefix] = parts;
					this.tags[handle] = prefix;
					return true;
				}
				case "%YAML": {
					this.yaml.explicit = true;
					if (parts.length !== 1) {
						onError(0, "%YAML directive should contain exactly one part");
						return false;
					}
					const [version] = parts;
					if (version === "1.1" || version === "1.2") {
						this.yaml.version = version;
						return true;
					} else {
						const isValid = /^\d+\.\d+$/.test(version);
						onError(6, `Unsupported YAML version ${version}`, isValid);
						return false;
					}
				}
				default:
					onError(0, `Unknown directive ${name}`, true);
					return false;
			}
		}
		/**
		* Resolves a tag, matching handles to those defined in %TAG directives.
		*
		* @returns Resolved tag, which may also be the non-specific tag `'!'` or a
		*   `'!local'` tag, or `null` if unresolvable.
		*/
		tagName(source, onError) {
			if (source === "!") return "!";
			if (source[0] !== "!") {
				onError(`Not a valid tag: ${source}`);
				return null;
			}
			if (source[1] === "<") {
				const verbatim = source.slice(2, -1);
				if (verbatim === "!" || verbatim === "!!") {
					onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
					return null;
				}
				if (source[source.length - 1] !== ">") onError("Verbatim tags must end with a >");
				return verbatim;
			}
			const [, handle, suffix] = source.match(/* @__PURE__ */ new RegExp("^(.*!)([^!]*)$", "s"));
			if (!suffix) onError(`The ${source} tag has no suffix`);
			const prefix = this.tags[handle];
			if (prefix) try {
				return prefix + decodeURIComponent(suffix);
			} catch (error) {
				onError(String(error));
				return null;
			}
			if (handle === "!") return source;
			onError(`Could not resolve tag: ${source}`);
			return null;
		}
		/**
		* Given a fully resolved tag, returns its printable string form,
		* taking into account current tag prefixes and defaults.
		*/
		tagString(tag) {
			for (const [handle, prefix] of Object.entries(this.tags)) if (tag.startsWith(prefix)) return handle + escapeTagName(tag.substring(prefix.length));
			return tag[0] === "!" ? tag : `!<${tag}>`;
		}
		toString(doc) {
			const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
			const tagEntries = Object.entries(this.tags);
			let tagNames;
			if (doc && tagEntries.length > 0 && isNode(doc.contents)) {
				const tags = {};
				visit$1(doc.contents, (_key, node) => {
					if (isNode(node) && node.tag) tags[node.tag] = true;
				});
				tagNames = Object.keys(tags);
			} else tagNames = [];
			for (const [handle, prefix] of tagEntries) {
				if (handle === "!!" && prefix === "tag:yaml.org,2002:") continue;
				if (!doc || tagNames.some((tn) => tn.startsWith(prefix))) lines.push(`%TAG ${handle} ${prefix}`);
			}
			return lines.join("\n");
		}
	};
	Directives.defaultYaml = {
		explicit: false,
		version: "1.2"
	};
	Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/doc/anchors.js
/**
* Verify that the input string is a valid anchor.
*
* Will throw on errors.
*/
function anchorIsValid(anchor) {
	if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
		const msg = `Anchor must not contain whitespace or control characters: ${JSON.stringify(anchor)}`;
		throw new Error(msg);
	}
	return true;
}
var init_anchors = __esmMin((() => {
	init_visit();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/doc/applyReviver.js
/**
* Applies the JSON.parse reviver algorithm as defined in the ECMA-262 spec,
* in section 24.5.1.1 "Runtime Semantics: InternalizeJSONProperty" of the
* 2021 edition: https://tc39.es/ecma262/#sec-json.parse
*
* Includes extensions for handling Map and Set objects.
*/
function applyReviver(reviver, obj, key, val) {
	if (val && typeof val === "object") if (Array.isArray(val)) for (let i = 0, len = val.length; i < len; ++i) {
		const v0 = val[i];
		const v1 = applyReviver(reviver, val, String(i), v0);
		if (v1 === void 0) delete val[i];
		else if (v1 !== v0) val[i] = v1;
	}
	else if (val instanceof Map) for (const k of Array.from(val.keys())) {
		const v0 = val.get(k);
		const v1 = applyReviver(reviver, val, k, v0);
		if (v1 === void 0) val.delete(k);
		else if (v1 !== v0) val.set(k, v1);
	}
	else if (val instanceof Set) for (const v0 of Array.from(val)) {
		const v1 = applyReviver(reviver, val, v0, v0);
		if (v1 === void 0) val.delete(v0);
		else if (v1 !== v0) {
			val.delete(v0);
			val.add(v1);
		}
	}
	else for (const [k, v0] of Object.entries(val)) {
		const v1 = applyReviver(reviver, val, k, v0);
		if (v1 === void 0) delete val[k];
		else if (v1 !== v0) val[k] = v1;
	}
	return reviver.call(obj, key, val);
}
var init_applyReviver = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/nodes/toJS.js
/**
* Recursively convert any node or its contents to native JavaScript
*
* @param value - The input value
* @param arg - If `value` defines a `toJSON()` method, use this
*   as its first argument
* @param ctx - Conversion context, originally set in Document#toJS(). If
*   `{ keep: true }` is not set, output should be suitable for JSON
*   stringification.
*/
function toJS(value, arg, ctx) {
	if (Array.isArray(value)) return value.map((v, i) => toJS(v, String(i), ctx));
	if (value && typeof value.toJSON === "function") {
		if (!ctx || !hasAnchor(value)) return value.toJSON(arg, ctx);
		const data = {
			aliasCount: 0,
			count: 1,
			res: void 0
		};
		ctx.anchors.set(value, data);
		ctx.onCreate = (res) => {
			data.res = res;
			delete ctx.onCreate;
		};
		const res = value.toJSON(arg, ctx);
		if (ctx.onCreate) ctx.onCreate(res);
		return res;
	}
	if (typeof value === "bigint" && !(ctx === null || ctx === void 0 ? void 0 : ctx.keep)) return Number(value);
	return value;
}
var init_toJS = __esmMin((() => {
	init_identity();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/nodes/Node.js
var NodeBase;
var init_Node = __esmMin((() => {
	init_applyReviver();
	init_identity();
	init_toJS();
	NodeBase = class {
		constructor(type) {
			Object.defineProperty(this, NODE_TYPE, { value: type });
		}
		/** Create a copy of this node.  */
		clone() {
			const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
			if (this.range) copy.range = this.range.slice();
			return copy;
		}
		/** A plain JavaScript representation of this node. */
		toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
			if (!isDocument(doc)) throw new TypeError("A document argument is required");
			const ctx = {
				anchors: /* @__PURE__ */ new Map(),
				doc,
				keep: true,
				mapAsMap: mapAsMap === true,
				mapKeyWarned: false,
				maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
			};
			const res = toJS(this, "", ctx);
			if (typeof onAnchor === "function") for (const { count, res } of ctx.anchors.values()) onAnchor(res, count);
			return typeof reviver === "function" ? applyReviver(reviver, { "": res }, "", res) : res;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/nodes/Alias.js
function getAliasCount(doc, node, anchors) {
	if (isAlias(node)) {
		const source = node.resolve(doc);
		const anchor = anchors && source && anchors.get(source);
		return anchor ? anchor.count * anchor.aliasCount : 0;
	} else if (isCollection(node)) {
		let count = 0;
		for (const item of node.items) {
			const c = getAliasCount(doc, item, anchors);
			if (c > count) count = c;
		}
		return count;
	} else if (isPair(node)) {
		const kc = getAliasCount(doc, node.key, anchors);
		const vc = getAliasCount(doc, node.value, anchors);
		return Math.max(kc, vc);
	}
	return 1;
}
var Alias;
var init_Alias = __esmMin((() => {
	init_anchors();
	init_visit();
	init_identity();
	init_Node();
	init_toJS();
	Alias = class extends NodeBase {
		constructor(source) {
			super(ALIAS);
			this.source = source;
			Object.defineProperty(this, "tag", { set() {
				throw new Error("Alias nodes cannot have tags");
			} });
		}
		/**
		* Resolve the value of this alias within `doc`, finding the last
		* instance of the `source` anchor before this node.
		*/
		resolve(doc, ctx) {
			if ((ctx === null || ctx === void 0 ? void 0 : ctx.maxAliasCount) === 0) throw new ReferenceError("Alias resolution is disabled");
			let nodes;
			if (ctx === null || ctx === void 0 ? void 0 : ctx.aliasResolveCache) nodes = ctx.aliasResolveCache;
			else {
				nodes = [];
				visit$1(doc, { Node: (_key, node) => {
					if (isAlias(node) || hasAnchor(node)) nodes.push(node);
				} });
				if (ctx) ctx.aliasResolveCache = nodes;
			}
			let found = void 0;
			for (const node of nodes) {
				if (node === this) break;
				if (node.anchor === this.source) found = node;
			}
			return found;
		}
		toJSON(_arg, ctx) {
			if (!ctx) return { source: this.source };
			const { anchors, doc, maxAliasCount } = ctx;
			const source = this.resolve(doc, ctx);
			if (!source) {
				const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
				throw new ReferenceError(msg);
			}
			let data = anchors.get(source);
			if (!data) {
				toJS(source, null, ctx);
				data = anchors.get(source);
			}
			/* istanbul ignore if */
			if ((data === null || data === void 0 ? void 0 : data.res) === void 0) throw new ReferenceError("This should not happen: Alias anchor was not resolved?");
			if (maxAliasCount >= 0) {
				data.count += 1;
				if (data.aliasCount === 0) data.aliasCount = getAliasCount(doc, source, anchors);
				if (data.count * data.aliasCount > maxAliasCount) throw new ReferenceError("Excessive alias count indicates a resource exhaustion attack");
			}
			return data.res;
		}
		toString(ctx, _onComment, _onChompKeep) {
			const src = `*${this.source}`;
			if (ctx) {
				anchorIsValid(this.source);
				if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
					const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
					throw new Error(msg);
				}
				if (ctx.implicitKey) return `${src} `;
			}
			return src;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/nodes/Scalar.js
var isScalarValue, Scalar;
var init_Scalar = __esmMin((() => {
	init_identity();
	init_Node();
	init_toJS();
	isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";
	Scalar = class extends NodeBase {
		constructor(value) {
			super(SCALAR);
			this.value = value;
		}
		toJSON(arg, ctx) {
			return (ctx === null || ctx === void 0 ? void 0 : ctx.keep) ? this.value : toJS(this.value, arg, ctx);
		}
		toString() {
			return String(this.value);
		}
	};
	Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
	Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
	Scalar.PLAIN = "PLAIN";
	Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
	Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/doc/createNode.js
function findTagObject(value, tagName, tags) {
	if (tagName) {
		var _match$find;
		const match = tags.filter((t) => t.tag === tagName);
		const tagObj = (_match$find = match.find((t) => !t.format)) !== null && _match$find !== void 0 ? _match$find : match[0];
		if (!tagObj) throw new Error(`Tag ${tagName} not found`);
		return tagObj;
	}
	return tags.find((t) => {
		var _t$identify;
		return ((_t$identify = t.identify) === null || _t$identify === void 0 ? void 0 : _t$identify.call(t, value)) && !t.format;
	});
}
function createNode(value, tagName, ctx) {
	var _tagObj$nodeClass;
	if (isDocument(value)) value = value.contents;
	if (isNode(value)) return value;
	if (isPair(value)) {
		var _ctx$schema$MAP$creat, _ctx$schema$MAP;
		const map = (_ctx$schema$MAP$creat = (_ctx$schema$MAP = ctx.schema[MAP]).createNode) === null || _ctx$schema$MAP$creat === void 0 ? void 0 : _ctx$schema$MAP$creat.call(_ctx$schema$MAP, ctx.schema, null, ctx);
		map.items.push(value);
		return map;
	}
	if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) value = value.valueOf();
	const { aliasDuplicateObjects, onAnchor, onTagObj, schema, sourceObjects } = ctx;
	let ref = void 0;
	if (aliasDuplicateObjects && value && typeof value === "object") {
		ref = sourceObjects.get(value);
		if (ref) {
			var _ref$anchor;
			(_ref$anchor = ref.anchor) !== null && _ref$anchor !== void 0 || (ref.anchor = onAnchor(value));
			return new Alias(ref.anchor);
		} else {
			ref = {
				anchor: null,
				node: null
			};
			sourceObjects.set(value, ref);
		}
	}
	if (tagName === null || tagName === void 0 ? void 0 : tagName.startsWith("!!")) tagName = defaultTagPrefix + tagName.slice(2);
	let tagObj = findTagObject(value, tagName, schema.tags);
	if (!tagObj) {
		if (value && typeof value.toJSON === "function") value = value.toJSON();
		if (!value || typeof value !== "object") {
			const node = new Scalar(value);
			if (ref) ref.node = node;
			return node;
		}
		tagObj = value instanceof Map ? schema[MAP] : Symbol.iterator in Object(value) ? schema[SEQ] : schema[MAP];
	}
	if (onTagObj) {
		onTagObj(tagObj);
		delete ctx.onTagObj;
	}
	const node = (tagObj === null || tagObj === void 0 ? void 0 : tagObj.createNode) ? tagObj.createNode(ctx.schema, value, ctx) : typeof (tagObj === null || tagObj === void 0 || (_tagObj$nodeClass = tagObj.nodeClass) === null || _tagObj$nodeClass === void 0 ? void 0 : _tagObj$nodeClass.from) === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar(value);
	if (tagName) node.tag = tagName;
	else if (!tagObj.default) node.tag = tagObj.tag;
	if (ref) ref.node = node;
	return node;
}
var defaultTagPrefix;
var init_createNode = __esmMin((() => {
	init_Alias();
	init_identity();
	init_Scalar();
	defaultTagPrefix = "tag:yaml.org,2002:";
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/nodes/Collection.js
function collectionFromPath(schema, path, value) {
	let v = value;
	for (let i = path.length - 1; i >= 0; --i) {
		const k = path[i];
		if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
			const a = [];
			a[k] = v;
			v = a;
		} else v = new Map([[k, v]]);
	}
	return createNode(v, void 0, {
		aliasDuplicateObjects: false,
		keepUndefined: false,
		onAnchor: () => {
			throw new Error("This should not happen, please report a bug.");
		},
		schema,
		sourceObjects: /* @__PURE__ */ new Map()
	});
}
var isEmptyPath, Collection;
var init_Collection = __esmMin((() => {
	init_createNode();
	init_identity();
	init_Node();
	isEmptyPath = (path) => path == null || typeof path === "object" && !!path[Symbol.iterator]().next().done;
	Collection = class extends NodeBase {
		constructor(type, schema) {
			super(type);
			Object.defineProperty(this, "schema", {
				value: schema,
				configurable: true,
				enumerable: false,
				writable: true
			});
		}
		/**
		* Create a copy of this collection.
		*
		* @param schema - If defined, overwrites the original's schema
		*/
		clone(schema) {
			const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
			if (schema) copy.schema = schema;
			copy.items = copy.items.map((it) => isNode(it) || isPair(it) ? it.clone(schema) : it);
			if (this.range) copy.range = this.range.slice();
			return copy;
		}
		/**
		* Adds a value to the collection. For `!!map` and `!!omap` the value must
		* be a Pair instance or a `{ key, value }` object, which may not have a key
		* that already exists in the map.
		*/
		addIn(path, value) {
			if (isEmptyPath(path)) this.add(value);
			else {
				const [key, ...rest] = path;
				const node = this.get(key, true);
				if (isCollection(node)) node.addIn(rest, value);
				else if (node === void 0 && this.schema) this.set(key, collectionFromPath(this.schema, rest, value));
				else throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
			}
		}
		/**
		* Removes a value from the collection.
		* @returns `true` if the item was found and removed.
		*/
		deleteIn(path) {
			const [key, ...rest] = path;
			if (rest.length === 0) return this.delete(key);
			const node = this.get(key, true);
			if (isCollection(node)) return node.deleteIn(rest);
			else throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
		}
		/**
		* Returns item at `key`, or `undefined` if not found. By default unwraps
		* scalar values from their surrounding node; to disable set `keepScalar` to
		* `true` (collections are always returned intact).
		*/
		getIn(path, keepScalar) {
			const [key, ...rest] = path;
			const node = this.get(key, true);
			if (rest.length === 0) return !keepScalar && isScalar(node) ? node.value : node;
			else return isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
		}
		hasAllNullValues(allowScalar) {
			return this.items.every((node) => {
				if (!isPair(node)) return false;
				const n = node.value;
				return n == null || allowScalar && isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
			});
		}
		/**
		* Checks if the collection includes a value with the key `key`.
		*/
		hasIn(path) {
			const [key, ...rest] = path;
			if (rest.length === 0) return this.has(key);
			const node = this.get(key, true);
			return isCollection(node) ? node.hasIn(rest) : false;
		}
		/**
		* Sets a value in this collection. For `!!set`, `value` needs to be a
		* boolean to add/remove the item from the set.
		*/
		setIn(path, value) {
			const [key, ...rest] = path;
			if (rest.length === 0) this.set(key, value);
			else {
				const node = this.get(key, true);
				if (isCollection(node)) node.setIn(rest, value);
				else if (node === void 0 && this.schema) this.set(key, collectionFromPath(this.schema, rest, value));
				else throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
			}
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/stringify/stringifyComment.js
function indentComment(comment, indent) {
	if (/^\n+$/.test(comment)) return comment.substring(1);
	return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
}
var stringifyComment, lineComment;
var init_stringifyComment = __esmMin((() => {
	stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, "#");
	lineComment = (str, indent, comment) => str.endsWith("\n") ? indentComment(comment, indent) : comment.includes("\n") ? "\n" + indentComment(comment, indent) : (str.endsWith(" ") ? "" : " ") + comment;
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/stringify/foldFlowLines.js
/**
* Tries to keep input at up to `lineWidth` characters, splitting only on spaces
* not followed by newlines or spaces unless `mode` is `'quoted'`. Lines are
* terminated with `\n` and started with `indent`.
*/
function foldFlowLines(text, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
	if (!lineWidth || lineWidth < 0) return text;
	if (lineWidth < minContentWidth) minContentWidth = 0;
	const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
	if (text.length <= endStep) return text;
	const folds = [];
	const escapedFolds = {};
	let end = lineWidth - indent.length;
	if (typeof indentAtStart === "number") if (indentAtStart > lineWidth - Math.max(2, minContentWidth)) folds.push(0);
	else end = lineWidth - indentAtStart;
	let split = void 0;
	let prev = void 0;
	let overflow = false;
	let i = -1;
	let escStart = -1;
	let escEnd = -1;
	if (mode === "block") {
		i = consumeMoreIndentedLines(text, i, indent.length);
		if (i !== -1) end = i + endStep;
	}
	for (let ch; ch = text[i += 1];) {
		if (mode === "quoted" && ch === "\\") {
			escStart = i;
			switch (text[i + 1]) {
				case "x":
					i += 3;
					break;
				case "u":
					i += 5;
					break;
				case "U":
					i += 9;
					break;
				default: i += 1;
			}
			escEnd = i;
		}
		if (ch === "\n") {
			if (mode === "block") i = consumeMoreIndentedLines(text, i, indent.length);
			end = i + indent.length + endStep;
			split = void 0;
		} else {
			if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
				const next = text[i + 1];
				if (next && next !== " " && next !== "\n" && next !== "	") split = i;
			}
			if (i >= end) if (split) {
				folds.push(split);
				end = split + endStep;
				split = void 0;
			} else if (mode === "quoted") {
				while (prev === " " || prev === "	") {
					prev = ch;
					ch = text[i += 1];
					overflow = true;
				}
				const j = i > escEnd + 1 ? i - 2 : escStart - 1;
				if (escapedFolds[j]) return text;
				folds.push(j);
				escapedFolds[j] = true;
				end = j + endStep;
				split = void 0;
			} else overflow = true;
		}
		prev = ch;
	}
	if (overflow && onOverflow) onOverflow();
	if (folds.length === 0) return text;
	if (onFold) onFold();
	let res = text.slice(0, folds[0]);
	for (let i = 0; i < folds.length; ++i) {
		const fold = folds[i];
		const end = folds[i + 1] || text.length;
		if (fold === 0) res = `\n${indent}${text.slice(0, end)}`;
		else {
			if (mode === "quoted" && escapedFolds[fold]) res += `${text[fold]}\\`;
			res += `\n${indent}${text.slice(fold + 1, end)}`;
		}
	}
	return res;
}
/**
* Presumes `i + 1` is at the start of a line
* @returns index of last newline in more-indented block
*/
function consumeMoreIndentedLines(text, i, indent) {
	let end = i;
	let start = i + 1;
	let ch = text[start];
	while (ch === " " || ch === "	") if (i < start + indent) ch = text[++i];
	else {
		do
			ch = text[++i];
		while (ch && ch !== "\n");
		end = i;
		start = i + 1;
		ch = text[start];
	}
	return end;
}
var FOLD_FLOW, FOLD_BLOCK, FOLD_QUOTED;
var init_foldFlowLines = __esmMin((() => {
	FOLD_FLOW = "flow";
	FOLD_BLOCK = "block";
	FOLD_QUOTED = "quoted";
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/stringify/stringifyString.js
function lineLengthOverLimit(str, lineWidth, indentLength) {
	if (!lineWidth || lineWidth < 0) return false;
	const limit = lineWidth - indentLength;
	const strLen = str.length;
	if (strLen <= limit) return false;
	for (let i = 0, start = 0; i < strLen; ++i) if (str[i] === "\n") {
		if (i - start > limit) return true;
		start = i + 1;
		if (strLen - start <= limit) return false;
	}
	return true;
}
function doubleQuotedString(value, ctx) {
	const json = JSON.stringify(value);
	if (ctx.options.doubleQuotedAsJSON) return json;
	const { implicitKey } = ctx;
	const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
	const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
	let str = "";
	let start = 0;
	for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
		if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
			str += json.slice(start, i) + "\\ ";
			i += 1;
			start = i;
			ch = "\\";
		}
		if (ch === "\\") switch (json[i + 1]) {
			case "u":
				{
					str += json.slice(start, i);
					const code = json.substr(i + 2, 4);
					switch (code) {
						case "0000":
							str += "\\0";
							break;
						case "0007":
							str += "\\a";
							break;
						case "000b":
							str += "\\v";
							break;
						case "001b":
							str += "\\e";
							break;
						case "0085":
							str += "\\N";
							break;
						case "00a0":
							str += "\\_";
							break;
						case "2028":
							str += "\\L";
							break;
						case "2029":
							str += "\\P";
							break;
						default: if (code.substr(0, 2) === "00") str += "\\x" + code.substr(2);
						else str += json.substr(i, 6);
					}
					i += 5;
					start = i + 1;
				}
				break;
			case "n":
				if (implicitKey || json[i + 2] === "\"" || json.length < minMultiLineLength) i += 1;
				else {
					str += json.slice(start, i) + "\n\n";
					while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== "\"") {
						str += "\n";
						i += 2;
					}
					str += indent;
					if (json[i + 2] === " ") str += "\\";
					i += 1;
					start = i + 1;
				}
				break;
			default: i += 1;
		}
	}
	str = start ? str + json.slice(start) : json;
	return implicitKey ? str : foldFlowLines(str, indent, FOLD_QUOTED, getFoldOptions(ctx, false));
}
function singleQuotedString(value, ctx) {
	if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes("\n") || /[ \t]\n|\n[ \t]/.test(value)) return doubleQuotedString(value, ctx);
	const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
	const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&\n${indent}`) + "'";
	return ctx.implicitKey ? res : foldFlowLines(res, indent, FOLD_FLOW, getFoldOptions(ctx, false));
}
function quotedString(value, ctx) {
	const { singleQuote } = ctx.options;
	let qs;
	if (singleQuote === false) qs = doubleQuotedString;
	else {
		const hasDouble = value.includes("\"");
		const hasSingle = value.includes("'");
		if (hasDouble && !hasSingle) qs = singleQuotedString;
		else if (hasSingle && !hasDouble) qs = doubleQuotedString;
		else qs = singleQuote ? singleQuotedString : doubleQuotedString;
	}
	return qs(value, ctx);
}
function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
	const { blockQuote, commentString, lineWidth } = ctx.options;
	if (!blockQuote || /\n[\t ]+$/.test(value)) return quotedString(value, ctx);
	const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
	const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.BLOCK_FOLDED ? false : type === Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
	if (!value) return literal ? "|\n" : ">\n";
	let chomp;
	let endStart;
	for (endStart = value.length; endStart > 0; --endStart) {
		const ch = value[endStart - 1];
		if (ch !== "\n" && ch !== "	" && ch !== " ") break;
	}
	let end = value.substring(endStart);
	const endNlPos = end.indexOf("\n");
	if (endNlPos === -1) chomp = "-";
	else if (value === end || endNlPos !== end.length - 1) {
		chomp = "+";
		if (onChompKeep) onChompKeep();
	} else chomp = "";
	if (end) {
		value = value.slice(0, -end.length);
		if (end[end.length - 1] === "\n") end = end.slice(0, -1);
		end = end.replace(blockEndNewlines, `$&${indent}`);
	}
	let startWithSpace = false;
	let startEnd;
	let startNlPos = -1;
	for (startEnd = 0; startEnd < value.length; ++startEnd) {
		const ch = value[startEnd];
		if (ch === " ") startWithSpace = true;
		else if (ch === "\n") startNlPos = startEnd;
		else break;
	}
	let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
	if (start) {
		value = value.substring(start.length);
		start = start.replace(/\n+/g, `$&${indent}`);
	}
	let header = (startWithSpace ? indent ? "2" : "1" : "") + chomp;
	if (comment) {
		header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
		if (onComment) onComment();
	}
	if (!literal) {
		const foldedValue = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
		let literalFallback = false;
		const foldOptions = getFoldOptions(ctx, true);
		if (blockQuote !== "folded" && type !== Scalar.BLOCK_FOLDED) foldOptions.onOverflow = () => {
			literalFallback = true;
		};
		const body = foldFlowLines(`${start}${foldedValue}${end}`, indent, FOLD_BLOCK, foldOptions);
		if (!literalFallback) return `>${header}\n${indent}${body}`;
	}
	value = value.replace(/\n+/g, `$&${indent}`);
	return `|${header}\n${indent}${start}${value}${end}`;
}
function plainString(item, ctx, onComment, onChompKeep) {
	const { type, value } = item;
	const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
	if (implicitKey && value.includes("\n") || inFlow && /[[\]{},]/.test(value)) return quotedString(value, ctx);
	if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) return implicitKey || inFlow || !value.includes("\n") ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
	if (!implicitKey && !inFlow && type !== Scalar.PLAIN && value.includes("\n")) return blockString(item, ctx, onComment, onChompKeep);
	if (containsDocumentMarker(value)) {
		if (indent === "") {
			ctx.forceBlockIndent = true;
			return blockString(item, ctx, onComment, onChompKeep);
		} else if (implicitKey && indent === indentStep) return quotedString(value, ctx);
	}
	const str = value.replace(/\n+/g, `$&\n${indent}`);
	if (actualString) {
		const test = (tag) => {
			var _tag$test;
			return tag.default && tag.tag !== "tag:yaml.org,2002:str" && ((_tag$test = tag.test) === null || _tag$test === void 0 ? void 0 : _tag$test.test(str));
		};
		const { compat, tags } = ctx.doc.schema;
		if (tags.some(test) || (compat === null || compat === void 0 ? void 0 : compat.some(test))) return quotedString(value, ctx);
	}
	return implicitKey ? str : foldFlowLines(str, indent, FOLD_FLOW, getFoldOptions(ctx, false));
}
function stringifyString(item, ctx, onComment, onChompKeep) {
	const { implicitKey, inFlow } = ctx;
	const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
	let { type } = item;
	if (type !== Scalar.QUOTE_DOUBLE) {
		if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value)) type = Scalar.QUOTE_DOUBLE;
	}
	const _stringify = (_type) => {
		switch (_type) {
			case Scalar.BLOCK_FOLDED:
			case Scalar.BLOCK_LITERAL: return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
			case Scalar.QUOTE_DOUBLE: return doubleQuotedString(ss.value, ctx);
			case Scalar.QUOTE_SINGLE: return singleQuotedString(ss.value, ctx);
			case Scalar.PLAIN: return plainString(ss, ctx, onComment, onChompKeep);
			default: return null;
		}
	};
	let res = _stringify(type);
	if (res === null) {
		const { defaultKeyType, defaultStringType } = ctx.options;
		const t = implicitKey && defaultKeyType || defaultStringType;
		res = _stringify(t);
		if (res === null) throw new Error(`Unsupported default string type ${t}`);
	}
	return res;
}
var getFoldOptions, containsDocumentMarker, blockEndNewlines;
var init_stringifyString = __esmMin((() => {
	init_Scalar();
	init_foldFlowLines();
	getFoldOptions = (ctx, isBlock) => ({
		indentAtStart: isBlock ? ctx.indent.length : ctx.indentAtStart,
		lineWidth: ctx.options.lineWidth,
		minContentWidth: ctx.options.minContentWidth
	});
	containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
	try {
		blockEndNewlines = /* @__PURE__ */ new RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
	} catch (_unused) {
		blockEndNewlines = /\n+(?!\n|$)/g;
	}
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/stringify/stringify.js
function createStringifyContext(doc, options) {
	const opt = Object.assign({
		blockQuote: true,
		commentString: stringifyComment,
		defaultKeyType: null,
		defaultStringType: "PLAIN",
		directives: null,
		doubleQuotedAsJSON: false,
		doubleQuotedMinMultiLineLength: 40,
		falseStr: "false",
		flowCollectionPadding: true,
		indentSeq: true,
		lineWidth: 80,
		minContentWidth: 20,
		nullStr: "null",
		simpleKeys: false,
		singleQuote: null,
		trailingComma: false,
		trueStr: "true",
		verifyAliasOrder: true
	}, doc.schema.toStringOptions, options);
	let inFlow;
	switch (opt.collectionStyle) {
		case "block":
			inFlow = false;
			break;
		case "flow":
			inFlow = true;
			break;
		default: inFlow = null;
	}
	return {
		anchors: /* @__PURE__ */ new Set(),
		doc,
		flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
		indent: "",
		indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
		inFlow,
		options: opt
	};
}
function getTagObject(tags, item) {
	if (item.tag) {
		var _match$find;
		const match = tags.filter((t) => t.tag === item.tag);
		if (match.length > 0) return (_match$find = match.find((t) => t.format === item.format)) !== null && _match$find !== void 0 ? _match$find : match[0];
	}
	let tagObj = void 0;
	let obj;
	if (isScalar(item)) {
		var _match$find2;
		obj = item.value;
		let match = tags.filter((t) => {
			var _t$identify;
			return (_t$identify = t.identify) === null || _t$identify === void 0 ? void 0 : _t$identify.call(t, obj);
		});
		if (match.length > 1) {
			const testMatch = match.filter((t) => t.test);
			if (testMatch.length > 0) match = testMatch;
		}
		tagObj = (_match$find2 = match.find((t) => t.format === item.format)) !== null && _match$find2 !== void 0 ? _match$find2 : match.find((t) => !t.format);
	} else {
		obj = item;
		tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
	}
	if (!tagObj) {
		var _obj$constructor$name, _obj$constructor;
		const name = (_obj$constructor$name = obj === null || obj === void 0 || (_obj$constructor = obj.constructor) === null || _obj$constructor === void 0 ? void 0 : _obj$constructor.name) !== null && _obj$constructor$name !== void 0 ? _obj$constructor$name : obj === null ? "null" : typeof obj;
		throw new Error(`Tag not resolved for ${name} value`);
	}
	return tagObj;
}
function stringifyProps(node, tagObj, { anchors, doc }) {
	var _node$tag;
	if (!doc.directives) return "";
	const props = [];
	const anchor = (isScalar(node) || isCollection(node)) && node.anchor;
	if (anchor && anchorIsValid(anchor)) {
		anchors.add(anchor);
		props.push(`&${anchor}`);
	}
	const tag = (_node$tag = node.tag) !== null && _node$tag !== void 0 ? _node$tag : tagObj.default ? null : tagObj.tag;
	if (tag) props.push(doc.directives.tagString(tag));
	return props.join(" ");
}
function stringify(item, ctx, onComment, onChompKeep) {
	var _tagObj, _ctx$indentAtStart;
	if (isPair(item)) return item.toString(ctx, onComment, onChompKeep);
	if (isAlias(item)) {
		var _ctx$resolvedAliases;
		if (ctx.doc.directives) return item.toString(ctx);
		if ((_ctx$resolvedAliases = ctx.resolvedAliases) === null || _ctx$resolvedAliases === void 0 ? void 0 : _ctx$resolvedAliases.has(item)) throw new TypeError(`Cannot stringify circular structure without alias nodes`);
		else {
			if (ctx.resolvedAliases) ctx.resolvedAliases.add(item);
			else ctx.resolvedAliases = new Set([item]);
			item = item.resolve(ctx.doc);
		}
	}
	let tagObj = void 0;
	const node = isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
	(_tagObj = tagObj) !== null && _tagObj !== void 0 || (tagObj = getTagObject(ctx.doc.schema.tags, node));
	const props = stringifyProps(node, tagObj, ctx);
	if (props.length > 0) ctx.indentAtStart = ((_ctx$indentAtStart = ctx.indentAtStart) !== null && _ctx$indentAtStart !== void 0 ? _ctx$indentAtStart : 0) + props.length + 1;
	const str = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : isScalar(node) ? stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
	if (!props) return str;
	return isScalar(node) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}\n${ctx.indent}${str}`;
}
var init_stringify = __esmMin((() => {
	init_anchors();
	init_identity();
	init_stringifyComment();
	init_stringifyString();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/stringify/stringifyPair.js
function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
	const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
	let keyComment = isNode(key) && key.comment || null;
	if (simpleKeys) {
		if (keyComment) throw new Error("With simple keys, key nodes cannot have comments");
		if (isCollection(key) || !isNode(key) && typeof key === "object") throw new Error("With simple keys, collection cannot be used as a key value");
	}
	let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || isCollection(key) || (isScalar(key) ? key.type === Scalar.BLOCK_FOLDED || key.type === Scalar.BLOCK_LITERAL : typeof key === "object"));
	ctx = Object.assign({}, ctx, {
		allNullValues: false,
		implicitKey: !explicitKey && (simpleKeys || !allNullValues),
		indent: indent + indentStep
	});
	let keyCommentDone = false;
	let chompKeep = false;
	let str = stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
	if (!explicitKey && !ctx.inFlow && str.length > 1024) {
		if (simpleKeys) throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
		explicitKey = true;
	}
	if (ctx.inFlow) {
		if (allNullValues || value == null) {
			if (keyCommentDone && onComment) onComment();
			return str === "" ? "?" : explicitKey ? `? ${str}` : str;
		}
	} else if (allNullValues && !simpleKeys || value == null && explicitKey) {
		str = `? ${str}`;
		if (keyComment && !keyCommentDone) str += lineComment(str, ctx.indent, commentString(keyComment));
		else if (chompKeep && onChompKeep) onChompKeep();
		return str;
	}
	if (keyCommentDone) keyComment = null;
	if (explicitKey) {
		if (keyComment) str += lineComment(str, ctx.indent, commentString(keyComment));
		str = `? ${str}\n${indent}:`;
	} else {
		str = `${str}:`;
		if (keyComment) str += lineComment(str, ctx.indent, commentString(keyComment));
	}
	let vsb, vcb, valueComment;
	if (isNode(value)) {
		vsb = !!value.spaceBefore;
		vcb = value.commentBefore;
		valueComment = value.comment;
	} else {
		vsb = false;
		vcb = null;
		valueComment = null;
		if (value && typeof value === "object") value = doc.createNode(value);
	}
	ctx.implicitKey = false;
	if (!explicitKey && !keyComment && isScalar(value)) ctx.indentAtStart = str.length + 1;
	chompKeep = false;
	if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && isSeq(value) && !value.flow && !value.tag && !value.anchor) ctx.indent = ctx.indent.substring(2);
	let valueCommentDone = false;
	const valueStr = stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
	let ws = " ";
	if (keyComment || vsb || vcb) {
		ws = vsb ? "\n" : "";
		if (vcb) {
			const cs = commentString(vcb);
			ws += `\n${indentComment(cs, ctx.indent)}`;
		}
		if (valueStr === "" && !ctx.inFlow) {
			if (ws === "\n" && valueComment) ws = "\n\n";
		} else ws += `\n${ctx.indent}`;
	} else if (!explicitKey && isCollection(value)) {
		var _ref, _ctx$inFlow;
		const vs0 = valueStr[0];
		const nl0 = valueStr.indexOf("\n");
		const hasNewline = nl0 !== -1;
		const flow = (_ref = (_ctx$inFlow = ctx.inFlow) !== null && _ctx$inFlow !== void 0 ? _ctx$inFlow : value.flow) !== null && _ref !== void 0 ? _ref : value.items.length === 0;
		if (hasNewline || !flow) {
			let hasPropsLine = false;
			if (hasNewline && (vs0 === "&" || vs0 === "!")) {
				let sp0 = valueStr.indexOf(" ");
				if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") sp0 = valueStr.indexOf(" ", sp0 + 1);
				if (sp0 === -1 || nl0 < sp0) hasPropsLine = true;
			}
			if (!hasPropsLine) ws = `\n${ctx.indent}`;
		}
	} else if (valueStr === "" || valueStr[0] === "\n") ws = "";
	str += ws + valueStr;
	if (ctx.inFlow) {
		if (valueCommentDone && onComment) onComment();
	} else if (valueComment && !valueCommentDone) str += lineComment(str, ctx.indent, commentString(valueComment));
	else if (chompKeep && onChompKeep) onChompKeep();
	return str;
}
var init_stringifyPair = __esmMin((() => {
	init_identity();
	init_Scalar();
	init_stringify();
	init_stringifyComment();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/log.js
function warn(logLevel, warning) {
	if (logLevel === "debug" || logLevel === "warn") console.warn(warning);
}
var init_log = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/schema/yaml-1.1/merge.js
function addMergeToJSMap(ctx, map, value) {
	const source = resolveAliasValue(ctx, value);
	if (isSeq(source)) for (const it of source.items) mergeValue(ctx, map, it);
	else if (Array.isArray(source)) for (const it of source) mergeValue(ctx, map, it);
	else mergeValue(ctx, map, source);
}
function mergeValue(ctx, map, value) {
	const source = resolveAliasValue(ctx, value);
	if (!isMap(source)) throw new Error("Merge sources must be maps or map aliases");
	const srcMap = source.toJSON(null, ctx, Map);
	for (const [key, value] of srcMap) if (map instanceof Map) {
		if (!map.has(key)) map.set(key, value);
	} else if (map instanceof Set) map.add(key);
	else if (!Object.prototype.hasOwnProperty.call(map, key)) Object.defineProperty(map, key, {
		value,
		writable: true,
		enumerable: true,
		configurable: true
	});
	return map;
}
function resolveAliasValue(ctx, value) {
	return ctx && isAlias(value) ? value.resolve(ctx.doc, ctx) : value;
}
var MERGE_KEY, merge, isMergeKey;
var init_merge = __esmMin((() => {
	init_identity();
	init_Scalar();
	MERGE_KEY = "<<";
	merge = {
		identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
		default: "key",
		tag: "tag:yaml.org,2002:merge",
		test: /^<<$/,
		resolve: () => Object.assign(new Scalar(Symbol(MERGE_KEY)), { addToJSMap: addMergeToJSMap }),
		stringify: () => MERGE_KEY
	};
	isMergeKey = (ctx, key) => (merge.identify(key) || isScalar(key) && (!key.type || key.type === Scalar.PLAIN) && merge.identify(key.value)) && (ctx === null || ctx === void 0 ? void 0 : ctx.doc.schema.tags.some((tag) => tag.tag === merge.tag && tag.default));
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/nodes/addPairToJSMap.js
function addPairToJSMap(ctx, map, { key, value }) {
	if (isNode(key) && key.addToJSMap) key.addToJSMap(ctx, map, value);
	else if (isMergeKey(ctx, key)) addMergeToJSMap(ctx, map, value);
	else {
		const jsKey = toJS(key, "", ctx);
		if (map instanceof Map) map.set(jsKey, toJS(value, jsKey, ctx));
		else if (map instanceof Set) map.add(jsKey);
		else {
			const stringKey = stringifyKey(key, jsKey, ctx);
			const jsValue = toJS(value, stringKey, ctx);
			if (stringKey in map) Object.defineProperty(map, stringKey, {
				value: jsValue,
				writable: true,
				enumerable: true,
				configurable: true
			});
			else map[stringKey] = jsValue;
		}
	}
	return map;
}
function stringifyKey(key, jsKey, ctx) {
	if (jsKey === null) return "";
	if (typeof jsKey !== "object") return String(jsKey);
	if (isNode(key) && (ctx === null || ctx === void 0 ? void 0 : ctx.doc)) {
		const strCtx = createStringifyContext(ctx.doc, {});
		strCtx.anchors = /* @__PURE__ */ new Set();
		for (const node of ctx.anchors.keys()) strCtx.anchors.add(node.anchor);
		strCtx.inFlow = true;
		strCtx.inStringifyKey = true;
		const strKey = key.toString(strCtx);
		if (!ctx.mapKeyWarned) {
			let jsonStr = JSON.stringify(strKey);
			if (jsonStr.length > 40) jsonStr = jsonStr.substring(0, 36) + "...\"";
			warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
			ctx.mapKeyWarned = true;
		}
		return strKey;
	}
	return JSON.stringify(jsKey);
}
var init_addPairToJSMap = __esmMin((() => {
	init_log();
	init_merge();
	init_stringify();
	init_identity();
	init_toJS();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/nodes/Pair.js
function createPair(key, value, ctx) {
	return new Pair(createNode(key, void 0, ctx), createNode(value, void 0, ctx));
}
var Pair;
var init_Pair = __esmMin((() => {
	init_createNode();
	init_stringifyPair();
	init_addPairToJSMap();
	init_identity();
	Pair = class Pair {
		constructor(key, value = null) {
			Object.defineProperty(this, NODE_TYPE, { value: PAIR });
			this.key = key;
			this.value = value;
		}
		clone(schema) {
			let { key, value } = this;
			if (isNode(key)) key = key.clone(schema);
			if (isNode(value)) value = value.clone(schema);
			return new Pair(key, value);
		}
		toJSON(_, ctx) {
			return addPairToJSMap(ctx, (ctx === null || ctx === void 0 ? void 0 : ctx.mapAsMap) ? /* @__PURE__ */ new Map() : {}, this);
		}
		toString(ctx, onComment, onChompKeep) {
			return (ctx === null || ctx === void 0 ? void 0 : ctx.doc) ? stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/stringify/stringifyCollection.js
function stringifyCollection(collection, ctx, options) {
	var _ctx$inFlow;
	return (((_ctx$inFlow = ctx.inFlow) !== null && _ctx$inFlow !== void 0 ? _ctx$inFlow : collection.flow) ? stringifyFlowCollection : stringifyBlockCollection)(collection, ctx, options);
}
function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
	const { indent, options: { commentString } } = ctx;
	const itemCtx = Object.assign({}, ctx, {
		indent: itemIndent,
		type: null
	});
	let chompKeep = false;
	const lines = [];
	for (let i = 0; i < items.length; ++i) {
		const item = items[i];
		let comment = null;
		if (isNode(item)) {
			if (!chompKeep && item.spaceBefore) lines.push("");
			addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
			if (item.comment) comment = item.comment;
		} else if (isPair(item)) {
			const ik = isNode(item.key) ? item.key : null;
			if (ik) {
				if (!chompKeep && ik.spaceBefore) lines.push("");
				addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
			}
		}
		chompKeep = false;
		let str = stringify(item, itemCtx, () => comment = null, () => chompKeep = true);
		if (comment) str += lineComment(str, itemIndent, commentString(comment));
		if (chompKeep && comment) chompKeep = false;
		lines.push(blockItemPrefix + str);
	}
	let str;
	if (lines.length === 0) str = flowChars.start + flowChars.end;
	else {
		str = lines[0];
		for (let i = 1; i < lines.length; ++i) {
			const line = lines[i];
			str += line ? `\n${indent}${line}` : "\n";
		}
	}
	if (comment) {
		str += "\n" + indentComment(commentString(comment), indent);
		if (onComment) onComment();
	} else if (chompKeep && onChompKeep) onChompKeep();
	return str;
}
function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
	const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
	itemIndent += indentStep;
	const itemCtx = Object.assign({}, ctx, {
		indent: itemIndent,
		inFlow: true,
		type: null
	});
	let reqNewline = false;
	let linesAtValue = 0;
	const lines = [];
	for (let i = 0; i < items.length; ++i) {
		const item = items[i];
		let comment = null;
		if (isNode(item)) {
			if (item.spaceBefore) lines.push("");
			addCommentBefore(ctx, lines, item.commentBefore, false);
			if (item.comment) comment = item.comment;
		} else if (isPair(item)) {
			const ik = isNode(item.key) ? item.key : null;
			if (ik) {
				if (ik.spaceBefore) lines.push("");
				addCommentBefore(ctx, lines, ik.commentBefore, false);
				if (ik.comment) reqNewline = true;
			}
			const iv = isNode(item.value) ? item.value : null;
			if (iv) {
				if (iv.comment) comment = iv.comment;
				if (iv.commentBefore) reqNewline = true;
			} else if (item.value == null && (ik === null || ik === void 0 ? void 0 : ik.comment)) comment = ik.comment;
		}
		if (comment) reqNewline = true;
		let str = stringify(item, itemCtx, () => comment = null);
		reqNewline || (reqNewline = lines.length > linesAtValue || str.includes("\n"));
		if (i < items.length - 1) str += ",";
		else if (ctx.options.trailingComma) {
			if (ctx.options.lineWidth > 0) reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str.length + 2) > ctx.options.lineWidth);
			if (reqNewline) str += ",";
		}
		if (comment) str += lineComment(str, itemIndent, commentString(comment));
		lines.push(str);
		linesAtValue = lines.length;
	}
	const { start, end } = flowChars;
	if (lines.length === 0) return start + end;
	else {
		if (!reqNewline) {
			const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
			reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
		}
		if (reqNewline) {
			let str = start;
			for (const line of lines) str += line ? `\n${indentStep}${indent}${line}` : "\n";
			return `${str}\n${indent}${end}`;
		} else return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
	}
}
function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
	if (comment && chompKeep) comment = comment.replace(/^\n+/, "");
	if (comment) {
		const ic = indentComment(commentString(comment), indent);
		lines.push(ic.trimStart());
	}
}
var init_stringifyCollection = __esmMin((() => {
	init_identity();
	init_stringify();
	init_stringifyComment();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/nodes/YAMLMap.js
function findPair(items, key) {
	const k = isScalar(key) ? key.value : key;
	for (const it of items) if (isPair(it)) {
		if (it.key === key || it.key === k) return it;
		if (isScalar(it.key) && it.key.value === k) return it;
	}
}
var YAMLMap;
var init_YAMLMap = __esmMin((() => {
	init_stringifyCollection();
	init_addPairToJSMap();
	init_Collection();
	init_identity();
	init_Pair();
	init_Scalar();
	YAMLMap = class extends Collection {
		static get tagName() {
			return "tag:yaml.org,2002:map";
		}
		constructor(schema) {
			super(MAP, schema);
			this.items = [];
		}
		/**
		* A generic collection parsing method that can be extended
		* to other node classes that inherit from YAMLMap
		*/
		static from(schema, obj, ctx) {
			const { keepUndefined, replacer } = ctx;
			const map = new this(schema);
			const add = (key, value) => {
				if (typeof replacer === "function") value = replacer.call(obj, key, value);
				else if (Array.isArray(replacer) && !replacer.includes(key)) return;
				if (value !== void 0 || keepUndefined) map.items.push(createPair(key, value, ctx));
			};
			if (obj instanceof Map) for (const [key, value] of obj) add(key, value);
			else if (obj && typeof obj === "object") for (const key of Object.keys(obj)) add(key, obj[key]);
			if (typeof schema.sortMapEntries === "function") map.items.sort(schema.sortMapEntries);
			return map;
		}
		/**
		* Adds a value to the collection.
		*
		* @param overwrite - If not set `true`, using a key that is already in the
		*   collection will throw. Otherwise, overwrites the previous value.
		*/
		add(pair, overwrite) {
			var _this$schema;
			let _pair;
			if (isPair(pair)) _pair = pair;
			else if (!pair || typeof pair !== "object" || !("key" in pair)) _pair = new Pair(pair, pair === null || pair === void 0 ? void 0 : pair.value);
			else _pair = new Pair(pair.key, pair.value);
			const prev = findPair(this.items, _pair.key);
			const sortEntries = (_this$schema = this.schema) === null || _this$schema === void 0 ? void 0 : _this$schema.sortMapEntries;
			if (prev) {
				if (!overwrite) throw new Error(`Key ${_pair.key} already set`);
				if (isScalar(prev.value) && isScalarValue(_pair.value)) prev.value.value = _pair.value;
				else prev.value = _pair.value;
			} else if (sortEntries) {
				const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
				if (i === -1) this.items.push(_pair);
				else this.items.splice(i, 0, _pair);
			} else this.items.push(_pair);
		}
		delete(key) {
			const it = findPair(this.items, key);
			if (!it) return false;
			return this.items.splice(this.items.indexOf(it), 1).length > 0;
		}
		get(key, keepScalar) {
			var _ref;
			const it = findPair(this.items, key);
			const node = it === null || it === void 0 ? void 0 : it.value;
			return (_ref = !keepScalar && isScalar(node) ? node.value : node) !== null && _ref !== void 0 ? _ref : void 0;
		}
		has(key) {
			return !!findPair(this.items, key);
		}
		set(key, value) {
			this.add(new Pair(key, value), true);
		}
		/**
		* @param ctx - Conversion context, originally set in Document#toJS()
		* @param {Class} Type - If set, forces the returned collection type
		* @returns Instance of Type, Map, or Object
		*/
		toJSON(_, ctx, Type) {
			const map = Type ? new Type() : (ctx === null || ctx === void 0 ? void 0 : ctx.mapAsMap) ? /* @__PURE__ */ new Map() : {};
			if (ctx === null || ctx === void 0 ? void 0 : ctx.onCreate) ctx.onCreate(map);
			for (const item of this.items) addPairToJSMap(ctx, map, item);
			return map;
		}
		toString(ctx, onComment, onChompKeep) {
			if (!ctx) return JSON.stringify(this);
			for (const item of this.items) if (!isPair(item)) throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
			if (!ctx.allNullValues && this.hasAllNullValues(false)) ctx = Object.assign({}, ctx, { allNullValues: true });
			return stringifyCollection(this, ctx, {
				blockItemPrefix: "",
				flowChars: {
					start: "{",
					end: "}"
				},
				itemIndent: ctx.indent || "",
				onChompKeep,
				onComment
			});
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/schema/common/map.js
var map;
var init_map = __esmMin((() => {
	init_identity();
	init_YAMLMap();
	map = {
		collection: "map",
		default: true,
		nodeClass: YAMLMap,
		tag: "tag:yaml.org,2002:map",
		resolve(map, onError) {
			if (!isMap(map)) onError("Expected a mapping for this tag");
			return map;
		},
		createNode: (schema, obj, ctx) => YAMLMap.from(schema, obj, ctx)
	};
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/nodes/YAMLSeq.js
function asItemIndex(key) {
	let idx = isScalar(key) ? key.value : key;
	if (idx && typeof idx === "string") idx = Number(idx);
	return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
}
var YAMLSeq;
var init_YAMLSeq = __esmMin((() => {
	init_createNode();
	init_stringifyCollection();
	init_Collection();
	init_identity();
	init_Scalar();
	init_toJS();
	YAMLSeq = class extends Collection {
		static get tagName() {
			return "tag:yaml.org,2002:seq";
		}
		constructor(schema) {
			super(SEQ, schema);
			this.items = [];
		}
		add(value) {
			this.items.push(value);
		}
		/**
		* Removes a value from the collection.
		*
		* `key` must contain a representation of an integer for this to succeed.
		* It may be wrapped in a `Scalar`.
		*
		* @returns `true` if the item was found and removed.
		*/
		delete(key) {
			const idx = asItemIndex(key);
			if (typeof idx !== "number") return false;
			return this.items.splice(idx, 1).length > 0;
		}
		get(key, keepScalar) {
			const idx = asItemIndex(key);
			if (typeof idx !== "number") return void 0;
			const it = this.items[idx];
			return !keepScalar && isScalar(it) ? it.value : it;
		}
		/**
		* Checks if the collection includes a value with the key `key`.
		*
		* `key` must contain a representation of an integer for this to succeed.
		* It may be wrapped in a `Scalar`.
		*/
		has(key) {
			const idx = asItemIndex(key);
			return typeof idx === "number" && idx < this.items.length;
		}
		/**
		* Sets a value in this collection. For `!!set`, `value` needs to be a
		* boolean to add/remove the item from the set.
		*
		* If `key` does not contain a representation of an integer, this will throw.
		* It may be wrapped in a `Scalar`.
		*/
		set(key, value) {
			const idx = asItemIndex(key);
			if (typeof idx !== "number") throw new Error(`Expected a valid index, not ${key}.`);
			const prev = this.items[idx];
			if (isScalar(prev) && isScalarValue(value)) prev.value = value;
			else this.items[idx] = value;
		}
		toJSON(_, ctx) {
			const seq = [];
			if (ctx === null || ctx === void 0 ? void 0 : ctx.onCreate) ctx.onCreate(seq);
			let i = 0;
			for (const item of this.items) seq.push(toJS(item, String(i++), ctx));
			return seq;
		}
		toString(ctx, onComment, onChompKeep) {
			if (!ctx) return JSON.stringify(this);
			return stringifyCollection(this, ctx, {
				blockItemPrefix: "- ",
				flowChars: {
					start: "[",
					end: "]"
				},
				itemIndent: (ctx.indent || "") + "  ",
				onChompKeep,
				onComment
			});
		}
		static from(schema, obj, ctx) {
			const { replacer } = ctx;
			const seq = new this(schema);
			if (obj && Symbol.iterator in Object(obj)) {
				let i = 0;
				for (let it of obj) {
					if (typeof replacer === "function") {
						const key = obj instanceof Set ? it : String(i++);
						it = replacer.call(obj, key, it);
					}
					seq.items.push(createNode(it, void 0, ctx));
				}
			}
			return seq;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/schema/common/seq.js
var seq;
var init_seq = __esmMin((() => {
	init_identity();
	init_YAMLSeq();
	seq = {
		collection: "seq",
		default: true,
		nodeClass: YAMLSeq,
		tag: "tag:yaml.org,2002:seq",
		resolve(seq, onError) {
			if (!isSeq(seq)) onError("Expected a sequence for this tag");
			return seq;
		},
		createNode: (schema, obj, ctx) => YAMLSeq.from(schema, obj, ctx)
	};
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/schema/common/string.js
var init_string = __esmMin((() => {
	init_stringifyString();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/schema/common/null.js
var init_null = __esmMin((() => {
	init_Scalar();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/schema/core/bool.js
var init_bool$1 = __esmMin((() => {
	init_Scalar();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/schema/core/float.js
var init_float$1 = __esmMin((() => {
	init_Scalar();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/schema/core/schema.js
var init_schema$2 = __esmMin((() => {
	init_map();
	init_null();
	init_seq();
	init_string();
	init_bool$1();
	init_float$1();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/schema/json/schema.js
function intIdentify(value) {
	return typeof value === "bigint" || Number.isInteger(value);
}
var stringifyJSON, jsonScalars;
var init_schema$1 = __esmMin((() => {
	init_Scalar();
	init_map();
	init_seq();
	stringifyJSON = ({ value }) => JSON.stringify(value);
	jsonScalars = [
		{
			identify: (value) => typeof value === "string",
			default: true,
			tag: "tag:yaml.org,2002:str",
			resolve: (str) => str,
			stringify: stringifyJSON
		},
		{
			identify: (value) => value == null,
			createNode: () => new Scalar(null),
			default: true,
			tag: "tag:yaml.org,2002:null",
			test: /^null$/,
			resolve: () => null,
			stringify: stringifyJSON
		},
		{
			identify: (value) => typeof value === "boolean",
			default: true,
			tag: "tag:yaml.org,2002:bool",
			test: /^true$|^false$/,
			resolve: (str) => str === "true",
			stringify: stringifyJSON
		},
		{
			identify: intIdentify,
			default: true,
			tag: "tag:yaml.org,2002:int",
			test: /^-?(?:0|[1-9][0-9]*)$/,
			resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
			stringify: ({ value }) => intIdentify(value) ? value.toString() : JSON.stringify(value)
		},
		{
			identify: (value) => typeof value === "number",
			default: true,
			tag: "tag:yaml.org,2002:float",
			test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
			resolve: (str) => parseFloat(str),
			stringify: stringifyJSON
		}
	];
	[map, seq].concat(jsonScalars, {
		default: true,
		tag: "",
		test: /^/,
		resolve(str, onError) {
			onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
			return str;
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/schema/yaml-1.1/binary.js
var init_binary = __esmMin((() => {
	init_Scalar();
	init_stringifyString();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/schema/yaml-1.1/pairs.js
function createPairs(schema, iterable, ctx) {
	const { replacer } = ctx;
	const pairs = new YAMLSeq(schema);
	pairs.tag = "tag:yaml.org,2002:pairs";
	let i = 0;
	if (iterable && Symbol.iterator in Object(iterable)) for (let it of iterable) {
		if (typeof replacer === "function") it = replacer.call(iterable, String(i++), it);
		let key, value;
		if (Array.isArray(it)) if (it.length === 2) {
			key = it[0];
			value = it[1];
		} else throw new TypeError(`Expected [key, value] tuple: ${it}`);
		else if (it && it instanceof Object) {
			const keys = Object.keys(it);
			if (keys.length === 1) {
				key = keys[0];
				value = it[key];
			} else throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
		} else key = it;
		pairs.items.push(createPair(key, value, ctx));
	}
	return pairs;
}
var init_pairs = __esmMin((() => {
	init_Pair();
	init_Scalar();
	init_YAMLSeq();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/schema/yaml-1.1/omap.js
var YAMLOMap;
var init_omap = __esmMin((() => {
	init_identity();
	init_toJS();
	init_YAMLMap();
	init_YAMLSeq();
	init_pairs();
	YAMLOMap = class YAMLOMap extends YAMLSeq {
		constructor() {
			super();
			this.add = YAMLMap.prototype.add.bind(this);
			this.delete = YAMLMap.prototype.delete.bind(this);
			this.get = YAMLMap.prototype.get.bind(this);
			this.has = YAMLMap.prototype.has.bind(this);
			this.set = YAMLMap.prototype.set.bind(this);
			this.tag = YAMLOMap.tag;
		}
		/**
		* If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
		* but TypeScript won't allow widening the signature of a child method.
		*/
		toJSON(_, ctx) {
			if (!ctx) return super.toJSON(_);
			const map = /* @__PURE__ */ new Map();
			if (ctx === null || ctx === void 0 ? void 0 : ctx.onCreate) ctx.onCreate(map);
			for (const pair of this.items) {
				let key, value;
				if (isPair(pair)) {
					key = toJS(pair.key, "", ctx);
					value = toJS(pair.value, key, ctx);
				} else key = toJS(pair, "", ctx);
				if (map.has(key)) throw new Error("Ordered maps must not include duplicate keys");
				map.set(key, value);
			}
			return map;
		}
		static from(schema, iterable, ctx) {
			const pairs = createPairs(schema, iterable, ctx);
			const omap = new this();
			omap.items = pairs.items;
			return omap;
		}
	};
	YAMLOMap.tag = "tag:yaml.org,2002:omap";
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/schema/yaml-1.1/bool.js
var init_bool = __esmMin((() => {
	init_Scalar();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/schema/yaml-1.1/float.js
var init_float = __esmMin((() => {
	init_Scalar();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/schema/yaml-1.1/set.js
var YAMLSet;
var init_set = __esmMin((() => {
	init_identity();
	init_Pair();
	init_YAMLMap();
	YAMLSet = class YAMLSet extends YAMLMap {
		constructor(schema) {
			super(schema);
			this.tag = YAMLSet.tag;
		}
		add(key) {
			let pair;
			if (isPair(key)) pair = key;
			else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null) pair = new Pair(key.key, null);
			else pair = new Pair(key, null);
			if (!findPair(this.items, pair.key)) this.items.push(pair);
		}
		/**
		* If `keepPair` is `true`, returns the Pair matching `key`.
		* Otherwise, returns the value of that Pair's key.
		*/
		get(key, keepPair) {
			const pair = findPair(this.items, key);
			return !keepPair && isPair(pair) ? isScalar(pair.key) ? pair.key.value : pair.key : pair;
		}
		set(key, value) {
			if (typeof value !== "boolean") throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
			const prev = findPair(this.items, key);
			if (prev && !value) this.items.splice(this.items.indexOf(prev), 1);
			else if (!prev && value) this.items.push(new Pair(key));
		}
		toJSON(_, ctx) {
			return super.toJSON(_, ctx, Set);
		}
		toString(ctx, onComment, onChompKeep) {
			if (!ctx) return JSON.stringify(this);
			if (this.hasAllNullValues(true)) return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
			else throw new Error("Set items must all have null values");
		}
		static from(schema, iterable, ctx) {
			const { replacer } = ctx;
			const set = new this(schema);
			if (iterable && Symbol.iterator in Object(iterable)) for (let value of iterable) {
				if (typeof replacer === "function") value = replacer.call(iterable, value, value);
				set.items.push(createPair(value, null, ctx));
			}
			return set;
		}
	};
	YAMLSet.tag = "tag:yaml.org,2002:set";
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/schema/yaml-1.1/schema.js
var init_schema = __esmMin((() => {
	init_map();
	init_null();
	init_seq();
	init_string();
	init_binary();
	init_bool();
	init_float();
	init_merge();
	init_omap();
	init_pairs();
	init_set();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/schema/tags.js
var init_tags = __esmMin((() => {
	init_map();
	init_null();
	init_seq();
	init_string();
	init_bool$1();
	init_float$1();
	init_schema$2();
	init_schema$1();
	init_binary();
	init_merge();
	init_omap();
	init_pairs();
	init_schema();
	init_set();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/schema/Schema.js
var init_Schema = __esmMin((() => {
	init_map();
	init_seq();
	init_string();
	init_tags();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/stringify/stringifyDocument.js
var init_stringifyDocument = __esmMin((() => {
	init_stringify();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/doc/Document.js
var init_Document = __esmMin((() => {
	init_Alias();
	init_Collection();
	init_Pair();
	init_Schema();
	init_stringifyDocument();
	init_anchors();
	init_createNode();
	init_directives();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/compose/resolve-block-map.js
var init_resolve_block_map = __esmMin((() => {
	init_Pair();
	init_YAMLMap();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/compose/resolve-block-seq.js
var init_resolve_block_seq = __esmMin((() => {
	init_YAMLSeq();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/compose/resolve-flow-collection.js
var init_resolve_flow_collection = __esmMin((() => {
	init_Pair();
	init_YAMLMap();
	init_YAMLSeq();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/compose/compose-collection.js
var init_compose_collection = __esmMin((() => {
	init_Scalar();
	init_YAMLMap();
	init_YAMLSeq();
	init_resolve_block_map();
	init_resolve_block_seq();
	init_resolve_flow_collection();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/compose/resolve-block-scalar.js
var init_resolve_block_scalar = __esmMin((() => {
	init_Scalar();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/compose/resolve-flow-scalar.js
var init_resolve_flow_scalar = __esmMin((() => {
	init_Scalar();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/compose/compose-scalar.js
var init_compose_scalar = __esmMin((() => {
	init_Scalar();
	init_resolve_block_scalar();
	init_resolve_flow_scalar();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/compose/compose-node.js
var init_compose_node = __esmMin((() => {
	init_Alias();
	init_compose_collection();
	init_compose_scalar();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/compose/compose-doc.js
var init_compose_doc = __esmMin((() => {
	init_Document();
	init_compose_node();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/compose/composer.js
var init_composer = __esmMin((() => {
	init_directives();
	init_Document();
	init_compose_doc();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/parse/cst-scalar.js
var init_cst_scalar = __esmMin((() => {
	init_resolve_block_scalar();
	init_resolve_flow_scalar();
	init_stringifyString();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/parse/cst-visit.js
/**
* Apply a visitor to a CST document or item.
*
* Walks through the tree (depth-first) starting from the root, calling a
* `visitor` function with two arguments when entering each item:
*   - `item`: The current item, which included the following members:
*     - `start: SourceToken[]` – Source tokens before the key or value,
*       possibly including its anchor or tag.
*     - `key?: Token | null` – Set for pair values. May then be `null`, if
*       the key before the `:` separator is empty.
*     - `sep?: SourceToken[]` – Source tokens between the key and the value,
*       which should include the `:` map value indicator if `value` is set.
*     - `value?: Token` – The value of a sequence item, or of a map pair.
*   - `path`: The steps from the root to the current node, as an array of
*     `['key' | 'value', number]` tuples.
*
* The return value of the visitor may be used to control the traversal:
*   - `undefined` (default): Do nothing and continue
*   - `visit.SKIP`: Do not visit the children of this token, continue with
*      next sibling
*   - `visit.BREAK`: Terminate traversal completely
*   - `visit.REMOVE`: Remove the current item, then continue with the next one
*   - `number`: Set the index of the next step. This is useful especially if
*     the index of the current token has changed.
*   - `function`: Define the next visitor for this item. After the original
*     visitor is called on item entry, next visitors are called after handling
*     a non-empty `key` and when exiting the item.
*/
function visit(cst, visitor) {
	if ("type" in cst && cst.type === "document") cst = {
		start: cst.start,
		value: cst.value
	};
	_visit(Object.freeze([]), cst, visitor);
}
function _visit(path, item, visitor) {
	let ctrl = visitor(item, path);
	if (typeof ctrl === "symbol") return ctrl;
	for (const field of ["key", "value"]) {
		const token = item[field];
		if (token && "items" in token) {
			for (let i = 0; i < token.items.length; ++i) {
				const ci = _visit(Object.freeze(path.concat([[field, i]])), token.items[i], visitor);
				if (typeof ci === "number") i = ci - 1;
				else if (ci === BREAK) return BREAK;
				else if (ci === REMOVE) {
					token.items.splice(i, 1);
					i -= 1;
				}
			}
			if (typeof ctrl === "function" && field === "key") ctrl = ctrl(item, path);
		}
	}
	return typeof ctrl === "function" ? ctrl(item, path) : ctrl;
}
var BREAK, SKIP, REMOVE;
var init_cst_visit = __esmMin((() => {
	BREAK = Symbol("break visit");
	SKIP = Symbol("skip children");
	REMOVE = Symbol("remove item");
	/** Terminate visit traversal completely */
	visit.BREAK = BREAK;
	/** Do not visit the children of the current item */
	visit.SKIP = SKIP;
	/** Remove the current item */
	visit.REMOVE = REMOVE;
	/** Find the item at `path` from `cst` as the root */
	visit.itemAtPath = (cst, path) => {
		let item = cst;
		for (const [field, index] of path) {
			const tok = item === null || item === void 0 ? void 0 : item[field];
			if (tok && "items" in tok) item = tok.items[index];
			else return void 0;
		}
		return item;
	};
	/**
	* Get the immediate parent collection of the item at `path` from `cst` as the root.
	*
	* Throws an error if the collection is not found, which should never happen if the item itself exists.
	*/
	visit.parentCollection = (cst, path) => {
		const parent = visit.itemAtPath(cst, path.slice(0, -1));
		const field = path[path.length - 1][0];
		const coll = parent === null || parent === void 0 ? void 0 : parent[field];
		if (coll && "items" in coll) return coll;
		throw new Error("Parent collection not found");
	};
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/parse/cst.js
var init_cst = __esmMin((() => {
	init_cst_scalar();
	init_cst_visit();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/parse/lexer.js
var init_lexer = __esmMin((() => {
	init_cst();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/parse/parser.js
var init_parser = __esmMin((() => {
	init_cst();
	init_lexer();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/public-api.js
var init_public_api = __esmMin((() => {
	init_composer();
	init_Document();
	init_parser();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/dist/index.js
var init_dist = __esmMin((() => {
	init_composer();
	init_Document();
	init_Schema();
	init_Alias();
	init_identity();
	init_Pair();
	init_Scalar();
	init_YAMLMap();
	init_YAMLSeq();
	init_cst();
	init_lexer();
	init_parser();
	init_public_api();
	init_visit();
}));
//#endregion
//#region node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/browser/index.js
var init_browser = __esmMin((() => {
	init_dist();
	init_dist();
}));
//#endregion
export { init_browser as t };
