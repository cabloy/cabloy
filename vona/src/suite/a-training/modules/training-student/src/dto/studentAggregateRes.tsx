import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { studentAnalysis } from '../lib/studentAnalysis.ts';

export interface IDtoOptionsStudentAggregateRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStudentAggregateRes>()
export class DtoStudentAggregateRes extends $Dto.analysisAggregate(studentAnalysis) {}
