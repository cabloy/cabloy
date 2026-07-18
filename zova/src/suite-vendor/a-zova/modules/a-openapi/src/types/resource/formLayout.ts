export interface IFormLayout {
  children: IFormLayoutNode[];
}

export type TypeFormLayoutColumns = 1 | 2 | 3 | 4;

export type TypeFormLayoutSectionLayout = 'grid' | 'flow';

export interface IFormLayoutResponsiveColumns {
  default?: TypeFormLayoutColumns;
  md?: TypeFormLayoutColumns;
  lg?: TypeFormLayoutColumns;
}

export interface IFormLayoutField {
  type: 'field';
  name: string;
  span?: IFormLayoutResponsiveColumns;
}

export interface IFormLayoutGroup {
  type: 'group';
  id?: string;
  title?: string;
  description?: string;
  children: Array<IFormLayoutField | IFormLayoutGroup | IFormLayoutSection>;
}

export interface IFormLayoutSection {
  type: 'section';
  id?: string;
  title?: string;
  description?: string;
  layout?: TypeFormLayoutSectionLayout;
  columns?: IFormLayoutResponsiveColumns;
  children: IFormLayoutField[];
}

export interface IFormLayoutTabs {
  type: 'tabs';
  id?: string;
  children: IFormLayoutTab[];
}

export interface IFormLayoutTab {
  type: 'tab';
  id?: string;
  title: string;
  children: Array<IFormLayoutField | IFormLayoutGroup | IFormLayoutSection>;
}

export type IFormLayoutNode =
  | IFormLayoutField
  | IFormLayoutGroup
  | IFormLayoutSection
  | IFormLayoutTabs;
