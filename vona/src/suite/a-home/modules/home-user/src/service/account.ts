import { replaceTemplate } from '@cabloy/utils';
import { BeanBase, createHash, uuidv4 } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { DtoAccountActivation } from '../dto/accountActivation.ts';
import type { DtoAccountCurrent } from '../dto/accountCurrent.ts';
import type { DtoAccountPasswordChange } from '../dto/accountPasswordChange.ts';
import type { DtoAccountPasswordReset } from '../dto/accountPasswordReset.ts';
import type { DtoAccountPasswordResetRequest } from '../dto/accountPasswordResetRequest.ts';
import type { DtoAccountPasswordResetRequestResult } from '../dto/accountPasswordResetRequestResult.ts';
import type { DtoAccountPasswordSet } from '../dto/accountPasswordSet.ts';
import type { DtoAccountPasswordSetIssue } from '../dto/accountPasswordSetIssue.ts';
import type { DtoAccountProfileUpdate } from '../dto/accountProfileUpdate.ts';
import type { DtoAccountRelogin } from '../dto/accountRelogin.ts';
import type { EntityUser } from '../entity/user.ts';

const activationConsumerPath = '/home/user/activation' as const;
const passwordSetConsumerPath = '/home/user/password-set' as const;
const passwordResetConsumerPath = '/home/user/password-reset' as const;

@Service()
export class ServiceAccount extends BeanBase {
  async current(): Promise<DtoAccountCurrent> {
    const user = await this._getCurrentUser();
    return await this._toCurrent(user);
  }

  async issueActivationLink(userId: EntityUser['id'], consumerUrl: string): Promise<void> {
    const user = await this.scope.model.user.getById(userId);
    if (!user || user.accountStatus === 'disabled' || user.activated || !user.email) {
      this._audit('activation-issue', 'rejected', userId, 'ineligible-user');
      return;
    }
    const consumerLink = this._getActivationLink(consumerUrl);
    return await this.scope.redlock.lock(
      `homeUser.account.activationMutation.${user.id}`,
      async () => await this._issueActivationLink(user, consumerLink),
    );
  }

  async consumeActivation(command: DtoAccountActivation): Promise<void> {
    const digest = this._digestActivationToken(command.token);
    return await this.scope.redlock.lock(
      `homeUser.account.activationConsume.${digest}`,
      async () => {
        const state = await this._getActivationState(digest);
        return await this.scope.redlock.lock(
          `homeUser.account.activationMutation.${state.userId}`,
          async () => {
            const user = await this._consumeActivation(digest);
            await this._finalizeActivation(user, digest);
          },
        );
      },
    );
  }

  @Core.transaction()
  async updateProfile(command: DtoAccountProfileUpdate): Promise<DtoAccountCurrent> {
    const user = await this._getCurrentUser();
    const avatar = this._resolveAvatar(command.avatar, user.avatar);
    const locale = this._resolveLocale(command.locale, user.locale);
    const tz = this._resolveTimezone(command.tz, user.tz);
    await this.scope.model.user.updateById(user.id, {
      name: command.name,
      avatar,
      locale,
      tz,
    });
    const userUpdated = await this.scope.model.user.getById(user.id);
    if (!userUpdated) this.app.throw(401);
    return await this._toCurrent(userUpdated);
  }

  async changePassword(command: DtoAccountPasswordChange): Promise<DtoAccountRelogin> {
    const user = await this._getCurrentUser();
    return await this.scope.redlock.lock(
      `homeUser.account.passwordMutation.${user.id}`,
      async () => {
        const result = await this._changePassword(user, command);
        await this._finalizePasswordChange(user);
        return result;
      },
    );
  }

  async issuePasswordSetLink(command: DtoAccountPasswordSetIssue): Promise<void> {
    const user = await this._getCurrentUser();
    return await this.scope.redlock.lock(
      `homeUser.account.passwordMutation.${user.id}`,
      async () => await this._issuePasswordSetLink(user, command),
    );
  }

  async consumePasswordSet(command: DtoAccountPasswordSet): Promise<DtoAccountRelogin> {
    const digest = this._digestPasswordSetToken(command.token);
    return await this.scope.redlock.lock(
      `homeUser.account.passwordSetConsume.${digest}`,
      async () => {
        const state = await this._getPasswordSetState(digest);
        const consume = async () => {
          const user = await this._consumePasswordSet(digest, command.newPassword);
          await this._finalizePasswordSet(user, digest);
          return { requiresRelogin: true as const };
        };
        if (!state.pendingEmail) {
          return await this.scope.redlock.lock(
            `homeUser.account.passwordMutation.${state.userId}`,
            consume,
          );
        }
        const candidateDigest = this._digestPasswordSetCandidate(state.pendingEmail);
        return await this.scope.redlock.lock(
          `homeUser.account.passwordSetCandidate.${candidateDigest}`,
          async () =>
            await this.scope.redlock.lock(
              `homeUser.account.passwordMutation.${state.userId}`,
              consume,
            ),
        );
      },
    );
  }

  async requestPasswordReset(
    command: DtoAccountPasswordResetRequest,
  ): Promise<DtoAccountPasswordResetRequestResult> {
    try {
      // Validate deployment configuration before resolving the recipient so an invalid configuration
      // cannot become an account-eligibility oracle.
      const consumerLink = this._getPasswordResetLink(command.consumerUrl);
      const email = this._normalizeEmail(command.email);
      const recipientDigest = this._digestPasswordResetRecipient(email);
      const user = await this.scope.model.user.getByEmailEqI(email);
      if (!user || !(await this._isPasswordResetEligible(user))) {
        this._audit('password-reset-request', 'suppressed', undefined, 'ineligible');
        return { accepted: true };
      }
      return await this.scope.redlock.lock(
        `homeUser.account.passwordMutation.${user.id}`,
        async () => await this._requestPasswordReset(user, recipientDigest, consumerLink),
      );
    } catch {
      this._audit('password-reset-request', 'failed', undefined, 'request-unavailable');
      return { accepted: true };
    }
  }

  async consumePasswordReset(command: DtoAccountPasswordReset): Promise<DtoAccountRelogin> {
    const digest = this._digestPasswordResetToken(command.token);
    return await this.scope.redlock.lock(
      `homeUser.account.passwordResetConsume.${digest}`,
      async () => {
        const state = await this._getPasswordResetState(digest);
        return await this.scope.redlock.lock(
          `homeUser.account.passwordMutation.${state.userId}`,
          async () => {
            const user = await this._consumePasswordReset(digest, command.newPassword);
            await this._finalizePasswordReset(user, digest);
            return { requiresRelogin: true };
          },
        );
      },
    );
  }

  @Core.transaction()
  private async _changePassword(
    user: EntityUser,
    command: DtoAccountPasswordChange,
  ): Promise<DtoAccountRelogin> {
    const verified = await this.$scope.authSimple.service.authSimple.verifyPassword(
      user.id,
      command.currentPassword,
    );
    if (!verified) this.app.throw(403);
    const replaced = await this.$scope.authSimple.service.authSimple.replacePassword(
      user.id,
      command.newPassword,
    );
    if (!replaced) this.app.throw(403);
    return { requiresRelogin: true };
  }

  private async _finalizePasswordChange(user: EntityUser) {
    await this.bean.passport.kickOut(user);
    this._audit('password-change', 'succeeded', user.id);
  }

  private async _issueActivationLink(user: EntityUser, consumerLink: URL): Promise<void> {
    const currentUser = await this.scope.model.user.getById(user.id);
    if (
      !currentUser ||
      currentUser.accountStatus === 'disabled' ||
      currentUser.activated ||
      !currentUser.email
    ) {
      this._audit('activation-issue', 'rejected', user.id, 'ineligible-user');
      return;
    }
    const rawToken = uuidv4();
    const digest = this._digestActivationToken(rawToken);
    const previousDigest = await this.scope.cacheRedis.activationCurrent.get(currentUser.id);
    try {
      if (previousDigest) await this.scope.cacheRedis.activation.del(previousDigest);
      await this.scope.cacheRedis.activation.set(
        {
          purpose: 'account-activation',
          userId: currentUser.id,
          consumerPath: activationConsumerPath,
          email: this._normalizeEmail(currentUser.email),
        },
        digest,
      );
      await this.scope.cacheRedis.activationCurrent.set(digest, currentUser.id);
      const link = this._getActivationLinkWithToken(consumerLink, rawToken);
      await this.bean.mail.send({
        to: currentUser.email,
        subject: this.scope.locale.ActivationEmailSubject(),
        text: replaceTemplate(this.scope.locale.ActivationEmailBody(), {
          userName: currentUser.name,
          link,
          siteName: this.ctx.instance.title || this.app.meta.env.APP_TITLE,
        }),
      });
    } catch (error) {
      try {
        await this._removeCurrentActivationToken(currentUser.id, digest);
      } catch (cleanupError) {
        this._audit('activation-issue', 'failed', currentUser.id, 'token-cleanup-failed');
        throw cleanupError;
      }
      this._audit(
        'activation-issue',
        'failed',
        currentUser.id,
        previousDigest ? 'previous-token-superseded' : 'mail-queue-failed',
      );
      throw error;
    }
    this._audit('activation-issue', 'accepted', currentUser.id);
  }

  @Core.transaction()
  private async _consumeActivation(digest: string): Promise<EntityUser> {
    const state = await this._getActivationState(digest);
    const currentDigest = await this.scope.cacheRedis.activationCurrent.get(state.userId);
    if (currentDigest !== digest) {
      this._audit('activation-consume', 'rejected', state.userId, 'superseded-token');
      this.app.throw(403);
    }
    const user = await this.scope.model.user.getByIdForUpdate(state.userId);
    if (
      !user ||
      user.accountStatus === 'disabled' ||
      user.activated ||
      !user.email ||
      this._normalizeEmail(user.email) !== state.email
    ) {
      this._audit('activation-consume', 'rejected', state.userId, 'ineligible-user');
      this.app.throw(403);
    }
    await this.bean.user.activate(user);
    return user;
  }

  private async _getActivationState(digest: string) {
    const state = await this.scope.cacheRedis.activation.get(digest);
    if (
      !state ||
      state.purpose !== 'account-activation' ||
      state.consumerPath !== activationConsumerPath
    ) {
      this._audit('activation-consume', 'rejected', undefined, 'invalid-token');
      this.app.throw(403);
    }
    return state;
  }

  private async _finalizeActivation(user: EntityUser, digest: string) {
    await this._removeCurrentActivationToken(user.id, digest);
    this._audit('activation-consume', 'succeeded', user.id);
  }

  private async _requestPasswordReset(
    user: EntityUser,
    recipientDigest: string,
    consumerLink: URL,
  ): Promise<DtoAccountPasswordResetRequestResult> {
    const currentUser = await this.scope.model.user.getById(user.id);
    if (!currentUser || !(await this._isPasswordResetEligible(currentUser))) {
      this._audit('password-reset-request', 'suppressed', user.id, 'ineligible');
      return { accepted: true };
    }
    if (await this.scope.cacheRedis.passwordResetRecipient.get(recipientDigest)) {
      this._audit('password-reset-request', 'suppressed', currentUser.id, 'recipient-cooldown');
      return { accepted: true };
    }
    const rawToken = uuidv4();
    const digest = this._digestPasswordResetToken(rawToken);
    const previousDigest = await this.scope.cacheRedis.passwordResetCurrent.get(currentUser.id);
    try {
      if (previousDigest) await this.scope.cacheRedis.passwordReset.del(previousDigest);
      await this.scope.cacheRedis.passwordReset.set(
        {
          purpose: 'password-reset',
          userId: currentUser.id,
          consumerPath: passwordResetConsumerPath,
        },
        digest,
      );
      await this.scope.cacheRedis.passwordResetCurrent.set(digest, currentUser.id);
      const link = this._getPasswordResetLinkWithToken(consumerLink, rawToken);
      await this.bean.mail.send({
        to: currentUser.email!,
        subject: this.scope.locale.PasswordResetEmailSubject(),
        text: replaceTemplate(this.scope.locale.PasswordResetEmailBody(), { link }),
      });
      await this.scope.cacheRedis.passwordResetRecipient.set(true, recipientDigest);
      this._audit('password-reset-request', 'accepted', currentUser.id);
    } catch {
      try {
        await this._removeCurrentPasswordResetToken(currentUser.id, digest);
      } catch {
        this._audit('password-reset-request', 'failed', currentUser.id, 'token-cleanup-failed');
        return { accepted: true };
      }
      this._audit(
        'password-reset-request',
        'failed',
        currentUser.id,
        previousDigest ? 'previous-token-superseded' : 'mail-queue-failed',
      );
    }
    return { accepted: true };
  }

  @Core.transaction()
  private async _consumePasswordReset(digest: string, password: string): Promise<EntityUser> {
    const state = await this._getPasswordResetState(digest);
    const currentDigest = await this.scope.cacheRedis.passwordResetCurrent.get(state.userId);
    if (currentDigest !== digest) {
      this._audit('password-reset-consume', 'rejected', state.userId, 'superseded-token');
      this.app.throw(403);
    }
    const user = await this.scope.model.user.getById(state.userId);
    if (!user || !(await this._isPasswordResetEligible(user))) {
      this._audit('password-reset-consume', 'rejected', state.userId, 'ineligible-user');
      this.app.throw(403);
    }
    const replaced = await this.$scope.authSimple.service.authSimple.replacePassword(
      user.id,
      password,
    );
    if (!replaced) {
      this._audit('password-reset-consume', 'rejected', user.id, 'simple-auth-missing');
      this.app.throw(403);
    }
    return user;
  }

  private async _getPasswordResetState(digest: string) {
    const state = await this.scope.cacheRedis.passwordReset.get(digest);
    if (
      !state ||
      state.purpose !== 'password-reset' ||
      state.consumerPath !== passwordResetConsumerPath
    ) {
      this._audit('password-reset-consume', 'rejected', undefined, 'invalid-token');
      this.app.throw(403);
    }
    return state;
  }

  private async _finalizePasswordReset(user: EntityUser, digest: string) {
    await this.bean.passport.kickOut(user);
    await this._removeCurrentPasswordResetToken(user.id, digest);
    this._audit('password-reset-consume', 'succeeded', user.id);
  }

  private async _issuePasswordSetLink(
    user: EntityUser,
    command: DtoAccountPasswordSetIssue,
  ): Promise<void> {
    const currentUser = await this.scope.model.user.getById(user.id);
    if (!currentUser) this.app.throw(401);
    if (await this.$scope.authSimple.service.authSimple.hasByUserId(currentUser.id)) {
      this._audit('password-set-issue', 'rejected', currentUser.id, 'simple-auth-exists');
      this.app.throw(403);
    }
    const submittedEmail = this._normalizeEmail(command.email);
    const storedEmail = currentUser.email?.trim() || undefined;
    if (storedEmail && this._normalizeEmail(storedEmail) !== submittedEmail) {
      this._audit('password-set-issue', 'rejected', currentUser.id, 'email-mismatch');
      this.app.throw(403);
    }
    let consumerLink: URL;
    try {
      consumerLink = this._getPasswordSetLink(command.consumerUrl);
    } catch (error) {
      this._audit('password-set-issue', 'rejected', currentUser.id, 'consumer-url-invalid');
      throw error;
    }
    const rawToken = uuidv4();
    const digest = this._digestPasswordSetToken(rawToken);
    const previousDigest = await this.scope.cacheRedis.passwordSetCurrent.get(currentUser.id);
    try {
      if (previousDigest) await this.scope.cacheRedis.passwordSet.del(previousDigest);
      await this.scope.cacheRedis.passwordSet.set(
        {
          purpose: 'password-set',
          userId: currentUser.id,
          consumerPath: passwordSetConsumerPath,
          email: storedEmail || submittedEmail,
          pendingEmail: storedEmail ? undefined : submittedEmail,
        },
        digest,
      );
      await this.scope.cacheRedis.passwordSetCurrent.set(digest, currentUser.id);
      const link = this._getPasswordSetLinkWithToken(consumerLink, rawToken);
      await this.bean.mail.send({
        to: storedEmail || submittedEmail,
        subject: this.scope.locale.PasswordSetEmailSubject(),
        text: replaceTemplate(this.scope.locale.PasswordSetEmailBody(), { link }),
      });
    } catch (error) {
      try {
        await this._removeCurrentPasswordSetToken(currentUser.id, digest);
      } catch (cleanupError) {
        this._audit('password-set-issue', 'failed', currentUser.id, 'token-cleanup-failed');
        throw cleanupError;
      }
      this._audit(
        'password-set-issue',
        'failed',
        currentUser.id,
        previousDigest ? 'previous-token-superseded' : 'mail-queue-failed',
      );
      throw error;
    }
    this._audit('password-set-issue', 'accepted', currentUser.id);
  }

  @Core.transaction()
  private async _consumePasswordSet(digest: string, password: string): Promise<EntityUser> {
    const state = await this._getPasswordSetState(digest);
    const currentDigest = await this.scope.cacheRedis.passwordSetCurrent.get(state.userId);
    if (currentDigest !== digest) {
      this._audit('password-set-consume', 'rejected', state.userId, 'superseded-token');
      this.app.throw(403);
    }
    const user = await this.scope.model.user.getByIdForUpdate(state.userId);
    if (!user || user.accountStatus === 'disabled') {
      this._audit('password-set-consume', 'rejected', state.userId, 'ineligible-user');
      this.app.throw(403);
    }
    if (await this.$scope.authSimple.service.authSimple.hasByUserId(user.id)) {
      this._audit('password-set-consume', 'rejected', user.id, 'simple-auth-exists');
      this.app.throw(403);
    }
    const issuedEmail = this._normalizeEmail(state.email);
    if (user.email?.trim() && this._normalizeEmail(user.email) !== issuedEmail) {
      this._audit('password-set-consume', 'rejected', user.id, 'email-mismatch');
      this.app.throw(403);
    }
    if (state.pendingEmail) {
      const pendingEmail = this._normalizeEmail(state.pendingEmail);
      const owner = await this.scope.model.user.getByEmailEqI(pendingEmail);
      if (owner && owner.id !== user.id) {
        this._audit('password-set-consume', 'rejected', user.id, 'email-owned');
        this.app.throw(403);
      }
      const storedEmail = user.email?.trim() || undefined;
      if (storedEmail && this._normalizeEmail(storedEmail) !== pendingEmail) {
        this._audit('password-set-consume', 'rejected', user.id, 'email-mismatch');
        this.app.throw(403);
      }
    }
    const created = await this.$scope.authSimple.service.authSimple.createForUser(
      user.id,
      password,
    );
    if (!created) {
      this._audit('password-set-consume', 'rejected', user.id, 'simple-auth-exists');
      this.app.throw(403);
    }
    if (state.pendingEmail && !user.email?.trim()) {
      await this.scope.model.user.updateById(user.id, {
        email: this._normalizeEmail(state.pendingEmail),
      });
    }
    return user;
  }

  private async _getPasswordSetState(digest: string) {
    const state = await this.scope.cacheRedis.passwordSet.get(digest);
    if (
      !state ||
      state.purpose !== 'password-set' ||
      state.consumerPath !== passwordSetConsumerPath
    ) {
      this._audit('password-set-consume', 'rejected', undefined, 'invalid-token');
      this.app.throw(403);
    }
    return state;
  }

  private async _finalizePasswordSet(user: EntityUser, digest: string) {
    await this.bean.passport.kickOut(user);
    await this._removeCurrentPasswordSetToken(user.id, digest);
    this._audit('password-set-consume', 'succeeded', user.id);
  }

  private async _toCurrent(user: EntityUser): Promise<DtoAccountCurrent> {
    const hasSimpleAuth = await this.$scope.authSimple.service.authSimple.hasByUserId(user.id);
    const eligibleEmail = user.email?.trim() || undefined;
    return {
      name: user.name,
      avatar: user.avatar,
      locale: user.locale,
      tz: user.tz,
      hasSimpleAuth,
      canSendSetPasswordLink: !hasSimpleAuth,
      eligibleEmailMasked: eligibleEmail ? this._maskEmail(eligibleEmail) : undefined,
    };
  }

  private _resolveAvatar(avatar: DtoAccountProfileUpdate['avatar'], current?: string) {
    if (avatar === undefined) return current;
    return avatar ?? undefined;
  }

  private _resolveLocale(
    locale: DtoAccountProfileUpdate['locale'],
    currentLocale: DtoAccountCurrent['locale'],
  ): DtoAccountCurrent['locale'] {
    if (locale === undefined) return currentLocale;
    if (locale === null) return undefined;
    const normalizedLocale = locale.toLowerCase().replaceAll('_', '-');
    if (!Object.keys(this.app.meta.locales).includes(normalizedLocale)) {
      this.app.throw(400, 'unsupported account locale');
    }
    return normalizedLocale as DtoAccountCurrent['locale'];
  }

  private _resolveTimezone(
    tz: DtoAccountProfileUpdate['tz'],
    currentTz: DtoAccountCurrent['tz'],
  ): DtoAccountCurrent['tz'] {
    if (tz === undefined) return currentTz;
    if (tz === null) return undefined;
    try {
      return new Intl.DateTimeFormat('en-US', { timeZone: tz }).resolvedOptions().timeZone;
    } catch {
      this.app.throw(400, 'invalid account timezone');
    }
  }

  private _getActivationLink(consumerUrl: string): URL {
    const url = this._getConsumerLink(consumerUrl, 'activation');
    if (url.pathname !== activationConsumerPath) {
      this.app.throw(503, 'account activation consumer URL is invalid');
    }
    return url;
  }

  private _getPasswordSetLink(consumerUrl: string): URL {
    return this._getConsumerLink(consumerUrl, 'password-set');
  }

  private _getPasswordResetLink(consumerUrl: string): URL {
    return this._getConsumerLink(consumerUrl, 'password-reset');
  }

  private _getConsumerLink(consumerUrl: string, purpose: string): URL {
    let url: URL;
    try {
      url = new URL(consumerUrl);
    } catch {
      this.app.throw(503, `account ${purpose} consumer URL is invalid`);
    }
    if (
      consumerUrl.includes('\\') ||
      this._getRawPathname(consumerUrl) !== url.pathname ||
      (url.protocol !== 'https:' && url.protocol !== 'http:') ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      this.bean.security.checkOriginExact(url.origin, this.ctx.host) !== url.origin
    ) {
      this.app.throw(503, `account ${purpose} consumer URL is invalid`);
    }
    return url;
  }

  private _getRawPathname(consumerUrl: string): string | undefined {
    const match = consumerUrl.match(/^[a-z][a-z\d+.-]*:\/\/[^/?#]*(\/[^?#]*)?(?:[?#]|$)/i);
    return match?.[1] ?? (match ? '/' : undefined);
  }

  private _getActivationLinkWithToken(url: URL, token: string) {
    return this._getConsumerLinkWithToken(url, token);
  }

  private _getPasswordSetLinkWithToken(url: URL, token: string) {
    return this._getConsumerLinkWithToken(url, token);
  }

  private _getPasswordResetLinkWithToken(url: URL, token: string) {
    return this._getConsumerLinkWithToken(url, token);
  }

  private _getConsumerLinkWithToken(url: URL, token: string) {
    url.searchParams.set('token', token);
    return url.toString();
  }

  private _normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private async _isPasswordResetEligible(user: EntityUser) {
    return (
      user.accountStatus === 'active' &&
      !!user.email &&
      (await this.$scope.authSimple.service.authSimple.hasByUserId(user.id))
    );
  }

  private _digestActivationToken(token: string) {
    return createHash(token, 'hex', 'sha256');
  }

  private _digestPasswordSetToken(token: string) {
    return createHash(token, 'hex', 'sha256');
  }

  private _digestPasswordResetToken(token: string) {
    return createHash(token, 'hex', 'sha256');
  }

  private _digestPasswordSetCandidate(email: string) {
    return createHash(`home-user:password-set-candidate\0${email}`, 'hex', 'sha256');
  }

  private _digestPasswordResetRecipient(email: string) {
    return createHash(`home-user:password-reset-recipient\0${email}`, 'hex', 'sha256');
  }

  private async _removeCurrentActivationToken(userId: EntityUser['id'], digest: string) {
    const currentDigest = await this.scope.cacheRedis.activationCurrent.get(userId);
    if (currentDigest === digest) await this.scope.cacheRedis.activationCurrent.del(userId);
    await this.scope.cacheRedis.activation.del(digest);
  }

  private async _removeCurrentPasswordSetToken(userId: EntityUser['id'], digest: string) {
    const currentDigest = await this.scope.cacheRedis.passwordSetCurrent.get(userId);
    if (currentDigest === digest) await this.scope.cacheRedis.passwordSetCurrent.del(userId);
    await this.scope.cacheRedis.passwordSet.del(digest);
  }

  private async _removeCurrentPasswordResetToken(userId: EntityUser['id'], digest: string) {
    const currentDigest = await this.scope.cacheRedis.passwordResetCurrent.get(userId);
    if (currentDigest === digest) await this.scope.cacheRedis.passwordResetCurrent.del(userId);
    await this.scope.cacheRedis.passwordReset.del(digest);
  }

  private _maskEmail(email: string) {
    const [local, domain] = email.split('@');
    if (!domain) return '***';
    return `${local.slice(0, 1)}***@${domain}`;
  }

  private _audit(action: string, outcome: string, userId?: EntityUser['id'], reason?: string) {
    this.$logger.info('home-user account security event', {
      event: 'home-user.account.security',
      action,
      outcome,
      userId: userId?.toString(),
      reason,
    });
  }

  private async _getCurrentUser(): Promise<EntityUser> {
    const user = this.bean.passport.currentUser;
    if (!user || user.anonymous) this.app.throw(401);
    const currentUser = await this.scope.model.user.getById(user.id);
    if (!currentUser) this.app.throw(401);
    return currentUser;
  }
}
