import { IFormMeta } from 'zova-module-a-openapi';

export interface IPageMeta {
  pageTitle?: string;
  pageDirty?: boolean;
  formMeta?: IFormMeta;
}
