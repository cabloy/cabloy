import type { IComponentOptions } from 'zova';

import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';

export interface ControllerMarkdownHtmlProps {
  class?: string;
  html?: string;
}

@Controller()
export class ControllerMarkdownHtml extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  protected async __init__() {}
}
