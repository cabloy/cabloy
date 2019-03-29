module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Event extends app.Service {

    async atomClassValidator({ event, data: { atomClass, user } }) {
      if (atomClass.module === moduleInfo.relativeName && atomClass.atomClassName === 'post') {
        // check if in role:cms-community-publisher
        const rolePublisher = await this.ctx.meta.role.get({ roleName: 'cms-community-publisher' });
        const check = await this.ctx.meta.role.userInRoleExpand({ userId: user.id, roleId: rolePublisher.id });
        if (!check) return null;
        // break event
        event.break = true;
        // more fields
        const validator = {
          module: 'a-cms',
          validator: 'article',
        };
        return validator;
      }
    }

  }

  return Event;
};
