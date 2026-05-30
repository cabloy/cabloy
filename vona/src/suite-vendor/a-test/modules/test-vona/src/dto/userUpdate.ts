import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsUserUpdate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsUserUpdate>()
export class DtoUserUpdate extends $Dto.update('test-vona:user', { include: { posts: true } }) {}
