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
  }

  return AuthOpen;
};
