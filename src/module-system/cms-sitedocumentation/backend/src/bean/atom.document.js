// const moduleInfo = module.info;
module.exports = class Atom extends module.meta.class.AtomCmsBase {
  async default({ atomClass, item, options, user }) {
    // super
    return await super.default({ atomClass, item, options, user });
  }

  async read({ atomClass, options, key, user }) {
    // super
    const item = await super.read({ atomClass, options, key, user });
    if (!item) return null;
    // ok
    return item;
  }

  async select({ atomClass, options, items, user }) {
    // super
    await super.select({ atomClass, options, items, user });
  }

  async create({ atomClass, item, options, user }) {
    // super
    return await super.create({ atomClass, item, options, user });
  }

  async write({ atomClass, target, key, item, options, user }) {
    // super
    return await super.write({ atomClass, target, key, item, options, user });
  }

  async delete({ atomClass, key, options, user }) {
    // super
    await super.delete({ atomClass, key, options, user });
  }
};
