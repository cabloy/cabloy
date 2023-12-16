const __atomClass_userFieldsRight = {
  module: 'a-base',
  atomClassName: 'userFieldsRight',
};

const moduleInfo = module.info;

module.exports = class Fields {
  // atomClass: only main (exluding detail)
  async getPreferredFieldsRightOfUser({ atomClass, user }) {
    if (!user || user.id === 0) return null;
    // atomClass
    atomClass = await ctx.bean.atomClass.get(atomClass);
    // 1. fieldsRightOfAtomClass
    const exists = await ctx.bean.summer.get(
      { module: moduleInfo.relativeName, name: 'fieldsRightOfAtomClass' },
      { atomClassId: atomClass.id }
    );
    if (!exists) return null;
    // 2. fieldsRightOfUser
    const fieldsRight = await ctx.bean.summer.get(
      { module: moduleInfo.relativeName, name: 'fieldsRightOfUser' },
      { atomClassId: atomClass.id, userId: user.id }
    );
    return fieldsRight;
  }

  async clearSummer_fieldsRightOfAtomClass() {
    await ctx.bean.summer.clear({ module: moduleInfo.relativeName, name: 'fieldsRightOfAtomClass' });
  }

  async clearSummer_fieldsRightOfUser() {
    await ctx.bean.summer.clear({ module: moduleInfo.relativeName, name: 'fieldsRightOfUser' });
  }

  async __getFieldsRightOfAtomClassRaw({ atomClassId }) {
    const item = await this.modelRoleFieldsRight.get({ atomClassId });
    return !!item; // exists: true/false
  }

  async __getFieldsRightOfUserRaw({ atomClassId, userId }) {
    const options = {
      page: { index: 0, size: 1 },
      where: {
        atomClassIdTarget: atomClassId,
      },
    };
    const items = await ctx.bean.atom.select({
      atomClass: __atomClass_userFieldsRight,
      options,
      user: { id: userId },
    });
    const item = items[0];
    return item?.fieldsRight ? JSON.parse(item.fieldsRight) : null;
  }

  async _fieldsRightLocale({ items }) {
    for (const item of items) {
      // roleNameBase
      if (item.roleNameBase) {
        item.roleNameBaseLocale = ctx.text(item.roleNameBase);
      }
    }
  }
};
