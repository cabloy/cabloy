const require3 = require('require3');
const nodemailer = require3('nodemailer');
const chalk = require3('chalk');
const boxen = require3('boxen');

const boxenOptions = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' };

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class IOChannel extends ctx.app.meta.IOChannelBase(ctx) {

    async onPush({ content /* options, message, messageSync, messageClass*/ }) {
      // scene
      let scene;
      if (content.scene === 'test') {
        scene = await this._createSceneTest();
      } else {
        scene = ctx.config.module(moduleInfo.relativeName).scenes[content.scene];
      }
      // check if empty
      if (!scene.transport.host) {
        const message = chalk.keyword('orange')(ctx.text('mailhostNotConfigAlert'));
        console.log('\n' + boxen(message, boxenOptions));
        return false;
      }
      // transporter
      const transporter = nodemailer.createTransport(scene.transport, scene.defaults);
      // send
      const res = await transporter.sendMail(content.message);
      // log
      if (content.scene === 'test') {
        const url = nodemailer.getTestMessageUrl(res);
        const message = chalk.keyword('cyan')('Test Mail To: ')
                        + chalk.keyword('yellow')(content.message.to)
                        + chalk.keyword('orange')('\n' + url);
        console.log('\n' + boxen(message, boxenOptions));
      }
      // done
      return true;
    }

    async _createSceneTest() {
      const account = await nodemailer.createTestAccount();
      return {
        transport: {
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
          logger: false,
          debug: false,
        },
        defaults: {
          // sender info
          from: 'Nodemailer <example@nodemailer.com>',
        },
      };
    }

  }
  return IOChannel;
};
