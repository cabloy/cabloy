const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  class TestController extends app.Controller {

    // right

    async checkRightCreate() {
      this.ctx.success(this.ctx.meta._atomClass);
    }

    async checkRightRead() {
      this.ctx.success(this.ctx.meta._atom);
    }

    async checkRightWrite() {
      this.ctx.success(this.ctx.meta._atom);
    }

    async checkRightAction() {
      this.ctx.success(this.ctx.meta._atom);
    }

    // function

    async checkRightFunctionUser() {
      this.ctx.success(this.ctx.meta._function);
    }

    async func() {
      // userIds
      const userIds = this.ctx.cache.mem.get('userIds');
      const userTom = { id: userIds.Tom };

      // Tom list all
      let list = await this.ctx.meta.function.list({
        options: {
          where: { 'a.module': 'test-party' },
          orders: [[ 'id', 'asc' ]],
          page: { index: 0, size: 0 },
          locale: '',
        },
        user: userTom,
      });
      assert.equal(list.length, 2);
      assert(!list[0].titleLocale);

      // Tom menu list zh-cn
      list = await this.ctx.meta.function.list({
        options: {
          where: { 'a.module': 'test-party' },
          orders: [[ 'id', 'asc' ]],
          page: { index: 0, size: 0 },
          locale: 'zh-cn',
        },
        user: userTom,
      });
      assert.equal(list.length, 2);
      assert.notEqual(list[0].title, list[0].titleLocale);

      // hold
      const function1 = list[0];

      // clear locales
      await this.ctx.meta.function.clearLocales();

      // select star
      list = await this.ctx.meta.function.list({
        user: userTom,
        options: {
          where: { 'a.module': 'test-party' },
          star: 1,
          page: { index: 0, size: 0 },
        },
      });
      assert(list.length === 0);

      // star 1
      await this.ctx.meta.function.star({ id: function1.id, star: 1, user: userTom });
      list = await this.ctx.meta.function.list({
        user: userTom,
        options: {
          where: { 'a.module': 'test-party' },
          star: 1,
          page: { index: 0, size: 0 },
        },
      });
      assert(list.length === 1);

      // star 0
      await this.ctx.meta.function.star({ id: function1.id, star: 0, user: userTom });
      list = await this.ctx.meta.function.list({
        user: userTom,
        options: {
          where: { 'a.module': 'test-party' },
          star: 1,
          page: { index: 0, size: 0 },
        },
      });
      assert(list.length === 0);

      // check
      list = await this.ctx.meta.function.check({
        functions: [{ name: function1.name }],
        user: userTom,
      });
      assert(list[0].passed === true);

      this.ctx.success();
    }

    async funcPublic() {

      // userIds
      const userIds = this.ctx.cache.mem.get('userIds');
      const userTom = { id: userIds.Tom };

      // check right function
      const pass = await this.ctx.meta.function.checkRightFunction({ function: { name: 'testPublic' }, user: userTom });
      assert.equal(!!pass, true);

      // Tom list all
      const list = await this.ctx.meta.function.list({
        options: {
          where: { 'a.module': 'test-party', 'a.public': 1 },
          orders: [[ 'id', 'asc' ]],
          page: { index: 0, size: 0 },
          locale: '',
        },
        user: userTom,
      });
      assert.equal(list.length, 1);

      // delete
      await this.ctx.model.query('delete from aFunction where id=?', [ list[0].id ]);

      this.ctx.success();
    }

    // echo

    async echo() {
      const res = await this.ctx.performAction({
        method: 'get',
        url: 'test/echo1',
      });
      this.ctx.session.__dbMetaNext = true;
      assert.equal(res.user.op.id, this.ctx.user.op.id);
      assert.equal(res.instance.id, this.ctx.instance.id);
      assert.equal(JSON.stringify(res.subdomains), JSON.stringify(this.ctx.subdomains));
      assert(res.route.action !== this.ctx.route.action);
      this.ctx.success(res);
    }
    async echo1() {
      const res = await this.ctx.performAction({
        method: 'get',
        url: 'test/echo2',
      });
      this.ctx.success(res);
    }
    async echo2() {
      // tail
      this.ctx.tail(async () => {
        assert.equal(this.ctx.session.__dbMetaNext, true);
      });
      // ok
      this.ctx.success({
        user: this.ctx.user,
        instance: this.ctx.instance,
        subdomains: this.ctx.subdomains,
        route: this.ctx.route,
      });
    }

    // atom

    async starlabel() {
      // atomClass
      const atomClass = await this.ctx.meta.atomClass.get({ atomClassName: 'party' });
      // userIds
      const userIds = this.ctx.cache.mem.get('userIds');
      const userTom = { id: userIds.Tom };

      // add party:star
      const partyKey = await this.ctx.meta.atom.create({
        atomClass,
        user: userTom,
      });

      // get party
      let party = await this.ctx.meta.atom.read({ key: partyKey, user: userTom });
      assert(!party.star);
      assert(!party.labels);

      // star label
      await this.ctx.meta.atom.star({ key: partyKey, atom: { star: 1 }, user: userTom });
      await this.ctx.meta.atom.labels({ key: partyKey, atom: { labels: [ 1 ] }, user: userTom });

      // get party
      party = await this.ctx.meta.atom.read({ key: partyKey, user: userTom });
      assert(party.star === 1);
      assert(party.labels === '[1]');

      // select parties
      let parties = await this.ctx.meta.atom.select({ user: userTom, options: { star: 1 } });
      assert(parties.length === 1);
      parties = await this.ctx.meta.atom.select({ user: userTom, options: { label: 1 } });
      assert(parties.length === 1);
      parties = await this.ctx.meta.atom.select({ user: userTom, options: { label: 2 } });
      assert(parties.length === 0);

      // star label
      await this.ctx.meta.atom.star({ key: partyKey, atom: { star: 0 }, user: userTom });
      await this.ctx.meta.atom.labels({ key: partyKey, atom: { labels: null }, user: userTom });

      // get party
      party = await this.ctx.meta.atom.read({ key: partyKey, user: userTom });
      assert(!party.star);
      assert(!party.labels);

      // delete party
      await this.ctx.meta.atom.delete({ key: partyKey, user: userTom });

      this.ctx.success();
    }

    async atom() {
      // atomClass
      const atomClass = await this.ctx.meta.atomClass.get({ atomClassName: 'party' });
      // userIds
      const userIds = this.ctx.cache.mem.get('userIds');

      // // system test

      // user->atom
      await this._testCheckList(userIds, [
        [ 'Tom', 0 ],
        [ 'Jane', 0 ],
        [ 'Jimmy', 0 ],
        [ 'Smith', 0 ],
      ]);

      // // custom test

      // Tom add party:egg
      const partyKey = await this.ctx.meta.atom.create({
        atomClass,
        user: { id: userIds.Tom },
      });
      await this.ctx.meta.atom.write({
        key: partyKey,
        item: { atomName: 'egg', partyCount: 3 },
        user: { id: userIds.Tom },
      });

      await this._testCheckList(userIds, [
        [ 'Tom', 1 ],
        [ 'Jane', 0 ],
        [ 'Jimmy', 0 ],
        [ 'Smith', 0 ],
      ]);

      // Tom enable party:egg
      await this.ctx.meta.atom.enable({
        key: partyKey,
        atom: {
          atomEnabled: 1,
        },
        user: { id: userIds.Tom },
      });

      await this._testCheckList(userIds, [
        [ 'Tom', 1 ],
        [ 'Jane', 1 ],
        [ 'Jimmy', 1 ],
        [ 'Smith', 1 ],
      ]);

      // Tom update party:egg
      await this.ctx.meta.atom.write({
        key: partyKey,
        item: { partyCount: 8 },
        user: { id: userIds.Tom },
      });

      // Tom get party:egg
      const party = await this.ctx.meta.atom.read({ key: partyKey, user: { id: userIds.Tom } });
      assert(party);

      // Tom list party:egg
      const parties = await this.ctx.meta.atom.select({
        atomClass,
        options: {
          where: { atomName: { val: 'egg', op: 'likeRight' } },
          orders: [[ 'a.createdAt', 'desc' ]],
          page: { index: 0, size: 0 },
        },
        user: { id: userIds.Tom },
      });
      assert.equal(parties.length, 1);

      // checkRightRead 1
      const checkRightReads = [[ 'Tom', partyKey.atomId, true ]];
      for (const [ userName, atomId, right ] of checkRightReads) {
        const res = await this.ctx.meta.atom.checkRightRead({
          atom: { id: atomId },
          user: { id: userIds[userName] },
        });
        assert(!!res === right);
      }

      // checkRightWrite
      const checkRightWrites = [[ 'Tom', partyKey.atomId, true ], [ 'Tomson', partyKey.atomId, false ]];
      for (const [ userName, atomId, right ] of checkRightWrites) {
        const res = await this.ctx.meta.atom.checkRightUpdate({
          atom: { id: atomId, action: this.ctx.constant.module('a-base').atom.action.write },
          user: { id: userIds[userName] },
        });
        assert(!!res === right, `${userIds[userName]}:${userName}`);
      }

      // checkRightCreate
      const checkRightCreates = [[ 'Tom', true ], [ 'Jimmy', true ], [ 'Smith', false ]];
      for (const [ userName, right ] of checkRightCreates) {
        const res = await this.ctx.meta.atom.checkRightCreate({
          atomClass,
          user: { id: userIds[userName] },
        });
        assert(!!res === right);
      }

      // checkRightAction:review(flag=1)
      const checkRightActions_1 = [[ 'Tom', partyKey.atomId, false ], [ 'Jane', partyKey.atomId, true ]];
      for (const [ userName, atomId, right ] of checkRightActions_1) {
        const res = await this.ctx.meta.atom.checkRightAction({
          atom: { id: atomId, action: 101 },
          user: { id: userIds[userName] },
        });
        assert(!!res === right);
      }

      // action: review
      await this.ctx.meta.atom.action({
        action: 101,
        key: partyKey,
        user: { id: userIds.Jane },
      });

      // checkRightAction:review(flag=2)
      const checkRightActions_2 = [[ 'Tom', 1, false ], [ 'Jane', 1, false ]];
      for (const [ userName, atomId, right ] of checkRightActions_2) {
        const res = await this.ctx.meta.atom.checkRightAction({
          atom: { id: atomId, action: 101 },
          user: { id: userIds[userName] },
        });
        assert(!!res === right);
      }

      // action: review again
      try {
        await this.ctx.meta.atom.action({
          action: 101,
          key: partyKey,
          user: { id: userIds.Jane },
        });
      } catch (e) {
        assert(e.code === 405);
      }

      // Tom delete party:egg
      await this.ctx.meta.atom.delete({
        key: partyKey,
        user: { id: userIds.Tom },
      });

      await this._testCheckList(userIds, [
        [ 'Tom', 0 ],
        [ 'Jane', 0 ],
        [ 'Jimmy', 0 ],
        [ 'Smith', 0 ],
      ]);

      this.ctx.success();
    }

    async atomPublic() {
      // atomClass
      const atomClass = await this.ctx.meta.atomClass.get({ atomClassName: 'partyPublic' });
      // userIds
      const userIds = this.ctx.cache.mem.get('userIds');

      // // system test

      // user->atom
      await this._testCheckList(userIds, [
        [ 'Tom', 0 ],
        [ 'Jane', 0 ],
        [ 'Jimmy', 0 ],
        [ 'Smith', 0 ],
      ]);

      // // custom test

      // Tom add test:egg
      const partyKey = await this.ctx.meta.atom.create({
        atomClass,
        user: { id: userIds.Tom },
      });

      await this.ctx.meta.atom.write({
        key: partyKey,
        item: { atomName: 'egg' },
        user: { id: userIds.Tom },
      });

      await this._testCheckList(userIds, [
        [ 'Tom', 1 ],
        [ 'Jane', 0 ],
        [ 'Jimmy', 0 ],
        [ 'Smith', 0 ],
      ]);

      // Tom enable party:egg
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
      ]);

      // checkRightRead 1
      let checkRightReads = [[ 'Jane', partyKey.atomId, false ]];
      for (const [ userName, atomId, right ] of checkRightReads) {
        const res = await this.ctx.meta.atom.checkRightRead({
          atom: { id: atomId },
          user: { id: userIds[userName] },
        });
        assert(!!res === right);
      }

      // flow party:egg
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
      ]);

      // checkRightRead 2
      checkRightReads = [[ 'Jane', partyKey.atomId, true ]];
      for (const [ userName, atomId, right ] of checkRightReads) {
        const res = await this.ctx.meta.atom.checkRightRead({
          atom: { id: atomId },
          user: { id: userIds[userName] },
        });
        assert(!!res === right);
      }

      // Tom get party:egg
      const party = await this.ctx.meta.atom.read({ key: partyKey, user: { id: userIds.Jane } });
      assert(party);

      // Tom delete party:egg
      await this.ctx.meta.atom.delete({
        key: partyKey,
        user: { id: userIds.Tom },
      });

      await this._testCheckList(userIds, [
        [ 'Tom', 0 ],
        [ 'Jane', 0 ],
        [ 'Jimmy', 0 ],
        [ 'Smith', 0 ],
      ]);

      this.ctx.success();
    }

    async eventUserVerify() {
      const data = this.ctx.request.body.data;
      // console.log('onUserVerify profileId: ', data.profileUser.profileId);
      assert(data.profileUser.profileId > 0);
      this.ctx.success();
    }

    async _testCheckList(userIds, userAtoms) {
      for (const [ userName, atomCountExpected ] of userAtoms) {
        const list = await this.ctx.meta.atom.select({
          options: {
            where: { 'b.module': 'test-party' },
            orders: null,
            page: null,
          },
          user: { id: userIds[userName] },
        });
        assert.equal(list.length, atomCountExpected);
      }
    }

    async httpLog() {
      this.ctx.success('this is a httpLog');
    }

    async userRole() {
      // userIds
      const userIds = this.ctx.cache.mem.get('userIds');
      //
      let list = await this.ctx.meta.role.getUserRolesDirect({ userId: userIds.root });
      assert.equal(list.length, 1);
      list = await this.ctx.meta.role.getUserRolesParent({ userId: userIds.root });
      assert.equal(list.length, 3);
      list = await this.ctx.meta.role.getUserRolesExpand({ userId: userIds.root });
      assert(list.length > 3);
      //
      this.ctx.success();
    }

    async startupAll() {
      assert.equal(this.ctx.instance, undefined);
      this.ctx.success();
    }

    async startupInstance() {
      assert(this.ctx.instance.id > 0);
      this.ctx.success();
    }

  }

  return TestController;
};
