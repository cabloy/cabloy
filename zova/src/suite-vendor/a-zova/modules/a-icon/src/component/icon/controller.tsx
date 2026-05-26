import { BeanControllerBase, convertToUnit, isHttpUrl, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';

import { ToolIcon } from '../../bean/tool.icon.js';
import { $getZovaIcon } from '../../lib/useZovaIcon.js';
import { IIconRecord } from '../../types/icon.js';

export interface ControllerIconProps {
  name?: keyof IIconRecord;
  href?: string;
  width?: string | number;
  height?: string | number;
  color?: string;
}

@Controller()
export class ControllerIcon extends BeanControllerBase {
  static $propsDefault = {};

  @Use()
  $$toolIcon: ToolIcon;

  protected async __init__() {
    await this._load();
  }

  private async _load() {
    const name = this.$props.name;
    if (name === ('none' as any) || !name) {
      return;
    }
    if (isHttpUrl(name)) {
      return;
    }
    const promise = this.$$toolIcon.parseIconInfo(name);
    if (process.env.SSR) {
      await promise;
    }
  }

  protected render() {
    // width/height
    const width = this.$props.width ?? this.$props.height;
    const height = this.$props.height ?? this.$props.width;
    const href = this._parseHref();
    if (isHttpUrl(href) && !href?.endsWith('.svg')) {
      return (
        <img
          class="zova-icon__img"
          style={{
            width: convertToUnit(width),
            height: convertToUnit(height),
          }}
          src={href}
        ></img>
      );
    }
    return (
      <svg
        class="zova-icon__svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        role="img"
        aria-hidden="true"
        style={{
          width: convertToUnit(width),
          height: convertToUnit(height),
          color: this.$props.color,
        }}
      >
        <use xlinkHref={href}></use>
      </svg>
    );
  }

  private _parseHref() {
    let href = this.$props.href;
    const name = this.$props.name;
    if (href) return href;
    if (isHttpUrl(name)) return name;
    // icon info
    const iconInfo = $getZovaIcon(name);
    // href
    href = `#${iconInfo?.symbolId || ''}`;
    return href;
  }
}
