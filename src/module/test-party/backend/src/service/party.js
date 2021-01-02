module.exports = app => {

  class Party extends app.Service {

    async types() {
      const items = await this.ctx.model.partyType.select();
      return items.map(item => {
        return {
          id: item.id,
          name: this.ctx.text(item.name),
        };
      });
    }

    async over({ key, user }) {
      await this.ctx.model.party.update({
        id: key.itemId,
        partyOver: 1,
      });
    }

    async overBulk({ keys, user }) {
      const resKeys = [];
      for (const key of keys) {
        const res = await this._overBulk_item({ key, user });
        if (res) {
          resKeys.push(key);
        }
      }
      return { keys: resKeys };
    }

    async _overBulk_item({ key, user }) {
      // check right
      const res = await this.ctx.bean.atom.checkRightAction({
        atom: { id: key.atomId }, action: 101, user,
      });
      if (!res) return false;
      // over
      await this.over({ key, user });
      // ok
      return true;
    }

  }

  return Party;
};
