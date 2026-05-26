import type { OmitNever, PowerPartial } from 'zova';
import type { ServiceOnion } from 'zova-module-a-bean';
import type { IMetaRecord } from 'zova-module-a-meta';

export interface IThemeRecord {}

export interface IDecoratorThemeOptions {
  token?: (params: IThemeApplyParams) => PowerPartial<ThemeToken>;
}

declare module 'zova-module-a-bean' {
  export interface SysOnion {
    theme: ServiceOnion<IDecoratorThemeOptions, keyof IThemeRecord>;
  }
}

declare module 'zova' {
  export interface ConfigOnions {
    theme: OmitNever<IThemeRecord>;
  }

  export interface IBeanSceneRecord {
    theme: never;
  }

  export interface BeanBase {
    $token: ThemeToken;
  }
}

export interface ThemeToken {}

export interface IThemeApplyParams {
  name: string;
  dark: boolean;
}

export interface IThemeApplyResult {
  token: ThemeToken;
  handler?: keyof IMetaRecord;
}

export interface IThemeBase {
  apply(params: IThemeApplyParams): Promise<IThemeApplyResult>;
}

export interface IThemeHandler {
  apply(result: IThemeHandlerApplyParams): Promise<void>;
}

export interface IThemeHandlerApplyParams {
  name: string;
  dark: boolean;
  token: ThemeToken;
}
