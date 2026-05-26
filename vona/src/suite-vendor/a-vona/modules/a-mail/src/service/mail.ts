import type { TableIdentity } from 'table-identity';

import { catchError } from '@cabloy/utils';
import chalk from 'chalk';
import nodemailer from 'nodemailer';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { ConfigMailClient, IMailClientRecord } from '../types/config.ts';

@Service()
export class ServiceMail extends BeanBase {
  async sendById(id: TableIdentity) {
    const mail = await this.scope.model.mail.getById(id);
    if (!mail) return;
    const clientName = mail.client;
    // client
    let client = this._getClient(clientName);
    if (!client) throw new Error(`config not found for mail client: ${clientName}`);
    // client test
    let clientTest = false;
    if (client.transport.service === 'test') {
      client = await this._createClientTest();
      clientTest = true;
    }
    // check again
    if (!this._checkClientValid(client))
      throw new Error(`not valid config for mail client: ${clientName}`);
    // send
    const [res, error] = await catchError(async () => {
      const transporter = nodemailer.createTransport(client.transport, client.defaults);
      return await transporter.sendMail(mail.message);
    });
    if (error) {
      // save error
      await this.scope.model.mail.update({ id, error: error.message });
    } else {
      // log
      if (clientTest) {
        const url = nodemailer.getTestMessageUrl(res);
        const message =
          chalk.cyan('Test Mail To: ') + chalk.yellow(mail.to) + chalk.hex('#FF8800')(`\n${url}`);
        this.$logger.silly(message);
      }
      // delete
      await this.scope.model.mail.delete({ id });
    }
  }

  private _getClient(clientName?: keyof IMailClientRecord) {
    return this.scope.config.clients[clientName || this.scope.config.defaultClient];
  }

  private _checkClientValid(client?: ConfigMailClient) {
    return !!client?.transport?.host || !!client?.transport?.service;
  }

  private async _createClientTest(): Promise<ConfigMailClient> {
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
