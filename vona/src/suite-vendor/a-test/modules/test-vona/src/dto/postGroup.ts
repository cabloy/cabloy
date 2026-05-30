import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { ModelPost } from '../model/post.ts';

export interface IDtoOptionsPostGroup extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsPostGroup>()
export class DtoPostGroup extends $Dto.group(() => ModelPost, 'userId', {
  count: '*',
  sum: 'stars',
}) {}
