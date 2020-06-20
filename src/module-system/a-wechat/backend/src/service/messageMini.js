module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Message extends app.Service {

    async index({ scene, message }) {
      // raise event
      await this.ctx.meta.event.invoke({
        module: moduleInfo.relativeName,
        name: 'wechatMessageMini',
        data: { scene, message },
      });
    }
  }

  return Message;
};
