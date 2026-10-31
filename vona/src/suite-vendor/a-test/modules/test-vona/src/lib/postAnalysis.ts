import { $defineAnalysis } from 'vona-module-a-orm';

import { ModelPost } from '../model/post.ts';

export const postAnalysis = $defineAnalysis(() => ModelPost, {
  groups: ['title', 'userId'],
  aggrs: {
    count: ['*', 'stars'],
    sum: ['stars'],
    avg: ['stars'],
    min: ['stars'],
    max: ['stars'],
  },
  defaults: {
    group: { groups: ['userId'], aggrs: { count: ['*'], sum: ['stars'] } },
    aggregate: {
      aggrs: {
        count: ['*', 'stars'],
        sum: ['stars'],
        avg: ['stars'],
        min: ['stars'],
        max: ['stars'],
      },
    },
  },
});
