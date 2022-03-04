module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const __atomClassUserOnline = {
    module: moduleInfo.relativeName,
    atomClassName: 'userOnline',
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

    async register({ user }) {
      // expireTime
      const configExpired = this.configUserOnline.userOnline.expired;
      const expireTime = new Date(ctx.bean.util.moment().unix() * 1000 + configExpired);
      // data
      const data = {
        clientIPLast: ctx.ip,
        loginTimeLast: new Date(),
        expireTime,
      };
      // userOnline
      await this._insertUserOnline({ user, data });
      // userOnlineHistory
      await this._insertUserOnlineHistory({ user, data });
    }

    async _insertUserOnline({ user, data }) {
      const userId = user.id;

      // check if exists
      const item = await this.modelUserOnline.get({ userId });
      if (item) {
        // only modified: loginCount,clientIPLast,loginTimeLast,expireTime
        await this.modelUserOnline.update({
          id: item.id,
          loginCount: item.loginCount + 1,
          ...data,
        });
      } else {
        //   atomName
        const atomName = user.userName;
        //   create
        const atomKey = await ctx.bean.atom.create({
          atomClass: __atomClassUserOnline,
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
            loginCount: 1,
            ...data,
          },
          user,
        });
      }
    }
  }
  return UserOnline;
};
