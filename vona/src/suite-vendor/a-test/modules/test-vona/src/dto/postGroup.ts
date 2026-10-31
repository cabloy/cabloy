import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { postAnalysis } from '../lib/postAnalysis.ts';

export interface IDtoOptionsPostGroup extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsPostGroup>()
export class DtoPostGroup extends $Dto.analysisGroup(postAnalysis) {}
