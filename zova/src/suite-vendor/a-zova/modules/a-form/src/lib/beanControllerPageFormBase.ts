import type {
  FormApi,
  FormAsyncValidateOrFn,
  FormOptions,
  FormValidateOrFn,
  VueFormApi,
} from '@tanstack/vue-form';

import { useForm } from '@tanstack/vue-form';
import { markRaw } from 'vue';
import { BeanControllerPageBase } from 'zova';

import { TypeForm } from '../types/form.js';

export class BeanControllerPageFormBase<
  TFormData extends {} = {},
  TSubmitMeta = never,
> extends BeanControllerPageBase {
  form: TypeForm<TFormData, TSubmitMeta>;
  formState: TypeForm<TFormData>['state'];

  public async submit(_submitMeta?: TSubmitMeta): Promise<boolean> {
    throw new Error('should implement submit');
  }

  public reset(_values?: TFormData, _opts?: { keepDefaultValues?: boolean }): TFormData {
    throw new Error('should implement reset');
  }

  public $useForm<
    TParentData,
    TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
    TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
    TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
    TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
    TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
    TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
    TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
    TFormOnDynamic extends undefined | FormValidateOrFn<TParentData>,
    TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
    TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
    TSubmitMeta,
  >(
    opts?: FormOptions<
      TParentData,
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
    TParentData,
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
      TParentData,
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
