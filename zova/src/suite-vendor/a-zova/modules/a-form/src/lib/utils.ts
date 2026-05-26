import type { IFormMeta, TypeFormScene } from 'zova-module-a-openapi';

export function formMetaFromFormScene(formScene: TypeFormScene): IFormMeta {
  if (formScene === 'view') return { formScene, formMode: 'view', editMode: undefined };
  if (formScene === 'create') return { formScene, formMode: 'edit', editMode: 'create' };
  if (formScene === 'edit') return { formScene, formMode: 'edit', editMode: 'update' };
  throw new Error('invalid parameters');
}

export function formSceneFromFormMeta(formMeta: Partial<IFormMeta>): TypeFormScene | undefined {
  if (formMeta.formMode === 'view') return 'view';
  if (formMeta.formMode === 'edit' && formMeta.editMode === 'create') return 'create';
  if (formMeta.formMode === 'edit' && formMeta.editMode === 'update') return 'edit';
  if (formMeta.formMode === 'edit' && formMeta.editMode === undefined) return 'edit';
  return undefined;
}
