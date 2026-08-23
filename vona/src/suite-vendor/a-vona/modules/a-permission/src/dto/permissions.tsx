import type {
  IOpenapiPermissionModeActionActions,
  IOpenapiPermissions,
} from 'vona-module-a-openapi';
import type { IRoleIdRecord, IRoleNameRecord } from 'vona-module-a-user';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

const SchemaPermissionActionMatcher = z.discriminatedUnion('mode', [
  z.object({ mode: z.literal('all') }),
  z.object({
    mode: z.literal('any'),
    rules: z.array(z.object({ field: z.string(), values: z.array(z.string()) })),
  }),
]);

const SchemaPermissionAction = z.union([
  z.boolean(),
  z.object({
    key: z.string(),
    allowed: z.boolean(),
    matcher: SchemaPermissionActionMatcher,
  }),
]);

export interface IDtoOptionsPermissions extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsPermissions>()
export class DtoPermissions implements IOpenapiPermissions {
  @Api.field(v.optional(), v.array(v.tableIdentity()))
  roleIds?: (keyof IRoleIdRecord)[];

  @Api.field(v.optional(), v.array(z.string()))
  roleNames?: (keyof IRoleNameRecord)[];

  @Api.field(v.optional(), z.record(z.string(), SchemaPermissionAction))
  actions?: IOpenapiPermissionModeActionActions;
}
