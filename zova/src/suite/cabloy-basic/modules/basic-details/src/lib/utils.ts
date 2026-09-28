import type { IPermissionHintGeneral, TypeFormScene } from 'zova-module-a-openapi';

export function checkFormScene(
  formScene: TypeFormScene,
  permissionHint?: IPermissionHintGeneral,
): boolean {
  const formSceneHint = permissionHint?.formScene;
  if (!formSceneHint) return true;
  if (Array.isArray(formSceneHint) && formSceneHint.includes(formScene!)) return true;
  if (formSceneHint === formScene) return true;
  return false;
}
