const require3 = require('require3');
const nodemailer = require3('nodemailer');
const chalk = require3('chalk');
const boxen = require3('boxen');

const boxenOptions = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' };

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  async function onPush({ io, ctx, options, message, messageSync, messageClass, pushContent }) {
    // scene
    let scene;
    if (pushContent.scene === 'test') {
      scene = await _createSceneTest();
    } else {
      scene = ctx.config.module(moduleInfo.relativeName).scenes[pushContent.scene];
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
    const res = await transporter.sendMail(pushContent.message);
    // log
    if (pushContent.scene === 'test') {
      const url = nodemailer.getTestMessageUrl(res);
      const message = chalk.keyword('cyan')('Test Mail To: ')
                        + chalk.keyword('yellow')(pushContent.message.to)
                        + chalk.keyword('orange')('\n' + url);
      console.log('\n' + boxen(message, boxenOptions));
    }
    // done
    return true;
  }

  async function _createSceneTest() {
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

  const ChannelMail = {
    info: {
      title: 'Mail',
    },
    callbacks: {
      onPush,
    },
  };
  return ChannelMail;
};
