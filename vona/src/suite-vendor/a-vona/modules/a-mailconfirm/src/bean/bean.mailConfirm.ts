import type { IUser } from 'vona-module-a-user';

import { combineQueries, replaceTemplate } from '@cabloy/utils';
import { BeanBase, uuidv4 } from 'vona';
import { Bean } from 'vona-module-a-bean';
import { $apiPath } from 'vona-module-a-openapiutils';

@Bean()
export class BeanMailConfirm extends BeanBase {
  async emailConfirm(user: IUser) {
    const userId = user.id;
    const email = user.email;
    if (!email) throw new Error(`email should not empty: ${user.name}`);
    // link
    const token = uuidv4();
    const callbackURLRelative = $apiPath('/mailconfirm/mail/emailConfirmCallback');
    const callbackURL = this.app.util.getAbsoluteUrlByApiPath(callbackURLRelative);
    const link = combineQueries(callbackURL, { token });
    // siteName
    const siteName = this.ctx.instance.title || this.app.meta.env.APP_TITLE;
    // email: subject
    const subject = replaceTemplate(this.scope.locale.ConfirmationEmailSubject(), {
      siteName,
    });
    // email: body
    const body = replaceTemplate(this.scope.locale.ConfirmationEmailBody(), {
      userName: user.name,
      link,
      siteName,
    });
    // send
    await this.bean.mail.send({ to: email, subject, text: body });
    // save
    await this.scope.cacheRedis.emailConfirm.set({ userId, email }, token);
  }

  async passwordReset(user: IUser) {
    const userId = user.id;
    const email = user.email;
    if (!email) throw new Error(`email should not empty: ${user.name}`);
    // link
    const token = uuidv4();
    const callbackURLRelative = $apiPath('/mailconfirm/mail/passwordResetCallback');
    const callbackURL = this.app.util.getAbsoluteUrlByApiPath(callbackURLRelative);
    const link = combineQueries(callbackURL, { token });
    // siteName
    const siteName = this.ctx.instance.title || this.app.meta.env.APP_TITLE;
    // email: subject
    const subject = replaceTemplate(this.scope.locale.PasswordResetEmailSubject(), {
      siteName,
    });
    // email: body
    const body = replaceTemplate(this.scope.locale.PasswordResetEmailBody(), {
      userName: user.name,
      link,
      siteName,
    });
    // send
    await this.bean.mail.send({ to: email, subject, text: body });
    // save
    await this.scope.cacheRedis.passwordReset.set({ userId }, token);
  }
}
