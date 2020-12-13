module.exports = app => {

  class Flow extends app.Service {

    async select({ options, user }) {
      const items = await this.ctx.bean.flow.select({ options, user });
      for (const item of items) {
        if (item.flowNodeNameCurrent) {
          item.flowNodeNameCurrentLocale = this.ctx.text(item.flowNodeNameCurrent);
        }
        if (item.flowRemark) {
          item.flowRemarkLocale = this.ctx.text(item.flowRemark);
        }
      }
      return items;
    }

    async count({ options, user }) {
      return await this.ctx.bean.flow.count({ options, user });
    }

  }
  return Flow;
};

