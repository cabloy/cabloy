import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { l as markRaw } from "./vue-CeNp4lbs.js";
import { d as defineComponent, l as createVNode, p as h, r as Fragment } from "./vue-t5FcxkD3.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
import { F as celEnvBase, J as init_dist, P as catchError, X as isEmptyObject, Z as isNil, _ as ZodMetadata, v as init_dist$1 } from "./zova-BE4e4PxD.js";
import { d as _objectSpread2, f as init_objectSpread2, m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { C as UseScope, H as objectAssignReactive, K as cast, R as deepEqual, _ as BeanControllerPageBase, b as BeanControllerBase, c as prepareComponentOptions, g as BeanRenderBase, k as BeanInfo, l as useController, m as BeanScopeBase, v as SymbolController, w as Use, z as deepExtend } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { c as Render, i as Scope, s as Controller, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { c as getBy, l as isGlobalFormValidationError, n as useStore, o as revalidateLogic, s as determineFormLevelErrorSourceAndValue } from "./esm-D7Ka3WAI.js";
import { n as useForm, r as useField, t as init_esm } from "./tanstack-form-DKYfuXfg.js";
import { i as isJsxComponent, n as ZovaJsx, t as init_src$3 } from "./zova-DxkRogHR.js";
import { r as renderFormFieldTopPropsSystem, t as init_src$4 } from "./a-openapi-DFPQpoaJ.js";
//#region src/suite-vendor/a-zova/modules/a-form/src/lib/beanControllerFormBase.ts
var BeanControllerFormBase;
var init_beanControllerFormBase = __esmMin((() => {
	init_esm();
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_asyncToGenerator();
	BeanControllerFormBase = class extends BeanControllerBase {
		constructor(...args) {
			super(...args);
			this.form = void 0;
			this.formState = void 0;
		}
		submit(_submitMeta) {
			return _asyncToGenerator(function* () {
				throw new Error("should implement submit");
			})();
		}
		reset(_values, _opts) {
			throw new Error("should implement reset");
		}
		$useForm(opts) {
			return this.ctx.util.instanceScope(() => {
				return markRaw(useForm(opts));
			});
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-form/src/types/formField.ts
var constFieldProps;
var init_formField$1 = __esmMin((() => {
	constFieldProps = "$$FieldProps";
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-form/src/component/form/controller.tsx
function _initializerDefineProperty$3(e, i, r, l) {
	r && Object.defineProperty(e, i, {
		enumerable: r.enumerable,
		configurable: r.configurable,
		writable: r.writable,
		value: r.initializer ? r.initializer.call(l) : void 0
	});
}
function _applyDecoratedDescriptor$3(i, e, r, n, l) {
	var a = {};
	return Object.keys(n).forEach(function(i) {
		a[i] = n[i];
	}), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function(r, n) {
		return n(i, e, r) || r;
	}, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a;
}
function parseIssues(error) {
	const issues = typeof error.message === "string" ? JSON.parse(error.message) : error.message;
	const fields = {};
	for (const issue of issues) {
		const key = issue.path.join(".");
		fields[key] = issue;
	}
	return { fields };
}
function normalizeError(rawError) {
	if (rawError) {
		if (isGlobalFormValidationError(rawError)) return {
			formError: normalizeError(rawError.form).formError,
			fieldErrors: rawError.fields
		};
		return { formError: rawError };
	}
	return { formError: void 0 };
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
var _dec$6, _dec2$6, _dec3$3, _dec4$3, _class$6, _class2$3, _descriptor$3, _ControllerForm, ControllerForm$1;
var init_controller$3 = __esmMin((() => {
	init_asyncToGenerator();
	init_objectSpread2();
	init_src$1();
	init_dist();
	init_dist$1();
	init_esm();
	init_src$3();
	init_src$2();
	init_src$4();
	init_beanControllerFormBase();
	init_formField$1();
	ControllerForm$1 = (_dec$6 = Controller(), _dec2$6 = BeanInfo({ module: "a-form" }), _dec3$3 = UseScope("a-openapi"), _dec4$3 = Reflect.metadata("design:type", typeof ScopeModuleAOpenapi === "undefined" ? Object : ScopeModuleAOpenapi), _dec$6(_class$6 = _dec2$6(_class$6 = (_class2$3 = (_ControllerForm = class ControllerForm extends BeanControllerFormBase {
		constructor(...args) {
			super(...args);
			this.formProvider = void 0;
			this.schema = void 0;
			this.zodSchema = void 0;
			this.properties = void 0;
			this.zovaJsx = void 0;
			this.fieldCelEnv = void 0;
			_initializerDefineProperty$3(this, "$$scopeOpenapi", _descriptor$3, this);
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.bean._setBean("$$form", _this);
				_this.form = _this._createForm();
				_this.formState = useStore(_this.form.store, (state) => state);
				_this.formProvider = _this.$computed(() => {
					const formProvider = _this.$$scopeOpenapi.config.formProvider;
					return _this.$props.formProvider ? deepExtend({}, formProvider, _this.$props.formProvider) : formProvider;
				});
				_this.schema = _this.$computed(() => {
					return _this.$props.schema;
				});
				_this.zodSchema = _this.$computed(() => {
					return _this._getZodSchema();
				});
				_this.properties = _this.$computed(() => {
					return _this.$sdk.loadSchemaProperties(_this.schema, _this.$props.schemaScene);
				});
				_this.fieldCelEnv = _this._getFieldCelEnv();
				_this.zovaJsx = _this.bean._newBeanSimple(ZovaJsx, false, _this.formProvider.components, _this.fieldCelEnv);
				_this.$watch(() => _this.$props.data, (newValue, oldValue) => {
					if (deepEqual(newValue, oldValue)) return;
					_this.reset(_this.$props.data);
				});
			})();
		}
		submit(submitMeta) {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				const [_, error] = yield catchError(() => {
					return _this2.form.handleSubmit(submitMeta);
				});
				return !error && _this2.formState.isValid;
			})();
		}
		reset(values, opts) {
			this.form.reset(values !== null && values !== void 0 ? values : {}, opts);
			return this.form.state.values;
		}
		get formMeta() {
			return this.$props.formMeta;
		}
		getFieldValue(name) {
			var _getBy;
			return (_getBy = getBy(this.formState.values, name)) !== null && _getBy !== void 0 ? _getBy : null;
		}
		setFieldValue(name, value, disableNotifyChanged) {
			this.form.setFieldValue(name, value);
			if (!disableNotifyChanged) {
				var _this$$props$onChange, _this$$props;
				(_this$$props$onChange = (_this$$props = this.$props).onChanged) === null || _this$$props$onChange === void 0 || _this$$props$onChange.call(_this$$props, this.formState.values);
			}
		}
		getFieldProperty(name) {
			if (!this.properties) return;
			return this.properties.find((item) => item.key === name);
		}
		getFieldZodSchema(name) {
			return ZodMetadata.getFieldSchema(this.zodSchema, name);
		}
		_getFieldCelEnv() {
			const celEnv = celEnvBase.clone();
			celEnv.registerFunction("getValue(string):dyn", (name) => {
				var _this$form$getFieldVa;
				return (_this$form$getFieldVa = this.form.getFieldValue(name)) !== null && _this$form$getFieldVa !== void 0 ? _this$form$getFieldVa : null;
			});
			celEnv.registerFunction("getProperty(string):dyn", (name) => {
				var _this$getFieldPropert;
				return (_this$getFieldPropert = this.getFieldProperty(name)) !== null && _this$getFieldPropert !== void 0 ? _this$getFieldPropert : null;
			});
			return celEnv;
		}
		getFieldScope(name, scopeExtra) {
			return objectAssignReactive({}, this.$props.formScope, _objectSpread2({
				name,
				value: this.getFieldValue(name),
				property: this.getFieldProperty(name)
			}, scopeExtra));
		}
		getFieldJsxRenderContext($$formField, celScope) {
			return {
				app: this.app,
				ctx: this.ctx,
				$scene: "formField",
				$host: $$formField !== null && $$formField !== void 0 ? $$formField : this,
				$celScope: celScope,
				$jsx: this.zovaJsx,
				$$formField,
				$$form: this
			};
		}
		getFieldComponentPropsTop(name, celScope, jsxRenderContext) {
			return this._getFieldComponentPropsTopInner(name, celScope, jsxRenderContext);
		}
		_getFieldComponentPropsTopInner(name, celScope, jsxRenderContext) {
			var _this$formMeta;
			let props = {
				["$$FieldProps"]: true,
				key: name,
				name,
				value: celScope.value
			};
			const property = this.getFieldProperty(name);
			if (!property) return props;
			const rest = property.rest;
			if (!rest) return props;
			const keys = Object.keys(rest).filter((item) => !renderFormFieldTopPropsSystem.includes(item));
			if (keys.length === 0) return props;
			for (const key of keys) {
				const value = rest[key];
				let keyValue;
				if (key === "render") if (typeof value === "string") keyValue = this.zovaJsx.evaluateExpression(value, celScope);
				else keyValue = value;
				else keyValue = this.zovaJsx.renderJsxOrCel(value, void 0, celScope, jsxRenderContext);
				props[key] = keyValue;
			}
			if (isJsxComponent(props.render) && this.isComponentFormField(props.render.type) && !isEmptyObject(props.render.props)) {
				const propsAppend = this.zovaJsx.renderJsxOrCel(props.render.props, void 0, celScope, jsxRenderContext);
				props = Object.assign({}, props, propsAppend);
			}
			const readonlyTemp = props.readonly;
			if (isNil(readonlyTemp) && ((_this$formMeta = this.formMeta) === null || _this$formMeta === void 0 ? void 0 : _this$formMeta.formMode) === "view") props.readonly = true;
			return props;
		}
		getRenderProvider(render) {
			if (isJsxComponent(render)) return cast(render).type;
			if (typeof render === "string") {
				var _this$formProvider$co, _this$formProvider$co2;
				return (_this$formProvider$co = (_this$formProvider$co2 = this.formProvider.components) === null || _this$formProvider$co2 === void 0 ? void 0 : _this$formProvider$co2[render]) !== null && _this$formProvider$co !== void 0 ? _this$formProvider$co : render;
			}
			return render;
		}
		_getZodSchema() {
			if (this.$props.zodSchema) return this._patchZodSchema(this.$props.zodSchema);
			if (!this.schema) return;
			return this._patchZodSchema(this.$sdk.schemaToZodSchema(this.schema));
		}
		_patchZodSchema(schema) {
			if (schema.def.type === "object") return schema;
			if (schema.def.type === "union") return schema.def.options.find((item) => item.def.type === "object");
			throw new Error("invalid zod schema");
		}
		_createForm() {
			var _this3 = this;
			return this.$useForm({
				defaultValues: this.$props.data,
				validationLogic: this.$props.validateOnDynamic !== false ? revalidateLogic(this.$props.validateOnDynamicLogic) : void 0,
				onSubmitInvalid: (data) => {
					var _this$$props$onSubmit, _this$$props2;
					(_this$$props$onSubmit = (_this$$props2 = this.$props).onSubmitInvalid) === null || _this$$props$onSubmit === void 0 || _this$$props$onSubmit.call(_this$$props2, data, this);
				},
				onSubmit: function() {
					var _ref = _asyncToGenerator(function* (data) {
						const [_, error] = yield catchError(() => {
							var _this$$props$onSubmit2, _this$$props3;
							return (_this$$props$onSubmit2 = (_this$$props3 = _this3.$props).onSubmitData) === null || _this$$props$onSubmit2 === void 0 ? void 0 : _this$$props$onSubmit2.call(_this$$props3, data, _this3);
						});
						const resHandled = yield _this3.app.meta.event.emit("a-form:formSubmission", {
							form: _this3.form,
							data,
							error
						});
						if (!error) return;
						if (error.code === 422) {
							var _this$$props$onSubmit3, _this$$props4;
							_this3._handleError422(error);
							(_this$$props$onSubmit3 = (_this$$props4 = _this3.$props).onSubmitInvalid) === null || _this$$props$onSubmit3 === void 0 || _this$$props$onSubmit3.call(_this$$props4, data, _this3);
						} else if (!resHandled) {
							var _this$$props$onShowEr, _this$$props5;
							(_this$$props$onShowEr = (_this$$props5 = _this3.$props).onShowError) === null || _this$$props$onShowEr === void 0 || _this$$props$onShowEr.call(_this$$props5, {
								data,
								error
							}, _this3);
						}
						throw error;
					});
					return function onSubmit(_x) {
						return _ref.apply(this, arguments);
					};
				}()
			});
		}
		renderField(name, propsExtra) {
			var _property$key;
			const property = this.getFieldProperty(name);
			const key = (_property$key = property === null || property === void 0 ? void 0 : property.key) !== null && _property$key !== void 0 ? _property$key : name;
			return this._renderFieldByKey(key, propsExtra);
		}
		_renderFieldByKey(key, propsExtra) {
			const celScope = this.getFieldScope(key);
			const jsxRenderContext = this.getFieldJsxRenderContext(void 0, celScope);
			let props = this.getFieldComponentPropsTop(key, celScope, jsxRenderContext);
			if (propsExtra) props = Object.assign({}, props, propsExtra);
			if (cast(props).visible === false) return;
			const componentOptions = this._getFieldComponentOptionsTop(props.render);
			return this.zovaJsx.render(componentOptions, props, celScope, jsxRenderContext);
		}
		_getFieldComponentOptionsTop(render) {
			var _render;
			render = (_render = render) !== null && _render !== void 0 ? _render : "Input";
			const renderProvider = this.getRenderProvider(render);
			if (this.isComponentFormField(renderProvider)) return renderProvider;
			return "a-form:formField";
		}
		isComponentFormField(renderProvider) {
			return typeof renderProvider === "string" && renderProvider.includes(":formField");
		}
		_handleError422(error, cause = "submit") {
			var _formApi$state$errorM, _formApi$state$errorM2, _formApi$state$errorM3;
			const formApi = this.form;
			let hasErrored = false;
			const currentValidationErrorMap = {};
			const { formError, fieldErrors } = normalizeError(parseIssues(error));
			const errorMapKey = getErrorMapKey(cause);
			for (const field of Object.keys(formApi.state.fieldMeta)) {
				if (formApi.baseStore.state.fieldMetaBase[field] === void 0) continue;
				const fieldMeta = formApi.getFieldMeta(field);
				if (!fieldMeta) continue;
				const { errorMap: currentErrorMap, errorSourceMap: currentErrorMapSource } = fieldMeta;
				const newFormValidatorError = fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors[field];
				const { newErrorValue, newSource } = determineFormLevelErrorSourceAndValue({
					newFormValidatorError,
					isPreviousErrorFromFormValidator: (currentErrorMapSource === null || currentErrorMapSource === void 0 ? void 0 : currentErrorMapSource[errorMapKey]) === "form",
					previousErrorValue: currentErrorMap === null || currentErrorMap === void 0 ? void 0 : currentErrorMap[errorMapKey]
				});
				if (newSource === "form") currentValidationErrorMap[field] = _objectSpread2(_objectSpread2({}, currentValidationErrorMap[field]), {}, { [errorMapKey]: newFormValidatorError });
				if ((currentErrorMap === null || currentErrorMap === void 0 ? void 0 : currentErrorMap[errorMapKey]) !== newErrorValue) formApi.setFieldMeta(field, (prev) => _objectSpread2(_objectSpread2({}, prev), {}, {
					errorMap: _objectSpread2(_objectSpread2({}, prev.errorMap), {}, { [errorMapKey]: newErrorValue }),
					errorSourceMap: _objectSpread2(_objectSpread2({}, prev.errorSourceMap), {}, { [errorMapKey]: newSource })
				}));
			}
			if (((_formApi$state$errorM = formApi.state.errorMap) === null || _formApi$state$errorM === void 0 ? void 0 : _formApi$state$errorM[errorMapKey]) !== formError) formApi.baseStore.setState((prev) => _objectSpread2(_objectSpread2({}, prev), {}, { errorMap: _objectSpread2(_objectSpread2({}, prev.errorMap), {}, { [errorMapKey]: formError }) }));
			if (formError || fieldErrors) hasErrored = true;
			/**
			*  when we have an error for onSubmit in the state, we want
			*  to clear the error as soon as the user enters a valid value in the field
			*/
			const submitErrKey = getErrorMapKey("submit");
			if (((_formApi$state$errorM2 = formApi.state.errorMap) === null || _formApi$state$errorM2 === void 0 ? void 0 : _formApi$state$errorM2[submitErrKey]) && cause !== "submit" && !hasErrored) formApi.baseStore.setState((prev) => _objectSpread2(_objectSpread2({}, prev), {}, { errorMap: _objectSpread2(_objectSpread2({}, prev.errorMap), {}, { [submitErrKey]: void 0 }) }));
			/**
			*  when we have an error for onServer in the state, we want
			*  to clear the error as soon as the user enters a valid value in the field
			*/
			const serverErrKey = getErrorMapKey("server");
			if (((_formApi$state$errorM3 = formApi.state.errorMap) === null || _formApi$state$errorM3 === void 0 ? void 0 : _formApi$state$errorM3[serverErrKey]) && cause !== "server" && !hasErrored) formApi.baseStore.setState((prev) => _objectSpread2(_objectSpread2({}, prev), {}, { errorMap: _objectSpread2(_objectSpread2({}, prev.errorMap), {}, { [serverErrKey]: void 0 }) }));
		}
	}, _ControllerForm.$propsDefault = {
		formTag: "form",
		schemaScene: "form"
	}, _ControllerForm), _descriptor$3 = _applyDecoratedDescriptor$3(_class2$3.prototype, "$$scopeOpenapi", [_dec3$3, _dec4$3], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2$3)) || _class$6) || _class$6);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-form/src/component/formField/controller.tsx
function _initializerDefineProperty$2(e, i, r, l) {
	r && Object.defineProperty(e, i, {
		enumerable: r.enumerable,
		configurable: r.configurable,
		writable: r.writable,
		value: r.initializer ? r.initializer.call(l) : void 0
	});
}
function _applyDecoratedDescriptor$2(i, e, r, n, l) {
	var a = {};
	return Object.keys(n).forEach(function(i) {
		a[i] = n[i];
	}), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function(r, n) {
		return n(i, e, r) || r;
	}, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a;
}
function _normalizeValidateSchema(validateSchema, zodSchemaField) {
	if (!validateSchema) return void 0;
	if (validateSchema === true) return zodSchemaField;
	return validateSchema;
}
var _dec$5, _dec2$5, _dec3$2, _dec4$2, _dec5, _dec6, _class$5, _class2$2, _descriptor$2, _descriptor2, _ControllerFormField, ControllerFormField;
var init_controller$2 = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_dist();
	init_esm();
	init_vue_runtime_esm_bundler();
	init_src$2();
	init_formField$1();
	ControllerFormField = (_dec$5 = Controller(), _dec2$5 = BeanInfo({ module: "a-form" }), _dec3$2 = Use({ injectionScope: "host" }), _dec4$2 = Reflect.metadata("design:type", typeof ControllerForm === "undefined" ? Object : ControllerForm), _dec5 = Use("a-behavior.bean.behaviorsHolder"), _dec6 = Reflect.metadata("design:type", typeof BeanBehaviorsHolder === "undefined" ? Object : BeanBehaviorsHolder), _dec$5(_class$5 = _dec2$5(_class$5 = (_class2$2 = (_ControllerFormField = class ControllerFormField extends BeanControllerBase {
		constructor(...args) {
			super(...args);
			this._formField = void 0;
			this.propsBucket = void 0;
			_initializerDefineProperty$2(this, "$$form", _descriptor$2, this);
			_initializerDefineProperty$2(this, "$$beanBehaviorsHolder", _descriptor2, this);
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				if (!_this.$$form) throw new Error(`FormField component should be used in Form component: ${_this.name}`);
				_this.bean._setBean("$$formField", _this);
				_this._formField = _this._createField();
				_this.propsBucket = _this.$computed(() => {
					return _this._getPropsBucket();
				});
				_this.$watch(() => _this.property, (newValue, oldValue) => {
					if (deepEqual(newValue, oldValue)) return;
					const options = _this._getFormFieldOptions();
					_this._formField.api.update(options);
					_this.form.resetField(_this.name);
				});
				yield _this.$$beanBehaviorsHolder.initialize({
					behaviorTag: void 0,
					behaviors: () => {
						return _this._getFieldBehaviors();
					}
				});
			})();
		}
		get form() {
			return this.$$form.form;
		}
		get field() {
			return this._formField;
		}
		get name() {
			return this.$props.name;
		}
		get property() {
			return this.$$form.getFieldProperty(this.name);
		}
		get fieldZodSchema() {
			return this.$$form.getFieldZodSchema(this.name);
		}
		get formMeta() {
			return this.$$form.formMeta;
		}
		get formProvider() {
			return this.$$form.formProvider;
		}
		setValue(value, disableNotifyChanged) {
			if (disableNotifyChanged === void 0) disableNotifyChanged = this.propsBucket.disableNotifyChanged;
			return this.$$form.setFieldValue(this.name, value, disableNotifyChanged);
		}
		handleBlur() {
			this.field.api.handleBlur();
		}
		getRenderContext() {
			const name = this.name;
			const propsBucket = this.propsBucket;
			const props = {
				key: name,
				name
			};
			props.class = propsBucket.class;
			props.readonly = propsBucket.readonly;
			const celScope = this.$$form.getFieldScope(this.name, {});
			return {
				propsBucket,
				props,
				celScope,
				jsxRenderContext: this.$$form.getFieldJsxRenderContext(this, celScope)
			};
		}
		_createField() {
			const field = markRaw(useField(this._getFormFieldOptions()));
			const fieldState = useStore(field.api.store, (state) => state);
			return {
				api: field.api,
				state: fieldState
			};
		}
		_getPropsBucket() {
			var _property$title, _this$$props, _this$$props2, _propsBucket$options$, _propsBucket$options, _propsBucket$options$2, _propsBucket$options2, _propsBucket$options$3, _propsBucket$options5, _this$formMeta;
			const property = this.property;
			const name = this.name;
			const propsTop = this._getFieldComponentPropsTop();
			const layoutOptions = Object.assign({
				bordered: this.scope.config.formFieldLayout.bordered,
				label: (_property$title = property === null || property === void 0 ? void 0 : property.title) !== null && _property$title !== void 0 ? _property$title : name
			}, this.$$form.$props.formFieldLayout, (_this$$props = this.$props) === null || _this$$props === void 0 ? void 0 : _this$$props.layout, propsTop === null || propsTop === void 0 ? void 0 : propsTop.layout);
			const presetOptions = Object.assign({}, (_this$$props2 = this.$props) === null || _this$$props2 === void 0 ? void 0 : _this$$props2.options, propsTop === null || propsTop === void 0 ? void 0 : propsTop.options);
			const propsBucket = Object.assign({ render: "Input" }, this.$props, propsTop, {
				layout: layoutOptions,
				options: presetOptions
			});
			if (propsBucket.layout.class || propsBucket.layout.style) {
				propsBucket.layout.class = this.$cssMerge(propsBucket.layout.class, this.$style(propsBucket.layout.style));
				delete propsBucket.layout.style;
			}
			const classTemp = (_propsBucket$options$ = (_propsBucket$options = propsBucket.options) === null || _propsBucket$options === void 0 ? void 0 : _propsBucket$options.class) !== null && _propsBucket$options$ !== void 0 ? _propsBucket$options$ : propsBucket.class;
			const styleTemp = (_propsBucket$options$2 = (_propsBucket$options2 = propsBucket.options) === null || _propsBucket$options2 === void 0 ? void 0 : _propsBucket$options2.style) !== null && _propsBucket$options$2 !== void 0 ? _propsBucket$options$2 : propsBucket.style;
			if (classTemp || styleTemp) {
				var _propsBucket$options3, _propsBucket$options4;
				propsBucket.class = this.$cssMerge(classTemp, this.$style(styleTemp));
				if ((_propsBucket$options3 = propsBucket.options) === null || _propsBucket$options3 === void 0 ? void 0 : _propsBucket$options3.class) delete propsBucket.options.class;
				if ((_propsBucket$options4 = propsBucket.options) === null || _propsBucket$options4 === void 0 ? void 0 : _propsBucket$options4.style) delete propsBucket.options.style;
				delete propsBucket.style;
			}
			const readonlyTemp = (_propsBucket$options$3 = (_propsBucket$options5 = propsBucket.options) === null || _propsBucket$options5 === void 0 ? void 0 : _propsBucket$options5.readonly) !== null && _propsBucket$options$3 !== void 0 ? _propsBucket$options$3 : propsBucket.readonly;
			if (!isNil(readonlyTemp)) {
				var _propsBucket$options6;
				propsBucket.readonly = readonlyTemp;
				if ((_propsBucket$options6 = propsBucket.options) === null || _propsBucket$options6 === void 0 ? void 0 : _propsBucket$options6.readonly) delete propsBucket.options.readonly;
			} else if (((_this$formMeta = this.formMeta) === null || _this$formMeta === void 0 ? void 0 : _this$formMeta.formMode) === "view") propsBucket.readonly = true;
			propsBucket.renderProvider = this.$$form.getRenderProvider(propsBucket.render);
			return propsBucket;
		}
		_getFieldComponentPropsTop() {
			if (this.$props["$$FieldProps"] === true) return;
			const celScope = this.$$form.getFieldScope(this.name);
			const jsxRenderContext = this.$$form.getFieldJsxRenderContext(this, celScope);
			return this.$$form.getFieldComponentPropsTop(this.name, celScope, jsxRenderContext);
		}
		_getFieldBehaviors() {
			const behaviors = {};
			if (this.$props.behaviors) Object.assign(behaviors, this.$props.behaviors);
			this._prepareBehaviorFormField(behaviors);
			this._prepareBehaviorFormFieldLayout(behaviors);
			return behaviors;
		}
		_prepareBehaviorFormField(behaviors) {
			var _this$formProvider$be;
			const behaviorFormField = (_this$formProvider$be = this.formProvider.behaviors) === null || _this$formProvider$be === void 0 ? void 0 : _this$formProvider$be.FormField;
			if (!behaviorFormField) return;
			behaviors[behaviorFormField] = {};
		}
		_prepareBehaviorFormFieldLayout(behaviors) {
			var _this$formProvider$be2;
			const behaviorFormFieldLayout = (_this$formProvider$be2 = this.formProvider.behaviors) === null || _this$formProvider$be2 === void 0 ? void 0 : _this$formProvider$be2.FormFieldLayout;
			if (!behaviorFormFieldLayout) return;
			behaviors[behaviorFormFieldLayout] = {};
		}
		_getFormFieldOptions() {
			var _this$$props$sys$defa, _this$$props$sys, _this$property;
			const defaultValue = isNil(this.$$form.getFieldValue(this.name)) ? (_this$$props$sys$defa = (_this$$props$sys = this.$props.sys) === null || _this$$props$sys === void 0 ? void 0 : _this$$props$sys.defaultValue) !== null && _this$$props$sys$defa !== void 0 ? _this$$props$sys$defa : (_this$property = this.property) === null || _this$property === void 0 ? void 0 : _this$property.default : void 0;
			const validators = this._getFormFieldOptionsValidators();
			return Object.assign({ defaultValue }, this.$props.sys, {
				name: this.name,
				form: this.$$form.form,
				validators
			});
		}
		_getFormFieldOptionsValidators() {
			var _validators$onDynamic, _this$$props$sys2;
			const zodSchemaField = this.fieldZodSchema;
			const validators = this.$props.validators;
			const validateOnDynamicDefault = (validators === null || validators === void 0 ? void 0 : validators.onDynamic) === void 0 && (validators === null || validators === void 0 ? void 0 : validators.onBlur) === void 0 && (validators === null || validators === void 0 ? void 0 : validators.onChange) === void 0;
			const validateOnDynamic = (_validators$onDynamic = validators === null || validators === void 0 ? void 0 : validators.onDynamic) !== null && _validators$onDynamic !== void 0 ? _validators$onDynamic : validateOnDynamicDefault;
			const validateOnBlur = validators === null || validators === void 0 ? void 0 : validators.onBlur;
			const validateOnChange = validators === null || validators === void 0 ? void 0 : validators.onChange;
			return Object.assign({}, {
				onDynamic: _normalizeValidateSchema(validateOnDynamic, zodSchemaField),
				onBlur: _normalizeValidateSchema(validateOnBlur, zodSchemaField),
				onChange: _normalizeValidateSchema(validateOnChange, zodSchemaField)
			}, (_this$$props$sys2 = this.$props.sys) === null || _this$$props$sys2 === void 0 ? void 0 : _this$$props$sys2.validators);
		}
	}, _ControllerFormField.$propsDefault = {}, _ControllerFormField.$componentOptions = { inheritAttrs: false }, _ControllerFormField), _descriptor$2 = _applyDecoratedDescriptor$2(_class2$2.prototype, "$$form", [_dec3$2, _dec4$2], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _descriptor2 = _applyDecoratedDescriptor$2(_class2$2.prototype, "$$beanBehaviorsHolder", [_dec5, _dec6], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2$2)) || _class$5) || _class$5);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-form/src/component/formFieldBlank/controller.tsx
function _initializerDefineProperty$1(e, i, r, l) {
	r && Object.defineProperty(e, i, {
		enumerable: r.enumerable,
		configurable: r.configurable,
		writable: r.writable,
		value: r.initializer ? r.initializer.call(l) : void 0
	});
}
function _applyDecoratedDescriptor$1(i, e, r, n, l) {
	var a = {};
	return Object.keys(n).forEach(function(i) {
		a[i] = n[i];
	}), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function(r, n) {
		return n(i, e, r) || r;
	}, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a;
}
var _dec$4, _dec2$4, _dec3$1, _dec4$1, _class$4, _class2$1, _descriptor$1, _ControllerFormFieldBlank, ControllerFormFieldBlank;
var init_controller$1 = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	init_controller$3();
	ControllerFormFieldBlank = (_dec$4 = Controller(), _dec2$4 = BeanInfo({ module: "a-form" }), _dec3$1 = Use({ injectionScope: "host" }), _dec4$1 = Reflect.metadata("design:type", typeof ControllerForm$1 === "undefined" ? Object : ControllerForm$1), _dec$4(_class$4 = _dec2$4(_class$4 = (_class2$1 = (_ControllerFormFieldBlank = class ControllerFormFieldBlank extends BeanControllerBase {
		constructor(...args) {
			super(...args);
			_initializerDefineProperty$1(this, "$$form", _descriptor$1, this);
		}
		__init__() {
			return _asyncToGenerator(function* () {})();
		}
		render() {
			if (this.$slotDefault) return this.$slotDefault(this.$$form);
		}
	}, _ControllerFormFieldBlank.$propsDefault = {}, _ControllerFormFieldBlank.$componentOptions = {
		inheritAttrs: false,
		deepExtendDefault: true
	}, _ControllerFormFieldBlank), _descriptor$1 = _applyDecoratedDescriptor$1(_class2$1.prototype, "$$form", [_dec3$1, _dec4$1], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2$1)) || _class$4) || _class$4);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-form/src/component/formFieldPreset/controller.tsx
function _initializerDefineProperty(e, i, r, l) {
	r && Object.defineProperty(e, i, {
		enumerable: r.enumerable,
		configurable: r.configurable,
		writable: r.writable,
		value: r.initializer ? r.initializer.call(l) : void 0
	});
}
function _applyDecoratedDescriptor(i, e, r, n, l) {
	var a = {};
	return Object.keys(n).forEach(function(i) {
		a[i] = n[i];
	}), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function(r, n) {
		return n(i, e, r) || r;
	}, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a;
}
var _dec$3, _dec2$3, _dec3, _dec4, _class$3, _class2, _descriptor, _ControllerFormFieldPreset, ControllerFormFieldPreset;
var init_controller = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	ControllerFormFieldPreset = (_dec$3 = Controller(), _dec2$3 = BeanInfo({ module: "a-form" }), _dec3 = Use({ injectionScope: "host" }), _dec4 = Reflect.metadata("design:type", typeof ControllerForm === "undefined" ? Object : ControllerForm), _dec$3(_class$3 = _dec2$3(_class$3 = (_class2 = (_ControllerFormFieldPreset = class ControllerFormFieldPreset extends BeanControllerBase {
		constructor(...args) {
			super(...args);
			_initializerDefineProperty(this, "$$form", _descriptor, this);
		}
		__init__() {
			return _asyncToGenerator(function* () {})();
		}
		render() {
			const name = this.$props.name;
			if (!name) throw new Error(`should specify field name`);
			return this.$$form.renderField(name, this.$props);
		}
	}, _ControllerFormFieldPreset.$propsDefault = {}, _ControllerFormFieldPreset.$componentOptions = {
		inheritAttrs: false,
		deepExtendDefault: true
	}, _ControllerFormFieldPreset), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "$$form", [_dec3, _dec4], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2)) || _class$3) || _class$3);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-form/src/component/form/render.tsx
var _dec$2, _dec2$2, _class$2, RenderForm;
var init_render$1 = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_src$2();
	RenderForm = (_dec$2 = Render(), _dec2$2 = BeanInfo({ module: "a-form" }), _dec$2(_class$2 = _dec2$2(_class$2 = class RenderForm extends BeanRenderBase {
		_renderSchema() {
			if (!this.properties) return;
			const children = [];
			for (const property of this.properties) {
				const child = this._renderFieldByKey(property.key);
				if (child) if (Array.isArray(child)) children.push(...child);
				else children.push(child);
			}
			return children;
		}
		_renderChildren() {
			var _this$$props$slotHead, _this$$props, _this$$props$slotFoot, _this$$props2;
			const children = [];
			children.push((_this$$props$slotHead = (_this$$props = this.$props).slotHeader) === null || _this$$props$slotHead === void 0 ? void 0 : _this$$props$slotHead.call(_this$$props, this));
			const bodyInner = this._renderBodyInner();
			if (this.$props.slotBody) children.push(this.$props.slotBody(bodyInner, this));
			else children.push(bodyInner);
			children.push((_this$$props$slotFoot = (_this$$props2 = this.$props).slotFooter) === null || _this$$props$slotFoot === void 0 ? void 0 : _this$$props$slotFoot.call(_this$$props2, this));
			return children;
		}
		_renderBodyInner() {
			const FormTag = this.$props.formTag;
			return this.$slotDefault ? this.$slotDefault(this) : createVNode(Fragment, null, [this._renderSchema(), FormTag === "form" && createVNode("button", {
				"type": "submit",
				"style": { display: "none" }
			}, null)]);
		}
		_renderProps() {
			const FormTag = this.$props.formTag;
			const props = {};
			if (this.$props.inline) props.class = "inline";
			if (FormTag === "form") props.onSubmit = (e) => {
				if (this.$props.onFormSubmit) this.$props.onFormSubmit(e, this);
				else {
					e.preventDefault();
					e.stopPropagation();
					this.submit();
				}
			};
			return props;
		}
		render() {
			const FormTag = this.$props.formTag;
			const props = this._renderProps();
			const children = this._renderChildren();
			if (this.$props.slotWrapper) return h(FormTag, props, this.$props.slotWrapper(children, this));
			return h(FormTag, props, children);
		}
	}) || _class$2) || _class$2);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-form/src/.metadata/component/form.ts
var ZForm;
var init_form$1 = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller$3();
	init_render$1();
	ZForm = defineComponent((_props) => {
		useController(ControllerForm$1, RenderForm, void 0);
		return () => {};
	}, prepareComponentOptions());
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-form/src/component/formField/render.tsx
var _dec$1, _dec2$1, _class$1, RenderFormField;
var init_render = __esmMin((() => {
	init_src$1();
	init_src$2();
	RenderFormField = (_dec$1 = Render(), _dec2$1 = BeanInfo({ module: "a-form" }), _dec$1(_class$1 = _dec2$1(_class$1 = class RenderFormField extends BeanRenderBase {
		render() {
			const renderContext = this.getRenderContext();
			return this.$$beanBehaviorsHolder.render((renderContext) => {
				return this._renderSlotDefault(renderContext);
			}, renderContext);
		}
		_renderSlotDefault(renderContext) {
			if (this.$slotDefault) return this.$slotDefault(renderContext, this[SymbolController]);
			return this.$$form.zovaJsx.render(renderContext.propsBucket.render, renderContext.props, renderContext.celScope, renderContext.jsxRenderContext);
		}
	}) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-form/src/.metadata/component/formField.ts
var ZFormField;
var init_formField = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller$2();
	init_render();
	ZFormField = defineComponent((_props) => {
		useController(ControllerFormField, RenderFormField, void 0);
		return () => {};
	}, prepareComponentOptions(ControllerFormField.$componentOptions));
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-form/src/.metadata/component/formFieldBlank.ts
var ZFormFieldBlank;
var init_formFieldBlank = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller$1();
	ZFormFieldBlank = defineComponent((_props) => {
		useController(ControllerFormFieldBlank, void 0, void 0);
		return () => {};
	}, prepareComponentOptions(ControllerFormFieldBlank.$componentOptions));
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-form/src/.metadata/component/formFieldPreset.ts
var ZFormFieldPreset;
var init_formFieldPreset = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller();
	ZFormFieldPreset = defineComponent((_props) => {
		useController(ControllerFormFieldPreset, void 0, void 0);
		return () => {};
	}, prepareComponentOptions(ControllerFormFieldPreset.$componentOptions));
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-form/src/config/config.ts
var config;
var init_config = __esmMin((() => {
	config = (_sys) => {
		return { formFieldLayout: { bordered: true } };
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-form/src/.metadata/index.ts
/** config: end */
/** scope: begin */
var _dec, _dec2, _class, components, ScopeModuleAForm;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_controller$3();
	init_controller$2();
	init_controller$1();
	init_controller();
	init_form$1();
	init_form$1();
	init_formField();
	init_formField();
	init_formFieldBlank();
	init_formFieldBlank();
	init_formFieldPreset();
	init_formFieldPreset();
	init_render$1();
	init_render();
	init_config();
	init_src$2();
	components = {
		"form": ZForm,
		"formField": ZFormField,
		"formFieldBlank": ZFormFieldBlank,
		"formFieldPreset": ZFormFieldPreset
	};
	ScopeModuleAForm = (_dec = Scope(), _dec2 = BeanInfo({ module: "a-form" }), _dec(_class = _dec2(_class = class ScopeModuleAForm extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite-vendor/a-zova/modules/a-form/src/lib/beanControllerPageFormBase.ts
var BeanControllerPageFormBase;
var init_beanControllerPageFormBase = __esmMin((() => {
	init_esm();
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_asyncToGenerator();
	BeanControllerPageFormBase = class extends BeanControllerPageBase {
		constructor(...args) {
			super(...args);
			this.form = void 0;
			this.formState = void 0;
		}
		submit(_submitMeta) {
			return _asyncToGenerator(function* () {
				throw new Error("should implement submit");
			})();
		}
		reset(_values, _opts) {
			throw new Error("should implement reset");
		}
		$useForm(opts) {
			return this.ctx.util.instanceScope(() => {
				return markRaw(useForm(opts));
			});
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-form/src/lib/utils.ts
function formMetaFromFormScene(formScene) {
	if (formScene === "view") return {
		formScene,
		formMode: "view",
		editMode: void 0
	};
	if (formScene === "create") return {
		formScene,
		formMode: "edit",
		editMode: "create"
	};
	if (formScene === "edit") return {
		formScene,
		formMode: "edit",
		editMode: "update"
	};
	throw new Error("invalid parameters");
}
function formSceneFromFormMeta(formMeta) {
	if (formMeta.formMode === "view") return "view";
	if (formMeta.formMode === "edit" && formMeta.editMode === "create") return "create";
	if (formMeta.formMode === "edit" && formMeta.editMode === "update") return "edit";
	if (formMeta.formMode === "edit" && formMeta.editMode === void 0) return "edit";
}
var init_utils = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-form/src/lib/index.ts
var init_lib = __esmMin((() => {
	init_beanControllerFormBase();
	init_beanControllerPageFormBase();
	init_utils();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-form/src/types/form.ts
var init_form = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-form/src/types/index.ts
var init_types = __esmMin((() => {
	init_form();
	init_formField$1();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-form/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	BeanControllerFormBase: () => BeanControllerFormBase,
	BeanControllerPageFormBase: () => BeanControllerPageFormBase,
	ControllerForm: () => ControllerForm$1,
	ControllerFormField: () => ControllerFormField,
	ControllerFormFieldBlank: () => ControllerFormFieldBlank,
	ControllerFormFieldPreset: () => ControllerFormFieldPreset,
	RenderForm: () => RenderForm,
	RenderFormField: () => RenderFormField,
	ScopeModuleAForm: () => ScopeModuleAForm,
	ZForm: () => ZForm,
	ZFormField: () => ZFormField,
	ZFormFieldBlank: () => ZFormFieldBlank,
	ZFormFieldPreset: () => ZFormFieldPreset,
	components: () => components,
	config: () => config,
	constFieldProps: () => constFieldProps,
	formMetaFromFormScene: () => formMetaFromFormScene,
	formSceneFromFormMeta: () => formSceneFromFormMeta
});
var init_src = __esmMin((() => {
	init__metadata();
	init_lib();
	init_types();
}));
//#endregion
export { formSceneFromFormMeta as i, src_exports as n, formMetaFromFormScene as r, init_src as t };
