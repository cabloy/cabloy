import type { IInstanceRecord } from 'vona';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';
import type { IInstanceStartupOptions } from 'vona-module-a-startup';

import { $Class } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBaseSimple } from 'vona-module-a-orm';
import z from 'zod';

export interface IEntityOptionsInstance extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsInstance>('aInstance')
export class EntityInstance extends $Class.omit(EntityBaseSimple, ['iid']) {
  @Api.field(v.default(false))
  disabled: boolean;

  @Api.field(v.default(false))
  isolate: boolean;

  @Api.field(z.string())
  name: keyof IInstanceRecord;

  @Api.field()
  title: string;

  @Api.field(v.optional())
  config?: string;
}

export interface IInstanceStartupQueueInfo {
  resolve: Function;
  reject: Function;
  instanceName: keyof IInstanceRecord;
  options: IInstanceStartupOptions;
}
