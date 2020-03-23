const require3 = require('require3');
const chalk = require3('chalk');
const boxen = require3('boxen');

const boxenOptions = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' };

module.exports = function(ctx) {

  class Provider {

    async sendCode({ context }) {
      // token
      const token = parseInt(Math.random() * 10000).toString();
      // prompt
      const message = chalk.keyword('cyan')('Test SMS Verification Code To: ')
                        + chalk.keyword('yellow')(context.mobile)
                        + chalk.keyword('orange')('\n' + token);
      console.log('\n' + boxen(message, boxenOptions));
      // ok
      return { token };
    }

  }

  return Provider;
};
