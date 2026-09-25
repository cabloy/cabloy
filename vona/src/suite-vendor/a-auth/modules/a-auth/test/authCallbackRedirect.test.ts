import assert from 'node:assert';
import { describe, it } from 'node:test';

import { getOauthRedirectDiagnostic } from '../src/lib/utils.ts';

describe('authCallbackRedirect.test.ts', () => {
  it('keeps absolute redirect diagnostics free of sensitive URL components', () => {
    const code = 'oauth-authorization-code-sentinel';
    const state = 'oauth-state-sentinel';
    const token = 'oauth-token-sentinel';
    const redirect = `https://user:password@app.example.test:8443/auth/callback?code=${code}&state=${state}&token=${token}#fragment-sentinel`;

    const diagnostic = getOauthRedirectDiagnostic(redirect);
    const serialized = JSON.stringify(diagnostic);

    assert.deepEqual(diagnostic, {
      redirectKind: 'absolute',
      redirectOrigin: 'https://app.example.test:8443',
      redirectProtocol: 'https:',
      redirectHost: 'app.example.test:8443',
      redirectHostname: 'app.example.test',
      redirectPort: '8443',
    });
    for (const value of [code, state, token, 'user', 'password', 'callback', 'fragment-sentinel']) {
      assert.equal(serialized.includes(value), false);
    }
  });

  it('classifies redirect shapes without retaining raw values', () => {
    assert.deepEqual(getOauthRedirectDiagnostic('/home/base/authCallback?token=secret'), {
      redirectKind: 'relative',
    });
    assert.deepEqual(getOauthRedirectDiagnostic('//app.example.test/authCallback?token=secret'), {
      redirectKind: 'protocol_relative',
    });
    assert.deepEqual(getOauthRedirectDiagnostic('https://[invalid'), {
      redirectKind: 'invalid',
    });
    assert.deepEqual(getOauthRedirectDiagnostic('javascript:alert(secret)'), {
      redirectKind: 'non_http',
      redirectProtocol: 'javascript:',
    });
  });
});
