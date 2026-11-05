import type { IMetaOptionsIndex } from 'vona-module-a-index';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';
import { $tableColumns } from 'vona-module-a-ormutils';

@Meta<IMetaOptionsIndex>({
  indexes: {
    ...$tableColumns('mcpAuthCustomScope', ['userId', 'scope+userId']),
    ...$tableColumns('mcpAuthAuthorization', [
      'clientId',
      'userId+scope',
      'requestedScope+userId',
      'requestDigest',
      'codeDigest',
      'tokenDigest',
      'expiresAt',
    ]),
    ...$tableColumns('mcpAuthClient', ['oauthClientId', 'resource+state']),
  },
})
export class MetaIndex extends BeanBase {}
