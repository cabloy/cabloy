export type TypeFormMode = 'view' | 'edit';
export type TypeEditMode = 'create' | 'update';
export type TypeFormScene = 'view' | 'create' | 'edit';

export interface IFormMeta {
  formMode: TypeFormMode;
  editMode?: TypeEditMode;
  formScene?: TypeFormScene;
}
