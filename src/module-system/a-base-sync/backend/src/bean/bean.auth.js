const require3 = require('require3');
const uuid = require3('uuid');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  class Auth {
    constructor() {
      this._redisAuth = null;
    }

    get redisAuth() {
      if (!this._redisAuth) {
        this._redisAuth = ctx.app.redis.get('auth') || ctx.app.redis.get('cache');
      }
      return this._redisAuth;
    }

    // return current user auth info
    //   { op:{id},agent:{id},provider}
    async echo() {
      try {
        // check
        await ctx.bean.user.check();
        // logined
        return await this.getLoginInfo({ clientId: true });
      } catch (e) {
        // deleted,disabled
        return await this._logout_inner();
      }
    }

    async check() {
      return await this.getLoginInfo();
    }

    async logout() {
      const user = ctx.state.user;
      await this._sendMessageSystemLogout({ user });
      await this._clearRedisAuth({ user });
      await this._logout_inner();
    }

    async _logout_inner() {
      await ctx.logout();
      await ctx.bean.user.loginAsAnonymous();
      return await this.getLoginInfo();
    }

    async getLoginInfo(options) {
      options = options || {};
      const needClientId = options.clientId === true;
      const isAuthOpen = ctx.bean.authOpen.isAuthOpen();
      // info
      const info = {
        user: ctx.state.user,
        instance: this._getInstance(),
        locales: ctx.bean.base.locales(),
      };
      // config
      if (!isAuthOpen) {
        info.config = await this._getConfig();
      }
      // clientId
      if (needClientId) {
        info.clientId = uuid.v4().replace(/-/g, '');
      }
      // login info event
      if (!isAuthOpen) {
        await ctx.bean.event.invoke({
          name: 'loginInfo',
          data: { info },
        });
      }
      // ok
      return info;
    }

    _getInstance() {
      return {
        name: ctx.instance.name,
        title: ctx.instance.title,
      };
    }

    async _getConfig() {
      // instanceConfigsFront
      const instanceConfigsFront = ctx.bean.instance.getInstanceConfigsFront();
      // config
      let config = {
        modules: instanceConfigsFront,
      };
      // config base
      config = ctx.bean.util.extend(config, {
        modules: {
          'a-base': {
            account: this._getAccount(),
          },
        },
      });
      // // theme
      // const themeStatus = `user-theme:${ctx.state.user.agent.id}`;
      // const theme = await ctx.bean.status.module('a-user').get(themeStatus);
      // if (theme) {
      //   config.theme = theme;
      // }
      // localeModules
      config.localeModules = ctx.bean.base.localeModules();
      // ok
      return config;
    }

    _getAccount() {
      // account
      const account = ctx.bean.util.extend({}, ctx.config.module(moduleInfo.relativeName).account);
      account.activatedRoles = undefined;
      // url
      for (const key in account.activationProviders) {
        const relativeName = account.activationProviders[key];
        if (relativeName) {
          const moduleConfig = ctx.config.module(relativeName);
          ctx.bean.util.extend(account.url, moduleConfig.account.url);
        }
      }
      return account;
    }

    _getAuthRedisKey({ user }) {
      const userAgent = user.agent || user.op;
      if (!ctx.instance || !user.provider || !userAgent) return null;
      return `authToken:${ctx.instance.id}:${userAgent.id}:${user.provider.scene || ''}:${user.provider.id}`;
    }

    _getAuthRedisKeyPattern({ user, keyPrefix }) {
      return `${keyPrefix}authToken:${ctx.instance.id}:${user.id}:*`;
    }

    _pruneUser({ user }) {
      const _user = {
        op: { id: user.op.id, iid: user.op.iid, anonymous: user.op.anonymous },
      };
      if (user.agent && user.agent.id !== user.op.id) {
        _user.agent = { id: user.agent.id, iid: user.agent.iid, anonymous: user.agent.anonymous };
      }
      if (user.provider) {
        _user.provider = user.provider;
      }
      return _user;
    }

    async serializeUser({ user }) {
      // _user
      const _user = this._pruneUser({ user });
      // anonymous
      if (user.op.anonymous) {
        // not use redis
        return _user;
      }
      // save to redis
      const key = this._getAuthRedisKey({ user });
      if (!ctx.bean.util.checkDemo(false)) {
        // demo, allowed to auth more times
        _user.token = await this.redisAuth.get(key);
      } else {
        // create a new one
        _user.token = null;
      }
      if (!_user.token) {
        _user.token = uuid.v4().replace(/-/g, '');
      }
      await this.redisAuth.set(key, _user.token, 'PX', ctx.session.maxAge);
      // register user online
      await ctx.bean.userOnline.register({ user, isLogin: true });
      // ok
      return _user;
    }

    async deserializeUser({ user }) {
      if (user.op.anonymous) return user;
      // not throw 401: ctx.throw(401);
      if (!user.token) return null;
      // check token
      const key = this._getAuthRedisKey({ user });
      if (!key) return null;
      const token = await this.redisAuth.get(key);
      if (token !== user.token) return null;
      // ready
      return user;
    }

    async _sendMessageSystemLogout({ user }) {
      if (!user || user.op.anonymous) return;
      // send message-system
      await ctx.bean.userOnline.sendMessageSystemLogout({
        user: user.op, // should use user.op
        type: 'provider',
        provider: user.provider,
      });
    }

    async _clearRedisAuth({ user }) {
      if (!user || user.agent.anonymous) return;
      // redis auth
      const key = this._getAuthRedisKey({ user });
      if (key) {
        await this.redisAuth.del(key);
      }
    }

    async _clearRedisAuthAll({ user }) {
      const keyPrefix = this.redisAuth.options.keyPrefix;
      const keyPattern = this._getAuthRedisKeyPattern({ user, keyPrefix });
      const keys = await this.redisAuth.keys(keyPattern);
      for (const fullKey of keys) {
        const key = keyPrefix ? fullKey.substr(keyPrefix.length) : fullKey;
        await this.redisAuth.del(key);
      }
    }
  }

  return Auth;
};
