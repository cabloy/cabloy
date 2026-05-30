import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Dto } from 'vona-module-a-web';

import { DtoTestResult } from './testResult.tsx';

export interface IDtoOptionsTestBody extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsTestBody>()
export class DtoTestBody extends DtoTestResult {}
