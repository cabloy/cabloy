import { n as __esmMin } from "./rolldown-runtime-lkMnaVCm.js";
//#region node_modules/.pnpm/free-style@3.1.0/node_modules/free-style/dist.es2015/index.js
/**
* Transform a JavaScript property into a CSS property.
*/
function hyphenate(propertyName) {
	return propertyName.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`).replace(/^ms-/, "-ms-");
}
/**
* Generate a hash value from a string.
*/
function stringHash(str) {
	let value = 5381;
	let len = str.length;
	while (len--) value = value * 33 ^ str.charCodeAt(len);
	return (value >>> 0).toString(36);
}
/**
* Transform a style string to a CSS string.
*/
function styleToString(key, value) {
	if (value && typeof value === "number" && !CSS_NUMBER[key]) return `${key}:${value}px`;
	return `${key}:${value}`;
}
/**
* Sort an array of tuples by first value.
*/
function sortTuples(value) {
	return value.sort((a, b) => a[0] > b[0] ? 1 : -1);
}
/**
* Categorize user styles.
*/
function parseStyles(styles, hasNestedStyles) {
	const properties = [];
	const nestedStyles = [];
	for (const key of Object.keys(styles)) {
		const name = key.trim();
		const value = styles[key];
		if (name.charCodeAt(0) !== 36 && value != null) if (typeof value === "object" && !Array.isArray(value)) nestedStyles.push([name, value]);
		else properties.push([hyphenate(name), value]);
	}
	return {
		style: stringifyProperties(sortTuples(properties)),
		nested: hasNestedStyles ? nestedStyles : sortTuples(nestedStyles),
		isUnique: !!styles.$unique
	};
}
/**
* Stringify an array of property tuples.
*/
function stringifyProperties(properties) {
	return properties.map(([name, value]) => {
		if (!Array.isArray(value)) return styleToString(name, value);
		return value.map((x) => styleToString(name, x)).join(";");
	}).join(";");
}
/**
* Interpolate CSS selectors.
*/
function interpolate(selector, parent) {
	if (selector.indexOf("&") === -1) return `${parent} ${selector}`;
	return selector.replace(/&/g, parent);
}
/**
* Recursive loop building styles with deferred selectors.
*/
function stylize(selector, styles, rulesList, stylesList, parent) {
	const { style, nested, isUnique } = parseStyles(styles, selector !== "");
	let pid = style;
	if (selector.charCodeAt(0) === 64) {
		const child = {
			selector,
			styles: [],
			rules: [],
			style: parent ? "" : style
		};
		rulesList.push(child);
		if (style && parent) child.styles.push({
			selector: parent,
			style,
			isUnique
		});
		for (const [name, value] of nested) pid += name + stylize(name, value, child.rules, child.styles, parent);
	} else {
		const key = parent ? interpolate(selector, parent) : selector;
		if (style) stylesList.push({
			selector: key,
			style,
			isUnique
		});
		for (const [name, value] of nested) pid += name + stylize(name, value, rulesList, stylesList, key);
	}
	return pid;
}
/**
* Transform `stylize` tree into style objects.
*/
function composeStylize(cache, pid, rulesList, stylesList, className, isStyle) {
	for (const { selector, style, isUnique } of stylesList) {
		const key = isStyle ? interpolate(selector, className) : selector;
		const item = new Style(style, isUnique ? `u\0${(++uniqueId).toString(36)}` : `s\0${pid}\0${style}`);
		item.add(new Selector(key, `k\0${pid}\0${key}`));
		cache.add(item);
	}
	for (const { selector, style, rules, styles } of rulesList) {
		const item = new Rule(selector, style, `r\0${pid}\0${selector}\0${style}`);
		composeStylize(item, pid, rules, styles, className, isStyle);
		cache.add(item);
	}
}
/**
* Cache to list to styles.
*/
function join(arr) {
	let res = "";
	for (let i = 0; i < arr.length; i++) res += arr[i];
	return res;
}
function key(pid, styles) {
	return `f${stringHash(pid)}`;
}
/**
* Exports a simple function to create a new instance.
*/
function create(changes) {
	return new FreeStyle(`f${(++uniqueId).toString(36)}`, changes);
}
var uniqueId, CSS_NUMBER, noopChanges, Cache, Selector, Style, Rule, FreeStyle;
var init_dist_es2015 = __esmMin((() => {
	uniqueId = 0;
	CSS_NUMBER = Object.create(null);
	for (const property of [
		"animation-iteration-count",
		"border-image-outset",
		"border-image-slice",
		"border-image-width",
		"box-flex",
		"box-flex-group",
		"box-ordinal-group",
		"column-count",
		"columns",
		"counter-increment",
		"counter-reset",
		"flex",
		"flex-grow",
		"flex-positive",
		"flex-shrink",
		"flex-negative",
		"flex-order",
		"font-weight",
		"grid-area",
		"grid-column",
		"grid-column-end",
		"grid-column-span",
		"grid-column-start",
		"grid-row",
		"grid-row-end",
		"grid-row-span",
		"grid-row-start",
		"line-clamp",
		"line-height",
		"opacity",
		"order",
		"orphans",
		"tab-size",
		"widows",
		"z-index",
		"zoom",
		"fill-opacity",
		"flood-opacity",
		"stop-opacity",
		"stroke-dasharray",
		"stroke-dashoffset",
		"stroke-miterlimit",
		"stroke-opacity",
		"stroke-width"
	]) for (const prefix of [
		"-webkit-",
		"-ms-",
		"-moz-",
		"-o-",
		""
	]) CSS_NUMBER[prefix + property] = true;
	noopChanges = {
		add: () => void 0,
		change: () => void 0,
		remove: () => void 0
	};
	Cache = class Cache {
		constructor(changes = noopChanges) {
			this.changes = changes;
			this.sheet = [];
			this.changeId = 0;
			this._keys = [];
			this._children = Object.create(null);
			this._counters = Object.create(null);
		}
		add(style) {
			const count = this._counters[style.id] || 0;
			const item = this._children[style.id] || style.clone();
			this._counters[style.id] = count + 1;
			if (count === 0) {
				this._children[item.id] = item;
				this._keys.push(item.id);
				this.sheet.push(item.getStyles());
				this.changeId++;
				this.changes.add(item, this._keys.length - 1);
			} else if (item instanceof Cache && style instanceof Cache) {
				const curIndex = this._keys.indexOf(style.id);
				const prevItemChangeId = item.changeId;
				item.merge(style);
				if (item.changeId !== prevItemChangeId) {
					this.sheet.splice(curIndex, 1, item.getStyles());
					this.changeId++;
					this.changes.change(item, curIndex, curIndex);
				}
			}
		}
		remove(style) {
			const count = this._counters[style.id];
			if (count) {
				this._counters[style.id] = count - 1;
				const item = this._children[style.id];
				const index = this._keys.indexOf(item.id);
				if (count === 1) {
					delete this._counters[style.id];
					delete this._children[style.id];
					this._keys.splice(index, 1);
					this.sheet.splice(index, 1);
					this.changeId++;
					this.changes.remove(item, index);
				} else if (item instanceof Cache && style instanceof Cache) {
					const prevChangeId = item.changeId;
					item.unmerge(style);
					if (item.changeId !== prevChangeId) {
						this.sheet.splice(index, 1, item.getStyles());
						this.changeId++;
						this.changes.change(item, index, index);
					}
				}
			}
		}
		values() {
			return this._keys.map((key) => this._children[key]);
		}
		merge(cache) {
			for (const item of cache.values()) this.add(item);
			return this;
		}
		unmerge(cache) {
			for (const item of cache.values()) this.remove(item);
			return this;
		}
		clone() {
			return new Cache().merge(this);
		}
	};
	Selector = class {
		constructor(selector, id) {
			this.selector = selector;
			this.id = id;
		}
		getStyles() {
			return this.selector;
		}
		clone() {
			return this;
		}
	};
	Style = class Style extends Cache {
		constructor(style, id) {
			super();
			this.style = style;
			this.id = id;
		}
		getStyles() {
			return `${this.sheet.join(",")}{${this.style}}`;
		}
		clone() {
			return new Style(this.style, this.id).merge(this);
		}
	};
	Rule = class Rule extends Cache {
		constructor(rule, style, id) {
			super();
			this.rule = rule;
			this.style = style;
			this.id = id;
		}
		getStyles() {
			return `${this.rule}{${this.style}${join(this.sheet)}}`;
		}
		clone() {
			return new Rule(this.rule, this.style, this.id).merge(this);
		}
	};
	FreeStyle = class FreeStyle extends Cache {
		constructor(id, changes) {
			super(changes);
			this.id = id;
		}
		registerStyle(styles) {
			const rulesList = [];
			const stylesList = [];
			const pid = stylize("&", styles, rulesList, stylesList);
			const id = key(pid, styles);
			const selector = `.${id}`;
			composeStylize(this, pid, rulesList, stylesList, selector, true);
			return id;
		}
		registerKeyframes(keyframes) {
			return this.registerHashRule("@keyframes", keyframes);
		}
		registerHashRule(prefix, styles) {
			const rulesList = [];
			const stylesList = [];
			const pid = stylize("", styles, rulesList, stylesList);
			const id = key(pid, styles);
			const rule = new Rule(`${prefix} ${id}`, "", `h\0${pid}\0${prefix}`);
			composeStylize(rule, pid, rulesList, stylesList, "", false);
			this.add(rule);
			return id;
		}
		registerRule(rule, styles) {
			const rulesList = [];
			const stylesList = [];
			const pid = stylize(rule, styles, rulesList, stylesList);
			composeStylize(this, pid, rulesList, stylesList, "", false);
		}
		registerCss(styles) {
			return this.registerRule("", styles);
		}
		getStyles() {
			return join(this.sheet);
		}
		clone() {
			return new FreeStyle(this.id, this.changes).merge(this);
		}
	};
}));
//#endregion
export { init_dist_es2015 as n, create as t };
