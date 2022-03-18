module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Message extends app.Service {
    async index({ scene, message, config, beanProvider }) {
      // raise event
      await this.ctx.bean.event.invoke({
        module: moduleInfo.relativeName,
        name: 'wechatMessageMini',
        data: { scene, message, config, beanProvider },
      });
    }
  }

  return Message;
};
