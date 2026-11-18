import type { IMetaOptionsIndex } from 'vona-module-a-index';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';
import { $tableColumns } from 'vona-module-a-ormutils';

@Meta<IMetaOptionsIndex>({
  indexes: {
    ...$tableColumns('cabloyAiProvider', ['iid+name']),
    ...$tableColumns('cabloyAiModel', ['iid+name']),
    ...$tableColumns('cabloyAiScene', ['iid+name']),
    ...$tableColumns('cabloyAiConversation', ['iid+userId']),
    ...$tableColumns('cabloyAiMessage', ['conversationId+runId']),
    ...$tableColumns('cabloyAiRun', ['conversationId+requestKey']),
    ...$tableColumns('cabloyAiUsage', ['runId']),
  },
})
export class MetaIndex extends BeanBase {}
