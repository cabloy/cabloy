import { n as __esmMin } from "./rolldown-runtime-lkMnaVCm.js";
import { b as toRaw, h as ref, m as readonly } from "./vue-CeNp4lbs.js";
import { k as watch } from "./vue-t5FcxkD3.js";
import { C as _classPrivateFieldSet2, D as _classPrivateFieldInitSpec, O as init_classPrivateFieldInitSpec, S as init_classPrivateFieldGet2, _ as init_toPropertyKey, d as _objectSpread2, f as init_objectSpread2, i as init_objectWithoutProperties, m as init_asyncToGenerator, p as _asyncToGenerator, r as _objectWithoutProperties, v as toPropertyKey, w as init_classPrivateFieldSet2, x as _classPrivateFieldGet2 } from "./fecha-DmopMB3M.js";
import { a as init_lib } from "./extends-CqKXG2OF.js";
//#region node_modules/.pnpm/@tanstack+store@0.9.3/node_modules/@tanstack/store/dist/esm/alien.js
/* @__NO_SIDE_EFFECTS__ */
function createReactiveSystem({ update, notify, unwatched }) {
	return {
		link,
		unlink,
		propagate,
		checkDirty,
		shallowPropagate
	};
	function link(dep, sub, version) {
		const prevDep = sub.depsTail;
		if (prevDep !== void 0 && prevDep.dep === dep) return;
		const nextDep = prevDep !== void 0 ? prevDep.nextDep : sub.deps;
		if (nextDep !== void 0 && nextDep.dep === dep) {
			nextDep.version = version;
			sub.depsTail = nextDep;
			return;
		}
		const prevSub = dep.subsTail;
		if (prevSub !== void 0 && prevSub.version === version && prevSub.sub === sub) return;
		const newLink = sub.depsTail = dep.subsTail = {
			version,
			dep,
			sub,
			prevDep,
			nextDep,
			prevSub,
			nextSub: void 0
		};
		if (nextDep !== void 0) nextDep.prevDep = newLink;
		if (prevDep !== void 0) prevDep.nextDep = newLink;
		else sub.deps = newLink;
		if (prevSub !== void 0) prevSub.nextSub = newLink;
		else dep.subs = newLink;
	}
	function unlink(link2, sub = link2.sub) {
		const dep = link2.dep;
		const prevDep = link2.prevDep;
		const nextDep = link2.nextDep;
		const nextSub = link2.nextSub;
		const prevSub = link2.prevSub;
		if (nextDep !== void 0) nextDep.prevDep = prevDep;
		else sub.depsTail = prevDep;
		if (prevDep !== void 0) prevDep.nextDep = nextDep;
		else sub.deps = nextDep;
		if (nextSub !== void 0) nextSub.prevSub = prevSub;
		else dep.subsTail = prevSub;
		if (prevSub !== void 0) prevSub.nextSub = nextSub;
		else if ((dep.subs = nextSub) === void 0) unwatched(dep);
		return nextDep;
	}
	function propagate(link2) {
		let next = link2.nextSub;
		let stack;
		top: do {
			const sub = link2.sub;
			let flags = sub.flags;
			if (!(flags & 60)) sub.flags = flags | 32;
			else if (!(flags & 12)) flags = 0;
			else if (!(flags & 4)) sub.flags = flags & -9 | 32;
			else if (!(flags & 48) && isValidLink(link2, sub)) {
				sub.flags = flags | 40;
				flags &= 1;
			} else flags = 0;
			if (flags & 2) notify(sub);
			if (flags & 1) {
				const subSubs = sub.subs;
				if (subSubs !== void 0) {
					const nextSub = (link2 = subSubs).nextSub;
					if (nextSub !== void 0) {
						stack = {
							value: next,
							prev: stack
						};
						next = nextSub;
					}
					continue;
				}
			}
			if ((link2 = next) !== void 0) {
				next = link2.nextSub;
				continue;
			}
			while (stack !== void 0) {
				link2 = stack.value;
				stack = stack.prev;
				if (link2 !== void 0) {
					next = link2.nextSub;
					continue top;
				}
			}
			break;
		} while (true);
	}
	function checkDirty(link2, sub) {
		let stack;
		let checkDepth = 0;
		let dirty = false;
		top: do {
			const dep = link2.dep;
			const flags = dep.flags;
			if (sub.flags & 16) dirty = true;
			else if ((flags & 17) === 17) {
				if (update(dep)) {
					const subs = dep.subs;
					if (subs.nextSub !== void 0) shallowPropagate(subs);
					dirty = true;
				}
			} else if ((flags & 33) === 33) {
				if (link2.nextSub !== void 0 || link2.prevSub !== void 0) stack = {
					value: link2,
					prev: stack
				};
				link2 = dep.deps;
				sub = dep;
				++checkDepth;
				continue;
			}
			if (!dirty) {
				const nextDep = link2.nextDep;
				if (nextDep !== void 0) {
					link2 = nextDep;
					continue;
				}
			}
			while (checkDepth--) {
				const firstSub = sub.subs;
				const hasMultipleSubs = firstSub.nextSub !== void 0;
				if (hasMultipleSubs) {
					link2 = stack.value;
					stack = stack.prev;
				} else link2 = firstSub;
				if (dirty) {
					if (update(sub)) {
						if (hasMultipleSubs) shallowPropagate(firstSub);
						sub = link2.sub;
						continue;
					}
					dirty = false;
				} else sub.flags &= -33;
				sub = link2.sub;
				const nextDep = link2.nextDep;
				if (nextDep !== void 0) {
					link2 = nextDep;
					continue top;
				}
			}
			return dirty;
		} while (true);
	}
	function shallowPropagate(link2) {
		do {
			const sub = link2.sub;
			const flags = sub.flags;
			if ((flags & 48) === 32) {
				sub.flags = flags | 16;
				if ((flags & 6) === 2) notify(sub);
			}
		} while ((link2 = link2.nextSub) !== void 0);
	}
	function isValidLink(checkLink, sub) {
		let link2 = sub.depsTail;
		while (link2 !== void 0) {
			if (link2 === checkLink) return true;
			link2 = link2.prevDep;
		}
		return false;
	}
}
var ReactiveFlags;
var init_alien = __esmMin((() => {
	ReactiveFlags = /* @__PURE__ */ ((ReactiveFlags2) => {
		ReactiveFlags2[ReactiveFlags2["None"] = 0] = "None";
		ReactiveFlags2[ReactiveFlags2["Mutable"] = 1] = "Mutable";
		ReactiveFlags2[ReactiveFlags2["Watching"] = 2] = "Watching";
		ReactiveFlags2[ReactiveFlags2["RecursedCheck"] = 4] = "RecursedCheck";
		ReactiveFlags2[ReactiveFlags2["Recursed"] = 8] = "Recursed";
		ReactiveFlags2[ReactiveFlags2["Dirty"] = 16] = "Dirty";
		ReactiveFlags2[ReactiveFlags2["Pending"] = 32] = "Pending";
		return ReactiveFlags2;
	})(ReactiveFlags || {});
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+store@0.9.3/node_modules/@tanstack/store/dist/esm/atom.js
function toObserver(nextHandler, errorHandler, completionHandler) {
	var _ref, _ref2, _ref3;
	const isObserver = typeof nextHandler === "object";
	const self = isObserver ? nextHandler : void 0;
	return {
		next: (_ref = isObserver ? nextHandler.next : nextHandler) === null || _ref === void 0 ? void 0 : _ref.bind(self),
		error: (_ref2 = isObserver ? nextHandler.error : errorHandler) === null || _ref2 === void 0 ? void 0 : _ref2.bind(self),
		complete: (_ref3 = isObserver ? nextHandler.complete : completionHandler) === null || _ref3 === void 0 ? void 0 : _ref3.bind(self)
	};
}
function batch(fn) {
	try {
		++batchDepth;
		fn();
	} finally {
		if (!--batchDepth) flush();
	}
}
function purgeDeps(sub) {
	const depsTail = sub.depsTail;
	let dep = depsTail !== void 0 ? depsTail.nextDep : sub.deps;
	while (dep !== void 0) dep = unlink(dep, sub);
}
function flush() {
	if (batchDepth > 0) return;
	while (notifyIndex < queuedEffectsLength) {
		const effect2 = queuedEffects[notifyIndex];
		queuedEffects[notifyIndex++] = void 0;
		effect2.notify();
	}
	notifyIndex = 0;
	queuedEffectsLength = 0;
}
function createAtom(valueOrFn, options) {
	const isComputed = typeof valueOrFn === "function";
	const getter = valueOrFn;
	const atom = {
		_snapshot: isComputed ? void 0 : valueOrFn,
		subs: void 0,
		subsTail: void 0,
		deps: void 0,
		depsTail: void 0,
		flags: isComputed ? ReactiveFlags.None : ReactiveFlags.Mutable,
		get() {
			if (activeSub !== void 0) link(atom, activeSub, cycle);
			return atom._snapshot;
		},
		subscribe(observerOrFn) {
			const obs = toObserver(observerOrFn);
			const observed = { current: false };
			const e = effect(() => {
				atom.get();
				if (!observed.current) observed.current = true;
				else {
					var _obs$next;
					(_obs$next = obs.next) === null || _obs$next === void 0 || _obs$next.call(obs, atom._snapshot);
				}
			});
			return { unsubscribe: () => {
				e.stop();
			} };
		},
		_update(getValue) {
			var _options$compare;
			const prevSub = activeSub;
			const compare = (_options$compare = options === null || options === void 0 ? void 0 : options.compare) !== null && _options$compare !== void 0 ? _options$compare : Object.is;
			if (isComputed) {
				activeSub = atom;
				++cycle;
				atom.depsTail = void 0;
			} else if (getValue === void 0) return false;
			if (isComputed) atom.flags = ReactiveFlags.Mutable | ReactiveFlags.RecursedCheck;
			try {
				const oldValue = atom._snapshot;
				const newValue = typeof getValue === "function" ? getValue(oldValue) : getValue === void 0 && isComputed ? getter(oldValue) : getValue;
				if (oldValue === void 0 || !compare(oldValue, newValue)) {
					atom._snapshot = newValue;
					return true;
				}
				return false;
			} finally {
				activeSub = prevSub;
				if (isComputed) atom.flags &= ~ReactiveFlags.RecursedCheck;
				purgeDeps(atom);
			}
		}
	};
	if (isComputed) {
		atom.flags = ReactiveFlags.Mutable | ReactiveFlags.Dirty;
		atom.get = function() {
			const flags = atom.flags;
			if (flags & ReactiveFlags.Dirty || flags & ReactiveFlags.Pending && checkDirty(atom.deps, atom)) {
				if (atom._update()) {
					const subs = atom.subs;
					if (subs !== void 0) shallowPropagate(subs);
				}
			} else if (flags & ReactiveFlags.Pending) atom.flags = flags & ~ReactiveFlags.Pending;
			if (activeSub !== void 0) link(atom, activeSub, cycle);
			return atom._snapshot;
		};
	} else atom.set = function(valueOrFn2) {
		if (atom._update(valueOrFn2)) {
			const subs = atom.subs;
			if (subs !== void 0) {
				propagate(subs);
				shallowPropagate(subs);
				flush();
			}
		}
	};
	return atom;
}
function effect(fn) {
	const run = () => {
		const prevSub = activeSub;
		activeSub = effectObj;
		++cycle;
		effectObj.depsTail = void 0;
		effectObj.flags = ReactiveFlags.Watching | ReactiveFlags.RecursedCheck;
		try {
			return fn();
		} finally {
			activeSub = prevSub;
			effectObj.flags &= ~ReactiveFlags.RecursedCheck;
			purgeDeps(effectObj);
		}
	};
	const effectObj = {
		deps: void 0,
		depsTail: void 0,
		subs: void 0,
		subsTail: void 0,
		flags: ReactiveFlags.Watching | ReactiveFlags.RecursedCheck,
		notify() {
			const flags = this.flags;
			if (flags & ReactiveFlags.Dirty || flags & ReactiveFlags.Pending && checkDirty(this.deps, this)) run();
			else this.flags = ReactiveFlags.Watching;
		},
		stop() {
			this.flags = ReactiveFlags.None;
			this.depsTail = void 0;
			purgeDeps(this);
		}
	};
	run();
	return effectObj;
}
var queuedEffects, cycle, link, unlink, propagate, checkDirty, shallowPropagate, notifyIndex, queuedEffectsLength, activeSub, batchDepth;
var init_atom = __esmMin((() => {
	init_alien();
	queuedEffects = [];
	cycle = 0;
	({link, unlink, propagate, checkDirty, shallowPropagate} = /* @__PURE__ */ createReactiveSystem({
		update(atom) {
			return atom._update();
		},
		notify(effect2) {
			queuedEffects[queuedEffectsLength++] = effect2;
			effect2.flags &= ~ReactiveFlags.Watching;
		},
		unwatched(atom) {
			if (atom.depsTail !== void 0) {
				atom.depsTail = void 0;
				atom.flags = ReactiveFlags.Mutable | ReactiveFlags.Dirty;
				purgeDeps(atom);
			}
		}
	}));
	notifyIndex = 0;
	queuedEffectsLength = 0;
	batchDepth = 0;
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+store@0.9.3/node_modules/@tanstack/store/dist/esm/store.js
function createStore(valueOrFn) {
	if (typeof valueOrFn === "function") return new ReadonlyStore(valueOrFn);
	return new Store(valueOrFn);
}
var Store, ReadonlyStore;
var init_store = __esmMin((() => {
	init_atom();
	Store = class {
		constructor(valueOrFn) {
			this.atom = createAtom(valueOrFn);
		}
		setState(updater) {
			this.atom.set(updater);
		}
		get state() {
			return this.atom.get();
		}
		get() {
			return this.state;
		}
		subscribe(observerOrFn) {
			return this.atom.subscribe(toObserver(observerOrFn));
		}
	};
	ReadonlyStore = class {
		constructor(valueOrFn) {
			this.atom = createAtom(valueOrFn);
		}
		get state() {
			return this.atom.get();
		}
		get() {
			return this.state;
		}
		subscribe(observerOrFn) {
			return this.atom.subscribe(toObserver(observerOrFn));
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+store@0.9.3/node_modules/@tanstack/store/dist/esm/index.js
var init_esm$3 = __esmMin((() => {
	init_atom();
	init_store();
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+pacer-lite@0.1.1/node_modules/@tanstack/pacer-lite/dist/lite-throttler.js
/**
* Creates a lightweight throttled function that limits how often the provided function can execute.
*
* This is an alternative to the throttle function in the core @tanstack/pacer package, but is more
* suitable for libraries and npm packages that need minimal overhead. Unlike the core version,
* this function creates a throttler with no external dependencies, devtools integration, or reactive state.
*
* Throttling ensures a function executes at most once within a specified time window,
* regardless of how many times it is called. This is useful for rate-limiting
* expensive operations or UI updates.
*
* @example
* ```ts
* const throttledScroll = liteThrottle(() => {
*   updateScrollIndicator();
* }, { wait: 100 });
*
* // Will execute at most once per 100ms
* window.addEventListener('scroll', throttledScroll);
* ```
*
* @example
* ```ts
* // Leading edge execution - fires immediately then throttles
* const throttledResize = liteThrottle(() => {
*   recalculateLayout();
* }, { wait: 250, leading: true, trailing: false });
* ```
*/
function liteThrottle(fn, options) {
	return new LiteThrottler(fn, options).maybeExecute;
}
var LiteThrottler;
var init_lite_throttler = __esmMin((() => {
	LiteThrottler = class {
		constructor(fn, options) {
			this.fn = fn;
			this.options = options;
			this.lastExecutionTime = 0;
			this.isPending = false;
			this.maybeExecute = (...args) => {
				const timeSinceLastExecution = Date.now() - this.lastExecutionTime;
				if (this.options.leading && timeSinceLastExecution >= this.options.wait) this.execute(...args);
				else {
					this.lastArgs = args;
					if (!this.timeoutId && this.options.trailing) {
						const timeoutDuration = this.options.wait - timeSinceLastExecution;
						this.isPending = true;
						this.timeoutId = setTimeout(() => {
							if (this.lastArgs !== void 0) this.execute(...this.lastArgs);
						}, timeoutDuration);
					}
				}
			};
			this.execute = (...args) => {
				var _this$options$onExecu, _this$options;
				this.fn(...args);
				(_this$options$onExecu = (_this$options = this.options).onExecute) === null || _this$options$onExecu === void 0 || _this$options$onExecu.call(_this$options, args, this);
				this.lastExecutionTime = Date.now();
				this.clearTimeout();
				this.lastArgs = void 0;
				this.isPending = false;
			};
			this.flush = () => {
				if (this.isPending && this.lastArgs) this.execute(...this.lastArgs);
			};
			this.cancel = () => {
				this.clearTimeout();
				this.lastArgs = void 0;
				this.isPending = false;
			};
			this.clearTimeout = () => {
				if (this.timeoutId) {
					clearTimeout(this.timeoutId);
					this.timeoutId = void 0;
				}
			};
			if (this.options.leading === void 0 && this.options.trailing === void 0) {
				this.options.leading = true;
				this.options.trailing = true;
			}
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+pacer-lite@0.1.1/node_modules/@tanstack/pacer-lite/dist/index.js
var init_dist = __esmMin((() => {
	init_lite_throttler();
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+devtools-event-client@0.4.3/node_modules/@tanstack/devtools-event-client/dist/esm/plugin.js
var _enabled, _pluginId, _eventTarget, _debug, _queuedEvents, _connected, _connectIntervalId, _connectEveryMs, _retryCount, _maxRetries, _connecting, _failedToConnect, _internalEventTarget, _onConnected, _retryConnection, _connectFunction, EventClient;
var init_plugin = __esmMin((() => {
	init_classPrivateFieldInitSpec();
	init_classPrivateFieldSet2();
	init_classPrivateFieldGet2();
	_enabled = /* @__PURE__ */ new WeakMap();
	_pluginId = /* @__PURE__ */ new WeakMap();
	_eventTarget = /* @__PURE__ */ new WeakMap();
	_debug = /* @__PURE__ */ new WeakMap();
	_queuedEvents = /* @__PURE__ */ new WeakMap();
	_connected = /* @__PURE__ */ new WeakMap();
	_connectIntervalId = /* @__PURE__ */ new WeakMap();
	_connectEveryMs = /* @__PURE__ */ new WeakMap();
	_retryCount = /* @__PURE__ */ new WeakMap();
	_maxRetries = /* @__PURE__ */ new WeakMap();
	_connecting = /* @__PURE__ */ new WeakMap();
	_failedToConnect = /* @__PURE__ */ new WeakMap();
	_internalEventTarget = /* @__PURE__ */ new WeakMap();
	_onConnected = /* @__PURE__ */ new WeakMap();
	_retryConnection = /* @__PURE__ */ new WeakMap();
	_connectFunction = /* @__PURE__ */ new WeakMap();
	EventClient = class {
		constructor({ pluginId, debug = false, enabled = true, reconnectEveryMs = 300 }) {
			_classPrivateFieldInitSpec(this, _enabled, true);
			_classPrivateFieldInitSpec(this, _pluginId, void 0);
			_classPrivateFieldInitSpec(this, _eventTarget, void 0);
			_classPrivateFieldInitSpec(this, _debug, void 0);
			_classPrivateFieldInitSpec(this, _queuedEvents, void 0);
			_classPrivateFieldInitSpec(this, _connected, void 0);
			_classPrivateFieldInitSpec(this, _connectIntervalId, void 0);
			_classPrivateFieldInitSpec(this, _connectEveryMs, void 0);
			_classPrivateFieldInitSpec(this, _retryCount, 0);
			_classPrivateFieldInitSpec(this, _maxRetries, 5);
			_classPrivateFieldInitSpec(this, _connecting, false);
			_classPrivateFieldInitSpec(this, _failedToConnect, false);
			_classPrivateFieldInitSpec(this, _internalEventTarget, null);
			_classPrivateFieldInitSpec(this, _onConnected, () => {
				this.debugLog("Connected to event bus");
				_classPrivateFieldSet2(_connected, this, true);
				_classPrivateFieldSet2(_connecting, this, false);
				this.debugLog("Emitting queued events", _classPrivateFieldGet2(_queuedEvents, this));
				_classPrivateFieldGet2(_queuedEvents, this).forEach((event) => this.emitEventToBus(event));
				_classPrivateFieldSet2(_queuedEvents, this, []);
				this.stopConnectLoop();
				_classPrivateFieldGet2(_eventTarget, this).call(this).removeEventListener("tanstack-connect-success", _classPrivateFieldGet2(_onConnected, this));
			});
			_classPrivateFieldInitSpec(this, _retryConnection, () => {
				if (_classPrivateFieldGet2(_retryCount, this) < _classPrivateFieldGet2(_maxRetries, this)) {
					var _this$retryCount;
					_classPrivateFieldSet2(_retryCount, this, (_this$retryCount = _classPrivateFieldGet2(_retryCount, this), _this$retryCount++, _this$retryCount));
					this.dispatchCustomEvent("tanstack-connect", {});
					return;
				}
				_classPrivateFieldGet2(_eventTarget, this).call(this).removeEventListener("tanstack-connect", _classPrivateFieldGet2(_retryConnection, this));
				_classPrivateFieldSet2(_failedToConnect, this, true);
				this.debugLog("Max retries reached, giving up on connection");
				this.stopConnectLoop();
			});
			_classPrivateFieldInitSpec(this, _connectFunction, () => {
				if (_classPrivateFieldGet2(_connecting, this)) return;
				_classPrivateFieldSet2(_connecting, this, true);
				_classPrivateFieldGet2(_eventTarget, this).call(this).addEventListener("tanstack-connect-success", _classPrivateFieldGet2(_onConnected, this));
				_classPrivateFieldGet2(_retryConnection, this).call(this);
			});
			_classPrivateFieldSet2(_pluginId, this, pluginId);
			_classPrivateFieldSet2(_enabled, this, enabled);
			_classPrivateFieldSet2(_eventTarget, this, this.getGlobalTarget);
			_classPrivateFieldSet2(_debug, this, debug);
			this.debugLog(" Initializing event subscription for plugin", _classPrivateFieldGet2(_pluginId, this));
			_classPrivateFieldSet2(_queuedEvents, this, []);
			_classPrivateFieldSet2(_connected, this, false);
			_classPrivateFieldSet2(_failedToConnect, this, false);
			_classPrivateFieldSet2(_connectIntervalId, this, null);
			_classPrivateFieldSet2(_connectEveryMs, this, reconnectEveryMs);
		}
		startConnectLoop() {
			if (_classPrivateFieldGet2(_connectIntervalId, this) !== null || _classPrivateFieldGet2(_connected, this)) return;
			this.debugLog(`Starting connect loop (every ${_classPrivateFieldGet2(_connectEveryMs, this)}ms)`);
			_classPrivateFieldSet2(_connectIntervalId, this, setInterval(_classPrivateFieldGet2(_retryConnection, this), _classPrivateFieldGet2(_connectEveryMs, this)));
		}
		stopConnectLoop() {
			_classPrivateFieldSet2(_connecting, this, false);
			if (_classPrivateFieldGet2(_connectIntervalId, this) === null) return;
			clearInterval(_classPrivateFieldGet2(_connectIntervalId, this));
			_classPrivateFieldSet2(_connectIntervalId, this, null);
			_classPrivateFieldSet2(_queuedEvents, this, []);
			this.debugLog("Stopped connect loop");
		}
		debugLog(...args) {
			if (_classPrivateFieldGet2(_debug, this)) console.log(`🌴 [tanstack-devtools:${_classPrivateFieldGet2(_pluginId, this)}-plugin]`, ...args);
		}
		getGlobalTarget() {
			if (typeof globalThis !== "undefined" && globalThis.__TANSTACK_EVENT_TARGET__) {
				this.debugLog("Using global event target");
				return globalThis.__TANSTACK_EVENT_TARGET__;
			}
			if (typeof window !== "undefined" && typeof window.addEventListener !== "undefined") {
				this.debugLog("Using window as event target");
				return window;
			}
			const eventTarget = typeof EventTarget !== "undefined" ? new EventTarget() : void 0;
			if (typeof eventTarget === "undefined" || typeof eventTarget.addEventListener === "undefined") {
				this.debugLog("No event mechanism available, running in non-web environment");
				return {
					addEventListener: () => {},
					removeEventListener: () => {},
					dispatchEvent: () => false
				};
			}
			this.debugLog("Using new EventTarget as fallback");
			return eventTarget;
		}
		getPluginId() {
			return _classPrivateFieldGet2(_pluginId, this);
		}
		dispatchCustomEventShim(eventName, detail) {
			try {
				const event = new Event(eventName, { detail });
				_classPrivateFieldGet2(_eventTarget, this).call(this).dispatchEvent(event);
			} catch (e) {
				this.debugLog("Failed to dispatch shim event");
			}
		}
		dispatchCustomEvent(eventName, detail) {
			try {
				_classPrivateFieldGet2(_eventTarget, this).call(this).dispatchEvent(new CustomEvent(eventName, { detail }));
			} catch (e) {
				this.dispatchCustomEventShim(eventName, detail);
			}
		}
		emitEventToBus(event) {
			this.debugLog("Emitting event to client bus", event);
			this.dispatchCustomEvent("tanstack-dispatch-event", event);
		}
		createEventPayload(eventSuffix, payload) {
			return {
				type: `${_classPrivateFieldGet2(_pluginId, this)}:${eventSuffix}`,
				payload,
				pluginId: _classPrivateFieldGet2(_pluginId, this)
			};
		}
		emit(eventSuffix, payload) {
			if (!_classPrivateFieldGet2(_enabled, this)) {
				this.debugLog("Event bus client is disabled, not emitting event", eventSuffix, payload);
				return;
			}
			if (_classPrivateFieldGet2(_internalEventTarget, this)) {
				this.debugLog("Emitting event to internal event target", eventSuffix, payload);
				_classPrivateFieldGet2(_internalEventTarget, this).dispatchEvent(new CustomEvent(`${_classPrivateFieldGet2(_pluginId, this)}:${eventSuffix}`, { detail: this.createEventPayload(eventSuffix, payload) }));
			}
			if (_classPrivateFieldGet2(_failedToConnect, this)) {
				this.debugLog("Previously failed to connect, not emitting to bus");
				return;
			}
			if (!_classPrivateFieldGet2(_connected, this)) {
				this.debugLog("Bus not available, will be pushed as soon as connected");
				_classPrivateFieldGet2(_queuedEvents, this).push(this.createEventPayload(eventSuffix, payload));
				if (typeof CustomEvent !== "undefined" && !_classPrivateFieldGet2(_connecting, this)) {
					_classPrivateFieldGet2(_connectFunction, this).call(this);
					this.startConnectLoop();
				}
				return;
			}
			return this.emitEventToBus(this.createEventPayload(eventSuffix, payload));
		}
		on(eventSuffix, cb, options) {
			var _options$withEventTar;
			const withEventTarget = (_options$withEventTar = options === null || options === void 0 ? void 0 : options.withEventTarget) !== null && _options$withEventTar !== void 0 ? _options$withEventTar : false;
			const eventName = `${_classPrivateFieldGet2(_pluginId, this)}:${eventSuffix}`;
			if (withEventTarget) {
				if (!_classPrivateFieldGet2(_internalEventTarget, this)) _classPrivateFieldSet2(_internalEventTarget, this, new EventTarget());
				_classPrivateFieldGet2(_internalEventTarget, this).addEventListener(eventName, (e) => {
					cb(e.detail);
				});
			}
			if (!_classPrivateFieldGet2(_enabled, this)) {
				this.debugLog("Event bus client is disabled, not registering event", eventName);
				return () => {};
			}
			const handler = (e) => {
				this.debugLog("Received event from bus", e.detail);
				cb(e.detail);
			};
			_classPrivateFieldGet2(_eventTarget, this).call(this).addEventListener(eventName, handler);
			this.debugLog("Registered event to bus", eventName);
			return () => {
				if (withEventTarget) {
					var _classPrivateFieldGet2$1;
					(_classPrivateFieldGet2$1 = _classPrivateFieldGet2(_internalEventTarget, this)) === null || _classPrivateFieldGet2$1 === void 0 || _classPrivateFieldGet2$1.removeEventListener(eventName, handler);
				}
				_classPrivateFieldGet2(_eventTarget, this).call(this).removeEventListener(eventName, handler);
			};
		}
		onAll(cb) {
			if (!_classPrivateFieldGet2(_enabled, this)) {
				this.debugLog("Event bus client is disabled, not registering event");
				return () => {};
			}
			const handler = (e) => {
				const event = e.detail;
				cb(event);
			};
			_classPrivateFieldGet2(_eventTarget, this).call(this).addEventListener("tanstack-devtools-global", handler);
			return () => _classPrivateFieldGet2(_eventTarget, this).call(this).removeEventListener("tanstack-devtools-global", handler);
		}
		onAllPluginEvents(cb) {
			if (!_classPrivateFieldGet2(_enabled, this)) {
				this.debugLog("Event bus client is disabled, not registering event");
				return () => {};
			}
			const handler = (e) => {
				const event = e.detail;
				if (_classPrivateFieldGet2(_pluginId, this) && event.pluginId !== _classPrivateFieldGet2(_pluginId, this)) return;
				cb(event);
			};
			_classPrivateFieldGet2(_eventTarget, this).call(this).addEventListener("tanstack-devtools-global", handler);
			return () => _classPrivateFieldGet2(_eventTarget, this).call(this).removeEventListener("tanstack-devtools-global", handler);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+devtools-event-client@0.4.3/node_modules/@tanstack/devtools-event-client/dist/esm/index.js
var init_esm$2 = __esmMin((() => {
	init_plugin();
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+form-core@1.32.0/node_modules/@tanstack/form-core/dist/esm/EventClient.js
var FormEventClient, formEventClient;
var init_EventClient = __esmMin((() => {
	init_esm$2();
	FormEventClient = class extends EventClient {
		constructor() {
			super({
				pluginId: "form-devtools",
				reconnectEveryMs: 1e3
			});
		}
	};
	formEventClient = new FormEventClient();
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+form-core@1.32.0/node_modules/@tanstack/form-core/dist/esm/utils.js
function functionalUpdate(updater, input) {
	return typeof updater === "function" ? updater(input) : updater;
}
function getBy(obj, path) {
	return makePathArray(path).reduce((current, pathPart) => {
		if (current === null) return null;
		if (typeof current !== "undefined") return current[pathPart];
	}, obj);
}
function setBy(obj, _path, updater) {
	const path = makePathArray(_path);
	function doSet(parent) {
		if (!path.length) return functionalUpdate(updater, parent);
		const key = path.shift();
		if (typeof key === "string" || typeof key === "number" && !Array.isArray(parent)) {
			if (typeof parent === "object") {
				if (parent === null) parent = {};
				return _objectSpread2(_objectSpread2({}, parent), {}, { [key]: doSet(parent[key]) });
			}
			return { [key]: doSet() };
		}
		if (Array.isArray(parent) && typeof key === "number") {
			const prefix = parent.slice(0, key);
			return [
				...prefix.length ? prefix : new Array(key),
				doSet(parent[key]),
				...parent.slice(key + 1)
			];
		}
		return [...new Array(key), doSet()];
	}
	return doSet(obj);
}
function deleteBy(obj, _path) {
	const path = makePathArray(_path);
	function doDelete(parent) {
		if (!parent) return;
		if (path.length === 1) {
			const finalPath = path[0];
			if (Array.isArray(parent) && typeof finalPath === "number") return parent.filter((_, i) => i !== finalPath);
			const { [finalPath]: remove } = parent;
			return _objectWithoutProperties(parent, [finalPath].map(toPropertyKey));
		}
		const key = path.shift();
		if (typeof key === "string" || typeof key === "number" && !Array.isArray(parent)) {
			if (typeof parent === "object") return _objectSpread2(_objectSpread2({}, parent), {}, { [key]: doDelete(parent[key]) });
		}
		if (typeof key === "number") {
			if (Array.isArray(parent)) {
				if (key >= parent.length) return parent;
				const prefix = parent.slice(0, key);
				return [
					...prefix.length ? prefix : new Array(key),
					doDelete(parent[key]),
					...parent.slice(key + 1)
				];
			}
		}
		throw new Error("It seems we have created an infinite loop in deleteBy. ");
	}
	return doDelete(obj);
}
function makePathArray(str) {
	if (Array.isArray(str)) return [...str];
	if (typeof str !== "string") throw new Error("Path must be a string.");
	return str.replace(/(^\[)|]/gm, "").replace(/\[/g, ".").replace(reLineOfOnlyDigits, intReplace).replace(reDigitsBetweenDots, `.${intReplace}.`).replace(reStartWithDigitThenDot, `${intReplace}.`).replace(reDotWithDigitsToEnd, `.${intReplace}`).replace(reMultipleDots, ".").split(".").map((d) => {
		if (d.startsWith(intPrefix)) {
			const numStr = d.substring(7);
			const num = parseInt(numStr, 10);
			if (String(num) === numStr) return num;
			return numStr;
		}
		return d;
	});
}
function isNonEmptyArray(obj) {
	return !(Array.isArray(obj) && obj.length === 0);
}
function getSyncValidatorArray(cause, options) {
	const runValidation = (props) => {
		return props.validators.filter(Boolean).map((validator) => {
			return {
				cause: validator.cause,
				validate: validator.fn
			};
		});
	};
	return options.validationLogic({
		form: options.form,
		validators: options.validators,
		event: {
			type: cause,
			fieldName: options.fieldName,
			async: false
		},
		runValidation
	});
}
function getAsyncValidatorArray(cause, options) {
	const { asyncDebounceMs } = options;
	const { onBlurAsyncDebounceMs, onChangeAsyncDebounceMs, onDynamicAsyncDebounceMs } = options.validators || {};
	const defaultDebounceMs = asyncDebounceMs !== null && asyncDebounceMs !== void 0 ? asyncDebounceMs : 0;
	const runValidation = (props) => {
		return props.validators.filter(Boolean).map((validator) => {
			const validatorCause = (validator === null || validator === void 0 ? void 0 : validator.cause) || cause;
			let debounceMs = defaultDebounceMs;
			switch (validatorCause) {
				case "change":
					debounceMs = onChangeAsyncDebounceMs !== null && onChangeAsyncDebounceMs !== void 0 ? onChangeAsyncDebounceMs : defaultDebounceMs;
					break;
				case "blur":
					debounceMs = onBlurAsyncDebounceMs !== null && onBlurAsyncDebounceMs !== void 0 ? onBlurAsyncDebounceMs : defaultDebounceMs;
					break;
				case "dynamic":
					debounceMs = onDynamicAsyncDebounceMs !== null && onDynamicAsyncDebounceMs !== void 0 ? onDynamicAsyncDebounceMs : defaultDebounceMs;
					break;
				case "submit":
					debounceMs = 0;
					break;
			}
			if (cause === "submit") debounceMs = 0;
			return {
				cause: validatorCause,
				validate: validator.fn,
				debounceMs
			};
		});
	};
	return options.validationLogic({
		form: options.form,
		validators: options.validators,
		event: {
			type: cause,
			fieldName: options.fieldName,
			async: true
		},
		runValidation
	});
}
function evaluate(objA, objB) {
	if (Object.is(objA, objB)) return true;
	if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) return false;
	if (objA instanceof Date && objB instanceof Date) return objA.getTime() === objB.getTime();
	if (objA instanceof Map && objB instanceof Map) {
		if (objA.size !== objB.size) return false;
		for (const [k, v] of objA) if (!objB.has(k) || !Object.is(v, objB.get(k))) return false;
		return true;
	}
	if (objA instanceof Set && objB instanceof Set) {
		if (objA.size !== objB.size) return false;
		for (const v of objA) if (!objB.has(v)) return false;
		return true;
	}
	const keysA = Object.keys(objA);
	const keysB = Object.keys(objB);
	if (keysA.length !== keysB.length) return false;
	if (keysA.length === 0 && !Array.isArray(objA) && !Array.isArray(objB) && (Object.getPrototypeOf(objA) !== Object.prototype || Object.getPrototypeOf(objB) !== Object.prototype)) return false;
	for (const key of keysA) if (!keysB.includes(key) || !evaluate(objA[key], objB[key])) return false;
	return true;
}
function mergeOpts(originalOpts, overrides) {
	if (originalOpts === void 0 || originalOpts === null) return overrides;
	return _objectSpread2(_objectSpread2({}, originalOpts), overrides);
}
function uuid() {
	let i = 0;
	let num;
	let out = "";
	if (!BUFFER || IDX + 16 > 256) {
		BUFFER = new Array(256);
		i = 256;
		while (i--) BUFFER[i] = 256 * Math.random() | 0;
		i = 0;
		IDX = 0;
	}
	for (; i < 16; i++) {
		num = BUFFER[IDX + i];
		if (i === 6) out += HEX[num & 15 | 64];
		else if (i === 8) out += HEX[num & 63 | 128];
		else out += HEX[num];
		if (i & 1 && i > 1 && i < 11) out += "-";
	}
	IDX++;
	return out;
}
var reLineOfOnlyDigits, reDigitsBetweenDots, reStartWithDigitThenDot, reDotWithDigitsToEnd, reMultipleDots, intPrefix, intReplace, isGlobalFormValidationError, determineFormLevelErrorSourceAndValue, determineFieldLevelErrorSourceAndValue, IDX, HEX, BUFFER, throttleFormState;
var init_utils = __esmMin((() => {
	init_dist();
	init_EventClient();
	init_objectSpread2();
	init_toPropertyKey();
	init_objectWithoutProperties();
	reLineOfOnlyDigits = /^(\d+)$/gm;
	reDigitsBetweenDots = /\.(\d+)(?=\.)/gm;
	reStartWithDigitThenDot = /^(\d+)\./gm;
	reDotWithDigitsToEnd = /\.(\d+$)/gm;
	reMultipleDots = /\.{2,}/gm;
	intPrefix = "__int__";
	intReplace = `${intPrefix}$1`;
	isGlobalFormValidationError = (error) => {
		return !!error && typeof error === "object" && "fields" in error;
	};
	determineFormLevelErrorSourceAndValue = ({ newFormValidatorError, isPreviousErrorFromFormValidator, previousErrorValue }) => {
		if (newFormValidatorError) return {
			newErrorValue: newFormValidatorError,
			newSource: "form"
		};
		if (isPreviousErrorFromFormValidator) return {
			newErrorValue: void 0,
			newSource: void 0
		};
		if (previousErrorValue) return {
			newErrorValue: previousErrorValue,
			newSource: "field"
		};
		return {
			newErrorValue: void 0,
			newSource: void 0
		};
	};
	determineFieldLevelErrorSourceAndValue = ({ formLevelError, fieldLevelError }) => {
		if (fieldLevelError) return {
			newErrorValue: fieldLevelError,
			newSource: "field"
		};
		if (formLevelError) return {
			newErrorValue: formLevelError,
			newSource: "form"
		};
		return {
			newErrorValue: void 0,
			newSource: void 0
		};
	};
	IDX = 256;
	HEX = [];
	while (IDX--) HEX[IDX] = (IDX + 256).toString(16).substring(1);
	throttleFormState = liteThrottle((form) => formEventClient.emit("form-state", {
		id: form.formId,
		state: form.store.state
	}), { wait: 300 });
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+form-core@1.32.0/node_modules/@tanstack/form-core/dist/esm/ValidationLogic.js
var revalidateLogic, defaultValidationLogic;
var init_ValidationLogic = __esmMin((() => {
	init_objectSpread2();
	revalidateLogic = ({ mode = "submit", modeAfterSubmission = "change" } = {}) => (props) => {
		var _props$validators;
		if (Object.keys((_props$validators = props.validators) !== null && _props$validators !== void 0 ? _props$validators : {}).length === 0) return props.runValidation({
			validators: [],
			form: props.form
		});
		const dynamicValidator = {
			fn: props.event.async ? props.validators["onDynamicAsync"] : props.validators["onDynamic"],
			cause: "dynamic"
		};
		const validatorsToAdd = [];
		if ([props.form.state.submissionAttempts === 0 ? mode : modeAfterSubmission, "submit"].includes(props.event.type)) validatorsToAdd.push(dynamicValidator);
		let defaultValidators = [];
		defaultValidationLogic(_objectSpread2(_objectSpread2({}, props), {}, { runValidation: (vProps) => {
			defaultValidators = vProps.validators;
		} }));
		if (validatorsToAdd.length === 0) return props.runValidation({
			validators: defaultValidators,
			form: props.form
		});
		return props.runValidation({
			validators: [...defaultValidators, ...validatorsToAdd],
			form: props.form
		});
	};
	defaultValidationLogic = (props) => {
		if (!props.validators) return props.runValidation({
			validators: [],
			form: props.form
		});
		const isAsync = props.event.async;
		const onMountValidator = isAsync ? void 0 : {
			fn: props.validators.onMount,
			cause: "mount"
		};
		const onChangeValidator = {
			fn: isAsync ? props.validators.onChangeAsync : props.validators.onChange,
			cause: "change"
		};
		const onBlurValidator = {
			fn: isAsync ? props.validators.onBlurAsync : props.validators.onBlur,
			cause: "blur"
		};
		const onSubmitValidator = {
			fn: isAsync ? props.validators.onSubmitAsync : props.validators.onSubmit,
			cause: "submit"
		};
		const onServerValidator = isAsync ? void 0 : {
			fn: () => void 0,
			cause: "server"
		};
		switch (props.event.type) {
			case "mount": return props.runValidation({
				validators: [onMountValidator],
				form: props.form
			});
			case "submit": return props.runValidation({
				validators: [
					onChangeValidator,
					onBlurValidator,
					onSubmitValidator,
					onServerValidator
				],
				form: props.form
			});
			case "server": return props.runValidation({
				validators: [],
				form: props.form
			});
			case "blur": return props.runValidation({
				validators: [onBlurValidator, onServerValidator],
				form: props.form
			});
			case "change": return props.runValidation({
				validators: [onChangeValidator, onServerValidator],
				form: props.form
			});
			default: throw new Error(`Unknown validation event type: ${props.event.type}`);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+form-core@1.32.0/node_modules/@tanstack/form-core/dist/esm/standardSchemaValidator.js
function prefixSchemaToErrors(issues, formValue) {
	const schema = /* @__PURE__ */ new Map();
	for (const issue of issues) {
		var _issue$path, _schema$get;
		const issuePath = (_issue$path = issue.path) !== null && _issue$path !== void 0 ? _issue$path : [];
		let currentFormValue = formValue;
		let path = "";
		for (let i = 0; i < issuePath.length; i++) {
			const pathSegment = issuePath[i];
			if (pathSegment === void 0) continue;
			const segment = typeof pathSegment === "object" ? pathSegment.key : pathSegment;
			const segmentAsNumber = Number(segment);
			if (Array.isArray(currentFormValue) && !Number.isNaN(segmentAsNumber)) path += `[${segmentAsNumber}]`;
			else path += (i > 0 ? "." : "") + String(segment);
			if (typeof currentFormValue === "object" && currentFormValue !== null) currentFormValue = currentFormValue[segment];
			else currentFormValue = void 0;
		}
		schema.set(path, ((_schema$get = schema.get(path)) !== null && _schema$get !== void 0 ? _schema$get : []).concat(issue));
	}
	return Object.fromEntries(schema);
}
var transformFormIssues, standardSchemaValidators, isStandardSchemaValidator;
var init_standardSchemaValidator = __esmMin((() => {
	init_asyncToGenerator();
	transformFormIssues = (issues, formValue) => {
		const schemaErrors = prefixSchemaToErrors(issues, formValue);
		return {
			form: schemaErrors,
			fields: schemaErrors
		};
	};
	standardSchemaValidators = {
		validate({ value, validationSource }, schema) {
			const result = schema["~standard"].validate(value);
			if (result instanceof Promise) throw new Error("async function passed to sync validator");
			if (!result.issues) return;
			if (validationSource === "field") return result.issues;
			return transformFormIssues(result.issues, value);
		},
		validateAsync({ value, validationSource }, schema) {
			return _asyncToGenerator(function* () {
				const result = yield schema["~standard"].validate(value);
				if (!result.issues) return;
				if (validationSource === "field") return result.issues;
				return transformFormIssues(result.issues, value);
			})();
		}
	};
	isStandardSchemaValidator = (validator) => !!validator && "~standard" in validator;
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+form-core@1.32.0/node_modules/@tanstack/form-core/dist/esm/metaHelper.js
function metaHelper(formApi) {
	function bumpArrayVersion(field) {
		var _formApi$getFieldMeta;
		const currentMeta = (_formApi$getFieldMeta = formApi.getFieldMeta(field)) !== null && _formApi$getFieldMeta !== void 0 ? _formApi$getFieldMeta : defaultFieldMeta;
		formApi.setFieldMeta(field, _objectSpread2(_objectSpread2({}, currentMeta), {}, { _arrayVersion: (currentMeta._arrayVersion || 0) + 1 }));
	}
	function handleArrayMove(field, fromIndex, toIndex) {
		bumpArrayVersion(field);
		const affectedFields = getAffectedFields(field, fromIndex, "move", toIndex);
		const startIndex = Math.min(fromIndex, toIndex);
		const endIndex = Math.max(fromIndex, toIndex);
		for (let i = startIndex; i <= endIndex; i++) affectedFields.push(getFieldPath(field, i));
		const fromFields = Object.keys(formApi.fieldInfo).reduce((fieldMap, fieldKey) => {
			if (fieldKey.startsWith(getFieldPath(field, fromIndex))) fieldMap.set(fieldKey, formApi.getFieldMeta(fieldKey));
			return fieldMap;
		}, /* @__PURE__ */ new Map());
		shiftMeta(affectedFields, fromIndex < toIndex ? "up" : "down");
		Object.keys(formApi.fieldInfo).filter((fieldKey) => fieldKey.startsWith(getFieldPath(field, toIndex))).forEach((fieldKey) => {
			const fromKey = fieldKey.replace(getFieldPath(field, toIndex), getFieldPath(field, fromIndex));
			const fromMeta = fromFields.get(fromKey);
			if (fromMeta) formApi.setFieldMeta(fieldKey, fromMeta);
		});
	}
	function handleArrayRemove(field, index) {
		bumpArrayVersion(field);
		shiftMeta(getAffectedFields(field, index, "remove"), "up");
	}
	function handleArraySwap(field, index, secondIndex) {
		bumpArrayVersion(field);
		getAffectedFields(field, index, "swap", secondIndex).forEach((fieldKey) => {
			if (!fieldKey.toString().startsWith(getFieldPath(field, index))) return;
			const swappedKey = fieldKey.toString().replace(getFieldPath(field, index), getFieldPath(field, secondIndex));
			const [meta1, meta2] = [formApi.getFieldMeta(fieldKey), formApi.getFieldMeta(swappedKey)];
			if (meta1) formApi.setFieldMeta(swappedKey, meta1);
			if (meta2) formApi.setFieldMeta(fieldKey, meta2);
		});
	}
	function handleArrayInsert(field, insertIndex) {
		bumpArrayVersion(field);
		const affectedFields = getAffectedFields(field, insertIndex, "insert");
		shiftMeta(affectedFields, "down");
		affectedFields.forEach((fieldKey) => {
			if (fieldKey.toString().startsWith(getFieldPath(field, insertIndex))) formApi.setFieldMeta(fieldKey, getEmptyFieldMeta());
		});
	}
	function getFieldPath(field, index) {
		return `${field}[${index}]`;
	}
	function getAffectedFields(field, index, mode, secondIndex) {
		const affectedFieldKeys = [getFieldPath(field, index)];
		switch (mode) {
			case "swap":
				affectedFieldKeys.push(getFieldPath(field, secondIndex));
				break;
			case "move": {
				const [startIndex, endIndex] = [Math.min(index, secondIndex), Math.max(index, secondIndex)];
				for (let i = startIndex; i <= endIndex; i++) affectedFieldKeys.push(getFieldPath(field, i));
				break;
			}
			default: {
				const currentValue = formApi.getFieldValue(field);
				const fieldItems = Array.isArray(currentValue) ? currentValue.length : 0;
				for (let i = index + 1; i < fieldItems; i++) affectedFieldKeys.push(getFieldPath(field, i));
				break;
			}
		}
		return Object.keys(formApi.fieldInfo).filter((fieldKey) => affectedFieldKeys.some((key) => fieldKey.startsWith(key)));
	}
	function updateIndex(fieldKey, direction) {
		return fieldKey.replace(/\[(\d+)\]/, (_, num) => {
			const currIndex = parseInt(num, 10);
			return `[${direction === "up" ? currIndex + 1 : Math.max(0, currIndex - 1)}]`;
		});
	}
	function shiftMeta(fields, direction) {
		(direction === "up" ? fields : [...fields].reverse()).forEach((fieldKey) => {
			const nextFieldKey = updateIndex(fieldKey.toString(), direction);
			const nextFieldMeta = formApi.getFieldMeta(nextFieldKey);
			if (nextFieldMeta) formApi.setFieldMeta(fieldKey, nextFieldMeta);
			else formApi.setFieldMeta(fieldKey, getEmptyFieldMeta());
		});
	}
	const getEmptyFieldMeta = () => defaultFieldMeta;
	return {
		bumpArrayVersion,
		handleArrayMove,
		handleArrayRemove,
		handleArraySwap,
		handleArrayInsert
	};
}
var defaultFieldMeta;
var init_metaHelper = __esmMin((() => {
	init_objectSpread2();
	defaultFieldMeta = {
		isValidating: false,
		isTouched: false,
		isBlurred: false,
		isDirty: false,
		isPristine: true,
		isValid: true,
		isDefaultValue: true,
		errors: [],
		errorMap: {},
		errorSourceMap: {},
		_arrayVersion: 0
	};
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+form-core@1.32.0/node_modules/@tanstack/form-core/dist/esm/FormApi.js
function getDefaultFormState(defaultState) {
	var _defaultState$values, _defaultState$errorMa, _defaultState$fieldMe, _defaultState$isSubmi, _defaultState$isSubmi2, _defaultState$isValid, _defaultState$submiss, _defaultState$isSubmi3, _defaultState$validat;
	return {
		values: (_defaultState$values = defaultState.values) !== null && _defaultState$values !== void 0 ? _defaultState$values : {},
		errorMap: (_defaultState$errorMa = defaultState.errorMap) !== null && _defaultState$errorMa !== void 0 ? _defaultState$errorMa : {},
		fieldMetaBase: (_defaultState$fieldMe = defaultState.fieldMetaBase) !== null && _defaultState$fieldMe !== void 0 ? _defaultState$fieldMe : {},
		isSubmitted: (_defaultState$isSubmi = defaultState.isSubmitted) !== null && _defaultState$isSubmi !== void 0 ? _defaultState$isSubmi : false,
		isSubmitting: (_defaultState$isSubmi2 = defaultState.isSubmitting) !== null && _defaultState$isSubmi2 !== void 0 ? _defaultState$isSubmi2 : false,
		isValidating: (_defaultState$isValid = defaultState.isValidating) !== null && _defaultState$isValid !== void 0 ? _defaultState$isValid : false,
		submissionAttempts: (_defaultState$submiss = defaultState.submissionAttempts) !== null && _defaultState$submiss !== void 0 ? _defaultState$submiss : 0,
		isSubmitSuccessful: (_defaultState$isSubmi3 = defaultState.isSubmitSuccessful) !== null && _defaultState$isSubmi3 !== void 0 ? _defaultState$isSubmi3 : false,
		validationMetaMap: (_defaultState$validat = defaultState.validationMetaMap) !== null && _defaultState$validat !== void 0 ? _defaultState$validat : {
			onChange: void 0,
			onBlur: void 0,
			onSubmit: void 0,
			onMount: void 0,
			onServer: void 0,
			onDynamic: void 0
		}
	};
}
function normalizeError$1(rawError) {
	if (rawError) {
		if (isGlobalFormValidationError(rawError)) return {
			formError: normalizeError$1(rawError.form).formError,
			fieldErrors: rawError.fields
		};
		return { formError: rawError };
	}
	return { formError: void 0 };
}
function getErrorMapKey$1(cause) {
	switch (cause) {
		case "submit": return "onSubmit";
		case "blur": return "onBlur";
		case "mount": return "onMount";
		case "server": return "onServer";
		case "dynamic": return "onDynamic";
		default: return "onChange";
	}
}
var FormApi;
var init_FormApi = __esmMin((() => {
	init_esm$3();
	init_utils();
	init_ValidationLogic();
	init_standardSchemaValidator();
	init_metaHelper();
	init_EventClient();
	init_objectSpread2();
	init_asyncToGenerator();
	FormApi = class {
		/**
		* Constructs a new `FormApi` instance with the given form options.
		*/
		constructor(opts) {
			var _this = this;
			var _opts$formId, _opts$defaultValues, _opts$defaultState;
			this.options = {};
			this.fieldInfo = {};
			this.mount = () => {
				var _this$options$listene, _this$options$listene2;
				const cleanupDevtoolBroadcast = this.store.subscribe(() => {
					throttleFormState(this);
				});
				const cleanupFormStateListener = formEventClient.on("request-form-state", (e) => {
					if (e.payload.id === this._formId) formEventClient.emit("form-api", {
						id: this._formId,
						state: this.store.state,
						options: this.options
					});
				});
				const cleanupFormResetListener = formEventClient.on("request-form-reset", (e) => {
					if (e.payload.id === this._formId) this.reset();
				});
				const cleanupFormForceSubmitListener = formEventClient.on("request-form-force-submit", (e) => {
					if (e.payload.id === this._formId) {
						this._devtoolsSubmissionOverride = true;
						this.handleSubmit();
						this._devtoolsSubmissionOverride = false;
					}
				});
				const cleanup = () => {
					cleanupFormForceSubmitListener();
					cleanupFormResetListener();
					cleanupFormStateListener();
					cleanupDevtoolBroadcast.unsubscribe();
					formEventClient.emit("form-unmounted", { id: this._formId });
				};
				(_this$options$listene = this.options.listeners) === null || _this$options$listene === void 0 || (_this$options$listene2 = _this$options$listene.onMount) === null || _this$options$listene2 === void 0 || _this$options$listene2.call(_this$options$listene, { formApi: this });
				const { onMount } = this.options.validators || {};
				formEventClient.emit("form-api", {
					id: this._formId,
					state: this.store.state,
					options: this.options
				});
				if (!onMount) return cleanup;
				this.validateSync("mount");
				return cleanup;
			};
			this.update = (options) => {
				if (!options) return;
				const oldOptions = this.options;
				this.options = options;
				const shouldUpdateValues = options.defaultValues && !evaluate(options.defaultValues, oldOptions.defaultValues) && !this.state.isTouched;
				const shouldUpdateState = !evaluate(options.defaultState, oldOptions.defaultState) && !this.state.isTouched;
				if (!shouldUpdateValues && !shouldUpdateState) return;
				batch(() => {
					this.baseStore.setState(() => getDefaultFormState(Object.assign({}, this.state, shouldUpdateState ? options.defaultState : {}, shouldUpdateValues ? { values: options.defaultValues } : {})));
				});
				formEventClient.emit("form-api", {
					id: this._formId,
					state: this.store.state,
					options: this.options
				});
			};
			this.reset = (values, opts2) => {
				const { fieldMeta: currentFieldMeta } = this.state;
				const fieldMetaBase = this.resetFieldMeta(currentFieldMeta);
				if (values && !(opts2 === null || opts2 === void 0 ? void 0 : opts2.keepDefaultValues)) this.options = _objectSpread2(_objectSpread2({}, this.options), {}, { defaultValues: values });
				this.baseStore.setState(() => {
					var _ref, _this$options$default;
					let nextValues = (_ref = values !== null && values !== void 0 ? values : this.options.defaultValues) !== null && _ref !== void 0 ? _ref : (_this$options$default = this.options.defaultState) === null || _this$options$default === void 0 ? void 0 : _this$options$default.values;
					if (!values) Object.values(this.fieldInfo).forEach((fieldInfo) => {
						if (fieldInfo.instance && fieldInfo.instance.options.defaultValue !== void 0) nextValues = setBy(nextValues, fieldInfo.instance.name, fieldInfo.instance.options.defaultValue);
					});
					return getDefaultFormState(_objectSpread2(_objectSpread2({}, this.options.defaultState), {}, {
						values: nextValues,
						fieldMetaBase
					}));
				});
			};
			this.validateAllFields = function() {
				var _ref2 = _asyncToGenerator(function* (cause) {
					const fieldValidationPromises = [];
					batch(() => {
						Object.values(_this.fieldInfo).forEach((field) => {
							if (!field.instance) return;
							const fieldInstance = field.instance;
							fieldValidationPromises.push(Promise.resolve().then(() => fieldInstance.validate(cause, { skipFormValidation: true })));
							if (!field.instance.state.meta.isTouched) field.instance.setMeta((prev) => _objectSpread2(_objectSpread2({}, prev), {}, { isTouched: true }));
						});
					});
					return (yield Promise.all(fieldValidationPromises)).flat();
				});
				return function(_x) {
					return _ref2.apply(this, arguments);
				};
			}();
			this.validateArrayFieldsStartingFrom = function() {
				var _ref3 = _asyncToGenerator(function* (field, index, cause) {
					const currentValue = _this.getFieldValue(field);
					const lastIndex = Array.isArray(currentValue) ? Math.max(currentValue.length - 1, 0) : null;
					const fieldKeysToValidate = [`${field}[${index}]`];
					for (let i = index + 1; i <= (lastIndex !== null && lastIndex !== void 0 ? lastIndex : 0); i++) fieldKeysToValidate.push(`${field}[${i}]`);
					const fieldsToValidate = Object.keys(_this.fieldInfo).filter((fieldKey) => fieldKeysToValidate.some((key) => fieldKey.startsWith(key)));
					const fieldValidationPromises = [];
					batch(() => {
						fieldsToValidate.forEach((nestedField) => {
							fieldValidationPromises.push(Promise.resolve().then(() => _this.validateField(nestedField, cause)));
						});
					});
					return (yield Promise.all(fieldValidationPromises)).flat();
				});
				return function(_x2, _x3, _x4) {
					return _ref3.apply(this, arguments);
				};
			}();
			this.validateField = (field, cause) => {
				var _this$fieldInfo$field;
				const fieldInstance = (_this$fieldInfo$field = this.fieldInfo[field]) === null || _this$fieldInfo$field === void 0 ? void 0 : _this$fieldInfo$field.instance;
				if (!fieldInstance) {
					const { hasErrored } = this.validateSync(cause);
					if (hasErrored && !this.options.asyncAlways) {
						var _this$getFieldMeta$er, _this$getFieldMeta;
						return (_this$getFieldMeta$er = (_this$getFieldMeta = this.getFieldMeta(field)) === null || _this$getFieldMeta === void 0 ? void 0 : _this$getFieldMeta.errors) !== null && _this$getFieldMeta$er !== void 0 ? _this$getFieldMeta$er : [];
					}
					return this.validateAsync(cause).then(() => {
						var _this$getFieldMeta$er2, _this$getFieldMeta2;
						return (_this$getFieldMeta$er2 = (_this$getFieldMeta2 = this.getFieldMeta(field)) === null || _this$getFieldMeta2 === void 0 ? void 0 : _this$getFieldMeta2.errors) !== null && _this$getFieldMeta$er2 !== void 0 ? _this$getFieldMeta$er2 : [];
					});
				}
				if (!fieldInstance.state.meta.isTouched) fieldInstance.setMeta((prev) => _objectSpread2(_objectSpread2({}, prev), {}, { isTouched: true }));
				return fieldInstance.validate(cause);
			};
			this.validateSync = (cause) => {
				const validates = getSyncValidatorArray(cause, _objectSpread2(_objectSpread2({}, this.options), {}, {
					form: this,
					validationLogic: this.options.validationLogic || defaultValidationLogic
				}));
				let hasErrored = false;
				const currentValidationErrorMap = {};
				batch(() => {
					var _this$state$errorMap2, _this$state$errorMap3;
					for (const validateObj of validates) {
						var _this$state$errorMap;
						if (!validateObj.validate) continue;
						const { formError, fieldErrors } = normalizeError$1(this.runValidator({
							validate: validateObj.validate,
							value: {
								value: this.state.values,
								formApi: this,
								validationSource: "form"
							},
							type: "validate"
						}));
						const errorMapKey = getErrorMapKey$1(validateObj.cause);
						const allFieldsToProcess = /* @__PURE__ */ new Set([...Object.keys(this.state.fieldMeta), ...Object.keys(fieldErrors || {})]);
						for (const field of allFieldsToProcess) {
							var _this$getFieldMeta3;
							if (this.baseStore.state.fieldMetaBase[field] === void 0 && !(fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors[field])) continue;
							const { errorMap: currentErrorMap, errorSourceMap: currentErrorMapSource } = (_this$getFieldMeta3 = this.getFieldMeta(field)) !== null && _this$getFieldMeta3 !== void 0 ? _this$getFieldMeta3 : defaultFieldMeta;
							const newFormValidatorError = fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors[field];
							const { newErrorValue, newSource } = determineFormLevelErrorSourceAndValue({
								newFormValidatorError,
								isPreviousErrorFromFormValidator: (currentErrorMapSource === null || currentErrorMapSource === void 0 ? void 0 : currentErrorMapSource[errorMapKey]) === "form",
								previousErrorValue: currentErrorMap === null || currentErrorMap === void 0 ? void 0 : currentErrorMap[errorMapKey]
							});
							if (newSource === "form") currentValidationErrorMap[field] = _objectSpread2(_objectSpread2({}, currentValidationErrorMap[field]), {}, { [errorMapKey]: newFormValidatorError });
							if ((currentErrorMap === null || currentErrorMap === void 0 ? void 0 : currentErrorMap[errorMapKey]) !== newErrorValue) this.setFieldMeta(field, (prev = defaultFieldMeta) => _objectSpread2(_objectSpread2({}, prev), {}, {
								errorMap: _objectSpread2(_objectSpread2({}, prev.errorMap), {}, { [errorMapKey]: newErrorValue }),
								errorSourceMap: _objectSpread2(_objectSpread2({}, prev.errorSourceMap), {}, { [errorMapKey]: newSource })
							}));
						}
						if (((_this$state$errorMap = this.state.errorMap) === null || _this$state$errorMap === void 0 ? void 0 : _this$state$errorMap[errorMapKey]) !== formError) this.baseStore.setState((prev) => _objectSpread2(_objectSpread2({}, prev), {}, { errorMap: _objectSpread2(_objectSpread2({}, prev.errorMap), {}, { [errorMapKey]: formError }) }));
						if (formError || fieldErrors) hasErrored = true;
					}
					const submitErrKey = getErrorMapKey$1("submit");
					if (((_this$state$errorMap2 = this.state.errorMap) === null || _this$state$errorMap2 === void 0 ? void 0 : _this$state$errorMap2[submitErrKey]) && cause !== "submit" && !hasErrored) this.baseStore.setState((prev) => _objectSpread2(_objectSpread2({}, prev), {}, { errorMap: _objectSpread2(_objectSpread2({}, prev.errorMap), {}, { [submitErrKey]: void 0 }) }));
					const serverErrKey = getErrorMapKey$1("server");
					if (((_this$state$errorMap3 = this.state.errorMap) === null || _this$state$errorMap3 === void 0 ? void 0 : _this$state$errorMap3[serverErrKey]) && cause !== "server" && !hasErrored) this.baseStore.setState((prev) => _objectSpread2(_objectSpread2({}, prev), {}, { errorMap: _objectSpread2(_objectSpread2({}, prev.errorMap), {}, { [serverErrKey]: void 0 }) }));
				});
				return {
					hasErrored,
					fieldsErrorMap: currentValidationErrorMap
				};
			};
			this.validateAsync = function() {
				var _ref5 = _asyncToGenerator(function* (cause) {
					const validates = getAsyncValidatorArray(cause, _objectSpread2(_objectSpread2({}, _this.options), {}, {
						form: _this,
						validationLogic: _this.options.validationLogic || defaultValidationLogic
					}));
					if (!_this.state.isFormValidating) _this.baseStore.setState((prev) => _objectSpread2(_objectSpread2({}, prev), {}, { isFormValidating: true }));
					const promises = [];
					let fieldErrorsFromFormValidators;
					for (const validateObj of validates) {
						if (!validateObj.validate) continue;
						const key = getErrorMapKey$1(validateObj.cause);
						const fieldValidatorMeta = _this.state.validationMetaMap[key];
						fieldValidatorMeta === null || fieldValidatorMeta === void 0 || fieldValidatorMeta.lastAbortController.abort();
						const controller = new AbortController();
						_this.state.validationMetaMap[key] = { lastAbortController: controller };
						promises.push(new Promise(function() {
							var _ref4 = _asyncToGenerator(function* (resolve) {
								let rawError;
								try {
									rawError = yield new Promise((rawResolve, rawReject) => {
										setTimeout(_asyncToGenerator(function* () {
											if (controller.signal.aborted) return rawResolve(void 0);
											try {
												rawResolve(yield _this.runValidator({
													validate: validateObj.validate,
													value: {
														value: _this.state.values,
														formApi: _this,
														validationSource: "form",
														signal: controller.signal
													},
													type: "validateAsync"
												}));
											} catch (e) {
												rawReject(e);
											}
										}), validateObj.debounceMs);
									});
								} catch (e) {
									rawError = e;
								}
								const { formError, fieldErrors: fieldErrorsFromNormalizeError } = normalizeError$1(rawError);
								if (fieldErrorsFromNormalizeError) fieldErrorsFromFormValidators = fieldErrorsFromFormValidators ? _objectSpread2(_objectSpread2({}, fieldErrorsFromFormValidators), fieldErrorsFromNormalizeError) : fieldErrorsFromNormalizeError;
								const errorMapKey = getErrorMapKey$1(validateObj.cause);
								for (const field of Object.keys(_this.state.fieldMeta)) {
									if (_this.baseStore.state.fieldMetaBase[field] === void 0) continue;
									const fieldMeta = _this.getFieldMeta(field);
									if (!fieldMeta) continue;
									const { errorMap: currentErrorMap, errorSourceMap: currentErrorMapSource } = fieldMeta;
									const { newErrorValue, newSource } = determineFormLevelErrorSourceAndValue({
										newFormValidatorError: fieldErrorsFromFormValidators === null || fieldErrorsFromFormValidators === void 0 ? void 0 : fieldErrorsFromFormValidators[field],
										isPreviousErrorFromFormValidator: (currentErrorMapSource === null || currentErrorMapSource === void 0 ? void 0 : currentErrorMapSource[errorMapKey]) === "form",
										previousErrorValue: currentErrorMap === null || currentErrorMap === void 0 ? void 0 : currentErrorMap[errorMapKey]
									});
									if ((currentErrorMap === null || currentErrorMap === void 0 ? void 0 : currentErrorMap[errorMapKey]) !== newErrorValue) _this.setFieldMeta(field, (prev) => _objectSpread2(_objectSpread2({}, prev), {}, {
										errorMap: _objectSpread2(_objectSpread2({}, prev.errorMap), {}, { [errorMapKey]: newErrorValue }),
										errorSourceMap: _objectSpread2(_objectSpread2({}, prev.errorSourceMap), {}, { [errorMapKey]: newSource })
									}));
								}
								_this.baseStore.setState((prev) => _objectSpread2(_objectSpread2({}, prev), {}, { errorMap: _objectSpread2(_objectSpread2({}, prev.errorMap), {}, { [errorMapKey]: formError }) }));
								resolve(fieldErrorsFromFormValidators ? {
									fieldErrors: fieldErrorsFromFormValidators,
									errorMapKey
								} : void 0);
							});
							return function(_x5) {
								return _ref4.apply(this, arguments);
							};
						}()));
					}
					let results = [];
					const fieldsErrorMap = {};
					if (promises.length) {
						results = yield Promise.all(promises);
						for (const fieldValidationResult of results) if (fieldValidationResult === null || fieldValidationResult === void 0 ? void 0 : fieldValidationResult.fieldErrors) {
							const { errorMapKey } = fieldValidationResult;
							for (const [field, fieldError] of Object.entries(fieldValidationResult.fieldErrors)) fieldsErrorMap[field] = _objectSpread2(_objectSpread2({}, fieldsErrorMap[field] || {}), {}, { [errorMapKey]: fieldError });
						}
					}
					_this.baseStore.setState((prev) => _objectSpread2(_objectSpread2({}, prev), {}, { isFormValidating: false }));
					return fieldsErrorMap;
				});
				return function(_x6) {
					return _ref5.apply(this, arguments);
				};
			}();
			this.validate = (cause) => {
				const { hasErrored, fieldsErrorMap } = this.validateSync(cause);
				if (hasErrored && !this.options.asyncAlways) return fieldsErrorMap;
				return this.validateAsync(cause);
			};
			this._handleSubmit = function() {
				var _ref6 = _asyncToGenerator(function* (submitMeta) {
					var _this$options$listene3, _this$options$listene4;
					_this.baseStore.setState((old) => _objectSpread2(_objectSpread2({}, old), {}, {
						isSubmitted: false,
						submissionAttempts: old.submissionAttempts + 1,
						isSubmitSuccessful: false
					}));
					batch(() => {
						Object.values(_this.fieldInfo).forEach((field) => {
							if (!field.instance) return;
							if (!field.instance.state.meta.isTouched) field.instance.setMeta((prev) => _objectSpread2(_objectSpread2({}, prev), {}, { isTouched: true }));
						});
					});
					const submitMetaArg = submitMeta !== null && submitMeta !== void 0 ? submitMeta : _this.options.onSubmitMeta;
					if (!_this.state.canSubmit && !_this._devtoolsSubmissionOverride) {
						var _this$options$onSubmi, _this$options;
						(_this$options$onSubmi = (_this$options = _this.options).onSubmitInvalid) === null || _this$options$onSubmi === void 0 || _this$options$onSubmi.call(_this$options, {
							value: _this.state.values,
							formApi: _this,
							meta: submitMetaArg
						});
						return;
					}
					_this.baseStore.setState((d) => _objectSpread2(_objectSpread2({}, d), {}, { isSubmitting: true }));
					const done = () => {
						_this.baseStore.setState((prev) => _objectSpread2(_objectSpread2({}, prev), {}, { isSubmitting: false }));
					};
					yield _this.validateAllFields("submit");
					if (!_this.state.isFieldsValid) {
						var _this$options$onSubmi2, _this$options2;
						done();
						(_this$options$onSubmi2 = (_this$options2 = _this.options).onSubmitInvalid) === null || _this$options$onSubmi2 === void 0 || _this$options$onSubmi2.call(_this$options2, {
							value: _this.state.values,
							formApi: _this,
							meta: submitMetaArg
						});
						formEventClient.emit("form-submission", {
							id: _this._formId,
							submissionAttempt: _this.state.submissionAttempts,
							successful: false,
							stage: "validateAllFields",
							errors: Object.values(_this.state.fieldMeta).map((meta) => meta.errors).flat()
						});
						return;
					}
					yield _this.validate("submit");
					if (!_this.state.isValid) {
						var _this$options$onSubmi3, _this$options3;
						done();
						(_this$options$onSubmi3 = (_this$options3 = _this.options).onSubmitInvalid) === null || _this$options$onSubmi3 === void 0 || _this$options$onSubmi3.call(_this$options3, {
							value: _this.state.values,
							formApi: _this,
							meta: submitMetaArg
						});
						formEventClient.emit("form-submission", {
							id: _this._formId,
							submissionAttempt: _this.state.submissionAttempts,
							successful: false,
							stage: "validate",
							errors: _this.state.errors
						});
						return;
					}
					batch(() => {
						Object.values(_this.fieldInfo).forEach((field) => {
							var _field$instance, _field$instance$onSub;
							(_field$instance = field.instance) === null || _field$instance === void 0 || (_field$instance = _field$instance.options.listeners) === null || _field$instance === void 0 || (_field$instance$onSub = _field$instance.onSubmit) === null || _field$instance$onSub === void 0 || _field$instance$onSub.call(_field$instance, {
								value: field.instance.state.value,
								fieldApi: field.instance
							});
						});
					});
					(_this$options$listene3 = _this.options.listeners) === null || _this$options$listene3 === void 0 || (_this$options$listene4 = _this$options$listene3.onSubmit) === null || _this$options$listene4 === void 0 || _this$options$listene4.call(_this$options$listene3, {
						formApi: _this,
						meta: submitMetaArg
					});
					try {
						var _this$options$onSubmi4, _this$options4;
						yield (_this$options$onSubmi4 = (_this$options4 = _this.options).onSubmit) === null || _this$options$onSubmi4 === void 0 ? void 0 : _this$options$onSubmi4.call(_this$options4, {
							value: _this.state.values,
							formApi: _this,
							meta: submitMetaArg
						});
						batch(() => {
							_this.baseStore.setState((prev) => _objectSpread2(_objectSpread2({}, prev), {}, {
								isSubmitted: true,
								isSubmitSuccessful: true
							}));
							formEventClient.emit("form-submission", {
								id: _this._formId,
								submissionAttempt: _this.state.submissionAttempts,
								successful: true
							});
							done();
						});
					} catch (err) {
						_this.baseStore.setState((prev) => _objectSpread2(_objectSpread2({}, prev), {}, { isSubmitSuccessful: false }));
						formEventClient.emit("form-submission", {
							id: _this._formId,
							submissionAttempt: _this.state.submissionAttempts,
							successful: false,
							stage: "inflight",
							onError: err
						});
						done();
						throw err;
					}
				});
				return function(_x7) {
					return _ref6.apply(this, arguments);
				};
			}();
			this.getFieldValue = (field) => getBy(this.state.values, field);
			this.getFieldMeta = (field) => {
				return this.state.fieldMeta[field];
			};
			this.getFieldInfo = (field) => {
				var _this$fieldInfo;
				return (_this$fieldInfo = this.fieldInfo)[field] || (_this$fieldInfo[field] = {
					instance: null,
					validationMetaMap: {
						onChange: void 0,
						onBlur: void 0,
						onSubmit: void 0,
						onMount: void 0,
						onServer: void 0,
						onDynamic: void 0
					}
				});
			};
			this.setFieldMeta = (field, updater) => {
				this.baseStore.setState((prev) => {
					return _objectSpread2(_objectSpread2({}, prev), {}, { fieldMetaBase: _objectSpread2(_objectSpread2({}, prev.fieldMetaBase), {}, { [field]: functionalUpdate(updater, prev.fieldMetaBase[field]) }) });
				});
			};
			this.resetFieldMeta = (fieldMeta) => {
				return Object.keys(fieldMeta).reduce((acc, key) => {
					const fieldKey = key;
					acc[fieldKey] = defaultFieldMeta;
					return acc;
				}, {});
			};
			this.setFieldValue = (field, updater, opts2) => {
				var _opts2$dontUpdateMeta, _opts2$dontRunListene, _opts2$dontValidate;
				const dontUpdateMeta = (_opts2$dontUpdateMeta = opts2 === null || opts2 === void 0 ? void 0 : opts2.dontUpdateMeta) !== null && _opts2$dontUpdateMeta !== void 0 ? _opts2$dontUpdateMeta : false;
				const dontRunListeners = (_opts2$dontRunListene = opts2 === null || opts2 === void 0 ? void 0 : opts2.dontRunListeners) !== null && _opts2$dontRunListene !== void 0 ? _opts2$dontRunListene : false;
				const dontValidate = (_opts2$dontValidate = opts2 === null || opts2 === void 0 ? void 0 : opts2.dontValidate) !== null && _opts2$dontValidate !== void 0 ? _opts2$dontValidate : false;
				batch(() => {
					if (!dontUpdateMeta) this.setFieldMeta(field, (prev) => _objectSpread2(_objectSpread2({}, prev), {}, {
						isTouched: true,
						isDirty: true,
						errorMap: _objectSpread2(_objectSpread2({}, prev === null || prev === void 0 ? void 0 : prev.errorMap), {}, { onMount: void 0 })
					}));
					this.baseStore.setState((prev) => {
						return _objectSpread2(_objectSpread2({}, prev), {}, { values: setBy(prev.values, field, updater) });
					});
				});
				if (!dontRunListeners) {
					var _this$getFieldInfo$in;
					(_this$getFieldInfo$in = this.getFieldInfo(field).instance) === null || _this$getFieldInfo$in === void 0 || _this$getFieldInfo$in.triggerOnChangeListener();
				}
				if (!dontValidate) this.validateField(field, "change");
			};
			this.deleteField = (field) => {
				const fieldsToDelete = [...Object.keys(this.fieldInfo).filter((f) => {
					const fieldStr = field.toString();
					return f !== fieldStr && f.startsWith(fieldStr);
				}), field];
				this.baseStore.setState((prev) => {
					const newState = _objectSpread2({}, prev);
					fieldsToDelete.forEach((f) => {
						newState.values = deleteBy(newState.values, f);
						delete this.fieldInfo[f];
						delete newState.fieldMetaBase[f];
					});
					return newState;
				});
			};
			this.pushFieldValue = (field, value, options) => {
				this.setFieldValue(field, (prev) => [...Array.isArray(prev) ? prev : [], value], options);
				metaHelper(this).bumpArrayVersion(field);
			};
			this.insertFieldValue = function() {
				var _ref7 = _asyncToGenerator(function* (field, index, value, options) {
					var _options$dontValidate;
					_this.setFieldValue(field, (prev) => {
						return [
							...prev.slice(0, index),
							value,
							...prev.slice(index)
						];
					}, mergeOpts(options, { dontValidate: true }));
					const dontValidate = (_options$dontValidate = options === null || options === void 0 ? void 0 : options.dontValidate) !== null && _options$dontValidate !== void 0 ? _options$dontValidate : false;
					if (!dontValidate) yield _this.validateField(field, "change");
					metaHelper(_this).handleArrayInsert(field, index);
					if (!dontValidate) yield _this.validateArrayFieldsStartingFrom(field, index, "change");
				});
				return function(_x8, _x9, _x10, _x11) {
					return _ref7.apply(this, arguments);
				};
			}();
			this.replaceFieldValue = function() {
				var _ref8 = _asyncToGenerator(function* (field, index, value, options) {
					var _options$dontValidate2;
					_this.setFieldValue(field, (prev) => {
						return prev.map((d, i) => i === index ? value : d);
					}, mergeOpts(options, { dontValidate: true }));
					metaHelper(_this).bumpArrayVersion(field);
					if (!((_options$dontValidate2 = options === null || options === void 0 ? void 0 : options.dontValidate) !== null && _options$dontValidate2 !== void 0 ? _options$dontValidate2 : false)) {
						yield _this.validateField(field, "change");
						yield _this.validateArrayFieldsStartingFrom(field, index, "change");
					}
				});
				return function(_x12, _x13, _x14, _x15) {
					return _ref8.apply(this, arguments);
				};
			}();
			this.removeFieldValue = function() {
				var _ref9 = _asyncToGenerator(function* (field, index, options) {
					var _options$dontValidate3;
					const fieldValue = _this.getFieldValue(field);
					const lastIndex = Array.isArray(fieldValue) ? Math.max(fieldValue.length - 1, 0) : null;
					_this.setFieldValue(field, (prev) => {
						return prev.filter((_d, i) => i !== index);
					}, mergeOpts(options, { dontValidate: true }));
					metaHelper(_this).handleArrayRemove(field, index);
					if (lastIndex !== null) {
						const start = `${field}[${lastIndex}]`;
						_this.deleteField(start);
					}
					if (!((_options$dontValidate3 = options === null || options === void 0 ? void 0 : options.dontValidate) !== null && _options$dontValidate3 !== void 0 ? _options$dontValidate3 : false)) {
						yield _this.validateField(field, "change");
						yield _this.validateArrayFieldsStartingFrom(field, index, "change");
					}
				});
				return function(_x16, _x17, _x18) {
					return _ref9.apply(this, arguments);
				};
			}();
			this.swapFieldValues = (field, index1, index2, options) => {
				var _options$dontValidate4;
				this.setFieldValue(field, (prev) => {
					const prev1 = prev[index1];
					const prev2 = prev[index2];
					return setBy(setBy(prev, `${index1}`, prev2), `${index2}`, prev1);
				}, mergeOpts(options, { dontValidate: true }));
				metaHelper(this).handleArraySwap(field, index1, index2);
				if (!((_options$dontValidate4 = options === null || options === void 0 ? void 0 : options.dontValidate) !== null && _options$dontValidate4 !== void 0 ? _options$dontValidate4 : false)) {
					this.validateField(field, "change");
					this.validateField(`${field}[${index1}]`, "change");
					this.validateField(`${field}[${index2}]`, "change");
				}
			};
			this.moveFieldValues = (field, index1, index2, options) => {
				var _options$dontValidate5;
				this.setFieldValue(field, (prev) => {
					const next = [...prev];
					next.splice(index2, 0, next.splice(index1, 1)[0]);
					return next;
				}, mergeOpts(options, { dontValidate: true }));
				metaHelper(this).handleArrayMove(field, index1, index2);
				if (!((_options$dontValidate5 = options === null || options === void 0 ? void 0 : options.dontValidate) !== null && _options$dontValidate5 !== void 0 ? _options$dontValidate5 : false)) {
					this.validateField(field, "change");
					this.validateField(`${field}[${index1}]`, "change");
					this.validateField(`${field}[${index2}]`, "change");
				}
			};
			this.clearFieldValues = (field, options) => {
				var _options$dontValidate6;
				const fieldValue = this.getFieldValue(field);
				const lastIndex = Array.isArray(fieldValue) ? Math.max(fieldValue.length - 1, 0) : null;
				this.setFieldValue(field, [], mergeOpts(options, { dontValidate: true }));
				metaHelper(this).bumpArrayVersion(field);
				if (lastIndex !== null) for (let i = 0; i <= lastIndex; i++) {
					const fieldKey = `${field}[${i}]`;
					this.deleteField(fieldKey);
				}
				if (!((_options$dontValidate6 = options === null || options === void 0 ? void 0 : options.dontValidate) !== null && _options$dontValidate6 !== void 0 ? _options$dontValidate6 : false)) this.validateField(field, "change");
			};
			this.resetField = (field) => {
				this.baseStore.setState((prev) => {
					var _this$getFieldInfo$in2;
					const fieldDefault = (_this$getFieldInfo$in2 = this.getFieldInfo(field).instance) === null || _this$getFieldInfo$in2 === void 0 ? void 0 : _this$getFieldInfo$in2.options.defaultValue;
					const formDefault = getBy(this.options.defaultValues, field);
					const targetValue = fieldDefault !== null && fieldDefault !== void 0 ? fieldDefault : formDefault;
					return _objectSpread2(_objectSpread2({}, prev), {}, {
						fieldMetaBase: _objectSpread2(_objectSpread2({}, prev.fieldMetaBase), {}, { [field]: defaultFieldMeta }),
						values: targetValue !== void 0 ? setBy(prev.values, field, targetValue) : prev.values
					});
				});
			};
			this.setErrorMap = (errorMap) => {
				batch(() => {
					Object.entries(errorMap).forEach(([key, value]) => {
						const errorMapKey = key;
						if (isGlobalFormValidationError(value)) {
							const { formError, fieldErrors } = normalizeError$1(value);
							for (const fieldName of Object.keys(this.fieldInfo)) {
								if (!this.getFieldMeta(fieldName)) continue;
								this.setFieldMeta(fieldName, (prev) => _objectSpread2(_objectSpread2({}, prev), {}, {
									errorMap: _objectSpread2(_objectSpread2({}, prev.errorMap), {}, { [errorMapKey]: fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors[fieldName] }),
									errorSourceMap: _objectSpread2(_objectSpread2({}, prev.errorSourceMap), {}, { [errorMapKey]: "form" })
								}));
							}
							this.baseStore.setState((prev) => _objectSpread2(_objectSpread2({}, prev), {}, { errorMap: _objectSpread2(_objectSpread2({}, prev.errorMap), {}, { [errorMapKey]: formError }) }));
						} else this.baseStore.setState((prev) => _objectSpread2(_objectSpread2({}, prev), {}, { errorMap: _objectSpread2(_objectSpread2({}, prev.errorMap), {}, { [errorMapKey]: value }) }));
					});
				});
			};
			this.getAllErrors = () => {
				return {
					form: {
						errors: this.state.errors,
						errorMap: this.state.errorMap
					},
					fields: Object.entries(this.state.fieldMeta).reduce((acc, [fieldName, fieldMeta]) => {
						if (Object.keys(fieldMeta).length && fieldMeta.errors.length) acc[fieldName] = {
							errors: fieldMeta.errors,
							errorMap: fieldMeta.errorMap
						};
						return acc;
					}, {})
				};
			};
			this.parseValuesWithSchema = (schema) => {
				return standardSchemaValidators.validate({
					value: this.state.values,
					validationSource: "form"
				}, schema);
			};
			this.parseValuesWithSchemaAsync = (schema) => {
				return standardSchemaValidators.validateAsync({
					value: this.state.values,
					validationSource: "form"
				}, schema);
			};
			this.timeoutIds = {
				validations: {},
				listeners: {},
				formListeners: {}
			};
			this._formId = (_opts$formId = opts === null || opts === void 0 ? void 0 : opts.formId) !== null && _opts$formId !== void 0 ? _opts$formId : uuid();
			this._devtoolsSubmissionOverride = false;
			let baseStoreVal = getDefaultFormState(_objectSpread2(_objectSpread2({}, opts === null || opts === void 0 ? void 0 : opts.defaultState), {}, { values: (_opts$defaultValues = opts === null || opts === void 0 ? void 0 : opts.defaultValues) !== null && _opts$defaultValues !== void 0 ? _opts$defaultValues : opts === null || opts === void 0 || (_opts$defaultState = opts.defaultState) === null || _opts$defaultState === void 0 ? void 0 : _opts$defaultState.values }));
			if (opts === null || opts === void 0 ? void 0 : opts.transform) {
				baseStoreVal = opts.transform({ state: baseStoreVal }).state;
				for (const errKey of Object.keys(baseStoreVal.errorMap)) {
					const errKeyMap = baseStoreVal.errorMap[errKey];
					if (errKeyMap === void 0 || !isGlobalFormValidationError(errKeyMap)) continue;
					for (const fieldName of Object.keys(errKeyMap.fields)) {
						var _existingFieldMeta$er, _existingFieldMeta$er2;
						const fieldErr = errKeyMap.fields[fieldName];
						if (fieldErr === void 0) continue;
						const existingFieldMeta = baseStoreVal.fieldMetaBase[fieldName];
						baseStoreVal.fieldMetaBase[fieldName] = _objectSpread2(_objectSpread2({
							isTouched: false,
							isValidating: false,
							isBlurred: false,
							isDirty: false,
							_arrayVersion: 0
						}, existingFieldMeta !== null && existingFieldMeta !== void 0 ? existingFieldMeta : {}), {}, {
							errorSourceMap: _objectSpread2(_objectSpread2({}, (_existingFieldMeta$er = existingFieldMeta === null || existingFieldMeta === void 0 ? void 0 : existingFieldMeta["errorSourceMap"]) !== null && _existingFieldMeta$er !== void 0 ? _existingFieldMeta$er : {}), {}, { onChange: "form" }),
							errorMap: _objectSpread2(_objectSpread2({}, (_existingFieldMeta$er2 = existingFieldMeta === null || existingFieldMeta === void 0 ? void 0 : existingFieldMeta["errorMap"]) !== null && _existingFieldMeta$er2 !== void 0 ? _existingFieldMeta$er2 : {}), {}, { [errKey]: fieldErr })
						});
					}
				}
			}
			this.baseStore = createStore(baseStoreVal);
			let prevBaseStore = void 0;
			this.fieldMetaDerived = createStore((prevVal) => {
				const currBaseStore = this.baseStore.get();
				let originalMetaCount = 0;
				const fieldMeta = {};
				for (const fieldName of Object.keys(currBaseStore.fieldMetaBase)) {
					var _this$getFieldInfo$in3, _this$getFieldInfo2, _fieldErrors;
					const currBaseMeta = currBaseStore.fieldMetaBase[fieldName];
					const prevBaseMeta = prevBaseStore === null || prevBaseStore === void 0 ? void 0 : prevBaseStore.fieldMetaBase[fieldName];
					const prevFieldInfo = prevVal === null || prevVal === void 0 ? void 0 : prevVal[fieldName];
					const curFieldVal = getBy(currBaseStore.values, fieldName);
					let fieldErrors = prevFieldInfo === null || prevFieldInfo === void 0 ? void 0 : prevFieldInfo.errors;
					if (!prevBaseMeta || currBaseMeta.errorMap !== prevBaseMeta.errorMap) {
						var _currBaseMeta$errorMa, _this$getFieldInfo;
						fieldErrors = Object.values((_currBaseMeta$errorMa = currBaseMeta.errorMap) !== null && _currBaseMeta$errorMa !== void 0 ? _currBaseMeta$errorMa : {}).filter((val) => val !== void 0);
						const fieldInstance = (_this$getFieldInfo = this.getFieldInfo(fieldName)) === null || _this$getFieldInfo === void 0 ? void 0 : _this$getFieldInfo.instance;
						if (!fieldInstance || !fieldInstance.options.disableErrorFlat) fieldErrors = fieldErrors.flat(1);
					}
					const isFieldValid = !isNonEmptyArray(fieldErrors);
					const isFieldPristine = !currBaseMeta.isDirty;
					const isDefaultValue = evaluate(curFieldVal, (_this$getFieldInfo$in3 = (_this$getFieldInfo2 = this.getFieldInfo(fieldName)) === null || _this$getFieldInfo2 === void 0 || (_this$getFieldInfo2 = _this$getFieldInfo2.instance) === null || _this$getFieldInfo2 === void 0 ? void 0 : _this$getFieldInfo2.options.defaultValue) !== null && _this$getFieldInfo$in3 !== void 0 ? _this$getFieldInfo$in3 : getBy(this.options.defaultValues, fieldName));
					if (prevFieldInfo && prevFieldInfo.isPristine === isFieldPristine && prevFieldInfo.isValid === isFieldValid && prevFieldInfo.isDefaultValue === isDefaultValue && prevFieldInfo.errors === fieldErrors && currBaseMeta === prevBaseMeta) {
						fieldMeta[fieldName] = prevFieldInfo;
						originalMetaCount++;
						continue;
					}
					fieldMeta[fieldName] = _objectSpread2(_objectSpread2({}, currBaseMeta), {}, {
						errors: (_fieldErrors = fieldErrors) !== null && _fieldErrors !== void 0 ? _fieldErrors : [],
						isPristine: isFieldPristine,
						isValid: isFieldValid,
						isDefaultValue
					});
				}
				if (!Object.keys(currBaseStore.fieldMetaBase).length) return fieldMeta;
				if (prevVal && originalMetaCount === Object.keys(currBaseStore.fieldMetaBase).length) return prevVal;
				prevBaseStore = this.baseStore.get();
				return fieldMeta;
			});
			let prevBaseStoreForStore = void 0;
			this.store = createStore((prevVal) => {
				var _currBaseStore$errorM, _currBaseStore$errorM2, _prevVal$errors, _this$options$canSubm;
				const currBaseStore = this.baseStore.get();
				const currFieldMeta = this.fieldMetaDerived.get();
				const fieldMetaValues = Object.values(currFieldMeta).filter(Boolean);
				const isFieldsValidating = fieldMetaValues.some((field) => field.isValidating);
				const isFieldsValid = fieldMetaValues.every((field) => field.isValid);
				const isTouched = fieldMetaValues.some((field) => field.isTouched);
				const isBlurred = fieldMetaValues.some((field) => field.isBlurred);
				const isDefaultValue = fieldMetaValues.every((field) => field.isDefaultValue);
				const shouldInvalidateOnMount = isTouched && ((_currBaseStore$errorM = currBaseStore.errorMap) === null || _currBaseStore$errorM === void 0 ? void 0 : _currBaseStore$errorM.onMount);
				const isDirty = fieldMetaValues.some((field) => field.isDirty);
				const isPristine = !isDirty;
				const hasOnMountError = Boolean(((_currBaseStore$errorM2 = currBaseStore.errorMap) === null || _currBaseStore$errorM2 === void 0 ? void 0 : _currBaseStore$errorM2.onMount) || fieldMetaValues.some((f) => {
					var _f$errorMap;
					return f === null || f === void 0 || (_f$errorMap = f.errorMap) === null || _f$errorMap === void 0 ? void 0 : _f$errorMap.onMount;
				}));
				const isValidating = !!isFieldsValidating;
				let errors = (_prevVal$errors = prevVal === null || prevVal === void 0 ? void 0 : prevVal.errors) !== null && _prevVal$errors !== void 0 ? _prevVal$errors : [];
				if (!prevBaseStoreForStore || currBaseStore.errorMap !== prevBaseStoreForStore.errorMap) errors = Object.values(currBaseStore.errorMap).reduce((prev, curr) => {
					if (curr === void 0) return prev;
					if (curr && isGlobalFormValidationError(curr)) {
						prev.push(curr.form);
						return prev;
					}
					prev.push(curr);
					return prev;
				}, []);
				const isFormValid = errors.length === 0;
				const isValid = isFieldsValid && isFormValid;
				const submitInvalid = (_this$options$canSubm = this.options.canSubmitWhenInvalid) !== null && _this$options$canSubm !== void 0 ? _this$options$canSubm : false;
				const canSubmit = currBaseStore.submissionAttempts === 0 && !isTouched && !hasOnMountError || !isValidating && !currBaseStore.isSubmitting && isValid || submitInvalid;
				let errorMap = currBaseStore.errorMap;
				if (shouldInvalidateOnMount) {
					errors = errors.filter((err) => err !== currBaseStore.errorMap.onMount);
					errorMap = Object.assign(errorMap, { onMount: void 0 });
				}
				if (prevVal && prevBaseStoreForStore && prevVal.errorMap === errorMap && prevVal.fieldMeta === this.fieldMetaDerived.state && prevVal.errors === errors && prevVal.isFieldsValidating === isFieldsValidating && prevVal.isFieldsValid === isFieldsValid && prevVal.isFormValid === isFormValid && prevVal.isValid === isValid && prevVal.canSubmit === canSubmit && prevVal.isTouched === isTouched && prevVal.isBlurred === isBlurred && prevVal.isPristine === isPristine && prevVal.isDefaultValue === isDefaultValue && prevVal.isDirty === isDirty && evaluate(prevBaseStoreForStore, currBaseStore)) return prevVal;
				const state = _objectSpread2(_objectSpread2({}, currBaseStore), {}, {
					errorMap,
					fieldMeta: this.fieldMetaDerived.state,
					errors,
					isFieldsValidating,
					isFieldsValid,
					isFormValid,
					isValid,
					canSubmit,
					isTouched,
					isBlurred,
					isPristine,
					isDefaultValue,
					isDirty
				});
				prevBaseStoreForStore = this.baseStore.get();
				return state;
			});
			this.handleSubmit = this.handleSubmit.bind(this);
			this.update(opts || {});
		}
		get state() {
			return this.store.state;
		}
		get formId() {
			return this._formId;
		}
		/**
		* @private
		*/
		runValidator(props) {
			if (isStandardSchemaValidator(props.validate)) return standardSchemaValidators[props.type](props.value, props.validate);
			return props.validate(props.value);
		}
		handleSubmit(submitMeta) {
			return this._handleSubmit(submitMeta);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+form-core@1.32.0/node_modules/@tanstack/form-core/dist/esm/FieldApi.js
function normalizeError(rawError) {
	if (rawError) return rawError;
}
function getErrorMapKey(cause) {
	switch (cause) {
		case "submit": return "onSubmit";
		case "blur": return "onBlur";
		case "mount": return "onMount";
		case "server": return "onServer";
		case "dynamic": return "onDynamic";
		default: return "onChange";
	}
}
var FieldApi;
var init_FieldApi = __esmMin((() => {
	init_esm$3();
	init_standardSchemaValidator();
	init_metaHelper();
	init_utils();
	init_ValidationLogic();
	init_objectSpread2();
	init_asyncToGenerator();
	FieldApi = class {
		/**
		* Initializes a new `FieldApi` instance.
		*/
		constructor(opts) {
			var _this = this;
			this.options = {};
			this.mount = () => {
				var _this$options$listene, _this$options$listene2;
				if (this.options.defaultValue !== void 0 && !this.getMeta().isTouched) this.form.setFieldValue(this.name, this.options.defaultValue, { dontUpdateMeta: true });
				const info = this.getInfo();
				info.instance = this;
				this.update(this.options);
				const { onMount } = this.options.validators || {};
				if (onMount) {
					const error = this.runValidator({
						validate: onMount,
						value: {
							value: this.state.value,
							fieldApi: this,
							validationSource: "field"
						},
						type: "validate"
					});
					if (error) this.setMeta((prev) => _objectSpread2(_objectSpread2({}, prev), {}, {
						errorMap: _objectSpread2(_objectSpread2({}, prev === null || prev === void 0 ? void 0 : prev.errorMap), {}, { onMount: error }),
						errorSourceMap: _objectSpread2(_objectSpread2({}, prev === null || prev === void 0 ? void 0 : prev.errorSourceMap), {}, { onMount: "field" })
					}));
				}
				(_this$options$listene = this.options.listeners) === null || _this$options$listene === void 0 || (_this$options$listene2 = _this$options$listene.onMount) === null || _this$options$listene2 === void 0 || _this$options$listene2.call(_this$options$listene, {
					value: this.state.value,
					fieldApi: this
				});
				return () => {
					var _this$options$listene3, _this$options$listene4, _this$form$options$li, _this$form$options$li2;
					for (const [key, timeout] of Object.entries(this.timeoutIds.validations)) if (timeout) {
						clearTimeout(timeout);
						this.timeoutIds.validations[key] = null;
					}
					for (const [key, timeout] of Object.entries(this.timeoutIds.listeners)) if (timeout) {
						clearTimeout(timeout);
						this.timeoutIds.listeners[key] = null;
					}
					for (const [key, timeout] of Object.entries(this.timeoutIds.formListeners)) if (timeout) {
						clearTimeout(timeout);
						this.timeoutIds.formListeners[key] = null;
					}
					const fieldInfo = this.form.fieldInfo[this.name];
					if (!fieldInfo) return;
					if (fieldInfo.instance !== this) return;
					for (const [key, validationMeta] of Object.entries(fieldInfo.validationMetaMap)) {
						validationMeta === null || validationMeta === void 0 || validationMeta.lastAbortController.abort();
						fieldInfo.validationMetaMap[key] = void 0;
					}
					this.form.baseStore.setState((prev) => {
						var _prev$fieldMetaBase$t, _prev$fieldMetaBase$t2, _prev$fieldMetaBase$t3, _prev$fieldMetaBase$t4, _prev$fieldMetaBase$t5, _prev$fieldMetaBase$t6;
						return _objectSpread2(_objectSpread2({}, prev), {}, { fieldMetaBase: _objectSpread2(_objectSpread2({}, prev.fieldMetaBase), {}, { [this.name]: _objectSpread2(_objectSpread2({}, defaultFieldMeta), {}, {
							isTouched: (_prev$fieldMetaBase$t = (_prev$fieldMetaBase$t2 = prev.fieldMetaBase[this.name]) === null || _prev$fieldMetaBase$t2 === void 0 ? void 0 : _prev$fieldMetaBase$t2.isTouched) !== null && _prev$fieldMetaBase$t !== void 0 ? _prev$fieldMetaBase$t : defaultFieldMeta.isTouched,
							isBlurred: (_prev$fieldMetaBase$t3 = (_prev$fieldMetaBase$t4 = prev.fieldMetaBase[this.name]) === null || _prev$fieldMetaBase$t4 === void 0 ? void 0 : _prev$fieldMetaBase$t4.isBlurred) !== null && _prev$fieldMetaBase$t3 !== void 0 ? _prev$fieldMetaBase$t3 : defaultFieldMeta.isBlurred,
							isDirty: (_prev$fieldMetaBase$t5 = (_prev$fieldMetaBase$t6 = prev.fieldMetaBase[this.name]) === null || _prev$fieldMetaBase$t6 === void 0 ? void 0 : _prev$fieldMetaBase$t6.isDirty) !== null && _prev$fieldMetaBase$t5 !== void 0 ? _prev$fieldMetaBase$t5 : defaultFieldMeta.isDirty
						}) }) });
					});
					fieldInfo.instance = null;
					(_this$options$listene3 = this.options.listeners) === null || _this$options$listene3 === void 0 || (_this$options$listene4 = _this$options$listene3.onUnmount) === null || _this$options$listene4 === void 0 || _this$options$listene4.call(_this$options$listene3, {
						value: this.state.value,
						fieldApi: this
					});
					(_this$form$options$li = this.form.options.listeners) === null || _this$form$options$li === void 0 || (_this$form$options$li2 = _this$form$options$li.onFieldUnmount) === null || _this$form$options$li2 === void 0 || _this$form$options$li2.call(_this$form$options$li, {
						formApi: this.form,
						fieldApi: this
					});
				};
			};
			this.update = (opts2) => {
				this.options = opts2;
				this.name = opts2.name;
				if (!this.state.meta.isTouched && this.options.defaultValue !== void 0) {
					if (!evaluate(this.form.getFieldValue(this.name), opts2.defaultValue)) this.form.setFieldValue(this.name, opts2.defaultValue, {
						dontUpdateMeta: true,
						dontValidate: true,
						dontRunListeners: true
					});
				}
				if (!this.form.getFieldMeta(this.name)) this.form.setFieldMeta(this.name, this.state.meta);
			};
			this.getValue = () => {
				return this.form.getFieldValue(this.name);
			};
			this.setValue = (updater, options) => {
				this.form.setFieldValue(this.name, updater, mergeOpts(options, {
					dontRunListeners: true,
					dontValidate: true
				}));
				if (!(options === null || options === void 0 ? void 0 : options.dontRunListeners)) this.triggerOnChangeListener();
				if (!(options === null || options === void 0 ? void 0 : options.dontValidate)) this.validate("change");
			};
			this.getMeta = () => this.store.state.meta;
			this.setMeta = (updater) => this.form.setFieldMeta(this.name, updater);
			this.getInfo = () => this.form.getFieldInfo(this.name);
			this.pushValue = (value, options) => {
				this.form.pushFieldValue(this.name, value, mergeOpts(options, { dontRunListeners: true }));
				if (!(options === null || options === void 0 ? void 0 : options.dontRunListeners)) this.triggerOnChangeListener();
			};
			this.insertValue = (index, value, options) => {
				this.form.insertFieldValue(this.name, index, value, mergeOpts(options, { dontRunListeners: true }));
				if (!(options === null || options === void 0 ? void 0 : options.dontRunListeners)) this.triggerOnChangeListener();
			};
			this.replaceValue = (index, value, options) => {
				this.form.replaceFieldValue(this.name, index, value, mergeOpts(options, { dontRunListeners: true }));
				if (!(options === null || options === void 0 ? void 0 : options.dontRunListeners)) this.triggerOnChangeListener();
			};
			this.removeValue = (index, options) => {
				this.form.removeFieldValue(this.name, index, mergeOpts(options, { dontRunListeners: true }));
				if (!(options === null || options === void 0 ? void 0 : options.dontRunListeners)) this.triggerOnChangeListener();
			};
			this.swapValues = (aIndex, bIndex, options) => {
				this.form.swapFieldValues(this.name, aIndex, bIndex, mergeOpts(options, { dontRunListeners: true }));
				if (!(options === null || options === void 0 ? void 0 : options.dontRunListeners)) this.triggerOnChangeListener();
			};
			this.moveValue = (aIndex, bIndex, options) => {
				this.form.moveFieldValues(this.name, aIndex, bIndex, mergeOpts(options, { dontRunListeners: true }));
				if (!(options === null || options === void 0 ? void 0 : options.dontRunListeners)) this.triggerOnChangeListener();
			};
			this.clearValues = (options) => {
				this.form.clearFieldValues(this.name, mergeOpts(options, { dontRunListeners: true }));
				if (!(options === null || options === void 0 ? void 0 : options.dontRunListeners)) this.triggerOnChangeListener();
			};
			this.getLinkedFields = (cause) => {
				const fields = Object.values(this.form.fieldInfo);
				const linkedFields = [];
				for (const field of fields) {
					if (!field.instance) continue;
					const { onChangeListenTo, onBlurListenTo } = field.instance.options.validators || {};
					if (cause === "change" && (onChangeListenTo === null || onChangeListenTo === void 0 ? void 0 : onChangeListenTo.includes(this.name))) linkedFields.push(field.instance);
					if (cause === "blur" && (onBlurListenTo === null || onBlurListenTo === void 0 ? void 0 : onBlurListenTo.includes(this.name))) linkedFields.push(field.instance);
				}
				return linkedFields;
			};
			this.validateSync = (cause, errorFromForm) => {
				var _this$state$meta$erro;
				const validates = getSyncValidatorArray(cause, _objectSpread2(_objectSpread2({}, this.options), {}, {
					form: this.form,
					fieldName: this.name,
					validationLogic: this.form.options.validationLogic || defaultValidationLogic
				}));
				const linkedFieldValidates = this.getLinkedFields(cause).reduce((acc, field) => {
					const fieldValidates = getSyncValidatorArray(cause, _objectSpread2(_objectSpread2({}, field.options), {}, {
						form: field.form,
						fieldName: field.name,
						validationLogic: field.form.options.validationLogic || defaultValidationLogic
					}));
					fieldValidates.forEach((validate) => {
						validate.field = field;
					});
					return acc.concat(fieldValidates);
				}, []);
				let hasErrored = false;
				batch(() => {
					const validateFieldFn = (field, validateObj) => {
						var _field$state$meta$err;
						const errorMapKey = getErrorMapKey(validateObj.cause);
						const fieldLevelError = validateObj.validate ? normalizeError(field.runValidator({
							validate: validateObj.validate,
							value: {
								value: field.store.state.value,
								validationSource: "field",
								fieldApi: field
							},
							type: "validate"
						})) : void 0;
						const formLevelError = errorFromForm[errorMapKey];
						const { newErrorValue, newSource } = determineFieldLevelErrorSourceAndValue({
							formLevelError,
							fieldLevelError
						});
						if (((_field$state$meta$err = field.state.meta.errorMap) === null || _field$state$meta$err === void 0 ? void 0 : _field$state$meta$err[errorMapKey]) !== newErrorValue) field.setMeta((prev) => _objectSpread2(_objectSpread2({}, prev), {}, {
							errorMap: _objectSpread2(_objectSpread2({}, prev.errorMap), {}, { [errorMapKey]: newErrorValue }),
							errorSourceMap: _objectSpread2(_objectSpread2({}, prev.errorSourceMap), {}, { [errorMapKey]: newSource })
						}));
						if (newErrorValue) hasErrored = true;
					};
					for (const validateObj of validates) validateFieldFn(this, validateObj);
					for (const fieldValitateObj of linkedFieldValidates) {
						if (!fieldValitateObj.validate) continue;
						validateFieldFn(fieldValitateObj.field, fieldValitateObj);
					}
				});
				const submitErrKey = getErrorMapKey("submit");
				if (((_this$state$meta$erro = this.state.meta.errorMap) === null || _this$state$meta$erro === void 0 ? void 0 : _this$state$meta$erro[submitErrKey]) && cause !== "submit" && !hasErrored) this.setMeta((prev) => _objectSpread2(_objectSpread2({}, prev), {}, {
					errorMap: _objectSpread2(_objectSpread2({}, prev.errorMap), {}, { [submitErrKey]: void 0 }),
					errorSourceMap: _objectSpread2(_objectSpread2({}, prev.errorSourceMap), {}, { [submitErrKey]: void 0 })
				}));
				return { hasErrored };
			};
			this.validateAsync = function() {
				var _ref2 = _asyncToGenerator(function* (cause, formValidationResultPromise) {
					const validates = getAsyncValidatorArray(cause, _objectSpread2(_objectSpread2({}, _this.options), {}, {
						form: _this.form,
						fieldName: _this.name,
						validationLogic: _this.form.options.validationLogic || defaultValidationLogic
					}));
					const asyncFormValidationResults = yield formValidationResultPromise;
					const linkedFields = _this.getLinkedFields(cause);
					const linkedFieldValidates = linkedFields.reduce((acc, field) => {
						const fieldValidates = getAsyncValidatorArray(cause, _objectSpread2(_objectSpread2({}, field.options), {}, {
							form: field.form,
							fieldName: field.name,
							validationLogic: field.form.options.validationLogic || defaultValidationLogic
						}));
						fieldValidates.forEach((validate) => {
							validate.field = field;
						});
						return acc.concat(fieldValidates);
					}, []);
					const validatesPromises = [];
					const linkedPromises = [];
					const hasAsyncValidators = validates.some((v) => v.validate) || linkedFieldValidates.some((v) => v.validate);
					if (hasAsyncValidators) {
						if (!_this.state.meta.isValidating) _this.setMeta((prev) => _objectSpread2(_objectSpread2({}, prev), {}, { isValidating: true }));
						for (const linkedField of linkedFields) linkedField.setMeta((prev) => _objectSpread2(_objectSpread2({}, prev), {}, { isValidating: true }));
					}
					const validateFieldAsyncFn = (field, validateObj, promises) => {
						const errorMapKey = getErrorMapKey(validateObj.cause);
						const fieldInfo = field.getInfo();
						const fieldValidatorMeta = fieldInfo.validationMetaMap[errorMapKey];
						fieldValidatorMeta === null || fieldValidatorMeta === void 0 || fieldValidatorMeta.lastAbortController.abort();
						const controller = new AbortController();
						fieldInfo.validationMetaMap[errorMapKey] = { lastAbortController: controller };
						promises.push(new Promise(function() {
							var _ref = _asyncToGenerator(function* (resolve) {
								var _asyncFormValidationR;
								let rawError;
								try {
									rawError = yield new Promise((rawResolve, rawReject) => {
										if (field.timeoutIds.validations[validateObj.cause]) clearTimeout(field.timeoutIds.validations[validateObj.cause]);
										field.timeoutIds.validations[validateObj.cause] = setTimeout(_asyncToGenerator(function* () {
											if (controller.signal.aborted) return rawResolve(void 0);
											try {
												rawResolve(yield _this.runValidator({
													validate: validateObj.validate,
													value: {
														value: field.store.state.value,
														fieldApi: field,
														signal: controller.signal,
														validationSource: "field"
													},
													type: "validateAsync"
												}));
											} catch (e) {
												rawReject(e);
											}
										}), validateObj.debounceMs);
									});
								} catch (e) {
									rawError = e;
								}
								if (controller.signal.aborted) return resolve(void 0);
								const fieldLevelError = normalizeError(rawError);
								const { newErrorValue, newSource } = determineFieldLevelErrorSourceAndValue({
									formLevelError: (_asyncFormValidationR = asyncFormValidationResults[field.name]) === null || _asyncFormValidationR === void 0 ? void 0 : _asyncFormValidationR[errorMapKey],
									fieldLevelError
								});
								if (field.getInfo().instance !== field) return resolve(void 0);
								field.setMeta((prev) => {
									return _objectSpread2(_objectSpread2({}, prev), {}, {
										errorMap: _objectSpread2(_objectSpread2({}, prev === null || prev === void 0 ? void 0 : prev.errorMap), {}, { [errorMapKey]: newErrorValue }),
										errorSourceMap: _objectSpread2(_objectSpread2({}, prev.errorSourceMap), {}, { [errorMapKey]: newSource })
									});
								});
								resolve(newErrorValue);
							});
							return function(_x) {
								return _ref.apply(this, arguments);
							};
						}()));
					};
					for (const validateObj of validates) {
						if (!validateObj.validate) continue;
						validateFieldAsyncFn(_this, validateObj, validatesPromises);
					}
					for (const fieldValitateObj of linkedFieldValidates) {
						if (!fieldValitateObj.validate) continue;
						validateFieldAsyncFn(fieldValitateObj.field, fieldValitateObj, linkedPromises);
					}
					let results = [];
					if (validatesPromises.length || linkedPromises.length) {
						results = yield Promise.all(validatesPromises);
						yield Promise.all(linkedPromises);
					}
					if (hasAsyncValidators) {
						_this.setMeta((prev) => _objectSpread2(_objectSpread2({}, prev), {}, { isValidating: false }));
						for (const linkedField of linkedFields) linkedField.setMeta((prev) => _objectSpread2(_objectSpread2({}, prev), {}, { isValidating: false }));
					}
					return results.filter(Boolean);
				});
				return function(_x2, _x3) {
					return _ref2.apply(this, arguments);
				};
			}();
			this.validate = (cause, opts2) => {
				var _fieldsErrorMap$this$;
				if (!this.state.meta.isTouched) return [];
				const { fieldsErrorMap } = (opts2 === null || opts2 === void 0 ? void 0 : opts2.skipFormValidation) ? { fieldsErrorMap: {} } : this.form.validateSync(cause);
				const { hasErrored } = this.validateSync(cause, (_fieldsErrorMap$this$ = fieldsErrorMap[this.name]) !== null && _fieldsErrorMap$this$ !== void 0 ? _fieldsErrorMap$this$ : {});
				if (hasErrored && !this.options.asyncAlways) {
					var _this$getInfo$validat;
					(_this$getInfo$validat = this.getInfo().validationMetaMap[getErrorMapKey(cause)]) === null || _this$getInfo$validat === void 0 || _this$getInfo$validat.lastAbortController.abort();
					return this.state.meta.errors;
				}
				const formValidationResultPromise = (opts2 === null || opts2 === void 0 ? void 0 : opts2.skipFormValidation) ? Promise.resolve({}) : this.form.validateAsync(cause);
				return this.validateAsync(cause, formValidationResultPromise);
			};
			this.handleChange = (updater) => {
				this.setValue(updater);
			};
			this.handleBlur = () => {
				if (!this.state.meta.isTouched) this.setMeta((prev) => _objectSpread2(_objectSpread2({}, prev), {}, { isTouched: true }));
				if (!this.state.meta.isBlurred) this.setMeta((prev) => _objectSpread2(_objectSpread2({}, prev), {}, { isBlurred: true }));
				this.validate("blur");
				this.triggerOnBlurListener();
			};
			this.setErrorMap = (errorMap) => {
				this.setMeta((prev) => _objectSpread2(_objectSpread2({}, prev), {}, { errorMap: _objectSpread2(_objectSpread2({}, prev.errorMap), errorMap) }));
			};
			this.parseValueWithSchema = (schema) => {
				return standardSchemaValidators.validate({
					value: this.state.value,
					validationSource: "field"
				}, schema);
			};
			this.parseValueWithSchemaAsync = (schema) => {
				return standardSchemaValidators.validateAsync({
					value: this.state.value,
					validationSource: "field"
				}, schema);
			};
			this.triggerOnChangeListener = () => {
				var _this$form$options$li3, _this$options$listene5;
				const formDebounceMs = (_this$form$options$li3 = this.form.options.listeners) === null || _this$form$options$li3 === void 0 ? void 0 : _this$form$options$li3.onChangeDebounceMs;
				if (formDebounceMs && formDebounceMs > 0) {
					if (this.timeoutIds.formListeners.change) clearTimeout(this.timeoutIds.formListeners.change);
					this.timeoutIds.formListeners.change = setTimeout(() => {
						var _this$form$options$li4, _this$form$options$li5;
						(_this$form$options$li4 = this.form.options.listeners) === null || _this$form$options$li4 === void 0 || (_this$form$options$li5 = _this$form$options$li4.onChange) === null || _this$form$options$li5 === void 0 || _this$form$options$li5.call(_this$form$options$li4, {
							formApi: this.form,
							fieldApi: this
						});
					}, formDebounceMs);
				} else {
					var _this$form$options$li6, _this$form$options$li7;
					(_this$form$options$li6 = this.form.options.listeners) === null || _this$form$options$li6 === void 0 || (_this$form$options$li7 = _this$form$options$li6.onChange) === null || _this$form$options$li7 === void 0 || _this$form$options$li7.call(_this$form$options$li6, {
						formApi: this.form,
						fieldApi: this
					});
				}
				const fieldDebounceMs = (_this$options$listene5 = this.options.listeners) === null || _this$options$listene5 === void 0 ? void 0 : _this$options$listene5.onChangeDebounceMs;
				if (fieldDebounceMs && fieldDebounceMs > 0) {
					if (this.timeoutIds.listeners.change) clearTimeout(this.timeoutIds.listeners.change);
					this.timeoutIds.listeners.change = setTimeout(() => {
						var _this$options$listene6, _this$options$listene7;
						(_this$options$listene6 = this.options.listeners) === null || _this$options$listene6 === void 0 || (_this$options$listene7 = _this$options$listene6.onChange) === null || _this$options$listene7 === void 0 || _this$options$listene7.call(_this$options$listene6, {
							value: this.state.value,
							fieldApi: this
						});
					}, fieldDebounceMs);
				} else {
					var _this$options$listene8, _this$options$listene9;
					(_this$options$listene8 = this.options.listeners) === null || _this$options$listene8 === void 0 || (_this$options$listene9 = _this$options$listene8.onChange) === null || _this$options$listene9 === void 0 || _this$options$listene9.call(_this$options$listene8, {
						value: this.state.value,
						fieldApi: this
					});
				}
			};
			this.form = opts.form;
			this.name = opts.name;
			this.options = opts;
			this.timeoutIds = {
				validations: {},
				listeners: {},
				formListeners: {}
			};
			this.store = createStore((prevVal) => {
				var _this$form$getFieldMe;
				this.form.store.get();
				const meta = (_this$form$getFieldMe = this.form.getFieldMeta(this.name)) !== null && _this$form$getFieldMe !== void 0 ? _this$form$getFieldMe : _objectSpread2(_objectSpread2({}, defaultFieldMeta), opts.defaultMeta);
				let value = this.form.getFieldValue(this.name);
				if (!meta.isTouched && value === void 0 && this.options.defaultValue !== void 0 && !evaluate(value, this.options.defaultValue)) value = this.options.defaultValue;
				if (prevVal && prevVal.value === value && prevVal.meta === meta) return prevVal;
				return {
					value,
					meta
				};
			});
		}
		/**
		* The current field state.
		*/
		get state() {
			return this.store.state;
		}
		/**
		* @private
		*/
		runValidator(props) {
			if (isStandardSchemaValidator(props.validate)) return standardSchemaValidators[props.type](props.value, props.validate);
			return props.validate(props.value);
		}
		triggerOnBlurListener() {
			var _this$form$options$li8, _this$options$listene10;
			const formDebounceMs = (_this$form$options$li8 = this.form.options.listeners) === null || _this$form$options$li8 === void 0 ? void 0 : _this$form$options$li8.onBlurDebounceMs;
			if (formDebounceMs && formDebounceMs > 0) {
				if (this.timeoutIds.formListeners.blur) clearTimeout(this.timeoutIds.formListeners.blur);
				this.timeoutIds.formListeners.blur = setTimeout(() => {
					var _this$form$options$li9, _this$form$options$li10;
					(_this$form$options$li9 = this.form.options.listeners) === null || _this$form$options$li9 === void 0 || (_this$form$options$li10 = _this$form$options$li9.onBlur) === null || _this$form$options$li10 === void 0 || _this$form$options$li10.call(_this$form$options$li9, {
						formApi: this.form,
						fieldApi: this
					});
				}, formDebounceMs);
			} else {
				var _this$form$options$li11, _this$form$options$li12;
				(_this$form$options$li11 = this.form.options.listeners) === null || _this$form$options$li11 === void 0 || (_this$form$options$li12 = _this$form$options$li11.onBlur) === null || _this$form$options$li12 === void 0 || _this$form$options$li12.call(_this$form$options$li11, {
					formApi: this.form,
					fieldApi: this
				});
			}
			const fieldDebounceMs = (_this$options$listene10 = this.options.listeners) === null || _this$options$listene10 === void 0 ? void 0 : _this$options$listene10.onBlurDebounceMs;
			if (fieldDebounceMs && fieldDebounceMs > 0) {
				if (this.timeoutIds.listeners.blur) clearTimeout(this.timeoutIds.listeners.blur);
				this.timeoutIds.listeners.blur = setTimeout(() => {
					var _this$options$listene11, _this$options$listene12;
					(_this$options$listene11 = this.options.listeners) === null || _this$options$listene11 === void 0 || (_this$options$listene12 = _this$options$listene11.onBlur) === null || _this$options$listene12 === void 0 || _this$options$listene12.call(_this$options$listene11, {
						value: this.state.value,
						fieldApi: this
					});
				}, fieldDebounceMs);
			} else {
				var _this$options$listene13, _this$options$listene14;
				(_this$options$listene13 = this.options.listeners) === null || _this$options$listene13 === void 0 || (_this$options$listene14 = _this$options$listene13.onBlur) === null || _this$options$listene14 === void 0 || _this$options$listene14.call(_this$options$listene13, {
					value: this.state.value,
					fieldApi: this
				});
			}
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+form-core@1.32.0/node_modules/@tanstack/form-core/dist/esm/index.js
var init_esm$1 = __esmMin((() => {
	init_FormApi();
	init_FieldApi();
	init_utils();
	init_ValidationLogic();
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+vue-store@0.9.3_vue@3.5.34_typescript@5.9.3_/node_modules/@tanstack/vue-store/dist/esm/index.js
function useStore(store, selector = (d) => d, options = {}) {
	var _options$equal;
	const slice = ref(selector(store.get()));
	const equal = (_options$equal = options.equal) !== null && _options$equal !== void 0 ? _options$equal : shallow;
	watch(() => store, (value, _oldValue, onCleanup) => {
		const unsub = value.subscribe((s) => {
			const data = selector(s);
			if (equal(toRaw(slice.value), data)) return;
			slice.value = data;
		}).unsubscribe;
		onCleanup(() => {
			unsub();
		});
	}, { immediate: true });
	return readonly(slice);
}
function shallow(objA, objB) {
	if (Object.is(objA, objB)) return true;
	if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) return false;
	if (objA instanceof Map && objB instanceof Map) {
		if (objA.size !== objB.size) return false;
		for (const [k, v] of objA) if (!objB.has(k) || !Object.is(v, objB.get(k))) return false;
		return true;
	}
	if (objA instanceof Set && objB instanceof Set) {
		if (objA.size !== objB.size) return false;
		for (const v of objA) if (!objB.has(v)) return false;
		return true;
	}
	if (objA instanceof Date && objB instanceof Date) {
		if (objA.getTime() !== objB.getTime()) return false;
		return true;
	}
	const keysA = Object.keys(objA);
	if (keysA.length !== Object.keys(objB).length) return false;
	for (let i = 0; i < keysA.length; i++) if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !Object.is(objA[keysA[i]], objB[keysA[i]])) return false;
	return true;
}
var init_esm = __esmMin((() => {
	init_lib();
	init_esm$3();
}));
//#endregion
export { FormApi as a, getBy as c, FieldApi as i, isGlobalFormValidationError as l, useStore as n, revalidateLogic as o, init_esm$1 as r, determineFormLevelErrorSourceAndValue as s, init_esm as t };
