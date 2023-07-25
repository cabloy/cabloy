module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Detail {
    async _deleteDetails({ atomClass, atomKey, user }) {
      await this._loopDetailClasses({
        atomClass,
        fn: async ({ detailClass }) => {
          await this._deleteDetails_Class({ detailClass, atomClass, atomKey, user });
        },
      });
    }

    async _deleteDetails_Class({ detailClass, atomKey, user }) {
      // details
      const details = await this.modelDetail.select({
        where: {
          atomId: atomKey.atomId,
          detailClassId: detailClass.id,
        },
      });
      // loop
      for (const detail of details) {
        // delete
        const key = { detailId: detail.id, detailItemId: detail.detailItemId };
        await this._delete2({ detailClass, key, user });
      }
    }

    async _deleteDetailBase({ atomClass, key, options, user }) {
      await this.modelDetailBase.delete({
        detailId: key.atomId,
        detailClassId: atomClass.id,
      });
    }
  }

  return Detail;
};
