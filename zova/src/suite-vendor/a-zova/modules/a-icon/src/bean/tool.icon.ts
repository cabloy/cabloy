import { BeanBase, Use } from 'zova';
import { Tool } from 'zova-module-a-bean';

import { IIconInfo, IIconMeta } from '../types/icon.js';
import { SysIcon } from './sys.icon.js';

@Tool()
export class ToolIcon extends BeanBase {
  private _iconSSR: Record<string, Record<string, Record<string, string>>> = {};

  @Use()
  private $$sysIcon: SysIcon;

  protected async __init__() {
    if (process.env.SERVER) {
      this.ctx.meta.$ssr.context.onRendered((err?: Error) => {
        if (err) return;
        this._onRendered();
      });
    }
  }

  async parseIconInfo(iconName?: string): Promise<IIconInfo | undefined> {
    const iconInfo = await this.$$sysIcon.parseIconInfo(iconName);
    if (!iconInfo) return iconInfo;
    this._injectIconSSR(iconInfo.meta);
    return iconInfo;
  }

  private _onRendered() {
    this.ctx.meta.$ssr.context._meta.bodyTags += this._renderSSRContainer();
  }

  private _renderSSRContainer() {
    const contentModules = this._renderSSRModules();
    return `<div id="zova-svg-container" style="position: absolute; width: 0px; height: 0px; display: none;">${contentModules}</div>`;
  }

  private _renderSSRModules() {
    return Object.keys(this._iconSSR)
      .map(moduleName => {
        const moduleId = `zova-svg-module-${moduleName}`;
        const contentGroups = this._renderSSRGroups(this._iconSSR[moduleName], moduleName);
        return `<div id="${moduleId}">${contentGroups}</div>`;
      })
      .join('');
  }

  private _renderSSRGroups(
    iconSSRGroups: Record<string, Record<string, string>>,
    moduleName: string,
  ) {
    return Object.keys(iconSSRGroups)
      .map(groupName => {
        const groupId = `zova-svg-group-${moduleName}-${groupName}`;
        const contentIcons = this._renderSSRIcons(iconSSRGroups[groupName]);
        return `<svg id="${groupId}" xmlns="http://www.w3.org/2000/svg" xmlns:link="http://www.w3.org/1999/xlink">${contentIcons}</svg>`;
      })
      .join('');
  }

  private _renderSSRIcons(iconSSRIcons: Record<string, string>) {
    return Object.keys(iconSSRIcons)
      .map(symbolId => {
        return iconSSRIcons[symbolId];
      })
      .join('');
  }

  private _injectIconSSR(meta: IIconMeta) {
    if (process.env.CLIENT) return;
    const iconModule = this.$$sysIcon.getIconModule(meta.module);
    const iconGroup = iconModule[meta.group];
    if (!this._iconSSR[meta.module]) this._iconSSR[meta.module] = {};
    if (!this._iconSSR[meta.module][meta.group]) this._iconSSR[meta.module][meta.group] = {};
    this._iconSSR[meta.module][meta.group][meta.symbolId] = this.$$sysIcon.extractIconContent(
      iconGroup.svg,
      meta.symbolId,
    )!;
  }
}
