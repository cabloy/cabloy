module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class eventBean {

    async execute(context, next) {
      const data = context.data;
      if (data.atomClass.module === moduleInfo.relativeName && data.atomClass.atomClassName === 'post') {
        // check if in role:cms-community-publisher
        const rolePublisher = await ctx.meta.role.get({ roleName: 'cms-community-publisher' });
        const check = await ctx.meta.role.userInRoleExpand({ userId: data.user.id, roleId: rolePublisher.id });
        if (!check) return await next();
        // result
        context.result = {
          module: 'a-cms',
          validator: 'article',
        };
        // break
        return;
      }
      // next
      await next();
    }

  }

  return eventBean;
};
