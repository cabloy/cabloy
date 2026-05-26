import type { Constructable } from 'vona';
import type { IJwtToken } from 'vona-module-a-jwt';
import type { IAuthUserProfile, IPassport, IUser } from 'vona-module-a-user';

import { combineQueries, isNil } from '@cabloy/utils';
import { TableIdentity } from 'table-identity';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { EntityAuthProvider } from '../entity/authProvider.ts';
import type { StrategyBase } from '../lib/strategyBase.ts';
import type { IAuthenticateStrategyState } from '../types/auth.ts';
import type {
  IAuthProviderClientOptions,
  IAuthProviderStrategy,
  IAuthProviderVerify,
  IDecoratorAuthProviderOptions,
  TypeStrategyOptions,
  TypeStrategyVerifyArgs,
} from '../types/authProvider.ts';

import { StrategyMock } from '../lib/strategyMock.ts';

@Service()
export class ServiceAuth extends BeanBase {
  async authenticateCallback(
    entityAuthProvider: EntityAuthProvider,
    beanAuthProvider: IAuthProviderVerify,
    clientOptions: IAuthProviderClientOptions,
    onionOptions: IDecoratorAuthProviderOptions,
    state?: IAuthenticateStrategyState,
    strategyVerifyArgs?: TypeStrategyVerifyArgs,
  ) {
    const profileUser = await beanAuthProvider.verify(
      strategyVerifyArgs ?? [],
      clientOptions,
      onionOptions,
      state,
    );
    // confirmed
    if (isNil(profileUser.confirmed)) profileUser.confirmed = clientOptions.confirmed;
    // issuePassport
    const passport = await this.issuePassport(
      profileUser,
      entityAuthProvider,
      clientOptions,
      state,
    );
    // signin
    const jwtToken = await this.bean.passport.signin(passport, {
      authToken: clientOptions.authTokenOptions,
    });
    return jwtToken;
  }

  async issuePassport(
    profileUser: IAuthUserProfile,
    entityAuthProvider: EntityAuthProvider,
    clientOptions: IAuthProviderClientOptions,
    state?: IAuthenticateStrategyState,
  ): Promise<IPassport> {
    // event: issuePassport
    return await this.scope.event.issuePassport.emit(
      { profileUser, entityAuthProvider, clientOptions, state },
      async ({ profileUser, entityAuthProvider, clientOptions, state }) => {
        return await this._issuePassportInner(
          profileUser,
          entityAuthProvider,
          clientOptions,
          state,
        );
      },
    );
  }

  private async _issuePassportInner(
    profileUser: IAuthUserProfile,
    entityAuthProvider: EntityAuthProvider,
    _clientOptions: IAuthProviderClientOptions,
    state?: IAuthenticateStrategyState,
  ): Promise<IPassport> {
    // stateIntention
    const stateIntention = state?.intention || 'login';
    const authProviderId = entityAuthProvider.id;
    const profileId = profileUser.id;
    // passport
    const passport: IPassport = {};
    // auth
    let entityAuth = await this.scope.model.auth.get({ authProviderId, profileId });
    if (!entityAuth) {
      if (stateIntention === 'migrate') {
        return this.scope.error.TheAuthShouldBeEnabled.throw();
      }
      // create new auth
      entityAuth = await this.scope.model.auth.insert({
        authProviderId,
        profileId,
        profile: JSON.stringify(profileUser),
      });
    }
    // passport.auth ready
    passport.auth = entityAuth;
    // user
    if (stateIntention === 'migrate') {
      // should check user so as to create this current passport
      const userCurrent = await this._checkAuthTokenAndReturnCurrentUser(state?.accessToken);
      // migrate
      if (TableIdentity.isNotEqual(entityAuth.userId, userCurrent.id)) {
        await this.accountMigration(userCurrent.id, entityAuth.userId);
      }
      // user
      const user = await this.bean.user.findOneById(entityAuth.userId);
      // ready
      passport.user = user;
    } else if (stateIntention === 'associate') {
      // should check user so as to create this current passport
      const userCurrent = await this._checkAuthTokenAndReturnCurrentUser(state?.accessToken);
      // associated
      // force update auth's userId, maybe different
      if (TableIdentity.isNotEqual(entityAuth.userId, userCurrent.id)) {
        // accountMigration / update
        if (entityAuth.userId) {
          await this.accountMigration(entityAuth.userId, userCurrent.id);
          entityAuth.userId = userCurrent.id;
        } else {
          // delete old record
          await this.scope.model.auth.delete({
            authProviderId,
            userId: userCurrent.id,
          });
          await this.scope.model.auth.update({
            id: entityAuth.id,
            userId: userCurrent.id,
          });
          entityAuth.userId = userCurrent.id;
        }
      }
      // ready
      passport.user = userCurrent;
    } else if (stateIntention === 'login' || stateIntention === 'register') {
      // check if user exists
      let entityUser: IUser | undefined;
      if (entityAuth.userId) {
        entityUser = await this.bean.user.findOneById(entityAuth.userId);
      }
      if (!entityUser) {
        // register user
        entityUser = await this.bean.user.registerByProfile(profileUser, true);
        // update auth's userId
        await this.scope.model.auth.update({
          id: entityAuth.id,
          userId: entityUser.id,
        });
        entityAuth.userId = entityUser.id;
      }
      // ready
      passport.user = entityUser;
    }
    // ok
    return passport;
  }

  private async _checkAuthTokenAndReturnCurrentUser(accessToken?: string) {
    if (accessToken) {
      await this.bean.passport.checkAuthToken(accessToken, 'oauth');
    }
    const userCurrent = this.bean.passport.currentUser;
    if (!userCurrent) return this.app.throw(401);
    return userCurrent;
  }

  async accountMigration(userIdFrom: TableIdentity, userIdTo: TableIdentity) {
    return await this.scope.event.accountMigration.emit(
      { userIdFrom, userIdTo },
      async ({ userIdFrom, userIdTo }) => {
        return await this._accountMigrationInner(userIdFrom, userIdTo);
      },
    );
  }

  private async _accountMigrationInner(userIdFrom: TableIdentity, userIdTo: TableIdentity) {
    // aAuth: delete old records
    const list = await this.scope.model.auth.select({
      where: {
        userId: userIdFrom,
      },
    });
    for (const item of list) {
      await this.scope.model.auth.delete({
        userId: userIdTo,
        authProviderId: item.authProviderId,
      });
    }
    // aAuth: update records
    await this.scope.model.auth.update(
      {
        userId: userIdTo,
      },
      {
        where: {
          userId: userIdFrom,
        },
      },
    );
    // remove user
    await this.bean.user.removeById(userIdFrom);
  }

  public async authCallback(strategyState: IAuthenticateStrategyState): Promise<IJwtToken> {
    // clientOptions
    const { entityAuthProvider, disabled, beanFullName, onionOptions, clientOptions } =
      await this.bean.authProvider.getClientOptions(
        {
          id: strategyState.authProviderId,
        },
        strategyState.clientOptions,
      );
    if (!entityAuthProvider || disabled) return this.app.throw(403);
    // execute
    const beanAuthProvider = this.app.bean._getBean<IAuthProviderVerify & IAuthProviderStrategy>(
      beanFullName as any,
    );
    // strategy
    if (!beanAuthProvider.strategy) return this.app.throw(401);
    const strategyOptions: TypeStrategyOptions = clientOptions;
    const Strategy = await this.getStrategyConstructable(
      beanAuthProvider,
      clientOptions,
      onionOptions,
    );
    // strategy.authenticate
    return new Promise((resolve, reject) => {
      const strategy = new Strategy(strategyOptions, async (...args: TypeStrategyVerifyArgs) => {
        try {
          const jwt = await this.scope.service.auth.authenticateCallback(
            entityAuthProvider,
            beanAuthProvider,
            clientOptions,
            onionOptions,
            strategyState,
            args,
          );
          if (clientOptions.mockUsername) {
            return resolve(jwt);
          }
          // code
          const code = await this.bean.passport.createOauthCodeFromOauthAuthToken(jwt.accessToken);
          // redirect
          if (!strategyState.redirect) return reject(new Error('redirect not specified'));
          const redirectUrl = combineQueries(strategyState.redirect, {
            [this.scope.config.oauthCodeField]: code,
          });
          return this.ctx.redirect(redirectUrl);
        } catch (err) {
          reject(err);
        }
      });
      strategy.error = (err: Error) => {
        reject(err);
      };
      strategy.authenticate(this.ctx.request, strategyOptions);
    });
  }

  public async getStrategyConstructable(
    beanAuthProvider: IAuthProviderVerify & IAuthProviderStrategy,
    clientOptions: IAuthProviderClientOptions,
    onionOptions: IDecoratorAuthProviderOptions,
  ): Promise<Constructable<StrategyBase>> {
    const Strategy =
      clientOptions.mockUsername || (this.app.meta.isDev && onionOptions.useMockForDev !== false)
        ? StrategyMock
        : await beanAuthProvider.strategy(clientOptions, onionOptions);
    return Strategy;
  }
}
