import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import { parseAuthHeader } from '../lib/authHeader.ts';

@Service()
export class ServiceJwtExtract extends BeanBase {
  fromHeader(): string | undefined {
    if (!this.scope.config.field.extract.header) return;
    return this.ctx.request.headers[this.scope.config.field.extract.header] as string | undefined;
  }

  fromQuery() {
    return this.ctx.request.query[this.scope.config.field.extract.query];
  }

  fromAuthHeaderWithScheme(headerValue?: string) {
    if (!headerValue) {
      headerValue = this.ctx.request.headers[this.scope.config.field.extract.headerAuth] as
        | string
        | undefined;
    }
    const auth = parseAuthHeader(headerValue);
    if (
      !auth ||
      auth.scheme.toLocaleLowerCase() !==
        this.scope.config.field.extract.headerAuthScheme.toLocaleLowerCase()
    ) {
      return;
    }
    return auth.value;
  }

  // fromCookie() {
  //   return this.ctx.cookies.get(this.scope.config.field.extract.cookie);
  // }

  fromAllWays() {
    let token: string | undefined = this.fromQuery();
    if (!token) token = this.fromAuthHeaderWithScheme();
    if (!token) token = this.fromHeader();
    // if (!token) token = this.fromCookie();
    return token;
  }
}
