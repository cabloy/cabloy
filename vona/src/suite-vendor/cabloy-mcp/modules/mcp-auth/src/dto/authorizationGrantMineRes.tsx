import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { DtoAuthorizationGrant } from './authorizationGrant.tsx';

export interface IDtoOptionsAuthorizationGrantMineRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAuthorizationGrantMineRes>()
export class DtoAuthorizationGrantMineRes extends $Dto.listAndCount(DtoAuthorizationGrant) {}
