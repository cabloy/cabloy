import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { combineQueries } from '@cabloy/utils';
import { BeanBase } from 'vona';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

export interface IControllerOptionsMock extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsMock>('mock', { meta: { mode: ['dev'] } })
export class ControllerMock extends BeanBase {
  @Web.get('authorize')
  @Passport.public()
  async authorize() {
    return `<html>
<head>
  <title>GitHub Mock</title>
  <style>
    body, input {
      font-size: 18px;
    }
  </style>
</head>
<body>
  <form method="post">
    <lable>Username: </label><input size="40" name="username" placeholder="Please input your mock username" />
    <button type="submit">Submit</button>
  </form>
</body>
</html>`;
  }

  @Web.post('authorize')
  @Passport.public()
  async authorizePost(
    @Arg.query('redirect_uri') redirect_uri: string,
    @Arg.query('state') state: string,
    @Arg.body('username') username: string,
  ) {
    const url = combineQueries(redirect_uri, { code: username, state });
    this.ctx.redirect(url);
  }
}
