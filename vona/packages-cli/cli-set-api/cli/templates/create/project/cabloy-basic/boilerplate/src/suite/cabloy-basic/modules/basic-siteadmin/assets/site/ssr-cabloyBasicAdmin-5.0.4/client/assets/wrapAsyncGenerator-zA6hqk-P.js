import { n as __esmMin } from "./rolldown-runtime-lkMnaVCm.js";
//#region \0@oxc-project+runtime@0.130.0/helpers/asyncIterator.js
function _asyncIterator(r) {
	var n, t, o, e = 2;
	for ("undefined" != typeof Symbol && (t = Symbol.asyncIterator, o = Symbol.iterator); e--;) {
		if (t && null != (n = r[t])) return n.call(r);
		if (o && null != (n = r[o])) return new AsyncFromSyncIterator(n.call(r));
		t = "@@asyncIterator", o = "@@iterator";
	}
	throw new TypeError("Object is not async iterable");
}
function AsyncFromSyncIterator(r) {
	function AsyncFromSyncIteratorContinuation(r) {
		if (Object(r) !== r) return Promise.reject(/* @__PURE__ */ new TypeError(r + " is not an object."));
		var n = r.done;
		return Promise.resolve(r.value).then(function(r) {
			return {
				value: r,
				done: n
			};
		});
	}
	return AsyncFromSyncIterator = function AsyncFromSyncIterator(r) {
		this.s = r, this.n = r.next;
	}, AsyncFromSyncIterator.prototype = {
		s: null,
		n: null,
		next: function next() {
			return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments));
		},
		"return": function _return(r) {
			var n = this.s["return"];
			return void 0 === n ? Promise.resolve({
				value: r,
				done: !0
			}) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
		},
		"throw": function _throw(r) {
			var n = this.s["return"];
			return void 0 === n ? Promise.reject(r) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
		}
	}, new AsyncFromSyncIterator(r);
}
var init_asyncIterator = __esmMin((() => {}));
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/OverloadYield.js
function _OverloadYield(e, d) {
	this.v = e, this.k = d;
}
var init_OverloadYield = __esmMin((() => {}));
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/awaitAsyncGenerator.js
function _awaitAsyncGenerator(e) {
	return new _OverloadYield(e, 0);
}
var init_awaitAsyncGenerator = __esmMin((() => {
	init_OverloadYield();
}));
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/asyncGeneratorDelegate.js
function _asyncGeneratorDelegate(t) {
	var e = {}, n = !1;
	function pump(e, r) {
		return n = !0, r = new Promise(function(n) {
			n(t[e](r));
		}), {
			done: !1,
			value: new _OverloadYield(r, 1)
		};
	}
	return e["undefined" != typeof Symbol && Symbol.iterator || "@@iterator"] = function() {
		return this;
	}, e.next = function(t) {
		return n ? (n = !1, t) : pump("next", t);
	}, "function" == typeof t["throw"] && (e["throw"] = function(t) {
		if (n) throw n = !1, t;
		return pump("throw", t);
	}), "function" == typeof t["return"] && (e["return"] = function(t) {
		return n ? (n = !1, t) : pump("return", t);
	}), e;
}
var init_asyncGeneratorDelegate = __esmMin((() => {
	init_OverloadYield();
}));
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/wrapAsyncGenerator.js
function _wrapAsyncGenerator(e) {
	return function() {
		return new AsyncGenerator(e.apply(this, arguments));
	};
}
function AsyncGenerator(e) {
	var r, t;
	function resume(r, t) {
		try {
			var n = e[r](t), o = n.value, u = o instanceof _OverloadYield;
			Promise.resolve(u ? o.v : o).then(function(t) {
				if (u) {
					var i = "return" === r ? "return" : "next";
					if (!o.k || t.done) return resume(i, t);
					t = e[i](t).value;
				}
				settle(n.done ? "return" : "normal", t);
			}, function(e) {
				resume("throw", e);
			});
		} catch (e) {
			settle("throw", e);
		}
	}
	function settle(e, n) {
		switch (e) {
			case "return":
				r.resolve({
					value: n,
					done: !0
				});
				break;
			case "throw":
				r.reject(n);
				break;
			default: r.resolve({
				value: n,
				done: !1
			});
		}
		(r = r.next) ? resume(r.key, r.arg) : t = null;
	}
	this._invoke = function(e, n) {
		return new Promise(function(o, u) {
			var i = {
				key: e,
				arg: n,
				resolve: o,
				reject: u,
				next: null
			};
			t ? t = t.next = i : (r = t = i, resume(e, n));
		});
	}, "function" != typeof e["return"] && (this["return"] = void 0);
}
var init_wrapAsyncGenerator = __esmMin((() => {
	init_OverloadYield();
	AsyncGenerator.prototype["function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator"] = function() {
		return this;
	}, AsyncGenerator.prototype.next = function(e) {
		return this._invoke("next", e);
	}, AsyncGenerator.prototype["throw"] = function(e) {
		return this._invoke("throw", e);
	}, AsyncGenerator.prototype["return"] = function(e) {
		return this._invoke("return", e);
	};
}));
//#endregion
export { _awaitAsyncGenerator as a, init_asyncIterator as c, init_asyncGeneratorDelegate as i, init_wrapAsyncGenerator as n, init_awaitAsyncGenerator as o, _asyncGeneratorDelegate as r, _asyncIterator as s, _wrapAsyncGenerator as t };
