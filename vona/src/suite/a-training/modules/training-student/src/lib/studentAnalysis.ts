import { $defineAnalysis } from 'vona-module-a-orm';

import { ModelStudent } from '../model/student.ts';

export const studentAnalysis = $defineAnalysis(() => ModelStudent, {
  groups: ['level'],
  aggrs: { count: ['*', 'imageId'] },
  defaults: {
    group: { groups: ['level'], aggrs: { count: ['*'] } },
    aggregate: { aggrs: { count: ['*', 'imageId'] } },
  },
});
