const url = require('url');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class UtilController extends app.Controller {

    async submit() {
      const { links, config } = this.ctx.request.body;
      for (const target in config.submit) {
        const targetConfig = config.submit[target];
        if (target === 'baidu') {
          await this._submitBaidu({ target, targetConfig, links });
        }
      }
      this.ctx.success();
    }

    async queueSubmit() {
      const { target, targetConfig, hostname, links } = this.ctx.request.body;
      if (target === 'baidu') {
        await this._queueSubmitBaidu({ target, targetConfig, hostname, links });
      }
      this.ctx.success();
    }

    async _queueSubmitBaidu({ targetConfig, hostname, links }) {
      // submit
      const url = `http://data.zz.baidu.com/urls?site=${hostname}&token=${targetConfig.token}`;
      const options = {
        method: 'POST',
        contentType: 'text/plain',
        dataType: 'json',
        data: links.join('\n'),
      };
      const res = await this.ctx.curl(url, options);
      if (res.status !== 200) {
        // log
        this.ctx.logger.error(new Error(res.data && res.data.message));
      } else {
        // log
        this.ctx.logger.info(`submit baidu: ${links.join('\n')}`);
      }
    }

    async _submitBaidu({ target, targetConfig, links }) {
      if (!targetConfig.token) return;
      if (!links || links.length === 0) return;
      // host
      const parts = url.parse(links[0]);
      const hostname = parts.hostname;
      if (!hostname || hostname === 'localhost') return;
      // queue
      this.ctx.tail(() => {
        this.ctx.app.meta.queue.push({
          locale: this.ctx.locale,
          subdomain: this.ctx.subdomain,
          module: moduleInfo.relativeName,
          queueName: 'submit',
          data: {
            target, targetConfig,
            hostname, links,
          },
        });
      });
    }

  }
  return UtilController;
};
