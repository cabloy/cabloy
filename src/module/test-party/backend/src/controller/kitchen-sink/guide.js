module.exports = app => {

  class GuideController extends app.Controller {

    async echo() {
      const message = 'Hello World';
      this.ctx.success(message);
    }

    async echo2() {
      const message = this.ctx.config.message;
      this.ctx.success(message);
    }

    async echo3() {
      const message = this.ctx.text('Hello World');
      this.ctx.success(message);
    }

    async echo4() {
      const { message, markCount } = this.ctx.request.body;
      const res = `${message}${new Array(markCount + 1).join('!')}`;
      this.ctx.success(res);
    }

    async echo6() {
      // testParty: insert/udpate/delete/get

      // insert
      const res = await this.ctx.db.insert('testParty', {
        iid: this.ctx.instance.id,
        deleted: 0,
        personCount: 3,
      });
      const id = res.insertId;
      // update
      await this.ctx.db.update('testParty', {
        id,
        personCount: 5,
      });
      // get
      const item = await this.ctx.db.get('testParty', {
        id,
      });
      // delete
      await this.ctx.db.delete('testParty', {
        id,
      });
      // ok
      this.ctx.success(item);
    }

    async echo7() {
      // testParty: insert/udpate/delete/get

      // insert
      const res = await this.ctx.model.party.insert({ personCount: 3 });
      const id = res.insertId;
      // update
      await this.ctx.model.party.update({ id, personCount: 6 });
      // get
      const item = await this.ctx.model.party.get({ id });
      // delete
      await this.ctx.model.party.delete({ id });
      // ok
      this.ctx.success(item);
    }

    async echo8() {
      // transaction

      // insert
      const res = await this.ctx.model.party.insert({ personCount: 3 });
      const id = res.insertId;
      // will throw error
      await this.ctx.model.party.update({ id, personCountA: 6 });
      // never here
      this.ctx.success();
    }

    async echo9() {
      // Menu Authorization
      // ok
      this.ctx.success('ok');
    }

  }

  return GuideController;
};

