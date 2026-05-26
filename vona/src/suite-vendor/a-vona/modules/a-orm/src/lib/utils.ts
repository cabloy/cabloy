import { deepExtend } from 'vona';

import type { IModelRelationIncludeWrapper } from '../types/model.ts';
import type { IRelationItem } from '../types/relationsDef.ts';

export function handleRelationsCollection(
  relationsStatic?: Record<string, any>,
  includeWrapper?: IModelRelationIncludeWrapper,
): IRelationItem[] {
  // collect
  const relations: IRelationItem[] = [];
  // include
  if (relationsStatic) {
    for (const key in relationsStatic) {
      const relationDef = relationsStatic[key];
      const relationCur: any = includeWrapper?.include?.[key];
      let relationReal;
      let includeReal;
      let withReal;
      let autoload;
      if (relationCur === false) {
        continue;
      } else if (relationCur === true) {
        relationReal = relationDef;
        autoload = relationDef.options?.autoload;
      } else if (typeof relationCur === 'object') {
        relationReal = deepExtend({}, relationDef, { options: relationCur });
        includeReal = relationCur.include;
        withReal = relationCur.with;
      } else if (relationDef.options?.autoload) {
        relationReal = relationDef;
        autoload = relationDef.options?.autoload;
      } else {
        continue;
      }
      relations.push([key, relationReal, includeReal, withReal, autoload]);
    }
  }
  // with
  if (includeWrapper?.with) {
    for (const key in includeWrapper.with) {
      const relationReal: any = includeWrapper.with[key];
      if (!relationReal) continue;
      relations.push([
        key,
        relationReal,
        relationReal.options?.include,
        relationReal.options?.with,
        false,
      ]);
    }
  }
  return relations;
}
