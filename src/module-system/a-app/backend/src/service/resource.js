module.exports = class Resource {
  async read({ atomStaticKey, options, user }) {
    // donot check user access right, but must check atomClass
    const appItem = await this.ctx.bean.resource.readByStaticKey({ atomStaticKey, options /* , user*/ });
    if (appItem.module !== 'a-app' || appItem.atomClassName !== 'app') this.ctx.throw(403);
    return appItem;
  }
};
