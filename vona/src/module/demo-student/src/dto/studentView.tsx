import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { ModelStudent } from '../model/student.ts';

export interface IDtoOptionsStudentView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStudentView>({
  fields: {
    mobile: $makeSchema(
      v.serializerReplace({
        patternFrom: /^(.{3}).{4}(.*)$/,
        patternTo: '$1****$2',
      }),
      z.string(),
    ),
  },
  blocks: [
    ZovaRender.block('basic-pageentry:blockPageEntry', {
      blocks: [
        ZovaRender.block('basic-pageentry:blockForm'),
        ZovaRender.block('basic-pageentry:blockToolbarRow', {
          actions: [
            ZovaRender.formActionRow('basic-form:actionBack', { permission: { public: true } }),
          ],
        }),
      ],
    }),
  ],
})
export class DtoStudentView extends $Dto.get(() => ModelStudent) {}
