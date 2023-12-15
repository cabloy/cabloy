// const moduleInfo = module.info;
module.exports = class Detail {
  async _deleteDetails({ atomClass, atomKey, user }) {
    await this._loopDetailClasses({
      atomClass,
      fn: async ({ atomClassDetail, atomClassBaseDetail }) => {
        await this._deleteDetails_Class({ atomClassDetail, atomClassBaseDetail, atomClass, atomKey, user });
      },
    });
  }

  async _deleteDetails_Class({ atomClassDetail, /* atomClassBaseDetail, atomClass,*/ atomKey, user }) {
    // select all details
    const details = await this.ctx.bean.atom.select({
      atomClass: atomClassDetail,
      options: {
        atomIdMain: atomKey.atomId,
        // mode: 'full',
      },
    });
    // loop
    for (const detail of details) {
      const detailKey = {
        atomId: detail.atomId,
        itemId: detail.itemId,
      };
      // delete
      await this.ctx.bean.atom.delete({
        key: detailKey,
        atomClass: atomClassDetail,
        user,
      });
    }
  }

  async _deleteDetailBase({ atomClass, key, options, user }) {
    await this.modelDetailBase.delete({
      detailId: key.atomId,
      detailClassId: atomClass.id,
    });
  }
};
