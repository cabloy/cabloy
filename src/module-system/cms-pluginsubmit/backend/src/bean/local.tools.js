const url = require('url');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class LocalTools {
    async submit({ links, config }) {
      for (const target in config.submit) {
        const targetConfig = config.submit[target];
        await this._submit({ target, targetConfig, links });
      }
    }

    async _submit({ target, targetConfig, links }) {
      if (!targetConfig.token) return;
      if (!links || links.length === 0) return;
      // host
      const parts = url.parse(links[0]);
      const hostname = parts.hostname;
      if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1') return;
      // queue
      ctx.tail(() => {
        ctx.meta.util.queuePush({
          module: moduleInfo.relativeName,
          queueName: 'submit',
          data: {
            target,
            targetConfig,
            hostname,
            links,
          },
        });
      });
    }
  }
  return LocalTools;
};
