import type {
  FormApi,
  FormAsyncValidateOrFn,
  FormOptions,
  FormValidateOrFn,
  VueFormApi,
} from '@tanstack/vue-form';

import { useForm } from '@tanstack/vue-form';
import { markRaw } from 'vue';
import { BeanControllerBase } from 'zova';

import { TypeForm } from '../types/form.js';

export class BeanControllerFormBase<
  TFormData extends {} = {},
  TSubmitMeta = never,
> extends BeanControllerBase {
  form: TypeForm<TFormData, TSubmitMeta>;
  formState: TypeForm<TFormData>['state'];

  public async submit(_submitMeta?: TSubmitMeta): Promise<boolean> {
    throw new Error('should implement submit');
  }

  public reset(_values?: TFormData, _opts?: { keepDefaultValues?: boolean }): TFormData {
    throw new Error('should implement reset');
  }

  public $useForm<
    TFormData,
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
  >(
    opts?: FormOptions<
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
    >,
  ): FormApi<
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
  > &
    VueFormApi<
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
    > {
    return this.ctx.util.instanceScope(() => {
      return markRaw(useForm(opts));
    });
  }
}
