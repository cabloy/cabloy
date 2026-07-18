import type {
  IFormLayoutResponsiveColumns,
  TypeFormLayoutSectionLayout,
} from 'zova-module-a-openapi';

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
  layout?: TypeFormLayoutSectionLayout;
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
