module.exports = app => {

  class Contacts extends app.Service {

    async queueSync({ type, mode }) {
      const res = await this.ctx.meta.wxwork.app.contacts.getDepartmentList();
      console.log('----sync:', type, mode);
      console.log(res);
    }

  }

  return Contacts;
};
