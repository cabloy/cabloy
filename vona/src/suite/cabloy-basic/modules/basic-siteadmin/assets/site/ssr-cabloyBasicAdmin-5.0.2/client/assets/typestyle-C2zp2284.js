import { n as __esmMin } from "./rolldown-runtime-lkMnaVCm.js";
import { n as init_dist_es2015, t as create } from "./dist.es2015-BMNhwNBy.js";
//#region node_modules/.pnpm/typestyle@2.4.0/node_modules/typestyle/lib.es2015/internal/formatting.js
/**
* We need to do the following to *our* objects before passing to freestyle:
* - For any `$nest` directive move up to FreeStyle style nesting
* - For any `$unique` directive map to FreeStyle Unique
* - For any `$debugName` directive return the debug name
*/
function convertToStyles(object) {
	/** The final result we will return */
	var styles = {};
	for (var key in object) {
		/** Grab the value upfront */
		var val = object[key];
		/** TypeStyle configuration options */
		if (key === "$nest") {
			var nested = val;
			for (var selector in nested) {
				var subproperties = nested[selector];
				styles[selector] = convertToStyles(subproperties);
			}
		} else if (key === "$debugName") styles.$displayName = val;
		else styles[key] = val;
	}
	return styles;
}
function convertToKeyframes(frames) {
	var result = {};
	for (var offset in frames) if (offset !== "$debugName") result[offset] = frames[offset];
	if (frames.$debugName) result.$displayName = frames.$debugName;
	return result;
}
var init_formatting = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/typestyle@2.4.0/node_modules/typestyle/lib.es2015/internal/utilities.js
/**
* Utility to join classes conditionally
*/
function classes() {
	var classes = [];
	for (var _i = 0; _i < arguments.length; _i++) classes[_i] = arguments[_i];
	return classes.map(function(c) {
		return c && typeof c === "object" ? Object.keys(c).map(function(key) {
			return !!c[key] && key;
		}) : [c];
	}).reduce(function(flattened, c) {
		return flattened.concat(c);
	}, []).filter(function(c) {
		return !!c;
	}).join(" ");
}
/**
* Merges various styles into a single style object.
* Note: if two objects have the same property the last one wins
*/
function extend() {
	var objects = [];
	for (var _i = 0; _i < arguments.length; _i++) objects[_i] = arguments[_i];
	/** The final result we will return */
	var result = {};
	for (var _a = 0, objects_1 = objects; _a < objects_1.length; _a++) {
		var object = objects_1[_a];
		if (object == null || object === false) continue;
		for (var key in object) {
			/** Falsy values except a explicit 0 is ignored */
			var val = object[key];
			if (!val && val !== 0) continue;
			/** if nested media or pseudo selector */
			if (key === "$nest" && val) result[key] = result["$nest"] ? extend(result["$nest"], val) : val;
			else if (key.indexOf("&") !== -1 || key.indexOf("@media") === 0) result[key] = result[key] ? extend(result[key], val) : val;
			else result[key] = val;
		}
	}
	return result;
}
var raf;
var init_utilities = __esmMin((() => {
	raf = typeof requestAnimationFrame === "undefined" ? function(cb) {
		return setTimeout(cb);
	} : typeof window === "undefined" ? requestAnimationFrame : requestAnimationFrame.bind(window);
}));
//#endregion
//#region node_modules/.pnpm/typestyle@2.4.0/node_modules/typestyle/lib.es2015/internal/typestyle.js
var createFreeStyle, TypeStyle;
var init_typestyle = __esmMin((() => {
	init_dist_es2015();
	init_formatting();
	init_utilities();
	createFreeStyle = function() {
		return create();
	};
	TypeStyle = function() {
		function TypeStyle(_a) {
			var _this = this;
			var autoGenerateTag = _a.autoGenerateTag;
			/**
			* Insert `raw` CSS as a string. This is useful for e.g.
			* - third party CSS that you are customizing with template strings
			* - generating raw CSS in JavaScript
			* - reset libraries like normalize.css that you can use without loaders
			*/
			this.cssRaw = function(mustBeValidCSS) {
				if (!mustBeValidCSS) return;
				_this._raw += mustBeValidCSS || "";
				_this._pendingRawChange = true;
				_this._styleUpdated();
			};
			/**
			* Takes CSSProperties and registers it to a global selector (body, html, etc.)
			*/
			this.cssRule = function(selector) {
				var objects = [];
				for (var _i = 1; _i < arguments.length; _i++) objects[_i - 1] = arguments[_i];
				var styles = convertToStyles(extend.apply(void 0, objects));
				_this._freeStyle.registerRule(selector, styles);
				_this._styleUpdated();
			};
			/**
			* Renders styles to the singleton tag imediately
			* NOTE: You should only call it on initial render to prevent any non CSS flash.
			* After that it is kept sync using `requestAnimationFrame` and we haven't noticed any bad flashes.
			**/
			this.forceRenderStyles = function() {
				var target = _this._getTag();
				if (!target) return;
				target.textContent = _this.getStyles();
			};
			/**
			* Utility function to register an @font-face
			*/
			this.fontFace = function() {
				var fontFace = [];
				for (var _i = 0; _i < arguments.length; _i++) fontFace[_i] = arguments[_i];
				var freeStyle = _this._freeStyle;
				for (var _a = 0, _b = fontFace; _a < _b.length; _a++) {
					var face = _b[_a];
					freeStyle.registerRule("@font-face", face);
				}
				_this._styleUpdated();
			};
			/**
			* Allows use to use the stylesheet in a node.js environment
			*/
			this.getStyles = function() {
				return (_this._raw || "") + _this._freeStyle.getStyles();
			};
			/**
			* Takes keyframes and returns a generated animationName
			*/
			this.keyframes = function(frames) {
				var keyframes = convertToKeyframes(frames);
				var animationName = _this._freeStyle.registerKeyframes(keyframes);
				_this._styleUpdated();
				return animationName;
			};
			/**
			* Helps with testing. Reinitializes FreeStyle + raw
			*/
			this.reinit = function() {
				/** reinit freestyle */
				var freeStyle = createFreeStyle();
				_this._freeStyle = freeStyle;
				_this._lastFreeStyleChangeId = freeStyle.changeId;
				/** reinit raw */
				_this._raw = "";
				_this._pendingRawChange = false;
				/** Clear any styles that were flushed */
				var target = _this._getTag();
				if (target) target.textContent = "";
			};
			/** Sets the target tag where we write the css on style updates */
			this.setStylesTarget = function(tag) {
				/** Clear any data in any previous tag */
				if (_this._tag) _this._tag.textContent = "";
				_this._tag = tag;
				/** This special time buffer immediately */
				_this.forceRenderStyles();
			};
			/**
			* Takes an object where property names are ideal class names and property values are CSSProperties, and
			* returns an object where property names are the same ideal class names and the property values are
			* the actual generated class names using the ideal class name as the $debugName
			*/
			this.stylesheet = function(classes) {
				var classNames = Object.getOwnPropertyNames(classes);
				var result = {};
				for (var _i = 0, classNames_1 = classNames; _i < classNames_1.length; _i++) {
					var className = classNames_1[_i];
					var classDef = classes[className];
					if (classDef) {
						classDef.$debugName = className;
						result[className] = _this.style(classDef);
					}
				}
				return result;
			};
			var freeStyle = createFreeStyle();
			this._autoGenerateTag = autoGenerateTag;
			this._freeStyle = freeStyle;
			this._lastFreeStyleChangeId = freeStyle.changeId;
			this._pending = 0;
			this._pendingRawChange = false;
			this._raw = "";
			this._tag = void 0;
			this.style = this.style.bind(this);
		}
		/**
		* Only calls cb all sync operations settle
		*/
		TypeStyle.prototype._afterAllSync = function(cb) {
			var _this = this;
			this._pending++;
			var pending = this._pending;
			raf(function() {
				if (pending !== _this._pending) return;
				cb();
			});
		};
		TypeStyle.prototype._getTag = function() {
			if (this._tag) return this._tag;
			if (this._autoGenerateTag) {
				var tag = typeof window === "undefined" ? { textContent: "" } : document.createElement("style");
				if (typeof document !== "undefined") document.head.appendChild(tag);
				this._tag = tag;
				return tag;
			}
		};
		/** Checks if the style tag needs updating and if so queues up the change */
		TypeStyle.prototype._styleUpdated = function() {
			var _this = this;
			var changeId = this._freeStyle.changeId;
			var lastChangeId = this._lastFreeStyleChangeId;
			if (!this._pendingRawChange && changeId === lastChangeId) return;
			this._lastFreeStyleChangeId = changeId;
			this._pendingRawChange = false;
			this._afterAllSync(function() {
				return _this.forceRenderStyles();
			});
		};
		TypeStyle.prototype.style = function() {
			var className = this._freeStyle.registerStyle(convertToStyles(extend.apply(void 0, arguments)));
			this._styleUpdated();
			return className;
		};
		return TypeStyle;
	}();
}));
//#endregion
//#region node_modules/.pnpm/typestyle@2.4.0/node_modules/typestyle/lib.es2015/index.js
/**
* Creates a new instance of TypeStyle separate from the default instance.
*
* - Use this for creating a different typestyle instance for a shadow dom component.
* - Use this if you don't want an auto tag generated and you just want to collect the CSS.
*
* NOTE: styles aren't shared between different instances.
*/
function createTypeStyle(target) {
	var instance = new TypeStyle({ autoGenerateTag: false });
	if (target) instance.setStylesTarget(target);
	return instance;
}
var ts, cssRaw, cssRule, style;
var init_lib_es2015 = __esmMin((() => {
	init_typestyle();
	init_utilities();
	ts = new TypeStyle({ autoGenerateTag: true });
	ts.setStylesTarget;
	cssRaw = ts.cssRaw;
	cssRule = ts.cssRule;
	ts.forceRenderStyles;
	ts.fontFace;
	ts.getStyles;
	ts.keyframes;
	ts.reinit;
	style = ts.style;
	ts.stylesheet;
}));
//#endregion
export { style as a, init_lib_es2015 as i, cssRaw as n, classes as o, cssRule as r, createTypeStyle as t };
