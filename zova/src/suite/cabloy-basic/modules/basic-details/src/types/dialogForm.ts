import { TypeFormOnSubmitData } from 'zova-module-a-form';
import { IIconRecord } from 'zova-module-a-icon';
import { TypeFormScene, TypeFormSchemaScene } from 'zova-module-a-openapi';
import { IModalDialogOptions, IModalDialogRenderContext } from 'zova-module-basic-app';

export interface IDialogFormOptions {
  locale: {
    Cancel: () => string;
    OK: () => string;
  };
  schema: any;
  data: Record<string, any>;
  formScene: TypeFormScene;
  schemaScene: TypeFormSchemaScene;
  dialogOptions?: IModalDialogOptions;
  icon?: keyof IIconRecord;
  title: string;
  onSubmitData: (
    data: TypeFormOnSubmitData<Record<string, any>>,
    dialog: IModalDialogRenderContext,
  ) => void | Promise<void>;
}
