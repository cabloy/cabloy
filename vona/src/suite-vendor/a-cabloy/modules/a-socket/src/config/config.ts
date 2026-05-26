import type { VonaApplication } from 'vona';

import { $protocolKey } from 'vona';

export function config(_app: VonaApplication) {
  return {
    eventPrefix: '_:',
    globalPrefix: '/ws',
    queryKey: {
      passportCode: $protocolKey('x-vona-passport-code'),
      instanceName: $protocolKey('x-vona-instance-name'),
      locale: $protocolKey('x-vona-locale'),
      tz: $protocolKey('x-vona-tz'),
    },
    timeout: {
      ping: 20000,
    },
  };
}
