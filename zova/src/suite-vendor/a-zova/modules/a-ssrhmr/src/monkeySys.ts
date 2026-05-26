import type { IMonkeySysClose, IMonkeySysReady } from 'zova';

import { WebSocketClient } from '@cabloy/socket';
import debounce from 'debounce';
import { BeanSimple } from 'zova';

export class MonkeySys extends BeanSimple implements IMonkeySysReady, IMonkeySysClose {
  private _ws?: WebSocketClient;
  private _reload?: () => void;

  async sysReady(): Promise<void> {
    if (!this.sys.config.ssr.hmr) return;
    const scopeConfig = this.sys.util.getModuleConfigSafe('a-ssrhmr');
    this._reload = debounce(() => {
      this._reloadInner();
    }, scopeConfig.change.debounce);
    this._startWs();
  }

  sysClose(): void {
    if (!this.sys.config.ssr.hmr) return;
    this._closeWs();
  }

  private _closeWs() {
    if (this._ws) {
      this._ws.disconnect();
      this._ws = undefined;
    }
  }

  private _startWs() {
    const ws = (this._ws = new WebSocketClient({ reconnectDelayMax: 1000 }));
    ws.onEvent = (eventName, _data) => {
      if (eventName === 'reload') {
        this._reload?.();
      }
    };
    ws.onOpen = (_event, reconnectAttempts) => {
      this.sys.meta.logger.get().log('silly', '[ssr hmr] ready');
      if (reconnectAttempts > 0) {
        this._reloadInner();
      }
    };
    // connect
    const url = `${this.sys.config.ws.baseURL}${this.sys.config.ws.prefix}/ssrhmr`;
    ws.connect(url);
  }

  private async _reloadInner() {
    await this.sys.meta.event.emit('a-ssrhmr:reload');
  }
}
