import { TypeFormOnSubmitData } from 'zova-module-a-form';
import { IIconRecord } from 'zova-module-a-icon';
import { TypeFormScene, TypeFormSchemaScene } from 'zova-module-a-openapi';
import { AppModalItem, IModalDialogOptions } from 'zova-module-basic-app';

export interface IDialogFormOptions<TData extends {} = {}> {
  locale: {
    Cancel: () => string;
    OK: () => string;
  };
  schema: any;
  data: TData;
  formScene: TypeFormScene;
  schemaScene: TypeFormSchemaScene;
  dialogOptions?: IModalDialogOptions;
  icon?: keyof IIconRecord;
  title: string;
  onSubmitData: (
    data: TypeFormOnSubmitData<TData>,
    dialogInstance: AppModalItem,
  ) => void | Promise<void>;
}
