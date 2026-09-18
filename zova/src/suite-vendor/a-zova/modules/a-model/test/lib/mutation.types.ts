import type { MutationObserverOptions } from '@tanstack/vue-query';

import type { MyMutationMeta } from '../../src/types/query.ts';

const mutationOptions: MutationObserverOptions<number, Error, { id: number }> = {
  mutationKey: ['test:mutation'],
  mutationFn: async variables => variables.id,
  onError: (_error, _variables, _context) => {},
};

const mutationMeta: MyMutationMeta = { source: 'test' };

void mutationOptions;
void mutationMeta;
