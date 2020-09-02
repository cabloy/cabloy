const require3 = require('require3');
const assert = require3('assert');

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class eventBean {

    async execute(context, next) {
      const data = context.data;
      assert(data.profileUser.profileId > 0);
      // next
      await next();
    }

  }

  return eventBean;
};
