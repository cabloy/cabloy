const require3 = require('require3');
const assert = require3('assert');

module.exports = ctx => {
  class Broadcast {

    async execute(context) {
      const sameAsCaller = context.sameAsCaller;
      const data = context.data;
      if (!sameAsCaller) {
        // do something
      }
      // locale
      assert.equal(ctx.locale, 'zh-cn');
      // data
      assert.equal(data.message, 'hello');
    }

  }

  return Broadcast;
};
