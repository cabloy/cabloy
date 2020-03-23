const require3 = require('require3');
const chalk = require3('chalk');
const boxen = require3('boxen');

const boxenOptions = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' };

module.exports = function(ctx) {

  class Provider {

    async sendCode({ context }) {
      // token
      const token = this.__prefix0(parseInt(Math.random() * 10000), 4);
      // prompt
      const message = chalk.keyword('cyan')('Test SMS Verification Code To: ')
                        + chalk.keyword('yellow')(context.mobile)
                        + chalk.keyword('orange')('\n' + token);
      console.log('\n' + boxen(message, boxenOptions));
      // ok
      return { token };
    }

    async verify({ data, dataInput }) {
      if (!data) ctx.throw(1002);
      if (data.token !== dataInput.token) ctx.throw(1003);
    }

    __prefix0(num, length) {
      return (Array(length).join('0') + num).slice(-length);
    }

  }

  return Provider;
};
