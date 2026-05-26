import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { ModelPost } from '../model/post.ts';

export interface IDtoOptionsPostAggregate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsPostAggregate>()
export class DtoPostAggregate extends $Dto.aggregate(() => ModelPost, {
  count: ['*', 'stars'],
  sum: 'stars',
  avg: 'stars',
  min: 'stars',
  max: 'stars',
}) {}
