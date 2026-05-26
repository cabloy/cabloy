import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsUserCreate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsUserCreate>({ independent: true })
export class DtoUserCreate extends $Dto.create('test-vona:user', {
  include: { roles: true, posts: true },
}) {}
