module.exports = ctx => {
  const moduleInfo = module.info;
  class Atom extends ctx.app.meta.AtomBase {
    constructor() {
      super(ctx);
    }

    get model() {
      return ctx.model.module(moduleInfo.relativeName).dict;
    }

    get modelDictContent() {
      return ctx.model.module(moduleInfo.relativeName).dictContent;
    }

    async default({ atomClass, item, options, user }) {
      // dict default
      const data = await this.model.default();
      data.dictItems = '[]';
      data.dictLocales = '{}';
      // super
      return await super.default({ atomClass, data, item, options, user });
    }

    async read({ atomClass, options, key, user }) {
      // super
      const item = await super.read({ atomClass, options, key, user });
      if (!item) return null;
      // meta
      await this._getMeta(item, atomClass);
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
      // meta
      for (const item of items) {
        await this._getMeta(item, atomClass);
      }
    }

    async create({ atomClass, item, options, user }) {
      // super
      const data = await super.create({ atomClass, item, options, user });
      // add dict
      data.itemId = await this.model.create(data);
      // add content
      if (!data.dictItems) {
        data.dictItems = '[]';
        data.dictLocales = '{}';
      }
      await this.modelDictContent.create(data);
      // data
      return data;
    }

    async write({ atomClass, target, key, item, options, user }) {
      // check demo
      ctx.bean.util.checkDemoForAtomWrite();
      // info
      const atomStaticKey = item.atomStaticKey;
      const atomStage = item.atomStage;
      // super
      const data = await super.write({ atomClass, target, key, item, options, user });
      // update dict
      if (key.atomId !== 0) {
        await this.model.write(data);
        // update content
        if (data.dictItems !== undefined) {
          await this.modelDictContent.update(
            {
              dictItems: data.dictItems,
              dictLocales: data.dictLocales,
            },
            {
              where: {
                atomId: key.atomId,
              },
            }
          );
        }
        // remove dict cache
        if (atomStage === 1) {
          ctx.tail(() => {
            ctx.bean.dict.dictCacheRemove({ dictKey: atomStaticKey });
          });
        }
      }
      // data
      return data;
    }

    async delete({ atomClass, key, options, user }) {
      const item = await ctx.bean.atom.modelAtom.get({ id: key.atomId });
      const atomStaticKey = item.atomStaticKey;
      const atomStage = item.atomStage;
      // super
      await super.delete({ atomClass, key, options, user });
      // delete dict
      await this.model.delete({
        id: key.itemId,
      });
      // delete content
      await this.modelDictContent.delete({
        itemId: key.itemId,
      });
      // remove dict cache
      if (atomStage === 1) {
        ctx.tail(() => {
          ctx.bean.dict.dictCacheRemove({ dictKey: atomStaticKey });
        });
      }
    }

    async _getMeta(item) {
      // translate
      await this._getMetaTranslate(item);
      // meta
      const meta = this._ensureItemMeta(item);
      // meta.flags
      // meta.summary
      meta.summary = item.description;
    }

    async _getMetaTranslate(item) {
      if (['a-dictbooster:dictMode', 'a-base:dictRoleType'].includes(item.atomStaticKey)) {
        item._dictModeTitle = 'Array';
        item._dictModeTitleLocale = ctx.text('Array');
        return;
      }
      await this._dictTranslateField({
        item,
        fieldName: 'dictMode',
        code: item.dictMode,
        field: {
          dictKey: 'a-dictbooster:dictMode',
        },
      });
    }
  }

  return Atom;
};
