const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  class PublicController extends app.Controller {

    async public() {
      // atomClass
      const atomClass = await this.ctx.bean.atomClass.get({ atomClassName: 'partyPublic' });
      // userIds
      const userIds = this.ctx.cache.mem.get('userIds');

      // user->atom
      await this._testCheckList('archive', userIds, [
        [ 'Tom', 0 ],
        [ 'Jane', 0 ],
        [ 'Jimmy', 0 ],
        [ 'Smith', 0 ],
      ], (actual, expected, userName) => {
        assert.equal(actual, expected, userName);
      });

      // Tom add party
      const partyKeyDraft = await this.ctx.bean.atom.create({
        atomClass,
        user: { id: userIds.Tom },
      });
      await this.ctx.bean.atom.write({
        key: partyKeyDraft,
        item: { atomName: 'test:publicFlow' },
        user: { id: userIds.Tom },
      });

      await this._testCheckList('draft', userIds, [
        [ 'Tom', 1 ],
        [ 'Jane', 0 ],
        [ 'Jimmy', 0 ],
        [ 'Smith', 0 ],
      ], (actual, expected, userName) => {
        assert.equal(actual, expected, userName);
      });

      // Tom enable(submit) party
      const res = await this.ctx.bean.atom.submit({
        key: partyKeyDraft,
        options: { ignoreFlow: true },
        user: { id: userIds.Tom },
      });
      const partyKeyArchive = res.archive.key;

      await this._testCheckList('archive', userIds, [
        [ 'Tom', 1 ],
        [ 'Jane', 1 ],
        [ 'Jimmy', 1 ],
        [ 'Smith', 1 ],
      ], (actual, expected, userName) => {
        assert.equal(actual, expected, userName);
      });

      // checkRightRead
      const checkRightReads = [[ 'Jane', partyKeyArchive.atomId, true ]];
      for (const [ userName, atomId, right ] of checkRightReads) {
        const res = await this.ctx.bean.atom.checkRightRead({
          atom: { id: atomId },
          user: { id: userIds[userName] },
        });
        assert.equal(!!res, right, userName);
      }

      // Jane read party
      const party = await this.ctx.bean.atom.read({ key: partyKeyArchive, user: { id: userIds.Jane } });
      assert(party);

      // Tom delete party
      await this.ctx.bean.atom.delete({
        key: partyKeyArchive,
        user: { id: userIds.Tom },
      });

      await this._testCheckList('archive', userIds, [
        [ 'Tom', 0 ],
        [ 'Jane', 0 ],
        [ 'Jimmy', 0 ],
        [ 'Smith', 0 ],
      ], (actual, expected, userName) => {
        assert.equal(actual, expected, userName);
      });

      // done
      this.ctx.success();
    }

    async _testCheckList(stage, userIds, userAtoms, cb) {
      for (const [ userName, atomCountExpected ] of userAtoms) {
        const list = await this.ctx.bean.atom.select({
          options: {
            where: {
              atomName: 'test:publicFlow',
              'b.module': 'test-party',
            },
            orders: null,
            page: null,
            stage,
          },
          user: { id: userIds[userName] },
        });
        // callback
        cb(list.length, atomCountExpected, userName);
      }
    }

  }

  return PublicController;
};

