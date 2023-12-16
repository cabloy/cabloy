const chalk = require('chalk');
const boxen = require('boxen');

const boxenOptions = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' };

const moduleInfo = module.info;
module.exports = class Provider {
  async sendCode({ context }) {
    // token
    const token = this.__prefix0(parseInt(Math.random() * 10000), 4);
    // prompt
    const message =
      chalk.keyword('cyan')('Test SMS Verification Code To: ') +
      chalk.keyword('yellow')(context.mobile) +
      chalk.keyword('orange')('\n' + token);
    console.log('\n' + boxen(message, boxenOptions));
    // ok
    return { token };
  }

  async verify({ data, dataInput }) {
    if (!data) this.ctx.throw.module(moduleInfo.relativeName, 1002);
    if (data.token !== dataInput.token) this.ctx.throw.module(moduleInfo.relativeName, 1003);
  }

  __prefix0(num, length) {
    return (Array(length).join('0') + num).slice(-length);
  }
};
