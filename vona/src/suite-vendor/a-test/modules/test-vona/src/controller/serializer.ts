import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { Api, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { DtoSerializerArray } from '../dto/serializerArray.ts';
import { DtoSerializerLazy } from '../dto/serializerLazy.ts';
import { DtoSerializerSimple } from '../dto/serializerSimple.ts';

export interface IControllerOptionsSerializer extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsSerializer>({ path: 'serializer', meta: { mode: ['test', 'dev'] } })
export class ControllerSerializer extends BeanBase {
  @Web.post('echoSimple')
  @Api.body(DtoSerializerSimple)
  @Passport.public()
  @Core.serializer()
  echoSimple(@Arg.body() data: DtoSerializerSimple) {
    return data;
  }

  @Web.post('echoArray')
  @Api.body(v.array(DtoSerializerArray))
  @Passport.public()
  @Core.serializer()
  echoArray(@Arg.body(v.array(DtoSerializerArray)) data: DtoSerializerArray[]) {
    return data;
  }

  @Web.post('echoLazy')
  @Api.body(DtoSerializerLazy)
  @Passport.public()
  @Core.serializer()
  echoLazy(@Arg.body(DtoSerializerLazy) data: DtoSerializerLazy) {
    return data;
  }
}
