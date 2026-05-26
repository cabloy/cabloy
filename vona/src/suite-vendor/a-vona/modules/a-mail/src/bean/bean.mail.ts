import type { Address } from 'nodemailer/lib/mailer/index.js';

import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { IMailClientRecord, IMailOptions } from '../types/config.ts';

@Bean()
export class BeanMail extends BeanBase {
  async send(mail: IMailOptions, clientName?: keyof IMailClientRecord) {
    const mailNew = await this.scope.model.mail.insert({
      client: clientName,
      from: __parseFrom(mail.from as string | Address | undefined),
      to: __parseTo(mail.to),
      subject: mail.subject,
      message: mail,
    });
    if (this.app.meta.isTest) {
      await this.ctx.db.commit(async () => {
        await this.scope.queue.mail.pushAsync({ mailId: mailNew.id });
      });
    } else {
      this.ctx.db.commit(() => {
        this.scope.queue.mail.push({ mailId: mailNew.id });
      });
    }
  }
}

function __parseFrom(address: string | Address | undefined): string | undefined {
  if (!address) return address;
  if (typeof address === 'object') return address.address;
  return address;
}

function __parseTo(
  address: string | Address | Array<string | Address> | undefined,
): string | undefined {
  if (!address) return address;
  if (!Array.isArray(address)) return __parseFrom(address);
  return address.map(item => __parseFrom(item)).join(',');
}
