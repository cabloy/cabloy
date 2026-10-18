import type { IncomingMessage, ServerResponse } from 'node:http';

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

interface ProbeState {
  interceptions: number;
  nextCalls: number;
  calls: number;
  identityMatches: number;
  originalFunction: boolean;
  returnedFunction: boolean;
  sameReturn: boolean;
  closed: boolean;
  armed: boolean;
  referencesReleased: boolean;
}
interface Session {
  snapshot(): ProbeState;
  close(): void;
}
interface Probe {
  arm(
    mode: 'wrap' | 'transparent',
    witness?: (req: IncomingMessage, res: ServerResponse) => boolean,
  ): Session;
}
interface StartupSurface {
  _callback(): (req: IncomingMessage, res: ServerResponse) => unknown;
}

let sequence = 0;
let retainedBytes = 0;
function event(
  t: { diagnostic: (value: string) => void },
  alias: 'included' | 'excluded',
  values: Record<string, number | boolean>,
) {
  assert.equal(sequence < 32, true, 'event_count_limit');
  assert.match(alias, /^[\x20-\x7E]{1,64}$/u, 'event_alias');
  const keys = ['matched', 'wrapped', 'transparent', 'closed', 'calls', 'listenerRestored'];
  assert.equal(
    Object.keys(values).every(key => keys.includes(key)),
    true,
    'event_keys',
  );
  assert.equal(
    Object.values(values).every(
      value => typeof value === 'boolean' || (Number.isSafeInteger(value) && value >= 0),
    ),
    true,
    'event_values',
  );
  const line = JSON.stringify({
    alias,
    proof: 'startup-proxy',
    outcome: 'observed',
    seq: sequence + 1,
    ...values,
  });
  const bytes = Buffer.byteLength(line);
  assert.equal(bytes <= 512 && retainedBytes + bytes <= 16 * 1024, true, 'event_byte_limit');
  sequence++;
  retainedBytes += bytes;
  t.diagnostic(line);
}

// No test-vona import: the excluded graph must stay excluded even during assertions.
describe('ingress proxy no-listener qualification', { concurrency: false, timeout: 60_000 }, () => {
  it('qualifies the command-selected fresh owner graph', { timeout: 15_000 }, t => {
    const sessions: Session[] = [];
    const before = app.listeners('error');
    let listenerRestored = false;
    let matched = false;
    let wrapped = false;
    let transparent = false;
    let calls = 0;
    let excluded = false;
    let failed = false;
    try {
      assert.equal(
        process.env.PROJECT_DISABLED_SUITES === undefined ||
          process.env.PROJECT_DISABLED_SUITES === '',
        true,
        'suite_exclusion_not_selected',
      );
      const disabled = process.env.PROJECT_DISABLED_MODULES;
      assert.equal(
        disabled === undefined || disabled === '' || disabled === 'test-vona',
        true,
        'module_exclusion_not_selected',
      );
      excluded = disabled === 'test-vona';
      assert.equal(app.meta.isTest, true, 'test_mode_required');
      assert.equal(app.meta.appStarted, true, 'started_singleton_required');
      assert.equal(app.config.server.listen.disable, true, 'listener_disabled_required');
      assert.equal(app.server == null, true, 'no_app_server_required');
      assert.equal(!!app.meta.modules['a-web'], true, 'web_required');
      assert.equal(!!app.meta.modules['cabloy-mcp'], true, 'mcp_required');
      assert.equal(!!app.meta.modules['test-vona'], !excluded, 'owner_graph');
      const aop = app.bean._getBean('a-aspectutils.service.aop') as unknown as {
        findAopsMatched(name: string): string[] | undefined;
      };
      matched = (aop.findAopsMatched('a-web.startup.listen') ?? []).includes(
        'test-vona.aop.mcpIngressProbe',
      );
      assert.equal(matched, !excluded, 'owner_advice_match');
      const startup = app.bean._getBean(
        'a-web.startup.listen' as never,
      ) as unknown as StartupSurface;
      if (excluded) {
        assert.equal(typeof startup._callback(), 'function', 'excluded_sync_listener');
      } else {
        const probe = app.bean._getBean(
          'test-vona.aop.mcpIngressProbe' as never,
        ) as unknown as Probe;
        const pairs = [
          {
            req: Object.create(null) as IncomingMessage,
            res: Object.create(null) as ServerResponse,
          },
          {
            req: Object.create(null) as IncomingMessage,
            res: Object.create(null) as ServerResponse,
          },
        ];
        let pairIndex = 0;
        const wrap = probe.arm('wrap', (req, res) => {
          const pair = pairs[pairIndex++];
          return pair?.req === req && pair.res === res;
        });
        sessions.push(wrap);
        try {
          const listener = startup._callback();
          assert.equal(typeof listener, 'function', 'wrapped_sync_listener');
          const acquired = wrap.snapshot();
          assert.equal(acquired.interceptions, 1, 'one_interception');
          assert.equal(acquired.nextCalls, 1, 'one_next');
          assert.equal(
            acquired.originalFunction && acquired.returnedFunction && !acquired.sameReturn,
            true,
            'distinct_wrapper',
          );
          for (const pair of pairs) {
            assert.equal(
              listener(pair.req, pair.res) === 'mcp_ingress_probe',
              true,
              'fixed_probe_result',
            );
          }
          const state = wrap.snapshot();
          assert.equal(state.calls, 2, 'two_local_calls');
          assert.equal(state.identityMatches, 2, 'two_local_identities');
          calls = state.calls;
          wrapped = true;
        } finally {
          wrap.close();
        }
        assert.equal(
          wrap.snapshot().closed && !wrap.snapshot().armed && wrap.snapshot().referencesReleased,
          true,
          'wrap_released',
        );
        const observe = probe.arm('transparent');
        sessions.push(observe);
        try {
          assert.equal(typeof startup._callback(), 'function', 'transparent_sync_listener');
          const state = observe.snapshot();
          assert.equal(
            state.interceptions === 1 && state.nextCalls === 1 && state.sameReturn,
            true,
            'exact_original_return',
          );
          assert.equal(state.calls, 0, 'no_original_invocation');
          transparent = true;
        } finally {
          observe.close();
        }
        const wrapBefore = wrap.snapshot();
        const observeBefore = observe.snapshot();
        assert.equal(typeof startup._callback(), 'function', 'unarmed_sync_listener');
        assert.deepEqual(wrap.snapshot(), wrapBefore, 'unarmed_wrap_unchanged');
        assert.deepEqual(observe.snapshot(), observeBefore, 'unarmed_observer_unchanged');
      }
    } catch {
      failed = true;
    } finally {
      for (const session of sessions) {
        session.close();
        const state = session.snapshot();
        if (!state.closed || state.armed || !state.referencesReleased) failed = true;
      }
      const after = app.listeners('error');
      if (before.length === 0 && after.length === 1 && after[0] === app.onerror) {
        app.removeListener('error', app.onerror);
      }
      const restored = app.listeners('error');
      listenerRestored =
        restored.length === before.length &&
        restored.every((listener, index) => listener === before[index]);
      if (!listenerRestored) failed = true;
    }
    if (failed) throw new Error('ingress_proxy_qualification_failed');
    event(t, excluded ? 'excluded' : 'included', {
      matched,
      wrapped,
      transparent,
      calls,
      closed: sessions.every(session => session.snapshot().closed),
      listenerRestored,
    });
  });
});
