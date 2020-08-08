const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  class PublicFlowController extends app.Controller {

    async publicFlow() {
      // atomClass
      const atomClass = await this.ctx.meta.atomClass.get({ atomClassName: 'partyPublic' });
      // userIds
      const userIds = this.ctx.cache.mem.get('userIds');

      // user->atom
      await this._testCheckList(userIds, [
        [ 'Tom', 0 ],
        [ 'Jane', 0 ],
        [ 'Jimmy', 0 ],
        [ 'Smith', 0 ],
      ], (actual, expected, userName) => {
        assert.equal(actual, expected, userName);
      });

      // Tom add party
      const partyKey = await this.ctx.meta.atom.create({
        atomClass,
        user: { id: userIds.Tom },
      });
      await this.ctx.meta.atom.write({
        key: partyKey,
        item: { atomName: 'test:publicFlow' },
        user: { id: userIds.Tom },
      });

      await this._testCheckList(userIds, [
        [ 'Tom', 1 ],
        [ 'Jane', 0 ],
        [ 'Jimmy', 0 ],
        [ 'Smith', 0 ],
      ], (actual, expected, userName) => {
        assert.equal(actual, expected, userName);
      });

      // Tom enable(submit) party
      await this.ctx.meta.atom.enable({
        key: partyKey,
        atom: {
          atomEnabled: 1,
        },
        user: { id: userIds.Tom },
      });

      await this._testCheckList(userIds, [
        [ 'Tom', 1 ],
        [ 'Jane', 0 ],
        [ 'Jimmy', 0 ],
        [ 'Smith', 0 ],
      ], (actual, expected, userName) => {
        assert.equal(actual, expected, userName);
      });

      // checkRightRead 1
      let checkRightReads = [[ 'Jane', partyKey.atomId, false ]];
      for (const [ userName, atomId, right ] of checkRightReads) {
        const res = await this.ctx.meta.atom.checkRightRead({
          atom: { id: atomId },
          user: { id: userIds[userName] },
        });
        assert.equal(!!res, right, userName);
      }

      // close atomFlow
      await this.ctx.meta.atom.flow({
        key: partyKey,
        atom: {
          atomFlow: 0,
        },
        user: { id: userIds.Tom },
      });

      await this._testCheckList(userIds, [
        [ 'Tom', 1 ],
        [ 'Jane', 1 ],
        [ 'Jimmy', 1 ],
        [ 'Smith', 1 ],
      ], (actual, expected, userName) => {
        assert.equal(actual, expected, userName);
      });

      // checkRightRead 2
      checkRightReads = [[ 'Jane', partyKey.atomId, true ]];
      for (const [ userName, atomId, right ] of checkRightReads) {
        const res = await this.ctx.meta.atom.checkRightRead({
          atom: { id: atomId },
          user: { id: userIds[userName] },
        });
        assert.equal(!!res, right, userName);
      }

      // Jane read party
      const party = await this.ctx.meta.atom.read({ key: partyKey, user: { id: userIds.Jane } });
      assert(party);

      // Tom delete party
      await this.ctx.meta.atom.delete({
        key: partyKey,
        user: { id: userIds.Tom },
      });

      await this._testCheckList(userIds, [
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

    async _testCheckList(userIds, userAtoms, cb) {
      for (const [ userName, atomCountExpected ] of userAtoms) {
        const list = await this.ctx.meta.atom.select({
          options: {
            where: {
              atomName: 'test:publicFlow',
              'b.module': 'test-party',
            },
            orders: null,
            page: null,
          },
          user: { id: userIds[userName] },
        });
        // callback
        cb(list.length, atomCountExpected, userName);
      }
    }

  }

  return PublicFlowController;
};

