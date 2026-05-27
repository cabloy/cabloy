import { n as __esmMin } from "./rolldown-runtime-lkMnaVCm.js";
import { C as onMounted, d as defineComponent, k as watch, o as computed, p as h, w as onUnmounted } from "./vue-t5FcxkD3.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
import { d as _objectSpread2, f as init_objectSpread2 } from "./fecha-DmopMB3M.js";
import { a as FormApi, i as FieldApi, n as useStore, r as init_esm$1, t as init_esm$2 } from "./esm-D7Ka3WAI.js";
//#region node_modules/.pnpm/@tanstack+vue-form@1.32.0_vue@3.5.34_typescript@5.9.3_/node_modules/@tanstack/vue-form/dist/esm/useField.js
function useField(opts) {
	const fieldApi = new FieldApi(_objectSpread2(_objectSpread2({}, opts), {}, {
		form: opts.form,
		name: opts.name
	}));
	const reactiveStateValue = useStore(fieldApi.store, opts.mode === "array" ? (state) => state.meta._arrayVersion || 0 : (state) => state.value);
	const reactiveMetaIsTouched = useStore(fieldApi.store, (state) => state.meta.isTouched);
	const reactiveMetaIsBlurred = useStore(fieldApi.store, (state) => state.meta.isBlurred);
	const reactiveMetaIsDirty = useStore(fieldApi.store, (state) => state.meta.isDirty);
	const reactiveMetaErrorMap = useStore(fieldApi.store, (state) => state.meta.errorMap);
	const reactiveMetaErrorSourceMap = useStore(fieldApi.store, (state) => state.meta.errorSourceMap);
	const reactiveMetaIsValidating = useStore(fieldApi.store, (state) => state.meta.isValidating);
	const fieldState = computed(() => {
		const trackedValue = reactiveStateValue.value;
		const isTouched = reactiveMetaIsTouched.value;
		const isBlurred = reactiveMetaIsBlurred.value;
		const isDirty = reactiveMetaIsDirty.value;
		const errorMap = reactiveMetaErrorMap.value;
		const errorSourceMap = reactiveMetaErrorSourceMap.value;
		const isValidating = reactiveMetaIsValidating.value;
		return {
			value: opts.mode === "array" ? fieldApi.state.value : trackedValue,
			meta: _objectSpread2(_objectSpread2({}, fieldApi.state.meta), {}, {
				isTouched,
				isBlurred,
				isDirty,
				errorMap,
				errorSourceMap,
				isValidating
			})
		};
	});
	const extendedFieldApi = computed(() => {
		return _objectSpread2(_objectSpread2({}, fieldApi), {}, { get state() {
			return fieldState.value;
		} });
	});
	let cleanup;
	onMounted(() => {
		cleanup = fieldApi.mount();
	});
	onUnmounted(() => {
		cleanup();
	});
	watch(() => opts, () => {
		fieldApi.update(_objectSpread2(_objectSpread2({}, opts), {}, { form: opts.form }));
	});
	return {
		api: extendedFieldApi.value,
		state: fieldState.value
	};
}
var Field;
var init_useField = __esmMin((() => {
	init_esm$1();
	init_esm$2();
	init_vue_runtime_esm_bundler();
	init_objectSpread2();
	Field = defineComponent((fieldOptions, context) => {
		const fieldApi = useField(_objectSpread2(_objectSpread2({}, fieldOptions), context.attrs));
		return () => context.slots.default({
			field: fieldApi.api,
			state: fieldApi.state
		});
	}, {
		name: "Field",
		inheritAttrs: false
	});
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+vue-form@1.32.0_vue@3.5.34_typescript@5.9.3_/node_modules/@tanstack/vue-form/dist/esm/useForm.js
function useForm(opts) {
	const formApi = (() => {
		const api = new FormApi(opts);
		const extendedApi = api;
		extendedApi.Field = defineComponent((props, context) => {
			return () => h(Field, _objectSpread2(_objectSpread2(_objectSpread2({}, props), context.attrs), {}, { form: api }), context.slots);
		}, {
			name: "APIField",
			inheritAttrs: false
		});
		extendedApi.useStore = (selector) => {
			return useStore(api.store, selector);
		};
		extendedApi.Subscribe = defineComponent((props, context) => {
			var _allProps$selector;
			const selector = (_allProps$selector = _objectSpread2(_objectSpread2({}, props), context.attrs).selector) !== null && _allProps$selector !== void 0 ? _allProps$selector : ((state) => state);
			const data = useStore(api.store, selector);
			return () => context.slots.default(data.value);
		}, {
			name: "Subscribe",
			inheritAttrs: false
		});
		return extendedApi;
	})();
	onMounted(formApi.mount);
	formApi.update(opts);
	return formApi;
}
var init_useForm = __esmMin((() => {
	init_esm$1();
	init_esm$2();
	init_vue_runtime_esm_bundler();
	init_useField();
	init_objectSpread2();
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+vue-form@1.32.0_vue@3.5.34_typescript@5.9.3_/node_modules/@tanstack/vue-form/dist/esm/index.js
var init_esm = __esmMin((() => {
	init_esm$1();
	init_esm$2();
	init_useField();
	init_useForm();
}));
//#endregion
export { useForm as n, useField as r, init_esm as t };
