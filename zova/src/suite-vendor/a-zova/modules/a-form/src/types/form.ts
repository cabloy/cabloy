import type {
  DeepKeys,
  DeepValue,
  FieldAsyncValidateOrFn,
  FieldOptions,
  FieldValidateOrFn,
  FormApi,
  FormAsyncValidateOrFn,
  FormOptions,
  FormState,
  FormValidateOrFn,
  useField,
  useForm,
} from '@tanstack/vue-form';
import type { UnwrapNestedRefs } from 'vue';

import type { ControllerForm } from '../component/form/controller.jsx';

export type TypeForm<
  TFormData = unknown,
  TSubmitMeta = never,
  TFormOnMount extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnChange extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnBlur extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnSubmit extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnDynamic extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnServer extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
> = ReturnType<
  typeof useForm<
    TFormData,
    TFormOnMount,
    TFormOnChange,
    TFormOnChangeAsync,
    TFormOnBlur,
    TFormOnBlurAsync,
    TFormOnSubmit,
    TFormOnSubmitAsync,
    TFormOnDynamic,
    TFormOnDynamicAsync,
    TFormOnServer,
    TSubmitMeta
  >
>;

export type TypeBehaviorFormOptions<
  TFormData = unknown,
  TSubmitMeta = never,
  TFormOnMount extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnChange extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnBlur extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnSubmit extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnDynamic extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnServer extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
> = FormOptions<
  TFormData,
  TFormOnMount,
  TFormOnChange,
  TFormOnChangeAsync,
  TFormOnBlur,
  TFormOnBlurAsync,
  TFormOnSubmit,
  TFormOnSubmitAsync,
  TFormOnDynamic,
  TFormOnDynamicAsync,
  TFormOnServer,
  TSubmitMeta
>;

export type TypeFormField<
  TParentData = unknown,
  TName extends DeepKeys<TParentData> = DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
  TParentSubmitMeta = never,
  TOnMount extends undefined | FieldValidateOrFn<TParentData, TName, TData> =
    | undefined
    | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChange extends undefined | FieldValidateOrFn<TParentData, TName, TData> =
    | undefined
    | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChangeAsync extends undefined | FieldAsyncValidateOrFn<TParentData, TName, TData> =
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnBlur extends undefined | FieldValidateOrFn<TParentData, TName, TData> =
    | undefined
    | FieldValidateOrFn<TParentData, TName, TData>,
  TOnBlurAsync extends undefined | FieldAsyncValidateOrFn<TParentData, TName, TData> =
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnSubmit extends undefined | FieldValidateOrFn<TParentData, TName, TData> =
    | undefined
    | FieldValidateOrFn<TParentData, TName, TData>,
  TOnSubmitAsync extends undefined | FieldAsyncValidateOrFn<TParentData, TName, TData> =
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnDynamic extends undefined | FieldValidateOrFn<TParentData, TName, TData> =
    | undefined
    | FieldValidateOrFn<TParentData, TName, TData>,
  TOnDynamicAsync extends undefined | FieldAsyncValidateOrFn<TParentData, TName, TData> =
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TFormOnMount extends undefined | FormValidateOrFn<TParentData> =
    | undefined
    | FormValidateOrFn<TParentData>,
  TFormOnChange extends undefined | FormValidateOrFn<TParentData> =
    | undefined
    | FormValidateOrFn<TParentData>,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData> =
    | undefined
    | FormAsyncValidateOrFn<TParentData>,
  TFormOnBlur extends undefined | FormValidateOrFn<TParentData> =
    | undefined
    | FormValidateOrFn<TParentData>,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData> =
    | undefined
    | FormAsyncValidateOrFn<TParentData>,
  TFormOnSubmit extends undefined | FormValidateOrFn<TParentData> =
    | undefined
    | FormValidateOrFn<TParentData>,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData> =
    | undefined
    | FormAsyncValidateOrFn<TParentData>,
  TFormOnDynamic extends undefined | FormValidateOrFn<TParentData> =
    | undefined
    | FormValidateOrFn<TParentData>,
  TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TParentData> =
    | undefined
    | FormAsyncValidateOrFn<TParentData>,
  TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData> =
    | undefined
    | FormAsyncValidateOrFn<TParentData>,
> = UnwrapNestedRefs<
  ReturnType<
    typeof useField<
      TParentData,
      TName,
      TData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnDynamic,
      TOnDynamicAsync,
      TFormOnMount,
      TFormOnChange,
      TFormOnChangeAsync,
      TFormOnBlur,
      TFormOnBlurAsync,
      TFormOnSubmit,
      TFormOnSubmitAsync,
      TFormOnDynamic,
      TFormOnDynamicAsync,
      TFormOnServer,
      TParentSubmitMeta
    >
  >
>;

export type TypeBehaviorFormFieldOptions<
  TParentData = unknown,
  TName extends DeepKeys<TParentData> = DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
  TOnMount extends undefined | FieldValidateOrFn<TParentData, TName, TData> =
    | undefined
    | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChange extends undefined | FieldValidateOrFn<TParentData, TName, TData> =
    | undefined
    | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChangeAsync extends undefined | FieldAsyncValidateOrFn<TParentData, TName, TData> =
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnBlur extends undefined | FieldValidateOrFn<TParentData, TName, TData> =
    | undefined
    | FieldValidateOrFn<TParentData, TName, TData>,
  TOnBlurAsync extends undefined | FieldAsyncValidateOrFn<TParentData, TName, TData> =
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnSubmit extends undefined | FieldValidateOrFn<TParentData, TName, TData> =
    | undefined
    | FieldValidateOrFn<TParentData, TName, TData>,
  TOnSubmitAsync extends undefined | FieldAsyncValidateOrFn<TParentData, TName, TData> =
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnDynamic extends undefined | FieldValidateOrFn<TParentData, TName, TData> =
    | undefined
    | FieldValidateOrFn<TParentData, TName, TData>,
  TOnDynamicAsync extends undefined | FieldAsyncValidateOrFn<TParentData, TName, TData> =
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
> = FieldOptions<
  TParentData,
  TName,
  TData,
  TOnMount,
  TOnChange,
  TOnChangeAsync,
  TOnBlur,
  TOnBlurAsync,
  TOnSubmit,
  TOnSubmitAsync,
  TOnDynamic,
  TOnDynamicAsync
>;

export interface TypeFormOnSubmitData<
  TFormData = unknown,
  TSubmitMeta = never,
  TFormOnMount extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnChange extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnBlur extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnSubmit extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnDynamic extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnServer extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
> {
  value: TFormData;
  formApi: FormApi<
    TFormData,
    TFormOnMount,
    TFormOnChange,
    TFormOnChangeAsync,
    TFormOnBlur,
    TFormOnBlurAsync,
    TFormOnSubmit,
    TFormOnSubmitAsync,
    TFormOnDynamic,
    TFormOnDynamicAsync,
    TFormOnServer,
    TSubmitMeta
  >;
  meta: TSubmitMeta;
}

export type TypeFormOnSubmitInvalid<
  TFormData extends {} = {},
  TSubmitMeta = never,
  TFormOnMount extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnChange extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnBlur extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnSubmit extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnDynamic extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnServer extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
> = (
  props: TypeFormOnSubmitData<
    TFormData,
    TSubmitMeta,
    TFormOnMount,
    TFormOnChange,
    TFormOnChangeAsync,
    TFormOnBlur,
    TFormOnBlurAsync,
    TFormOnSubmit,
    TFormOnSubmitAsync,
    TFormOnDynamic,
    TFormOnDynamicAsync,
    TFormOnServer
  >,
  form: ControllerForm<TFormData, TSubmitMeta>,
) => void;

export type TypeFormOnSubmit<
  TFormData extends {} = {},
  TSubmitMeta = never,
  TFormOnMount extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnChange extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnBlur extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnSubmit extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnDynamic extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnServer extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
> = (
  props: TypeFormOnSubmitData<
    TFormData,
    TSubmitMeta,
    TFormOnMount,
    TFormOnChange,
    TFormOnChangeAsync,
    TFormOnBlur,
    TFormOnBlurAsync,
    TFormOnSubmit,
    TFormOnSubmitAsync,
    TFormOnDynamic,
    TFormOnDynamicAsync,
    TFormOnServer
  >,
  form: ControllerForm<TFormData, TSubmitMeta>,
) => any | Promise<any>;

export type TypeFormState<
  TFormData = unknown,
  TFormOnMount extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnChange extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnBlur extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnSubmit extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnDynamic extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnServer extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
> = FormState<
  TFormData,
  TFormOnMount,
  TFormOnChange,
  TFormOnChangeAsync,
  TFormOnBlur,
  TFormOnBlurAsync,
  TFormOnSubmit,
  TFormOnSubmitAsync,
  TFormOnDynamic,
  TFormOnDynamicAsync,
  TFormOnServer
>;

export type TypeFormOnShowError<
  TFormData extends {} = {},
  TSubmitMeta = never,
  TFormOnMount extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnChange extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnBlur extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnSubmit extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnDynamic extends undefined | FormValidateOrFn<TFormData> =
    | undefined
    | FormValidateOrFn<TFormData>,
  TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
  TFormOnServer extends undefined | FormAsyncValidateOrFn<TFormData> =
    | undefined
    | FormAsyncValidateOrFn<TFormData>,
> = (
  {
    data,
    error,
  }: {
    data: TypeFormOnSubmitData<
      TFormData,
      TSubmitMeta,
      TFormOnMount,
      TFormOnChange,
      TFormOnChangeAsync,
      TFormOnBlur,
      TFormOnBlurAsync,
      TFormOnSubmit,
      TFormOnSubmitAsync,
      TFormOnDynamic,
      TFormOnDynamicAsync,
      TFormOnServer
    >;
    error: Error;
  },
  form: ControllerForm<TFormData, TSubmitMeta>,
) => void;

export interface RevalidateLogicProps {
  mode?: 'change' | 'blur' | 'submit';
  modeAfterSubmission?: 'change' | 'blur' | 'submit';
}

export interface IEventFormSubmission {
  form: TypeForm;
  data: {};
  error?: Error;
}

declare module 'zova' {
  export interface IEventRecord {
    'a-form:formSubmission': { data: IEventFormSubmission; result: boolean | undefined };
  }
}

export interface IFormScope {}
