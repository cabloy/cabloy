const nodemailer = require('nodemailer');
const chalk = require('chalk');
const boxen = require('boxen');

const boxenOptions = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' };

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class IOChannel extends ctx.app.meta.IOChannelBase(ctx) {
    async onPush({ content /* options, message, messageSync, messageClass*/ }) {
      // check if content.message
      // not set content.message.to dynamic for test, which must be set by business
      if (!content.message || !content.message.to) return false;
      // scene
      let scene;
      let sceneTest = false;
      // 1. maybe object by dynamic
      if (content.scene && typeof content.scene === 'object') {
        scene = content.scene;
      } else {
        // 2. from config cache
        scene = ctx.bean.mailSceneCache.getMailSceneConfigCache(content.scene || 'system');
      }
      // 3. test
      if (!this._sceneValid(scene) && (ctx.app.meta.isTest || ctx.app.meta.isLocal)) {
        scene = await this._createSceneTest();
        sceneTest = true;
      }
      // check if empty
      if (!this._sceneValid(scene)) {
        const message = chalk.keyword('orange')(ctx.text('mailhostNotConfigAlert'));
        console.log('\n' + boxen(message, boxenOptions));
        return false;
      }
      // transporter
      const transporter = nodemailer.createTransport(scene.transport, scene.defaults);
      // send
      const res = await transporter.sendMail(content.message);
      // log
      if (sceneTest) {
        const url = nodemailer.getTestMessageUrl(res);
        const message =
          chalk.keyword('cyan')('Test Mail To: ') +
          chalk.keyword('yellow')(content.message.to) +
          chalk.keyword('orange')('\n' + url);
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

    _sceneValid(scene) {
      return scene && scene.transport && scene.transport.host;
    }
  }
  return IOChannel;
};
