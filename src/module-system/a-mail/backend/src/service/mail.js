const require3 = require('require3');
const nodemailer = require3('nodemailer');
const chalk = require3('chalk');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Mail extends app.Service {

    async schedulePushQueueInstance() {
      await this.ctx.app.meta.queue.push({
        subdomain: this.ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'send',
        data: null,
      });
    }

    // mail:status
    //      0:unsend
    //      1:sent
    //      -1: error
    async queueSend() {
      // // reset
      // await this.ctx.model.query(`
      //     update aMail set status=0 where status=-1 where iid=? and deleted=0
      //       `, [ this.ctx.instance.id ]);

      // loop
      while (true) {
        // get
        const mail = await this.ctx.model.mail.get({ status: 0 });
        if (!mail) break;
        // send
        const res = await this._send({ mail });
        if (!res) break;
        // status
        await this.ctx.model.mail.update({
          id: mail.id,
          status: 1,
        });
      }
    }

    async _send({ mail }) {
      try {
        // scene
        let scene;
        if (mail.scene === 'test') {
          scene = await this._createSceneTest();
        } else {
          scene = this.ctx.config.scenes[mail.scene];
        }
        // check if empty
        if (!scene.transport.host) {
          console.log(chalk.keyword('orange')(this.ctx.text('mailhostNotConfigAlert')));
          return false;
        }
        // transporter
        const transporter = nodemailer.createTransport(scene.transport, scene.defaults);
        // send
        const message = mail.message ? JSON.parse(mail.message) : null;
        const res = await transporter.sendMail(message);
        // log
        if (mail.scene === 'test') {
          const url = nodemailer.getTestMessageUrl(res);
          console.log(chalk.keyword('orange')(`test mail url: ${url}`));
        }
        return true;
      } catch (err) {
        // status
        if (err.responseCode === 559) {
          await this.ctx.model.mail.update({
            id: mail.id,
            status: -1,
          });
        }
        // log
        this.ctx.logger.error(err);
        return false;
      }
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

  return Mail;
};
