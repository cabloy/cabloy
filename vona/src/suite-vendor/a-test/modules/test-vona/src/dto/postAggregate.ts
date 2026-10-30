import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { postAnalysis } from '../lib/postAnalysis.ts';

export interface IDtoOptionsPostAggregate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsPostAggregate>()
export class DtoPostAggregate extends $Dto.analysisAggregate(postAnalysis) {}
