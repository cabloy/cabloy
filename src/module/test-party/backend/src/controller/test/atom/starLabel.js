const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  class StarLabelController extends app.Controller {

    async starLabel() {
      // atomClass
      const atomClass = await this.ctx.meta.atomClass.get({ atomClassName: 'party' });
      // user
      const user = this.ctx.user.op;

      // add party:star
      const partyKey = await this.ctx.meta.atom.create({
        atomClass,
        user,
      });

      // write party
      await this.ctx.meta.atom.write({
        key: partyKey,
        item: { atomName: 'test:starLabel' },
        user,
      });

      // get party
      let party = await this.ctx.meta.atom.read({ key: partyKey, user });
      assert.equal(party.star, null);
      assert.equal(party.labels, null);

      // set star/label
      await this.ctx.meta.atom.star({ key: partyKey, atom: { star: 1 }, user });
      await this.ctx.meta.atom.labels({ key: partyKey, atom: { labels: [ 1 ] }, user });

      // get party
      party = await this.ctx.meta.atom.read({ key: partyKey, user });
      assert.equal(party.star, 1);
      assert.equal(party.labels, '[1]');

      // select parties
      let parties = await this.ctx.meta.atom.select({
        user,
        options: {
          star: 1,
          where: { atomName: 'test:starLabel' },
        },
      });
      assert.equal(parties.length, 1);

      parties = await this.ctx.meta.atom.select({
        user,
        options: {
          label: 1,
          where: { atomName: 'test:starLabel' },
        },
      });
      assert.equal(parties.length, 1);

      parties = await this.ctx.meta.atom.select({
        user,
        options: {
          label: 2,
          where: { atomName: 'test:starLabel' },
        },
      });
      assert.equal(parties.length, 0);

      // clear star/label
      await this.ctx.meta.atom.star({ key: partyKey, atom: { star: 0 }, user });
      await this.ctx.meta.atom.labels({ key: partyKey, atom: { labels: null }, user });

      // get party
      party = await this.ctx.meta.atom.read({ key: partyKey, user });
      assert.equal(party.star, null);
      assert.equal(party.labels, null);

      // delete party
      await this.ctx.meta.atom.delete({ key: partyKey, user });

      // done
      this.ctx.success();
    }

  }

  return StarLabelController;
};

