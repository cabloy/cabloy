const __atomClass_userFieldsRight = {
  module: 'a-base',
  atomClassName: 'userFieldsRight',
};

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Fields {
    // atomClass: only main (exluding detail)
    async getPreferredFieldsRightOfUser({ atomClass, user }) {
      if (!user || user.id === 0) return null;
      // atomClass
      atomClass = await ctx.bean.atomClass.get(atomClass);
      const options = {
        page: { index: 0, size: 1 },
        where: {
          atomClassIdTarget: atomClass.id,
        },
      };
      const items = await ctx.bean.atom.select({
        atomClass: __atomClass_userFieldsRight,
        options,
        user,
      });
      const item = items[0];
      return item?.fieldsRight ? JSON.parse(item.fieldsRight) : null;
    }

    async __getFieldsRightOfAtomClassRaw({ atomClassId }) {}

    async __getFieldsRightOfUserRaw({ atomClassId, userId }) {}

    async _fieldsRightLocale({ items }) {
      for (const item of items) {
        // roleNameBase
        if (item.roleNameBase) {
          item.roleNameBaseLocale = ctx.text(item.roleNameBase);
        }
      }
    }
  }

  return Fields;
};
