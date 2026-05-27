import { t as __commonJSMin } from "./rolldown-runtime-lkMnaVCm.js";
//#region node_modules/.pnpm/reflect-metadata@0.2.2/node_modules/reflect-metadata/Reflect.js
var require_Reflect = /* @__PURE__ */ __commonJSMin((() => {
	/*! *****************************************************************************
	Copyright (C) Microsoft. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0
	
	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.
	
	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */
	var Reflect;
	(function(Reflect) {
		(function(factory) {
			var root = typeof globalThis === "object" ? globalThis : typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : sloppyModeThis();
			var exporter = makeExporter(Reflect);
			if (typeof root.Reflect !== "undefined") exporter = makeExporter(root.Reflect, exporter);
			factory(exporter, root);
			if (typeof root.Reflect === "undefined") root.Reflect = Reflect;
			function makeExporter(target, previous) {
				return function(key, value) {
					Object.defineProperty(target, key, {
						configurable: true,
						writable: true,
						value
					});
					if (previous) previous(key, value);
				};
			}
			function functionThis() {
				try {
					return Function("return this;")();
				} catch (_) {}
			}
			function indirectEvalThis() {
				try {
					return (0, eval)("(function() { return this; })()");
				} catch (_) {}
			}
			function sloppyModeThis() {
				return functionThis() || indirectEvalThis();
			}
		})(function(exporter, root) {
			var hasOwn = Object.prototype.hasOwnProperty;
			var supportsSymbol = typeof Symbol === "function";
			var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
			var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
			var supportsCreate = typeof Object.create === "function";
			var supportsProto = { __proto__: [] } instanceof Array;
			var downLevel = !supportsCreate && !supportsProto;
			var HashMap = {
				create: supportsCreate ? function() {
					return MakeDictionary(Object.create(null));
				} : supportsProto ? function() {
					return MakeDictionary({ __proto__: null });
				} : function() {
					return MakeDictionary({});
				},
				has: downLevel ? function(map, key) {
					return hasOwn.call(map, key);
				} : function(map, key) {
					return key in map;
				},
				get: downLevel ? function(map, key) {
					return hasOwn.call(map, key) ? map[key] : void 0;
				} : function(map, key) {
					return map[key];
				}
			};
			var functionPrototype = Object.getPrototypeOf(Function);
			var _Map = typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
			var _Set = typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
			var _WeakMap = typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
			var registrySymbol = supportsSymbol ? Symbol.for("@reflect-metadata:registry") : void 0;
			var metadataRegistry = GetOrCreateMetadataRegistry();
			var metadataProvider = CreateMetadataProvider(metadataRegistry);
			/**
			* Applies a set of decorators to a property of a target object.
			* @param decorators An array of decorators.
			* @param target The target object.
			* @param propertyKey (Optional) The property key to decorate.
			* @param attributes (Optional) The property descriptor for the target key.
			* @remarks Decorators are applied in reverse order.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     Example = Reflect.decorate(decoratorsArray, Example);
			*
			*     // property (on constructor)
			*     Reflect.decorate(decoratorsArray, Example, "staticProperty");
			*
			*     // property (on prototype)
			*     Reflect.decorate(decoratorsArray, Example.prototype, "property");
			*
			*     // method (on constructor)
			*     Object.defineProperty(Example, "staticMethod",
			*         Reflect.decorate(decoratorsArray, Example, "staticMethod",
			*             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
			*
			*     // method (on prototype)
			*     Object.defineProperty(Example.prototype, "method",
			*         Reflect.decorate(decoratorsArray, Example.prototype, "method",
			*             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
			*
			*/
			function decorate(decorators, target, propertyKey, attributes) {
				if (!IsUndefined(propertyKey)) {
					if (!IsArray(decorators)) throw new TypeError();
					if (!IsObject(target)) throw new TypeError();
					if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes)) throw new TypeError();
					if (IsNull(attributes)) attributes = void 0;
					propertyKey = ToPropertyKey(propertyKey);
					return DecorateProperty(decorators, target, propertyKey, attributes);
				} else {
					if (!IsArray(decorators)) throw new TypeError();
					if (!IsConstructor(target)) throw new TypeError();
					return DecorateConstructor(decorators, target);
				}
			}
			exporter("decorate", decorate);
			/**
			* A default metadata decorator factory that can be used on a class, class member, or parameter.
			* @param metadataKey The key for the metadata entry.
			* @param metadataValue The value for the metadata entry.
			* @returns A decorator function.
			* @remarks
			* If `metadataKey` is already defined for the target and target key, the
			* metadataValue for that key will be overwritten.
			* @example
			*
			*     // constructor
			*     @Reflect.metadata(key, value)
			*     class Example {
			*     }
			*
			*     // property (on constructor, TypeScript only)
			*     class Example {
			*         @Reflect.metadata(key, value)
			*         static staticProperty;
			*     }
			*
			*     // property (on prototype, TypeScript only)
			*     class Example {
			*         @Reflect.metadata(key, value)
			*         property;
			*     }
			*
			*     // method (on constructor)
			*     class Example {
			*         @Reflect.metadata(key, value)
			*         static staticMethod() { }
			*     }
			*
			*     // method (on prototype)
			*     class Example {
			*         @Reflect.metadata(key, value)
			*         method() { }
			*     }
			*
			*/
			function metadata(metadataKey, metadataValue) {
				function decorator(target, propertyKey) {
					if (!IsObject(target)) throw new TypeError();
					if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey)) throw new TypeError();
					OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
				}
				return decorator;
			}
			exporter("metadata", metadata);
			/**
			* Define a unique metadata entry on the target.
			* @param metadataKey A key used to store and retrieve metadata.
			* @param metadataValue A value that contains attached metadata.
			* @param target The target object on which to define metadata.
			* @param propertyKey (Optional) The property key for the target.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     Reflect.defineMetadata("custom:annotation", options, Example);
			*
			*     // property (on constructor)
			*     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
			*
			*     // property (on prototype)
			*     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
			*
			*     // method (on constructor)
			*     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
			*
			*     // method (on prototype)
			*     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
			*
			*     // decorator factory as metadata-producing annotation.
			*     function MyAnnotation(options): Decorator {
			*         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
			*     }
			*
			*/
			function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
			}
			exporter("defineMetadata", defineMetadata);
			/**
			* Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
			* @param metadataKey A key used to store and retrieve metadata.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.hasMetadata("custom:annotation", Example);
			*
			*     // property (on constructor)
			*     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
			*
			*/
			function hasMetadata(metadataKey, target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryHasMetadata(metadataKey, target, propertyKey);
			}
			exporter("hasMetadata", hasMetadata);
			/**
			* Gets a value indicating whether the target object has the provided metadata key defined.
			* @param metadataKey A key used to store and retrieve metadata.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.hasOwnMetadata("custom:annotation", Example);
			*
			*     // property (on constructor)
			*     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
			*
			*/
			function hasOwnMetadata(metadataKey, target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
			}
			exporter("hasOwnMetadata", hasOwnMetadata);
			/**
			* Gets the metadata value for the provided metadata key on the target object or its prototype chain.
			* @param metadataKey A key used to store and retrieve metadata.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns The metadata value for the metadata key if found; otherwise, `undefined`.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.getMetadata("custom:annotation", Example);
			*
			*     // property (on constructor)
			*     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
			*
			*/
			function getMetadata(metadataKey, target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryGetMetadata(metadataKey, target, propertyKey);
			}
			exporter("getMetadata", getMetadata);
			/**
			* Gets the metadata value for the provided metadata key on the target object.
			* @param metadataKey A key used to store and retrieve metadata.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns The metadata value for the metadata key if found; otherwise, `undefined`.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.getOwnMetadata("custom:annotation", Example);
			*
			*     // property (on constructor)
			*     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
			*
			*/
			function getOwnMetadata(metadataKey, target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
			}
			exporter("getOwnMetadata", getOwnMetadata);
			/**
			* Gets the metadata keys defined on the target object or its prototype chain.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns An array of unique metadata keys.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.getMetadataKeys(Example);
			*
			*     // property (on constructor)
			*     result = Reflect.getMetadataKeys(Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.getMetadataKeys(Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.getMetadataKeys(Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.getMetadataKeys(Example.prototype, "method");
			*
			*/
			function getMetadataKeys(target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryMetadataKeys(target, propertyKey);
			}
			exporter("getMetadataKeys", getMetadataKeys);
			/**
			* Gets the unique metadata keys defined on the target object.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns An array of unique metadata keys.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.getOwnMetadataKeys(Example);
			*
			*     // property (on constructor)
			*     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
			*
			*/
			function getOwnMetadataKeys(target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryOwnMetadataKeys(target, propertyKey);
			}
			exporter("getOwnMetadataKeys", getOwnMetadataKeys);
			/**
			* Deletes the metadata entry from the target object with the provided key.
			* @param metadataKey A key used to store and retrieve metadata.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns `true` if the metadata entry was found and deleted; otherwise, false.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.deleteMetadata("custom:annotation", Example);
			*
			*     // property (on constructor)
			*     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
			*
			*/
			function deleteMetadata(metadataKey, target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				var provider = GetMetadataProvider(target, propertyKey, false);
				if (IsUndefined(provider)) return false;
				return provider.OrdinaryDeleteMetadata(metadataKey, target, propertyKey);
			}
			exporter("deleteMetadata", deleteMetadata);
			function DecorateConstructor(decorators, target) {
				for (var i = decorators.length - 1; i >= 0; --i) {
					var decorator = decorators[i];
					var decorated = decorator(target);
					if (!IsUndefined(decorated) && !IsNull(decorated)) {
						if (!IsConstructor(decorated)) throw new TypeError();
						target = decorated;
					}
				}
				return target;
			}
			function DecorateProperty(decorators, target, propertyKey, descriptor) {
				for (var i = decorators.length - 1; i >= 0; --i) {
					var decorator = decorators[i];
					var decorated = decorator(target, propertyKey, descriptor);
					if (!IsUndefined(decorated) && !IsNull(decorated)) {
						if (!IsObject(decorated)) throw new TypeError();
						descriptor = decorated;
					}
				}
				return descriptor;
			}
			function OrdinaryHasMetadata(MetadataKey, O, P) {
				if (OrdinaryHasOwnMetadata(MetadataKey, O, P)) return true;
				var parent = OrdinaryGetPrototypeOf(O);
				if (!IsNull(parent)) return OrdinaryHasMetadata(MetadataKey, parent, P);
				return false;
			}
			function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
				var provider = GetMetadataProvider(O, P, false);
				if (IsUndefined(provider)) return false;
				return ToBoolean(provider.OrdinaryHasOwnMetadata(MetadataKey, O, P));
			}
			function OrdinaryGetMetadata(MetadataKey, O, P) {
				if (OrdinaryHasOwnMetadata(MetadataKey, O, P)) return OrdinaryGetOwnMetadata(MetadataKey, O, P);
				var parent = OrdinaryGetPrototypeOf(O);
				if (!IsNull(parent)) return OrdinaryGetMetadata(MetadataKey, parent, P);
			}
			function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
				var provider = GetMetadataProvider(O, P, false);
				if (IsUndefined(provider)) return;
				return provider.OrdinaryGetOwnMetadata(MetadataKey, O, P);
			}
			function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
				GetMetadataProvider(O, P, true).OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P);
			}
			function OrdinaryMetadataKeys(O, P) {
				var ownKeys = OrdinaryOwnMetadataKeys(O, P);
				var parent = OrdinaryGetPrototypeOf(O);
				if (parent === null) return ownKeys;
				var parentKeys = OrdinaryMetadataKeys(parent, P);
				if (parentKeys.length <= 0) return ownKeys;
				if (ownKeys.length <= 0) return parentKeys;
				var set = new _Set();
				var keys = [];
				for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
					var key = ownKeys_1[_i];
					var hasKey = set.has(key);
					if (!hasKey) {
						set.add(key);
						keys.push(key);
					}
				}
				for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
					var key = parentKeys_1[_a];
					var hasKey = set.has(key);
					if (!hasKey) {
						set.add(key);
						keys.push(key);
					}
				}
				return keys;
			}
			function OrdinaryOwnMetadataKeys(O, P) {
				var provider = GetMetadataProvider(O, P, false);
				if (!provider) return [];
				return provider.OrdinaryOwnMetadataKeys(O, P);
			}
			function Type(x) {
				if (x === null) return 1;
				switch (typeof x) {
					case "undefined": return 0;
					case "boolean": return 2;
					case "string": return 3;
					case "symbol": return 4;
					case "number": return 5;
					case "object": return x === null ? 1 : 6;
					default: return 6;
				}
			}
			function IsUndefined(x) {
				return x === void 0;
			}
			function IsNull(x) {
				return x === null;
			}
			function IsSymbol(x) {
				return typeof x === "symbol";
			}
			function IsObject(x) {
				return typeof x === "object" ? x !== null : typeof x === "function";
			}
			function ToPrimitive(input, PreferredType) {
				switch (Type(input)) {
					case 0: return input;
					case 1: return input;
					case 2: return input;
					case 3: return input;
					case 4: return input;
					case 5: return input;
				}
				var hint = PreferredType === 3 ? "string" : PreferredType === 5 ? "number" : "default";
				var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
				if (exoticToPrim !== void 0) {
					var result = exoticToPrim.call(input, hint);
					if (IsObject(result)) throw new TypeError();
					return result;
				}
				return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
			}
			function OrdinaryToPrimitive(O, hint) {
				if (hint === "string") {
					var toString_1 = O.toString;
					if (IsCallable(toString_1)) {
						var result = toString_1.call(O);
						if (!IsObject(result)) return result;
					}
					var valueOf = O.valueOf;
					if (IsCallable(valueOf)) {
						var result = valueOf.call(O);
						if (!IsObject(result)) return result;
					}
				} else {
					var valueOf = O.valueOf;
					if (IsCallable(valueOf)) {
						var result = valueOf.call(O);
						if (!IsObject(result)) return result;
					}
					var toString_2 = O.toString;
					if (IsCallable(toString_2)) {
						var result = toString_2.call(O);
						if (!IsObject(result)) return result;
					}
				}
				throw new TypeError();
			}
			function ToBoolean(argument) {
				return !!argument;
			}
			function ToString(argument) {
				return "" + argument;
			}
			function ToPropertyKey(argument) {
				var key = ToPrimitive(argument, 3);
				if (IsSymbol(key)) return key;
				return ToString(key);
			}
			function IsArray(argument) {
				return Array.isArray ? Array.isArray(argument) : argument instanceof Object ? argument instanceof Array : Object.prototype.toString.call(argument) === "[object Array]";
			}
			function IsCallable(argument) {
				return typeof argument === "function";
			}
			function IsConstructor(argument) {
				return typeof argument === "function";
			}
			function IsPropertyKey(argument) {
				switch (Type(argument)) {
					case 3: return true;
					case 4: return true;
					default: return false;
				}
			}
			function SameValueZero(x, y) {
				return x === y || x !== x && y !== y;
			}
			function GetMethod(V, P) {
				var func = V[P];
				if (func === void 0 || func === null) return void 0;
				if (!IsCallable(func)) throw new TypeError();
				return func;
			}
			function GetIterator(obj) {
				var method = GetMethod(obj, iteratorSymbol);
				if (!IsCallable(method)) throw new TypeError();
				var iterator = method.call(obj);
				if (!IsObject(iterator)) throw new TypeError();
				return iterator;
			}
			function IteratorValue(iterResult) {
				return iterResult.value;
			}
			function IteratorStep(iterator) {
				var result = iterator.next();
				return result.done ? false : result;
			}
			function IteratorClose(iterator) {
				var f = iterator["return"];
				if (f) f.call(iterator);
			}
			function OrdinaryGetPrototypeOf(O) {
				var proto = Object.getPrototypeOf(O);
				if (typeof O !== "function" || O === functionPrototype) return proto;
				if (proto !== functionPrototype) return proto;
				var prototype = O.prototype;
				var prototypeProto = prototype && Object.getPrototypeOf(prototype);
				if (prototypeProto == null || prototypeProto === Object.prototype) return proto;
				var constructor = prototypeProto.constructor;
				if (typeof constructor !== "function") return proto;
				if (constructor === O) return proto;
				return constructor;
			}
			/**
			* Creates a registry used to allow multiple `reflect-metadata` providers.
			*/
			function CreateMetadataRegistry() {
				var fallback;
				if (!IsUndefined(registrySymbol) && typeof root.Reflect !== "undefined" && !(registrySymbol in root.Reflect) && typeof root.Reflect.defineMetadata === "function") fallback = CreateFallbackProvider(root.Reflect);
				var first;
				var second;
				var rest;
				var targetProviderMap = new _WeakMap();
				var registry = {
					registerProvider,
					getProvider,
					setProvider
				};
				return registry;
				function registerProvider(provider) {
					if (!Object.isExtensible(registry)) throw new Error("Cannot add provider to a frozen registry.");
					switch (true) {
						case fallback === provider: break;
						case IsUndefined(first):
							first = provider;
							break;
						case first === provider: break;
						case IsUndefined(second):
							second = provider;
							break;
						case second === provider: break;
						default:
							if (rest === void 0) rest = new _Set();
							rest.add(provider);
							break;
					}
				}
				function getProviderNoCache(O, P) {
					if (!IsUndefined(first)) {
						if (first.isProviderFor(O, P)) return first;
						if (!IsUndefined(second)) {
							if (second.isProviderFor(O, P)) return first;
							if (!IsUndefined(rest)) {
								var iterator = GetIterator(rest);
								while (true) {
									var next = IteratorStep(iterator);
									if (!next) return;
									var provider = IteratorValue(next);
									if (provider.isProviderFor(O, P)) {
										IteratorClose(iterator);
										return provider;
									}
								}
							}
						}
					}
					if (!IsUndefined(fallback) && fallback.isProviderFor(O, P)) return fallback;
				}
				function getProvider(O, P) {
					var providerMap = targetProviderMap.get(O);
					var provider;
					if (!IsUndefined(providerMap)) provider = providerMap.get(P);
					if (!IsUndefined(provider)) return provider;
					provider = getProviderNoCache(O, P);
					if (!IsUndefined(provider)) {
						if (IsUndefined(providerMap)) {
							providerMap = new _Map();
							targetProviderMap.set(O, providerMap);
						}
						providerMap.set(P, provider);
					}
					return provider;
				}
				function hasProvider(provider) {
					if (IsUndefined(provider)) throw new TypeError();
					return first === provider || second === provider || !IsUndefined(rest) && rest.has(provider);
				}
				function setProvider(O, P, provider) {
					if (!hasProvider(provider)) throw new Error("Metadata provider not registered.");
					var existingProvider = getProvider(O, P);
					if (existingProvider !== provider) {
						if (!IsUndefined(existingProvider)) return false;
						var providerMap = targetProviderMap.get(O);
						if (IsUndefined(providerMap)) {
							providerMap = new _Map();
							targetProviderMap.set(O, providerMap);
						}
						providerMap.set(P, provider);
					}
					return true;
				}
			}
			/**
			* Gets or creates the shared registry of metadata providers.
			*/
			function GetOrCreateMetadataRegistry() {
				var metadataRegistry;
				if (!IsUndefined(registrySymbol) && IsObject(root.Reflect) && Object.isExtensible(root.Reflect)) metadataRegistry = root.Reflect[registrySymbol];
				if (IsUndefined(metadataRegistry)) metadataRegistry = CreateMetadataRegistry();
				if (!IsUndefined(registrySymbol) && IsObject(root.Reflect) && Object.isExtensible(root.Reflect)) Object.defineProperty(root.Reflect, registrySymbol, {
					enumerable: false,
					configurable: false,
					writable: false,
					value: metadataRegistry
				});
				return metadataRegistry;
			}
			function CreateMetadataProvider(registry) {
				var metadata = new _WeakMap();
				var provider = {
					isProviderFor: function(O, P) {
						var targetMetadata = metadata.get(O);
						if (IsUndefined(targetMetadata)) return false;
						return targetMetadata.has(P);
					},
					OrdinaryDefineOwnMetadata,
					OrdinaryHasOwnMetadata,
					OrdinaryGetOwnMetadata,
					OrdinaryOwnMetadataKeys,
					OrdinaryDeleteMetadata
				};
				metadataRegistry.registerProvider(provider);
				return provider;
				function GetOrCreateMetadataMap(O, P, Create) {
					var targetMetadata = metadata.get(O);
					var createdTargetMetadata = false;
					if (IsUndefined(targetMetadata)) {
						if (!Create) return void 0;
						targetMetadata = new _Map();
						metadata.set(O, targetMetadata);
						createdTargetMetadata = true;
					}
					var metadataMap = targetMetadata.get(P);
					if (IsUndefined(metadataMap)) {
						if (!Create) return void 0;
						metadataMap = new _Map();
						targetMetadata.set(P, metadataMap);
						if (!registry.setProvider(O, P, provider)) {
							targetMetadata.delete(P);
							if (createdTargetMetadata) metadata.delete(O);
							throw new Error("Wrong provider for target.");
						}
					}
					return metadataMap;
				}
				function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
					var metadataMap = GetOrCreateMetadataMap(O, P, false);
					if (IsUndefined(metadataMap)) return false;
					return ToBoolean(metadataMap.has(MetadataKey));
				}
				function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
					var metadataMap = GetOrCreateMetadataMap(O, P, false);
					if (IsUndefined(metadataMap)) return void 0;
					return metadataMap.get(MetadataKey);
				}
				function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
					GetOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
				}
				function OrdinaryOwnMetadataKeys(O, P) {
					var keys = [];
					var metadataMap = GetOrCreateMetadataMap(O, P, false);
					if (IsUndefined(metadataMap)) return keys;
					var iterator = GetIterator(metadataMap.keys());
					var k = 0;
					while (true) {
						var next = IteratorStep(iterator);
						if (!next) {
							keys.length = k;
							return keys;
						}
						var nextValue = IteratorValue(next);
						try {
							keys[k] = nextValue;
						} catch (e) {
							try {
								IteratorClose(iterator);
							} finally {
								throw e;
							}
						}
						k++;
					}
				}
				function OrdinaryDeleteMetadata(MetadataKey, O, P) {
					var metadataMap = GetOrCreateMetadataMap(O, P, false);
					if (IsUndefined(metadataMap)) return false;
					if (!metadataMap.delete(MetadataKey)) return false;
					if (metadataMap.size === 0) {
						var targetMetadata = metadata.get(O);
						if (!IsUndefined(targetMetadata)) {
							targetMetadata.delete(P);
							if (targetMetadata.size === 0) metadata.delete(targetMetadata);
						}
					}
					return true;
				}
			}
			function CreateFallbackProvider(reflect) {
				var defineMetadata = reflect.defineMetadata, hasOwnMetadata = reflect.hasOwnMetadata, getOwnMetadata = reflect.getOwnMetadata, getOwnMetadataKeys = reflect.getOwnMetadataKeys, deleteMetadata = reflect.deleteMetadata;
				var metadataOwner = new _WeakMap();
				return {
					isProviderFor: function(O, P) {
						var metadataPropertySet = metadataOwner.get(O);
						if (!IsUndefined(metadataPropertySet) && metadataPropertySet.has(P)) return true;
						if (getOwnMetadataKeys(O, P).length) {
							if (IsUndefined(metadataPropertySet)) {
								metadataPropertySet = new _Set();
								metadataOwner.set(O, metadataPropertySet);
							}
							metadataPropertySet.add(P);
							return true;
						}
						return false;
					},
					OrdinaryDefineOwnMetadata: defineMetadata,
					OrdinaryHasOwnMetadata: hasOwnMetadata,
					OrdinaryGetOwnMetadata: getOwnMetadata,
					OrdinaryOwnMetadataKeys: getOwnMetadataKeys,
					OrdinaryDeleteMetadata: deleteMetadata
				};
			}
			/**
			* Gets the metadata provider for an object. If the object has no metadata provider and this is for a create operation,
			* then this module's metadata provider is assigned to the object.
			*/
			function GetMetadataProvider(O, P, Create) {
				var registeredProvider = metadataRegistry.getProvider(O, P);
				if (!IsUndefined(registeredProvider)) return registeredProvider;
				if (Create) {
					if (metadataRegistry.setProvider(O, P, metadataProvider)) return metadataProvider;
					throw new Error("Illegal state.");
				}
			}
			function CreateMapPolyfill() {
				var cacheSentinel = {};
				var arraySentinel = [];
				var MapIterator = function() {
					function MapIterator(keys, values, selector) {
						this._index = 0;
						this._keys = keys;
						this._values = values;
						this._selector = selector;
					}
					MapIterator.prototype["@@iterator"] = function() {
						return this;
					};
					MapIterator.prototype[iteratorSymbol] = function() {
						return this;
					};
					MapIterator.prototype.next = function() {
						var index = this._index;
						if (index >= 0 && index < this._keys.length) {
							var result = this._selector(this._keys[index], this._values[index]);
							if (index + 1 >= this._keys.length) {
								this._index = -1;
								this._keys = arraySentinel;
								this._values = arraySentinel;
							} else this._index++;
							return {
								value: result,
								done: false
							};
						}
						return {
							value: void 0,
							done: true
						};
					};
					MapIterator.prototype.throw = function(error) {
						if (this._index >= 0) {
							this._index = -1;
							this._keys = arraySentinel;
							this._values = arraySentinel;
						}
						throw error;
					};
					MapIterator.prototype.return = function(value) {
						if (this._index >= 0) {
							this._index = -1;
							this._keys = arraySentinel;
							this._values = arraySentinel;
						}
						return {
							value,
							done: true
						};
					};
					return MapIterator;
				}();
				return function() {
					function Map() {
						this._keys = [];
						this._values = [];
						this._cacheKey = cacheSentinel;
						this._cacheIndex = -2;
					}
					Object.defineProperty(Map.prototype, "size", {
						get: function() {
							return this._keys.length;
						},
						enumerable: true,
						configurable: true
					});
					Map.prototype.has = function(key) {
						return this._find(key, false) >= 0;
					};
					Map.prototype.get = function(key) {
						var index = this._find(key, false);
						return index >= 0 ? this._values[index] : void 0;
					};
					Map.prototype.set = function(key, value) {
						var index = this._find(key, true);
						this._values[index] = value;
						return this;
					};
					Map.prototype.delete = function(key) {
						var index = this._find(key, false);
						if (index >= 0) {
							var size = this._keys.length;
							for (var i = index + 1; i < size; i++) {
								this._keys[i - 1] = this._keys[i];
								this._values[i - 1] = this._values[i];
							}
							this._keys.length--;
							this._values.length--;
							if (SameValueZero(key, this._cacheKey)) {
								this._cacheKey = cacheSentinel;
								this._cacheIndex = -2;
							}
							return true;
						}
						return false;
					};
					Map.prototype.clear = function() {
						this._keys.length = 0;
						this._values.length = 0;
						this._cacheKey = cacheSentinel;
						this._cacheIndex = -2;
					};
					Map.prototype.keys = function() {
						return new MapIterator(this._keys, this._values, getKey);
					};
					Map.prototype.values = function() {
						return new MapIterator(this._keys, this._values, getValue);
					};
					Map.prototype.entries = function() {
						return new MapIterator(this._keys, this._values, getEntry);
					};
					Map.prototype["@@iterator"] = function() {
						return this.entries();
					};
					Map.prototype[iteratorSymbol] = function() {
						return this.entries();
					};
					Map.prototype._find = function(key, insert) {
						if (!SameValueZero(this._cacheKey, key)) {
							this._cacheIndex = -1;
							for (var i = 0; i < this._keys.length; i++) if (SameValueZero(this._keys[i], key)) {
								this._cacheIndex = i;
								break;
							}
						}
						if (this._cacheIndex < 0 && insert) {
							this._cacheIndex = this._keys.length;
							this._keys.push(key);
							this._values.push(void 0);
						}
						return this._cacheIndex;
					};
					return Map;
				}();
				function getKey(key, _) {
					return key;
				}
				function getValue(_, value) {
					return value;
				}
				function getEntry(key, value) {
					return [key, value];
				}
			}
			function CreateSetPolyfill() {
				return function() {
					function Set() {
						this._map = new _Map();
					}
					Object.defineProperty(Set.prototype, "size", {
						get: function() {
							return this._map.size;
						},
						enumerable: true,
						configurable: true
					});
					Set.prototype.has = function(value) {
						return this._map.has(value);
					};
					Set.prototype.add = function(value) {
						return this._map.set(value, value), this;
					};
					Set.prototype.delete = function(value) {
						return this._map.delete(value);
					};
					Set.prototype.clear = function() {
						this._map.clear();
					};
					Set.prototype.keys = function() {
						return this._map.keys();
					};
					Set.prototype.values = function() {
						return this._map.keys();
					};
					Set.prototype.entries = function() {
						return this._map.entries();
					};
					Set.prototype["@@iterator"] = function() {
						return this.keys();
					};
					Set.prototype[iteratorSymbol] = function() {
						return this.keys();
					};
					return Set;
				}();
			}
			function CreateWeakMapPolyfill() {
				var UUID_SIZE = 16;
				var keys = HashMap.create();
				var rootKey = CreateUniqueKey();
				return function() {
					function WeakMap() {
						this._key = CreateUniqueKey();
					}
					WeakMap.prototype.has = function(target) {
						var table = GetOrCreateWeakMapTable(target, false);
						return table !== void 0 ? HashMap.has(table, this._key) : false;
					};
					WeakMap.prototype.get = function(target) {
						var table = GetOrCreateWeakMapTable(target, false);
						return table !== void 0 ? HashMap.get(table, this._key) : void 0;
					};
					WeakMap.prototype.set = function(target, value) {
						var table = GetOrCreateWeakMapTable(target, true);
						table[this._key] = value;
						return this;
					};
					WeakMap.prototype.delete = function(target) {
						var table = GetOrCreateWeakMapTable(target, false);
						return table !== void 0 ? delete table[this._key] : false;
					};
					WeakMap.prototype.clear = function() {
						this._key = CreateUniqueKey();
					};
					return WeakMap;
				}();
				function CreateUniqueKey() {
					var key;
					do
						key = "@@WeakMap@@" + CreateUUID();
					while (HashMap.has(keys, key));
					keys[key] = true;
					return key;
				}
				function GetOrCreateWeakMapTable(target, create) {
					if (!hasOwn.call(target, rootKey)) {
						if (!create) return void 0;
						Object.defineProperty(target, rootKey, { value: HashMap.create() });
					}
					return target[rootKey];
				}
				function FillRandomBytes(buffer, size) {
					for (var i = 0; i < size; ++i) buffer[i] = Math.random() * 255 | 0;
					return buffer;
				}
				function GenRandomBytes(size) {
					if (typeof Uint8Array === "function") {
						var array = new Uint8Array(size);
						if (typeof crypto !== "undefined") crypto.getRandomValues(array);
						else if (typeof msCrypto !== "undefined") msCrypto.getRandomValues(array);
						else FillRandomBytes(array, size);
						return array;
					}
					return FillRandomBytes(new Array(size), size);
				}
				function CreateUUID() {
					var data = GenRandomBytes(UUID_SIZE);
					data[6] = data[6] & 79 | 64;
					data[8] = data[8] & 191 | 128;
					var result = "";
					for (var offset = 0; offset < UUID_SIZE; ++offset) {
						var byte = data[offset];
						if (offset === 4 || offset === 6 || offset === 8) result += "-";
						if (byte < 16) result += "0";
						result += byte.toString(16).toLowerCase();
					}
					return result;
				}
			}
			function MakeDictionary(obj) {
				obj.__ = void 0;
				delete obj.__;
				return obj;
			}
		});
	})(Reflect || (Reflect = {}));
}));
//#endregion
export { require_Reflect as t };
