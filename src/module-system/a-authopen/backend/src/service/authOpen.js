const require3 = require('require3');
const randomize = require3('randomatic');

module.exports = app => {
  class AuthOpen extends app.Service {
    async hideClientSecret({ key, user }) {
      // use userId for safety
      await this.ctx.model.authOpen.update({
        id: key.itemId,
        userId: user.id,
        clientSecretHidden: 1,
      });
    }

    async resetClientSecret({ key, user }) {
      // clientSecret
      const clientSecret = randomize('0a', 40);
      // use userId for safety
      await this.ctx.model.authOpen.update({
        id: key.itemId,
        userId: user.id,
        clientSecret,
        clientSecretHidden: 0,
      });
    }
  }

  return AuthOpen;
};
