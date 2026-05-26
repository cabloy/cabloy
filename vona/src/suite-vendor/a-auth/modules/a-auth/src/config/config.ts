import type { VonaApplication } from 'vona';

import { $protocolKey } from 'vona';

export function config(_app: VonaApplication) {
  return {
    oauthCodeField: $protocolKey('x-vona-oauth-code'),
  };
}
