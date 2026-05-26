import type { IComponentOptions, TypeEventOff } from 'zova';
import type {
  ICaptchaData,
  ICaptchaSceneRecord,
  IResourceFormFieldOptionsBase,
} from 'zova-module-a-openapi';

import { classes } from 'typestyle';
import { BeanControllerBase, ClientOnly, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ControllerForm, ZFormField, type IFormFieldComponentOptions } from 'zova-module-a-form';
import { IResourceFormFieldInputOptions } from 'zova-module-basic-input';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'basic-captcha:formFieldCaptcha'?: IResourceFormFieldCaptchaOptions;
  }

  export interface ICaptchaSceneRecord {
    'captcha-simple:simple': never;
  }
}

export interface IResourceFormFieldCaptchaOptions extends IResourceFormFieldOptionsBase {
  scene?: keyof ICaptchaSceneRecord;
}

export interface ControllerFormFieldCaptchaProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldCaptchaOptions;
}

@Controller()
export class ControllerFormFieldCaptcha extends BeanControllerBase {
  static $propsDefault = {
    options: {
      scene: 'captcha-simple:simple',
    },
  };
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  eventFormSubmission: TypeEventOff;
  captchaData?: ICaptchaData;

  @Use({ injectionScope: 'host' })
  $$form: ControllerForm;

  protected async __init__() {
    // event
    if (process.env.CLIENT) {
      this.eventFormSubmission = this.app.meta.event.on('a-form:formSubmission', (data, next) => {
        if (data.form.formId === this.$$form.form.formId && data.error) {
          this.refreshCaptchaData();
        }
        return next();
      });
    }
    // captcha data
    if (process.env.CLIENT) {
      this.createCaptchaData();
    }
  }

  protected __dispose__() {
    if (this.eventFormSubmission) {
      this.eventFormSubmission();
    }
  }

  get captchaScene() {
    return this.$props.options!.scene!;
  }

  private async createCaptchaData() {
    this.captchaData = await this.$api.captcha.create(
      {
        scene: this.captchaScene,
      },
      { authToken: false },
    );
    this.setFieldCaptchaData();
  }

  private async refreshCaptchaData() {
    this.captchaData = await this.$api.captcha.refresh(
      {
        id: this.captchaData!.id,
        scene: this.captchaScene,
      },
      { authToken: false },
    );
    this.setFieldCaptchaData();
  }

  private setFieldCaptchaData() {
    this.$$form.setFieldValue(this.$props.name!, {
      id: this.captchaData?.id,
      token: this.captchaData?.token,
    });
  }

  protected render() {
    return (
      <>
        <ZFormField
          {...this.$props}
          slotDefault={({ propsBucket, props }, $$formField) => {
            const className = !propsBucket.needHandleBorder
              ? props.class
              : classes(
                  props.class,
                  'input',
                  !$$formField.field.state.meta.isValid && 'input-error',
                );
            const propsNew: Omit<IResourceFormFieldInputOptions, 'style'> = {
              type: 'text',
              placeholder: this.scope.locale.InputCaptcha(),
              onInput: (e: Event) => {
                const token = (e.target as HTMLInputElement).value;
                if (this.captchaData) {
                  this.captchaData.token = token;
                }
                $$formField.setValue({
                  id: this.captchaData?.id,
                  token,
                });
              },
              onBlur: () => {
                $$formField.handleBlur();
              },
              value: this.captchaData?.token,
              ...props,
              class: className,
            };
            return <input {...propsNew}></input>;
          }}
        ></ZFormField>
        <label class="flex items-center gap-2 w-full" style={{ height: '50px' }}>
          <ClientOnly>
            {this.captchaData?.payload && (
              <img
                class="cursor-pointer"
                src={this.captchaData!.payload as string}
                onClick={() => {
                  this.refreshCaptchaData();
                }}
              ></img>
            )}
          </ClientOnly>
        </label>
      </>
    );
  }
}
