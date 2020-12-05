const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  class StarLabelController extends app.Controller {

    async getRoleIdOwner(atomClass, userId) {
      const roles = await this.ctx.bean.atom.preferredRoles({
        atomClass,
        user: { id: userId },
      });
      return roles[0].roleIdWho;
    }

    async starLabel() {
      // atomClass
      const atomClass = await this.ctx.bean.atomClass.get({ atomClassName: 'party' });
      // user
      const user = this.ctx.state.user.op;

      // add party:star
      const roleIdOwner = await this.getRoleIdOwner(atomClass, user.id);
      const partyKeyDraft = await this.ctx.bean.atom.create({
        atomClass,
        roleIdOwner,
        user,
      });

      // write party
      await this.ctx.bean.atom.write({
        key: partyKeyDraft,
        item: { atomName: 'test:starLabel' },
        user,
      });

      // submit party
      const res = await this.ctx.bean.atom.submit({
        key: partyKeyDraft,
        options: { ignoreFlow: true },
        user,
      });
      const partyKeyArchive = res.archive.key;

      // get party
      let party = await this.ctx.bean.atom.read({ key: partyKeyArchive, user });
      assert.equal(party.star, null);
      assert.equal(party.labels, null);

      // set star/label
      await this.ctx.bean.atom.star({ key: partyKeyArchive, atom: { star: 1 }, user });
      await this.ctx.bean.atom.labels({ key: partyKeyArchive, atom: { labels: [ 1 ] }, user });

      // get party
      party = await this.ctx.bean.atom.read({ key: partyKeyArchive, user });
      assert.equal(party.star, 1);
      assert.equal(party.labels, '[1]');

      // select parties
      let parties = await this.ctx.bean.atom.select({
        user,
        options: {
          star: 1,
          where: { atomName: 'test:starLabel' },
          stage: 'archive',
        },
      });
      assert.equal(parties.length, 1);

      parties = await this.ctx.bean.atom.select({
        user,
        options: {
          label: 1,
          where: { atomName: 'test:starLabel' },
          stage: 'archive',
        },
      });
      assert.equal(parties.length, 1);

      parties = await this.ctx.bean.atom.select({
        user,
        options: {
          label: 2,
          where: { atomName: 'test:starLabel' },
          stage: 'archive',
        },
      });
      assert.equal(parties.length, 0);

      // clear star/label
      await this.ctx.bean.atom.star({ key: partyKeyArchive, atom: { star: 0 }, user });
      await this.ctx.bean.atom.labels({ key: partyKeyArchive, atom: { labels: null }, user });

      // get party
      party = await this.ctx.bean.atom.read({ key: partyKeyArchive, user });
      assert.equal(party.star, null);
      assert.equal(party.labels, null);

      // delete party
      await this.ctx.bean.atom.delete({ key: partyKeyArchive, user });

      // done
      this.ctx.success();
    }

  }

  return StarLabelController;
};

