import { reactive } from 'vue';
import { BeanBase } from 'zova';
import { Sys } from 'zova-module-a-bean';

import { IconGroup } from '../lib/iconGroup.js';
import { IIconInfo, IIconMeta, TypeIconModules, TypeIconSymbols } from '../types/icon.js';

const XMLNS = 'http://www.w3.org/2000/svg';
const XMLNS_LINK = 'http://www.w3.org/1999/xlink';

@Sys()
export class SysIcon extends BeanBase {
  protected _iconSymbols: TypeIconSymbols = reactive({});
  protected _iconMoudles: TypeIconModules = {};

  // undefined: ignore
  // '': empty icon
  parseIconInfoSync(iconName?: string): IIconInfo | undefined {
    // parts
    const meta = this.parseIconMeta(iconName);
    if (!meta) return undefined;
    // empty
    const iconEmpty = { meta, symbolId: '' };
    // ok
    const iconOk = { meta, symbolId: meta.symbolId };
    // check if exists
    if (this._iconSymbols[meta.fullName]) return iconOk;
    // check if dom exists
    if (process.env.CLIENT) {
      const domIcon = document.getElementById(meta.symbolId) as unknown as SVGElement;
      if (domIcon) return iconOk;
    }
    // check if exists
    if (this._iconSymbols[meta.fullName] === undefined) {
      this.parseIconInfo(iconName);
      return iconEmpty;
    } else if (this._iconSymbols[meta.fullName] === '') {
      return iconEmpty;
    }
  }

  async parseIconInfo(iconName?: string): Promise<IIconInfo | undefined> {
    // parts
    const meta = this.parseIconMeta(iconName);
    if (!meta) return undefined;
    // check if exists
    if (this._iconSymbols[meta.fullName]) {
      return { meta, symbolId: this._iconSymbols[meta.fullName] };
    }
    // pre set
    this._iconSymbols[meta.fullName] = '';
    // icon group
    const iconGroup = await this.parseIconGroup(meta.module, meta.group);
    if (!iconGroup) return undefined;
    // icon inject
    this._injectIconClient(meta);
    const symbolId = (this._iconSymbols[meta.fullName] = meta.symbolId);
    // ok
    return { meta, symbolId };
  }

  public async parseIconGroup(moduleName: string, groupName: string): Promise<string | undefined> {
    // check if exists
    const iconModule = this.getIconModule(moduleName);
    if (iconModule[groupName]) {
      await iconModule[groupName].loaded.wait();
      return iconModule[groupName].svg;
    }
    // record
    iconModule[groupName] = new IconGroup();
    // parse
    const svg = await this._parseIconGroupInner(moduleName, groupName);
    // touch
    iconModule[groupName].svg = svg;
    iconModule[groupName].loaded.touch();
    // ok
    return iconModule[groupName].svg;
  }

  private async _parseIconGroupInner(
    moduleName: string,
    groupName: string,
  ): Promise<string | undefined> {
    // module
    const module = await this.sys.meta.module.use(moduleName);
    if (!module) return;
    // icons
    const icons = module.resource.icons;
    let groupUrl = icons[groupName];
    if (!groupUrl) return;
    // inline
    if (groupUrl.startsWith('data:image/svg+xml')) throw new Error('inline svg not supported');
    // fetch
    let svg;
    if (process.env.SERVER) {
      // publicPath
      groupUrl = this.sys.util.getPagePathFromAbsoluteUrl(groupUrl);
      const path = await import('node:path');
      const fs = await import('node:fs/promises');
      let filePath: string;
      if (process.env.DEV) {
        filePath = path.join(process.cwd(), groupUrl);
      } else {
        const { fileURLToPath } = await import('node:url');
        const rootFolder = fileURLToPath(new URL(/* @vite-ignore */ '.', import.meta.url));
        filePath = path.join(rootFolder, 'client', groupUrl);
      }
      svg = await fs.readFile(filePath, { encoding: 'utf8' });
    } else {
      const res = await fetch(groupUrl);
      if (!res.ok) return;
      svg = await res.text();
    }
    return svg;
  }

  private _injectIconClient(meta: IIconMeta) {
    if (process.env.SERVER) return;
    // client
    const iconModule = this.getIconModule(meta.module);
    const iconGroup = iconModule[meta.group];
    // inject container
    let domContainer = document.getElementById('zova-svg-container');
    if (!domContainer) {
      domContainer = document.createElement('div');
      domContainer.style.position = 'absolute';
      domContainer.style.width = '0';
      domContainer.style.height = '0';
      domContainer.style.display = 'none';
      domContainer.id = 'zova-svg-container';
      document.body.appendChild(domContainer);
    }
    // inject module
    let domModule = document.getElementById(`zova-svg-module-${meta.module}`);
    if (!domModule) {
      domModule = document.createElement('div');
      domModule.id = `zova-svg-module-${meta.module}`;
      domContainer.appendChild(domModule);
    }
    // inject group
    let domGroup = document.getElementById(
      `zova-svg-group-${meta.module}-${meta.group}`,
    ) as unknown as SVGSVGElement;
    if (!domGroup) {
      domGroup = document.createElementNS(XMLNS, 'svg');
      domGroup.id = `zova-svg-group-${meta.module}-${meta.group}`;
      domGroup.setAttribute('xmlns', XMLNS);
      domGroup.setAttribute('xmlns:link', XMLNS_LINK);
      domModule.appendChild(domGroup);
    }
    // inject icon
    const domIcon = document.getElementById(meta.symbolId) as unknown as SVGElement;
    if (!domIcon) {
      const iconContent = this.extractIconContent(iconGroup.svg, meta.symbolId);
      if (iconContent) {
        domGroup.insertAdjacentHTML('beforeend', iconContent);
      }
    }
  }

  extractIconContent(svg: string | undefined, symbolId: string) {
    if (!svg) return undefined;
    let pos = svg.indexOf(`'${symbolId}'`);
    if (pos === -1) pos = svg.indexOf(`"${symbolId}"`);
    if (pos === -1) return undefined;
    const posB = svg.indexOf('</symbol>', pos);
    const posA = svg.lastIndexOf('<symbol', pos);
    return svg.substring(posA, posB + '</symbol>'.length);
    // const symbolPattern = new RegExp(`<symbol.*?id=['"]${symbolId}['"].*?>.*?</symbol>`);
    // const matched = symbolPattern.exec(svg || '');
    // return matched && matched[0];
  }

  getIconModule(moduleName: string) {
    if (!this._iconMoudles[moduleName]) {
      this._iconMoudles[moduleName] = {};
    }
    return this._iconMoudles[moduleName];
  }

  parseIconMeta(iconName?: string): IIconMeta | undefined {
    if (!iconName) return;
    // split module:group:name
    const parts = iconName.split(':');
    if (parts.length !== 3) {
      return;
    }
    const module = parts[0] || this.scope.config.defaultModule;
    const group = parts[1] || 'default';
    const name = parts[2] || '';
    if (!module.includes('-') || !name) {
      return;
    }
    return {
      module,
      group,
      name,
      fullName: this._getFullName(module, group, name),
      symbolId: this._getSymbolId(module, group, name),
    };
  }

  private _getSymbolId(module: string, group: string, name: string) {
    return `zova-svg-icon-${module}-${group}-${name}`;
  }

  private _getFullName(module: string, group: string, name: string) {
    return `${module}:${group}:${name}`;
  }
}
