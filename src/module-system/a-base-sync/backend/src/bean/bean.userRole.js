module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const __atomClassUserRole = {
    module: moduleInfo.relativeName,
    atomClassName: 'userRole',
  };

  class UserRole extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'userRole');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get modelUserRole() {
      return ctx.model.module(moduleInfo.relativeName).userRole;
    }

    async _checkRightReadOfUser({ userId, user }) {
      if (!user || user.id === 0) return true;
      // select
      const list = await ctx.bean.atom.select({
        atomClass: __atomClassUserRole,
        options: {
          stage: 'formal',
          where: {
            'f.userId': userId,
          },
        },
        user,
        pageForce: false,
      });
      return list.length > 0;
    }
  }

  return UserRole;
};
