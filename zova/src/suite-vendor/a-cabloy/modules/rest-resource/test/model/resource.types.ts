import type { TableIdentity } from 'table-identity';

import type { ModelResource } from '../../src/model/resource.ts';

type Entity = { id: number };
type EntityCreate = Pick<Entity, 'id'>;
type EntityUpdate = Partial<Entity>;
type DeleteReason = { reason: string };

declare const id: TableIdentity;
declare const standard: ModelResource<Entity, EntityCreate, EntityUpdate>;
declare const requiredBody: ModelResource<Entity, EntityCreate, EntityUpdate, DeleteReason>;
declare const optionalBody: ModelResource<Entity, EntityCreate, EntityUpdate, DeleteReason | void>;

void standard.delete(id).mutateAsync();
void requiredBody.delete(id).mutateAsync({ reason: 'duplicate' });
void optionalBody.delete(id).mutateAsync();
void optionalBody.delete(id).mutateAsync({ reason: 'duplicate' });

// @ts-expect-error required DELETE bodies cannot be omitted
void requiredBody.delete(id).mutateAsync();

// @ts-expect-error DELETE body shape must match the resource contract
void requiredBody.delete(id).mutateAsync({ reason: 1 });
