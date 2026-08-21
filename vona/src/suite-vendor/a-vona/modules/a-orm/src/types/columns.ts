export interface ITableColumn {
  type: string;
  default: any;
  columnType?: string;
}

export type ITableColumns = Record<string, ITableColumn>;

export type ITableColumnsDefault = Record<string, any>;
