import type {
  IFormLayoutResponsiveColumns,
  IResourceRenderBlockOptionsBlock,
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

export interface IResolvedFormLayoutBlock {
  type: 'block';
  block: IResourceRenderBlockOptionsBlock;
  span?: IFormLayoutResponsiveColumns;
}

export type IResolvedFormLayoutLeaf = IResolvedFormLayoutField | IResolvedFormLayoutBlock;

export interface IResolvedFormLayoutGroup {
  type: 'group';
  id: string;
  title?: string;
  description?: string;
  children: Array<IResolvedFormLayoutLeaf | IResolvedFormLayoutGroup | IResolvedFormLayoutSection>;
}

export interface IResolvedFormLayoutSection {
  type: 'section';
  id: string;
  title?: string;
  description?: string;
  layout?: TypeFormLayoutSectionLayout;
  columns?: IFormLayoutResponsiveColumns;
  children: IResolvedFormLayoutLeaf[];
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
  children: Array<IResolvedFormLayoutLeaf | IResolvedFormLayoutGroup | IResolvedFormLayoutSection>;
}

export interface IResolvedFormLayoutTabRef {
  tabsId: string;
  tabId: string;
}

export type IResolvedFormLayoutNode =
  | IResolvedFormLayoutLeaf
  | IResolvedFormLayoutGroup
  | IResolvedFormLayoutSection
  | IResolvedFormLayoutTabs;

export interface IFormLayoutDiagnostic {
  type: 'duplicateField' | 'unknownField' | 'duplicateId';
  value: string;
}
