import type { IStartupExecute } from 'vona-module-a-startup';

import http from 'node:http';
import { BeanBase, cast, compose } from 'vona';
import { Startup } from 'vona-module-a-startup';

@Startup({ after: true })
export class StartupListen extends BeanBase implements IStartupExecute {
  async execute() {
    if (!this.app.config.server.listen.disable) {
      this.app.server = this._listen(
        this.app.config.server.listen.port,
        this.app.config.server.listen.hostname,
      );
    }
  }

  private _listen(port: number, hostname: string) {
    const server = http.createServer(this._callback());
    return server.listen(port, hostname);
  }

  private _callback() {
    const fn = compose(this.app.middleware);
    if (!this.app.listenerCount('error')) this.app.on('error', this.app.onerror);
    return (req, res) => {
      return this.app.bean.executor.newCtx(
        () => {
          return cast(this.app).handleRequest(this.app.ctx, fn);
        },
        { dbInfo: { level: 0 }, innerAccess: false, req, res },
      ); // not set instanceName
    };
  }
}
