import z from 'zod';
import { BeanBase } from 'zova';
import { Tool } from 'zova-module-a-bean';

@Tool()
export class ToolV extends BeanBase {
  protected async __init__() {}

  required<T extends z.ZodType>(schema: T, params?: string | z.core.$ZodStringParams): T {
    params = params || this.scope.locale.ZodErrorRequired();
    schema._zod.def.error = z.util.normalizeParams(params).error;
    return schema;
  }
}
