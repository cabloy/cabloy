import type { IComponentOptions } from 'zova';
import type {
  IJsxRenderContextDetails,
  IResourceDetailsActionBulkOptionsBase,
} from 'zova-module-a-openapi';
import type { IModalDialogOptions, IModalDialogRenderContext } from 'zova-module-basic-app';

import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { TypeFormOnSubmitData } from 'zova-module-a-form';
import { IIconRecord } from 'zova-module-a-icon';

import { ServiceDetail } from '../../service/detail.jsx';

declare module 'zova-module-a-openapi' {
  export interface IResourceDetailsActionBulkRecord {
    'basic-details:actionCreate'?: ControllerActionCreateProps;
  }
}

export interface ControllerActionCreateProps extends IResourceDetailsActionBulkOptionsBase {
  dialogOptions?: IModalDialogOptions & { icon?: keyof IIconRecord; title?: string };
}

@Controller()
export class ControllerActionCreate extends BeanControllerBase {
  static $propsDefault = { class: 'btn btn-info join-item' };
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextDetails;

  protected render() {
    return (
      <button
        class={this.$props.class}
        type="button"
        onClick={async () => {
          const { $$details } = this.$$renderContext;
          const serverDetail = await this.bean._newBean(ServiceDetail, true, {
            $host: this,
            locale: this.scope.locale,
            schema: $$details.schemaForm,
            data: {},
            formScene: 'create',
            schemaScene: 'form-create',
            icon: this.$props.dialogOptions?.icon,
            title: this.$props.dialogOptions?.title ?? this.scope.locale.AddDetail(),
            dialogOptions: this.$props.dialogOptions,
            onSubmitData: (
              data: TypeFormOnSubmitData<Record<string, any>>,
              dialog: IModalDialogRenderContext,
            ) => {
              const detailItem = data.value;
              $$details.data = [...$$details.data, detailItem];
              dialog.close();
            },
          });
          serverDetail.openDialogForm();
        }}
      >
        {this.scope.locale.AddDetail()}
      </button>
    );
  }
}
