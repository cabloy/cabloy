import type {
  IPermissionHintDetailsAction,
  IResourceRenderDetailsActionBulkOptionsAction,
  IResourceRenderDetailsActionRowOptionsAction,
  TypeFormScene,
  TypeOpenapiPermissions,
} from 'zova-module-a-openapi';

import type { TypeDetailsCheckPermission } from '../types/details.js';

import { checkFormScene } from './utils.js';

export interface IDetailsPermissionAction {
  name?: string;
  options?: { permission?: IPermissionHintDetailsAction };
}

export function createDetailsPermissionChecker(
  getPermissions: () => TypeOpenapiPermissions | undefined,
  getCurrentData: () => Record<string, unknown> | undefined,
  checkPermission: (
    permissions: TypeOpenapiPermissions | undefined,
    actionName?: string,
    permissionHint?: IPermissionHintDetailsAction,
    currentData?: Record<string, unknown>,
  ) => boolean,
): TypeDetailsCheckPermission {
  return (actionName, permissionHint) => {
    return checkPermission(getPermissions(), actionName, permissionHint, getCurrentData());
  };
}

export function isDetailsActionAllowed(
  formScene: TypeFormScene,
  checkPermission: TypeDetailsCheckPermission,
  action: IDetailsPermissionAction,
): boolean {
  const permissionHint = action.options?.permission;
  if (!checkFormScene(formScene, permissionHint)) return false;
  if (permissionHint?.mode === 'formScene' && !permissionHint.actionInherit) return true;
  return checkPermission(action.name, permissionHint);
}

export function filterDetailsActions<TAction extends IDetailsPermissionAction>(
  formScene: TypeFormScene,
  checkPermission: TypeDetailsCheckPermission,
  actions: TAction[] | undefined,
): TAction[] {
  if (!actions || actions.length === 0) return [];
  return actions.filter(action => isDetailsActionAllowed(formScene, checkPermission, action));
}

export function filterDetailsBulkActions(
  formScene: TypeFormScene,
  checkPermission: TypeDetailsCheckPermission,
  actions: IResourceRenderDetailsActionBulkOptionsAction[] | undefined,
) {
  return filterDetailsActions(formScene, checkPermission, actions);
}

export function filterDetailsRowActions(
  formScene: TypeFormScene,
  checkPermission: TypeDetailsCheckPermission,
  actions: IResourceRenderDetailsActionRowOptionsAction[] | undefined,
) {
  return filterDetailsActions(formScene, checkPermission, actions);
}
