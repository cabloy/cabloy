import type { VNode } from 'vue';
import type { IFormLayoutResponsiveColumns } from 'zova-module-a-openapi';

import type { ControllerForm } from '../component/form/controller.jsx';

export interface IResolvedFormLayout {
  children: IResolvedFormLayoutNode[];
  fieldTabPaths: Record<string, IResolvedFormLayoutTabRef[]>;
  diagnostics: IFormLayoutDiagnostic[];
}

export interface IResolvedFormLayoutField {
  type: 'field';
  name: string;
  span?: IFormLayoutResponsiveColumns;
}

export interface IResolvedFormLayoutGroup {
  type: 'group';
  id: string;
  title?: string;
  description?: string;
  children: Array<IResolvedFormLayoutField | IResolvedFormLayoutGroup | IResolvedFormLayoutSection>;
}

export interface IResolvedFormLayoutSection {
  type: 'section';
  id: string;
  title?: string;
  description?: string;
  columns?: IFormLayoutResponsiveColumns;
  children: IResolvedFormLayoutField[];
}

export interface IResolvedFormLayoutTabs {
  type: 'tabs';
  id: string;
  children: IResolvedFormLayoutTab[];
}

export interface IResolvedFormLayoutTab {
  type: 'tab';
  id: string;
  title: string;
  children: Array<IResolvedFormLayoutField | IResolvedFormLayoutGroup | IResolvedFormLayoutSection>;
}

export interface IResolvedFormLayoutTabRef {
  tabsId: string;
  tabId: string;
}

export type IResolvedFormLayoutNode =
  | IResolvedFormLayoutField
  | IResolvedFormLayoutGroup
  | IResolvedFormLayoutSection
  | IResolvedFormLayoutTabs;

export interface IFormLayoutDiagnostic {
  type: 'duplicateField' | 'unknownField' | 'duplicateId';
  value: string;
}

export interface IFormLayoutRenderContext<TFormData extends {} = {}, TSubmitMeta = never> {
  form: ControllerForm<TFormData, TSubmitMeta>;
  plan: IResolvedFormLayout;
  renderField: (name: string) => VNode | VNode[] | undefined;
  getActiveTab: (tabsId: string) => string | undefined;
  activateTab: (tabsId: string, tabId: string) => void;
  hasErrors: (node: IResolvedFormLayoutNode | IResolvedFormLayoutTab) => boolean;
}
