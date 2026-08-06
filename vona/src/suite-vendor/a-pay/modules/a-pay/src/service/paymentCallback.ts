import type { TableIdentity } from 'table-identity';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { EntityPaymentSession } from '../entity/paymentSession.tsx';

type TypePaymentCallbackPurpose = 'return' | 'cancel';

interface IPaymentCallbackState {
  paymentSessionId: TableIdentity;
  providerName: string;
  clientName: string;
  environment: 'sandbox' | 'live';
  purpose: TypePaymentCallbackPurpose;
  continuationPath: string;
}

@Service()
export class ServicePaymentCallback extends BeanBase {
  async createUrls(session: EntityPaymentSession) {
    const continuationPath = await this._getContinuationPath(session);
    return {
      returnUrl: await this._createUrl(session, 'return', continuationPath),
      cancelUrl: await this._createUrl(session, 'cancel', continuationPath),
    };
  }

  async consume(
    purpose: TypePaymentCallbackPurpose,
    token: string | undefined,
  ): Promise<IPaymentCallbackState> {
    const path = `/pay/payment-callback/${purpose}`;
    const state = (await this.bean.jwt.get('oauthstate').verify(token, { path })) as
      | IPaymentCallbackState
      | undefined;
    if (
      !state ||
      state.purpose !== purpose ||
      !this._isSafeContinuationPath(state.continuationPath)
    ) {
      this.app.throw(401, 'payment callback state is invalid');
    }
    const session = await this.scope.model.paymentSession.getById(state.paymentSessionId);
    if (
      !session ||
      session.providerName !== state.providerName ||
      session.clientName !== state.clientName ||
      session.environment !== state.environment
    ) {
      this.app.throw(404, 'payment session not found');
    }
    return state;
  }

  private async _createUrl(
    session: EntityPaymentSession,
    purpose: TypePaymentCallbackPurpose,
    continuationPath: string,
  ) {
    const path = `/pay/payment-callback/${purpose}`;
    const continuationPathWithResult = `${continuationPath}?providerResult=${purpose}`;
    const state = await this.bean.jwt.get('oauthstate').sign(
      {
        paymentSessionId: session.id,
        providerName: session.providerName,
        clientName: session.clientName,
        environment: session.environment,
        purpose,
        continuationPath: continuationPathWithResult,
      },
      { path, expiresIn: '15m' },
    );
    this._assertTrustedOrigin();
    const url = new URL(this.app.util.getAbsoluteUrlByApiPath(path));
    url.searchParams.set('state', state);
    return url.toString();
  }

  private async _getContinuationPath(session: EntityPaymentSession) {
    const scene = this.bean.payScene.get(session.payScene as never);
    const continuationPath = await scene.getPaymentCallbackPath(session);
    if (!this._isSafeContinuationPath(continuationPath)) {
      this.app.throw(500, 'payment scene returned an invalid callback continuation path');
    }
    return continuationPath;
  }

  private _assertTrustedOrigin() {
    const { protocol, host } = this.app.config.server.serve;
    if (!protocol || !host) {
      this.app.throw(503, 'payment callbacks require configured server serve protocol and host');
    }
  }

  private _isSafeContinuationPath(value: unknown): value is string {
    return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//');
  }
}
