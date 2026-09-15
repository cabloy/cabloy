import type { IUser } from 'vona-module-a-user';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { DtoLayoutProfile } from '../dto/layoutProfile.tsx';
import { DtoLayoutProfileLoad } from '../dto/layoutProfileLoad.tsx';
import { DtoLayoutProfileSave } from '../dto/layoutProfileSave.tsx';

export interface IControllerOptionsLayoutprofile extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsLayoutprofile>('layoutprofile')
export class ControllerLayoutprofile extends BeanBase {
  @Web.get('load')
  @Api.body(v.optional(), v.object(DtoLayoutProfile))
  async load(
    @Arg.query() query: DtoLayoutProfileLoad,
    @Arg.user() user: IUser,
  ): Promise<DtoLayoutProfile | undefined> {
    return await this.scope.service.layoutprofile.load(user, query.layoutKey);
  }

  @Web.post('save')
  @Api.body(v.object(DtoLayoutProfile))
  async save(
    @Arg.body(v.object(DtoLayoutProfileSave)) command: DtoLayoutProfileSave,
    @Arg.user() user: IUser,
  ): Promise<DtoLayoutProfile> {
    return await this.scope.service.layoutprofile.save(user, command.layoutKey, command.profile);
  }

  @Web.delete('reset')
  async reset(@Arg.query() query: DtoLayoutProfileLoad, @Arg.user() user: IUser): Promise<void> {
    await this.scope.service.layoutprofile.reset(user, query.layoutKey);
  }
}
