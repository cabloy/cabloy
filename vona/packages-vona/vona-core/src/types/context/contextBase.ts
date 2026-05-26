import type { BeanContainer, Constructable, ILocaleRecord, MetadataKey } from '../../lib/index.ts';
import type { VonaConfig } from '../config/config.ts';
import type { IInstanceRecord } from '../config/instance.ts';
import type { VonaContext } from './index.ts';

export interface ContextBase {
  get bean(): BeanContainer;
  get locale(): keyof ILocaleRecord;
  set locale(value: keyof ILocaleRecord);
  get tz(): string | undefined;
  set tz(value: string | undefined);
  get instanceName(): keyof IInstanceRecord | undefined | null;
  set instanceName(value: keyof IInstanceRecord | undefined | null);
  get config(): VonaConfig;
  get innerAccess(): boolean;
  set innerAccess(value: boolean);
  get ctxCaller(): VonaContext;
  set ctxCaller(value: VonaContext);
  getController: () => Constructable | undefined;
  getControllerPrototype: () => object | undefined;
  getControllerBean: <T = any>() => T | undefined;
  getControllerBeanFullName: () => string | undefined;
  getHandler: () => Function | undefined;
  getHandlerName: () => MetadataKey | undefined;
  get onionsDynamic(): any | undefined;
  set onionsDynamic(value: any | undefined);
  get acceptJSON(): boolean;
  redirect(url: string, status?: 301 | 302): void;
}
