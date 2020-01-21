const require3 = require('require3');
const uuid = require3('uuid');

const modelFn = require('../../../model/user.js');
const modelAgentFn = require('../../../model/userAgent.js');
const modelAuthFn = require('../../../model/auth.js');
const modelAuthProviderFn = require('../../../model/authProvider.js');

const _usersAnonymous = {};

module.exports = ctx => {

  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  class User {

    constructor() {
      this._model = null;
      this._modelAgent = null;
      this._modelAuth = null;
      this._modelAuthProvider = null;
      this._sequence = null;
      this._config = null;
    }

    get model() {
      if (!this._model) this._model = new (modelFn(ctx.app))(ctx);
      return this._model;
    }

    get modelAgent() {
      if (!this._modelAgent) this._modelAgent = new (modelAgentFn(ctx.app))(ctx);
      return this._modelAgent;
    }

    get modelAuth() {
      if (!this._modelAuth) this._modelAuth = new (modelAuthFn(ctx.app))(ctx);
      return this._modelAuth;
    }

    get modelAuthProvider() {
      if (!this._modelAuthProvider) this._modelAuthProvider = new (modelAuthProviderFn(ctx.app))(ctx);
      return this._modelAuthProvider;
    }

    get sequence() {
      if (!this._sequence) this._sequence = ctx.meta.sequence.module(moduleInfo.relativeName);
      return this._sequence;
    }

    get config() {
      if (!this._config) this._config = ctx.config.module(moduleInfo.relativeName);
      return this._config;
    }

    async anonymous() {
      // cache
      let _userAnonymous = _usersAnonymous[ctx.instance.id];
      if (_userAnonymous) return _userAnonymous;
      // try get
      _userAnonymous = await this.get({ anonymous: 1 });
      if (_userAnonymous) {
        _usersAnonymous[ctx.instance.id] = _userAnonymous;
        return _userAnonymous;
      }
      // add user
      const userId = await this.add({ disabled: 0, anonymous: 1 });
      // addRole
      const role = await ctx.meta.role.getSystemRole({ roleName: 'anonymous' });
      await ctx.meta.role.addUserRole({ userId, roleId: role.id });
      // ready
      _userAnonymous = await this.get({ id: userId });
      _usersAnonymous[ctx.instance.id] = _userAnonymous;
      return _userAnonymous;
    }

    async loginAsAnonymous() {
      const userOp = await this.anonymous();
      const user = {
        op: userOp,
        agent: userOp,
        provider: null,
      };
      await ctx.login(user);
      // maxAge
      const maxAge = this.config.anonymous.maxAge;
      ctx.session.maxAge = maxAge;
      // ok
      return user;
    }

    anonymousId() {
      let _anonymousId = ctx.cookies.get('anonymous', { encrypt: true });
      if (!_anonymousId) {
        _anonymousId = uuid.v4().replace(/-/g, '');
        const maxAge = this.config.anonymous.maxAge;
        ctx.cookies.set('anonymous', _anonymousId, { encrypt: true, maxAge });
      }
      return _anonymousId;
    }

    async check() {
      // check if has ctx.user
      if (!ctx.isAuthenticated() || !ctx.user.op || !ctx.user.agent || ctx.user.op.iid !== ctx.instance.id) ctx.throw(401);
      // check if deleted,disabled,agent
      const userOp = await this.get({ id: ctx.user.op.id });
      // deleted
      if (!userOp) ctx.throw.module(moduleInfo.relativeName, 1004);
      // disabled
      if (userOp.disabled) ctx.throw.module(moduleInfo.relativeName, 1005);
      // hold user
      ctx.user.op = userOp;
      // agent
      if (ctx.user.agent.id !== ctx.user.op.id) {
        const agent = await this.agent({ userId: ctx.user.op.id });
        if (!agent) ctx.throw.module(moduleInfo.relativeName, 1006);
        if (agent.id !== ctx.user.agent.id) ctx.throw.module(moduleInfo.relativeName, 1006);
        if (agent.disabled) ctx.throw.module(moduleInfo.relativeName, 1005);
        // hold agent
        ctx.user.agent = agent;
      } else {
        // hold agent
        ctx.user.agent = userOp;
      }
    }

    async setActivated({ user }) {
      // save
      if (user.activated !== undefined) delete user.activated;
      await this.save({ user });
      // tryActivate
      const tryActivate = user.emailConfirmed || user.mobileVerified;
      if (tryActivate) {
        await this.userRoleStageActivate({ userId: user.id });
      }
    }

    async userRoleStageAdd({ userId }) {
      // roleNames
      let roleNames = this.config.account.needActivation ? 'registered' : this.config.account.activatedRoles;
      roleNames = roleNames.split(',');
      for (const roleName of roleNames) {
        const role = await ctx.meta.role.get({ roleName });
        await ctx.meta.role.addUserRole({ userId, roleId: role.id });
      }
    }

    async userRoleStageActivate({ userId }) {
      // get
      const user = await this.get({ id: userId });
      // only once
      if (user.activated) return;
      // adjust role
      if (this.config.account.needActivation) {
        // userRoles
        const userRoles = await ctx.meta.role.getUserRolesDirect({ userId });
        // userRolesMap
        const map = {};
        for (const role of userRoles) {
          map[role.roleName] = role;
        }
        // remove from registered
        if (map.registered) {
          const roleRegistered = await ctx.meta.role.getSystemRole({ roleName: 'registered' });
          await ctx.meta.role.deleteUserRole({ userId, roleId: roleRegistered.id });
        }
        // add to activated
        const roleNames = this.config.account.activatedRoles.split(',');
        for (const roleName of roleNames) {
          if (!map[roleName]) {
            const role = await ctx.meta.role.get({ roleName });
            await ctx.meta.role.addUserRole({ userId, roleId: role.id });
          }
        }
      }
      // set activated
      await this.save({
        user: { id: userId, activated: 1 },
      });
    }

    async exists({ userName, email, mobile }) {
      userName = userName || '';
      email = email || '';
      mobile = mobile || '';
      if (this.config.checkUserName === true && userName) {
        return await this.model.queryOne(
          `select * from aUser
             where iid=? and deleted=0 and ((userName=?) or (?<>'' and email=?) or (?<>'' and mobile=?))`,
          [ ctx.instance.id, userName, email, email, mobile, mobile ]);
      }
      return await this.model.queryOne(
        `select * from aUser
             where iid=? and deleted=0 and ((?<>'' and email=?) or (?<>'' and mobile=?))`,
        [ ctx.instance.id, email, email, mobile, mobile ]);
    }

    async add({
      disabled = 0, userName, realName, email, mobile, avatar, motto, locale, anonymous = 0,
    }) {
      // check if incomplete information
      let needCheck;
      if (anonymous) {
        needCheck = false;
      } else if (this.config.checkUserName === true) {
        needCheck = userName || email || mobile;
      } else {
        needCheck = email || mobile;
      }
      // if exists
      if (needCheck) {
        const res = await this.exists({ userName, email, mobile });
        if (res) ctx.throw.module(moduleInfo.relativeName, 1001);
      }
      // insert
      const res = await this.model.insert({
        disabled,
        userName,
        realName,
        email,
        mobile,
        avatar,
        motto,
        locale,
        anonymous,
      });
      return res.insertId;
    }

    async get(where) {
      return await this.model.get(where);
    }

    async save({ user }) {
      if (Object.keys(user).length > 1) {
        await this.model.update(user);
      }
    }

    async agent({ userId }) {
      const sql = `
        select a.* from aUser a
          left join aUserAgent b on a.id=b.userIdAgent
            where a.iid=? and a.deleted=0 and b.userId=?
      `;
      return await ctx.model.queryOne(sql, [ ctx.instance.id, userId ]);
    }

    async agentsBy({ userId }) {
      const sql = `
        select a.* from aUser a
          left join aUserAgent b on a.id=b.userId
            where a.iid=? and a.deleted=0 and b.userIdAgent=?
      `;
      return await ctx.model.query(sql, [ ctx.instance.id, userId ]);
    }

    async addAgent({ userIdAgent, userId }) {
      await this.modelAgent.insert({
        userIdAgent,
        userId,
      });
    }

    async removeAgent({ userIdAgent, userId }) {
      await this.modelAgent.delete({
        userIdAgent,
        userId,
      });
    }

    async switchAgent({ userIdAgent }) {
      const op = ctx.user.op;
      ctx.user.op = await this.get({ id: userIdAgent });
      try {
        await this.check();
        await ctx.login(ctx.user);
        return ctx.user;
      } catch (err) {
        ctx.user.op = op;
        throw err;
      }
    }

    async switchOffAgent() {
      return await this.switchAgent({ userIdAgent: ctx.user.agent.id });
    }

    async list({ roleId, query, anonymous, page }) {
      const roleJoin = roleId ? 'left join aUserRole b on a.id=b.userId' : '';
      const roleWhere = roleId ? `and b.roleId=${ctx.model._format2(roleId)}` : '';
      const queryLike = query ? ctx.model._format2({ op: 'like', val: query }) : '';
      const queryWhere = query ? `and ( a.userName like ${queryLike} or a.realName like ${queryLike} or a.mobile like ${queryLike} )` : '';
      const anonymousWhere = anonymous !== undefined ? `and a.anonymous=${ctx.model._format2(anonymous)}` : '';
      const _limit = ctx.model._limit(page.size, page.index);
      const sql = `
        select a.* from aUser a
          ${roleJoin}
            where a.iid=? and a.deleted=0
                  ${anonymousWhere}
                  ${roleWhere}
                  ${queryWhere}
            ${_limit}
      `;
      return await ctx.model.query(sql, [ ctx.instance.id ]);
    }

    async disable({ userId, disabled }) {
      await this.model.update({ id: userId, disabled });
    }

    async delete({ userId }) {
      await ctx.meta.role.deleteAllUserRoles({ userId });
      await this.model.delete({ id: userId });
    }

    // roles
    async roles({ userId, page }) {
      page = ctx.meta.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      return await ctx.model.query(`
        select a.*,b.roleName from aUserRole a
          left join aRole b on a.roleId=b.id
            where a.iid=? and a.userId=?
            ${_limit}
        `, [ ctx.instance.id, userId ]);
    }

    // state: login/associate
    async verify({ state = 'login', profileUser }) {
      // verifyUser
      const verifyUser = {};

      // provider
      const providerItem = await this.getAuthProvider({
        module: profileUser.module,
        providerName: profileUser.provider,
      });

      // check if auth exists
      const authItem = await this.modelAuth.get({
        providerId: providerItem.id,
        profileId: profileUser.profileId,
      });
      // avatar
      await this._prepareAvatar({ authItem, profile: profileUser.profile });
      // auth
      let authId;
      let authUserId;
      if (authItem) {
        // update
        authItem.profile = JSON.stringify(profileUser.profile);
        await this.modelAuth.update(authItem);
        authId = authItem.id;
        authUserId = authItem.userId;
      } else {
        // add
        const res = await this.modelAuth.insert({
          providerId: providerItem.id,
          profileId: profileUser.profileId,
          profile: JSON.stringify(profileUser.profile),
        });
        authId = res.insertId;
      }
      verifyUser.provider = {
        id: authId,
        providerId: providerItem.id,
        module: profileUser.module,
        providerName: profileUser.provider,
        // profile: profileUser.profile,  // maybe has private info
      };

      // columns
      const columns = [
        'userName', 'realName', 'email', 'mobile', 'avatar', 'motto', 'locale',
      ];

      //
      let userId;
      if (state === 'associate') {
        // check if ctx.user exists
        if (!ctx.user || ctx.user.agent.anonymous) return false;
        userId = ctx.user.agent.id;
        // associated
        // update user
        await this._updateUserInfo(userId, profileUser.profile, columns);
        // force update auth's userId, maybe different
        if (authUserId !== userId) {
          // delete old records
          await this.modelAuth.delete({
            providerId: providerItem.id,
            userId,
          });
          // update
          await this.modelAuth.update({
            id: authId,
            userId,
          });
        }
        // ready
        verifyUser.op = ctx.user.op;
        verifyUser.agent = ctx.user.agent;
      } else if (state === 'login') {
        // check if user exists
        let user;
        if (authUserId) {
          user = await this.model.get({ id: authUserId });
        }
        if (user) {
          // check if disabled
          if (user.disabled) return false;
          // update user
          await this._updateUserInfo(user.id, profileUser.profile, columns);
          userId = user.id;
        } else {
          // add user
          userId = await this._addUserInfo(profileUser.profile, columns);
          user = await this.model.get({ id: userId });
          // update auth's userId
          await this.modelAuth.update({
            id: authId,
            userId,
          });
        }
        // ready
        verifyUser.op = user;
        verifyUser.agent = user;
      }

      // restore maxAge
      if (profileUser.maxAge === 0) {
        ctx.session.maxAge = 0;
      } else {
        ctx.session.maxAge = profileUser.maxAge || this.config.authenticated.maxAge;
      }

      // user verify event
      await ctx.meta.event.invoke({
        module: moduleInfo.relativeName, name: 'userVerify', data: { verifyUser, profileUser },
      });

      // ok
      return verifyUser;
    }

    async _downloadAvatar({ avatar }) {
      const timeout = this.config.auth.avatar.timeout;
      let res;
      try {
        res = await ctx.curl(avatar, { method: 'GET', timeout });
      } catch (err) {
        res = await ctx.curl(this.config.auth.avatar.default, { method: 'GET', timeout });
      }
      return res;
    }

    async _prepareAvatar({ authItem, profile }) {
      // avatar
      let avatarOld;
      if (authItem) {
        const _profile = JSON.parse(authItem.profile);
        avatarOld = _profile.avatar;
      }
      if (!profile.avatar || profile.avatar === avatarOld) return;
      // download image
      const res = await this._downloadAvatar({ avatar: profile.avatar });
      // meta
      const mime = res.headers['content-type'] || '';
      const ext = mime.split('/')[1] || '';
      const meta = {
        filename: `user-avatar.${ext}`,
        encoding: '7bit',
        mime,
        fields: {
          mode: 1,
          flag: `user-avatar:${profile.avatar}`,
        },
      };
      // upload
      const res2 = await ctx.performAction({
        method: 'post',
        url: '/a/file/file/uploadInner',
        body: {
          file: res.data,
          meta,
        },
      });
      // hold
      profile._avatar = res2.downloadUrl;
    }

    async _addUserInfo(profile, columns) {
      const user = {};
      for (const column of columns) {
        // others
        await this._setUserInfoColumn(user, column, profile);
      }
      // add user
      const userId = await this.add(user);
      // add role
      await this.userRoleStageAdd({ userId });
      // try setActivated
      const data = { id: userId };
      // emailConfirmed
      if (profile.emailConfirmed && profile.email) {
        data.emailConfirmed = 1;
      }
      // mobileVerified
      if (profile.mobileVerified && profile.mobile) {
        data.mobileVerified = 1;
      }
      // setActivated
      await this.setActivated({ user: data });
      // ok
      return userId;
    }

    async _updateUserInfo(userId, profile, columns) {
      const users = await this.model.select({
        where: { id: userId },
        columns,
      });
      const user = users[0];
      for (const column of columns) {
        await this._setUserInfoColumn(user, column, profile);
      }
      user.id = userId;
      await this.save({ user });
    }

    async _setUserInfoColumn(user, column, profile) {
      // value
      let value = profile[column];
      // avatar
      if (column === 'avatar' && profile._avatar) {
        user[column] = profile._avatar;
        return;
      }
      // only set when empty
      if (user[column] || !value) return;
      // userName
      if (column === 'userName') {
        const res = await this.exists({ [column]: value });
        if (res) {
          // sequence
          const sequence = await this.sequence.next('userName');
          value = `${value}__${sequence}`;
        }
      } else if (column === 'email' || column === 'mobile') {
        const res = await this.exists({ [column]: value });
        if (res) {
          value = null;
        }
      }
      if (value) {
        user[column] = value;
      }
    }

    async getAuthProvider({ subdomain, iid, id, module, providerName }) {
      // ctx.instance maybe not exists
      const data = id ? {
        iid: iid || ctx.instance.id,
        id,
      } : {
        iid: iid || ctx.instance.id,
        module,
        providerName,
      };
      const res = await ctx.db.get('aAuthProvider', data);
      if (res) return res;
      if (!module || !providerName) throw new Error('Invalid arguments');
      // queue
      return await ctx.app.meta.queue.pushAsync({
        subdomain: subdomain || ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'registerAuthProvider',
        data: { module, providerName },
      });
    }

    async registerAuthProvider({ module, providerName }) {
      // get
      const res = await this.modelAuthProvider.get({ module, providerName });
      if (res) return res;
      // data
      const _module = ctx.app.meta.modules[module];
      const _provider = _module.main.meta.auth.providers[providerName];
      if (!_provider) throw new Error(`authProvider ${module}:${providerName} not found!`);
      const data = {
        module,
        providerName,
        config: JSON.stringify(_provider.config),
        disabled: 0,
      };
      // insert
      const res2 = await this.modelAuthProvider.insert(data);
      data.id = res2.insertId;
      return data;
    }

  }

  return User;
};
