import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { Api } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { DtoAccountActivation } from '../dto/accountActivation.ts';
import { DtoAccountCurrent } from '../dto/accountCurrent.ts';
import { DtoAccountPasswordChange } from '../dto/accountPasswordChange.ts';
import { DtoAccountPasswordReset } from '../dto/accountPasswordReset.ts';
import { DtoAccountPasswordResetRequest } from '../dto/accountPasswordResetRequest.ts';
import { DtoAccountPasswordResetRequestResult } from '../dto/accountPasswordResetRequestResult.ts';
import { DtoAccountPasswordSet } from '../dto/accountPasswordSet.ts';
import { DtoAccountPasswordSetIssue } from '../dto/accountPasswordSetIssue.ts';
import { DtoAccountProfileUpdate } from '../dto/accountProfileUpdate.ts';
import { DtoAccountRelogin } from '../dto/accountRelogin.ts';

export interface IControllerOptionsAccount extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsAccount>({
  path: 'account',
  tags: ['HomeUserAccount'],
})
export class ControllerAccount extends BeanBase {
  @Web.get('current')
  @Api.body(DtoAccountCurrent)
  async current(): Promise<DtoAccountCurrent> {
    return await this.scope.service.account.current();
  }

  @Web.patch('profile')
  @Api.body(DtoAccountCurrent)
  async updateProfile(@Arg.body() command: DtoAccountProfileUpdate): Promise<DtoAccountCurrent> {
    return await this.scope.service.account.updateProfile(command);
  }

  @Web.post('activation/consume')
  @Passport.public()
  @Core.rateLimit({
    enable: true,
    rateLimit: {
      mode: 'enforce',
      limit: 10,
      windowMs: 15 * 60 * 1000,
      key: 'ip',
      name: 'home-user-account-activation-consume',
      headers: true,
    },
  })
  async consumeActivation(@Arg.body() command: DtoAccountActivation): Promise<void> {
    await this.scope.service.account.consumeActivation(command);
  }

  @Web.post('password/change')
  @Api.body(DtoAccountRelogin)
  @Core.rateLimit({
    enable: true,
    rateLimit: {
      mode: 'enforce',
      limit: 10,
      windowMs: 15 * 60 * 1000,
      key: 'subject',
      name: 'home-user-account-password-change',
      headers: true,
    },
  })
  async changePassword(@Arg.body() command: DtoAccountPasswordChange): Promise<DtoAccountRelogin> {
    return await this.scope.service.account.changePassword(command);
  }

  @Web.post('password-set/issue')
  @Core.rateLimit({
    enable: true,
    rateLimit: {
      mode: 'enforce',
      limit: 3,
      windowMs: 15 * 60 * 1000,
      key: 'subject',
      name: 'home-user-account-password-set-issue',
      headers: true,
    },
  })
  async issuePasswordSetLink(@Arg.body() command: DtoAccountPasswordSetIssue): Promise<void> {
    await this.scope.service.account.issuePasswordSetLink(command);
  }

  @Web.post('password-set/consume')
  @Api.body(DtoAccountRelogin)
  @Passport.public()
  @Core.rateLimit({
    enable: true,
    rateLimit: {
      mode: 'enforce',
      limit: 10,
      windowMs: 15 * 60 * 1000,
      key: 'ip',
      name: 'home-user-account-password-set-consume',
      headers: true,
    },
  })
  async consumePasswordSet(@Arg.body() command: DtoAccountPasswordSet): Promise<DtoAccountRelogin> {
    return await this.scope.service.account.consumePasswordSet(command);
  }

  @Web.post('password-reset/request')
  @Passport.public()
  @Core.captchaVerify({ scene: 'captcha-simple:simple' })
  @Api.body(DtoAccountPasswordResetRequestResult)
  @Core.rateLimit({
    enable: true,
    rateLimit: {
      mode: 'enforce',
      limit: 5,
      windowMs: 15 * 60 * 1000,
      key: 'ip',
      name: 'home-user-account-password-reset-request',
      headers: true,
    },
  })
  async requestPasswordReset(
    @Arg.body() command: DtoAccountPasswordResetRequest,
  ): Promise<DtoAccountPasswordResetRequestResult> {
    return await this.scope.service.account.requestPasswordReset(command);
  }

  @Web.post('password-reset/consume')
  @Passport.public()
  @Api.body(DtoAccountRelogin)
  @Core.rateLimit({
    enable: true,
    rateLimit: {
      mode: 'enforce',
      limit: 10,
      windowMs: 15 * 60 * 1000,
      key: 'ip',
      name: 'home-user-account-password-reset-consume',
      headers: true,
    },
  })
  async consumePasswordReset(
    @Arg.body() command: DtoAccountPasswordReset,
  ): Promise<DtoAccountRelogin> {
    return await this.scope.service.account.consumePasswordReset(command);
  }
}
