module.exports = class Queue {
  async execute(context) {
    const { target, targetConfig, hostname, links } = context.data;
    if (target === 'baidu') {
      await this._queueSubmitBaidu({ target, targetConfig, hostname, links });
    }
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
};
