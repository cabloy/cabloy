module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const __atomClassUserOnline = {
    module: moduleInfo.relativeName,
    atomClassName: 'userOnline',
  };
  const __atomClassUserOnlineHistory = {
    module: moduleInfo.relativeName,
    atomClassName: 'userOnlineHistory',
  };
  class UserOnline extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'userOnline');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get modelUserOnline() {
      return ctx.model.module(moduleInfo.relativeName).userOnline;
    }

    get configUserOnline() {
      return ctx.config.module(moduleInfo.relativeName);
    }

    async register({ user, isLogin }) {
      user = user.agent || user.op;
      // data
      const data = {
        onlineIPLast: (ctx.socket && ctx.socket.remoteAddress) || ctx.ip,
        onlineTimeLast: new Date(),
        expireTime: this._combineExpireTime(),
      };
      // userOnline
      const res = await this._insertUserOnline({ user, data, isLogin });
      if (res) {
        // userOnlineHistory
        await this._insertUserOnlineHistory({ user, data, isLogin });
      }
    }

    async unRegister({ user }) {
      user = user.agent || user.op;
      const userId = user.id;
      await this.modelUserOnline.update(
        {
          expireTime: new Date(),
        },
        {
          where: {
            userId,
          },
        }
      );
    }

    async heartBeat({ user }) {
      user = user.agent || user.op;
      const userId = user.id;
      const item = await this.modelUserOnline.get({ userId });
      if (!item) return false;
      if (item.expireTime <= new Date()) return false;
      // Renewal
      await this.modelUserOnline.update({
        id: item.id,
        expireTime: this._combineExpireTime(),
      });
      return true;
    }

    _combineExpireTime() {
      const configExpired = this.configUserOnline.userOnline.expired;
      return new Date(ctx.bean.util.moment().unix() * 1000 + configExpired);
    }

    async _insertUserOnline({ user, data, isLogin }) {
      const userId = user.id;
      // check if exists
      let item = await this.modelUserOnline.get({ userId });
      if (!item) {
        //   create
        const atomKey = await ctx.bean.atom.create({
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
        if (item.expireTime > new Date()) return false;
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
      return true;
    }

    async _insertUserOnlineHistory({ user, data, isLogin }) {
      const userId = user.id;
      //   atomName
      const atomName = user.userName;
      //   create
      const atomKey = await ctx.bean.atom.create({
        atomClass: __atomClassUserOnlineHistory,
        user,
        item: {
          atomName,
        },
      });
      //   write
      await ctx.bean.atom.write({
        key: atomKey,
        item: {
          userId,
          onlineIP: data.onlineIPLast,
          onlineTime: data.onlineTimeLast,
          isLogin,
        },
        options: {
          ignoreValidate: true,
        },
        user,
      });
    }
  }
  return UserOnline;
};
