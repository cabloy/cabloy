const modelFn = require('../../../model/user.js');
const modelAgentFn = require('../../../model/userAgent.js');
const modelAuthFn = require('../../../model/auth.js');
const modelAuthProviderFn = require('../../../model/authProvider.js');

module.exports = ctx => {

  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  class User {

    constructor() {
      this._model = null;
      this._modelAgent = null;
      this._modelAuth = null;
      this._modelAuthProvider = null;
      this._sequence = null;
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

    async anonymous() {
      // new
      const userId = await this.add({ disabled: 0, anonymous: 1 });
      // addRole
      const role = await ctx.meta.role.getSystemRole({ roleName: 'anonymous' });
      await ctx.meta.role.addUserRole({ userId, roleId: role.id });
      return userId;
    }

    async loginAsAnonymous() {
      const maxAge = ctx.config.module(moduleInfo.relativeName).anonymous.maxAge;
      let userId = ctx.cookies.get('anonymous', { encrypt: true });
      let userOp;
      if (userId) {
        userOp = await this.get({ id: userId });
      }
      if (!userOp) {
        userId = await this.anonymous();
        ctx.cookies.set('anonymous', userId.toString(), { encrypt: true, maxAge });
        userOp = await this.get({ id: userId });
      }
      const user = {
        op: userOp,
        agent: userOp,
      };
      await ctx.login(user);
      // maxAge
      ctx.session.maxAge = maxAge;
      return user;
    }

    async check() {
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

    async signup(user, ops) {
      ops = ops || {};
      const userId = await this.add(user);
      if (ops.addRole !== false) {
        const role = await ctx.meta.role.getSystemRole({ roleName: ctx.config.module(moduleInfo.relativeName).signupRoleName });
        await ctx.meta.role.addUserRole({ userId, roleId: role.id });
      }
      return userId;
    }

    async exists({ userName, email, mobile }) {
      userName = userName || '';
      email = email || '';
      mobile = mobile || '';
      if (ctx.config.module(moduleInfo.relativeName).checkUserName === true) {
        return await this.model.queryOne(
          `select * from aUser
             where iid=? and deleted=0 and ((?<>'' and userName=?) or (?<>'' and email=?) or (?<>'' and mobile=?))`,
          [ ctx.instance.id, userName, userName, email, email, mobile, mobile ]);
      }
      return await this.model.queryOne(
        `select * from aUser
             where iid=? and deleted=0 and ((?<>'' and email=?) or (?<>'' and mobile=?))`,
        [ ctx.instance.id, email, email, mobile, mobile ]);
    }

    async add({ disabled = 0, userName, realName, email, mobile, avatar, motto, locale, anonymous = 0 }) {
      // check if incomplete information
      let needCheck;
      if (anonymous) {
        needCheck = false;
      } else if (ctx.config.module(moduleInfo.relativeName).checkUserName === true) {
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
      await this.model.update(user);
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
      ctx.user.op = { id: userIdAgent };
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

    async verify(profileUser) {
      // state
      //   login/associate
      const state = ctx.request.query.state || 'login';

      // verifyUser
      const verifyUser = {};

      // provider
      const providerItem = await this.getAuthProvider({
        module: profileUser.module,
        providerName: profileUser.provider,
      });
      const config = JSON.parse(providerItem.config);

      // check if auth exists
      const authItem = await this.modelAuth.get({
        providerId: providerItem.id,
        profileId: profileUser.profileId,
      });
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
        module: profileUser.module,
        providerName: profileUser.provider,
        // profile: profileUser.profile,  // maybe has private info
      };

      // columns
      const columns = [ 'userName', 'realName', 'email', 'mobile', 'avatar', 'motto', 'locale' ];

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
          // check if addUser
          if (config.addUser === false) return false;
          // add user
          userId = await this._addUserInfo(profileUser.profile, columns, config.addRole !== false);
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
        ctx.session.maxAge = profileUser.maxAge || ctx.config.module(moduleInfo.relativeName).registered.maxAge;
      }
      return verifyUser;
    }

    async _addUserInfo(profile, columns, addRole) {
      const user = {};
      for (const column of columns) {
        await this._setUserInfoColumn(user, column, profile[column]);
      }
      return await this.signup(user, { addRole });
    }
    async _updateUserInfo(userId, profile, columns) {
      const users = await this.model.select({
        where: { id: userId },
        columns,
      });
      const user = users[0];
      for (const column of columns) {
        await this._setUserInfoColumn(user, column, profile[column]);
      }
      user.id = userId;
      await this.model.update(user);
    }

    async _setUserInfoColumn(user, column, value) {
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
          value = '';
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
      };
      // insert
      const res2 = await this.modelAuthProvider.insert(data);
      data.id = res2.insertId;
      return data;
    }

  }

  return User;
};
