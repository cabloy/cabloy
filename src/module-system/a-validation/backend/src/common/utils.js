module.exports = {
  // check draft/formal
  async checkAtomIdExists({ ctx, atomId, items }) {
    if (items.length === 0) return false;
    const _atomOld = await ctx.bean.atom.modelAtom.get({ id: atomId });
    const atomIds = new Set([atomId]);
    if (_atomOld.atomIdDraft) {
      atomIds.add(_atomOld.atomIdDraft);
    }
    if (_atomOld.atomIdFormal) {
      atomIds.add(_atomOld.atomIdFormal);
    }
    return items.some(item => {
      return !atomIds.has(item.id);
    });
  },
};
