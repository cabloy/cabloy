import type { IncomingMessage, ServerResponse } from 'node:http';
import type { AopAction } from 'vona-module-a-aspect';

import { BeanAopBase } from 'vona';
import { Aop } from 'vona-module-a-aspect';

type NativeListener = (req: IncomingMessage, res: ServerResponse) => unknown;
interface CallbackSurface {
  _callback(): NativeListener;
}
type Mode = 'wrap' | 'transparent';

@Aop({ match: /^a-web\.startup\.listen$/, meta: { mode: 'test' } })
export class AopMcpIngressProbe extends BeanAopBase {
  private session?: {
    acquire: (original: NativeListener) => NativeListener;
  };

  private acquisitions = 0;
  private invocations = 0;

  arm(mode: Mode, witness?: (req: IncomingMessage, res: ServerResponse) => boolean) {
    if (!this.app.meta.isTest || this.session || !['wrap', 'transparent'].includes(mode)) {
      throw new Error('probe_arm_rejected');
    }
    if (mode === 'wrap' && typeof witness !== 'function') {
      throw new Error('probe_witness_required');
    }
    const state = {
      interceptions: 0,
      nextCalls: 0,
      calls: 0,
      identityMatches: 0,
      originalFunction: false,
      returnedFunction: false,
      sameReturn: false,
      closed: false,
    };
    let observe = witness;
    const wrapper: NativeListener = (req, res) => {
      if (state.closed || this.invocations >= 4) throw new Error('probe_call_rejected');
      this.invocations++;
      state.calls++;
      if (observe?.(req, res) !== true) throw new Error('probe_identity_failed');
      state.identityMatches++;
      return 'mcp_ingress_probe';
    };
    const session = {
      acquire: (original: NativeListener) => {
        state.interceptions++;
        state.nextCalls++;
        state.originalFunction = typeof original === 'function';
        if (!state.originalFunction) throw new Error('probe_original_not_function');
        const returned = mode === 'wrap' ? wrapper : original;
        state.returnedFunction = typeof returned === 'function';
        state.sameReturn = returned === original;
        return returned;
      },
    };
    // Only this bounded session is retained; no original listener or native pair is stored.
    this.session = session;
    return {
      snapshot: () => ({ ...state, armed: this.session === session, referencesReleased: !observe }),
      close: () => {
        state.closed = true;
        observe = undefined;
        if (this.session === session) this.session = undefined;
      },
    };
  }

  _callback: AopAction<CallbackSurface, '_callback'> = (_args, next) => {
    const session = this.session;
    if (!session) return next();
    if (this.acquisitions >= 4) throw new Error('probe_acquisition_rejected');
    this.acquisitions++;
    return session.acquire(next());
  };
}
