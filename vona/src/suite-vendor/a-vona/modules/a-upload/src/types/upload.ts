export const SymbolUploadValue = Symbol('SymbolUploadValue');

export interface IUploadValue {
  fields: IUploadField[];
  files: IUploadFile[];
}

export interface IUploadFile {
  name?: string;
  file: string;
  info: IUploadFileInfo;
}

export interface IUploadFileInfo {
  filename?: string;
  encoding: string;
  mimeType: string;
}

export interface IUploadField {
  name: string;
  value: string;
  info: IUploadFieldInfo;
}

export interface IUploadFieldInfo {
  nameTruncated: boolean;
  valueTruncated: boolean;
  encoding: string;
  mimeType: string;
}
