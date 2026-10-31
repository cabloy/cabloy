import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { studentAnalysis } from '../lib/studentAnalysis.ts';

export interface IDtoOptionsStudentGroupResItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStudentGroupResItem>()
export class DtoStudentGroupResItem extends $Dto.analysisGroup(studentAnalysis) {}
