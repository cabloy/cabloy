import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { ModelPost } from '../model/post.ts';

export interface IDtoOptionsPostCreate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsPostCreate>({ independent: true })
export class DtoPostCreate extends $Dto.create(() => ModelPost) {}
