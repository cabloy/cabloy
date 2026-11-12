import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { DtoAccessToken } from './accessToken.tsx';

export interface IDtoOptionsAccessTokenMineRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAccessTokenMineRes>()
export class DtoAccessTokenMineRes extends $Dto.listAndCount(DtoAccessToken) {}
