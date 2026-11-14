import type { IMetaOptionsIndex } from 'vona-module-a-index';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';
import { $tableColumns } from 'vona-module-a-ormutils';

@Meta<IMetaOptionsIndex>({
  indexes: {
    // Direct metadata supports wider composites than the typed helper's two-column keys.
    mcpAuthCustomScope: ['userId+resource', 'scope+userId+resource'],
    mcpAuthAuthorization: [
      'clientId',
      'userId+resource+scope',
      'requestedScope+userId+resource',
      'requestDigest',
      'codeDigest',
      'tokenDigest',
      'expiresAt',
    ],
    ...$tableColumns('mcpAuthClient', ['oauthClientId', 'issuer+state']),
  },
})
export class MetaIndex extends BeanBase {}
