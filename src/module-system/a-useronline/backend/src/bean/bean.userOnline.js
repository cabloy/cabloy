const moduleInfo = module.info;
const __atomClassUserOnline = {
  module: moduleInfo.relativeName,
  atomClassName: 'userOnline',
};
const __atomClassUserOnlineHistory = {
  module: moduleInfo.relativeName,
  atomClassName: 'userOnlineHistory',
};
module.exports = class UserOnline extends module.meta.class.BeanModuleBase {
  constructor(moduleName) {
    super(moduleName, 'userOnline');
  }

  get modelUserOnline() {
    return this.ctx.model.module(moduleInfo.relativeName).userOnline;
  }

  get configUserOnline() {
    return this.ctx.config.module(moduleInfo.relativeName);
  }

  get configUserOnlineExpired() {
    return this.configUserOnline.userOnline.expired;
  }

  async register({ user, isLogin }) {
    user = user.agent || user.op;
    // data
    const data = {
      onlineIPLast: this.ctx.ip,
      onlineTimeLast: new Date(),
      expireTime: this._combineExpireTime(),
    };
    // userOnline
    const res = await this._insertUserOnline({ user, data, isLogin });
    if (res) {
      // userOnlineHistory
      const res2 = await this._insertUserOnlineHistory({ user, data, isLogin });
      Object.assign(res, res2);
    }
    return res;
  }

  async heartBeat({ user }) {
    user = user.agent || user.op;
    const userId = user.id;
    const item = await this.modelUserOnline.get({ userId });
    if (!item) return false;
    if (item.expireTime <= Date.now()) return false;
    // Renewal
    if (item.expireTime - Date.now() < this.configUserOnlineExpired / 2) {
      await this.modelUserOnline.update({
        id: item.id,
        expireTime: this._combineExpireTime(),
      });
    }
    return true;
  }

  async kickOut({ user }) {
    // redis
    await this.ctx.bean.auth._clearRedisAuthAll({ user });
    // offline
    await this._offline({ user });
    // publish
    await this.sendMessageSystemLogout({ user, type: 'all' });
  }

  async _offline({ user }) {
    const userId = user.id;
    const item = await this.modelUserOnline.get({ userId });
    await this.modelUserOnline.update({
      id: item.id,
      expireTime: new Date(),
    });
  }

  async sendMessageSystemLogout({ user, type, provider }) {
    const userId = user.id;
    // content
    const content = {
      code: 401,
      message: 'logout',
      type,
    };
    if (provider) {
      content.provider = provider;
    }
    // send message-system
    const message = {
      userIdTo: userId,
      content,
    };
    this.ctx.bean.io.publishMessageSystem({ message });
  }

  _combineExpireTime() {
    return new Date(Date.now() + this.configUserOnlineExpired);
  }

  async _insertUserOnline({ user, data, isLogin }) {
    const userId = user.id;
    // check if exists
    let item = await this.modelUserOnline.get({ userId });
    if (!item) {
      //   create
      const atomKey = await this.ctx.bean.atom.create({
        atomClass: __atomClassUserOnline,
        user,
        item: {
          atomName: user.userName,
          userId,
        },
      });
      item = {
        id: atomKey.itemId,
        loginCount: 0,
        onlineCount: 0,
        expireTime: 0,
      };
    }
    // isLogin
    if (isLogin) {
      data = {
        loginCount: item.loginCount + 1,
        loginIPLast: data.onlineIPLast,
        loginTimeLast: data.onlineTimeLast,
        onlineCount: item.onlineCount + 1,
        ...data,
      };
    } else {
      // check expireTime
      if (item.expireTime > Date.now()) return null;
      data = {
        onlineCount: item.onlineCount + 1,
        ...data,
      };
    }
    // update
    await this.modelUserOnline.update({
      id: item.id,
      ...data,
    });
    // ok
    return {
      userOnlineId: item.id,
    };
  }

  async _insertUserOnlineHistory({ user, data, isLogin }) {
    const userId = user.id;
    //   write
    const atomKey = await this.ctx.bean.atom.write({
      atomClass: __atomClassUserOnlineHistory,
      item: {
        userId,
        onlineIP: data.onlineIPLast,
        onlineTime: data.onlineTimeLast,
        isLogin,
      },
      options: {
        ignoreValidate: true,
      },
    });
    // ok
    return {
      userOnlineHistoryId: atomKey.itemId,
    };
  }
};
