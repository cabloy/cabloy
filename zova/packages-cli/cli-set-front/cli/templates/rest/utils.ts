import type { PrefixKeys } from 'zova';
import type { IVonaComponentRecord, TypeComponentOptions } from 'zova-module-a-bean';
import type { ICommandRecord, IJsxCommandOptionsEvent, IJsxCommandOptionsCommands, TypeCommandOptions } from 'zova-module-a-command';
import type { IIconRecord } from 'zova-module-a-icon';
import type { TypePagePathSchema } from 'zova-module-a-router';
import type { CssBase } from 'zova-module-home-theme';

declare module 'zova-module-a-router' {
  export interface IPagePathRecord {
    '/': TypePagePathSchema<undefined, undefined>;
    'presetLogin': TypePagePathSchema<undefined, undefined>;
    'presetErrorExpired': TypePagePathSchema<undefined, undefined>;
    'presetResource': TypePagePathSchema<undefined, undefined>;
  }
}

export function ZovaCssBase<K extends PrefixKeys<CssBase, 'c'>>(name: K): string {
  return `cssBase:${name}`;
}

export function ZovaCssMerge(
  ...classes: (
    | string
    | false
    | undefined
    | null
    | {
        [className: string]: any;
      }
  )[]
): any {
  return classes;
}

export function ZovaIconName<K extends keyof IIconRecord>(name: K): any {
  return name;
}

export function ZovaComponent<K extends keyof IVonaComponentRecord>(options: TypeComponentOptions<K>) {
  if (!options.name) throw new Error('should specify the component name');
  return options.name;
}

export function ZovaCommand<K extends keyof ICommandRecord>(options: TypeCommandOptions<K>) {
  if (!options.name) throw new Error('should specify the command name');
  return options.name.replace(':', '.command.');
}

export function ZovaEvent(_options: IJsxCommandOptionsEvent) {
  return 'ZovaEvent';
}

export function ZovaCommands(_options: IJsxCommandOptionsCommands) {
  return 'ZovaCommands';
}
