// eslint-disable
/** service: begin */
export * from '../service/fileNative.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'file-native:fileNative': never;
    }

  
}
declare module 'vona-module-file-native' {
  
        export interface ServiceFileNative {
          /** @internal */
          get scope(): ScopeModuleFileNative;
        }

          export interface ServiceFileNative {
            get $beanFullName(): 'file-native.service.fileNative';
            get $onionName(): 'file-native:fileNative';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceFileNative } from '../service/fileNative.ts';
export interface IModuleService {
  'fileNative': ServiceFileNative;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'file-native.service.fileNative': ServiceFileNative;
  }
}
/** service: end */
/** fileProvider: begin */
export * from '../bean/fileProvider.native.ts';
import type { IFileProviderOptionsNative } from '../bean/fileProvider.native.ts';
import 'vona-module-a-file';
declare module 'vona-module-a-file' {
  
    export interface IFileProviderRecord {
      'file-native:native': IFileProviderOptionsNative;
    }

  
}
declare module 'vona-module-file-native' {
  
        export interface FileProviderNative {
          /** @internal */
          get scope(): ScopeModuleFileNative;
        }

          export interface FileProviderNative {
            get $beanFullName(): 'file-native.fileProvider.native';
            get $onionName(): 'file-native:native';
            get $onionOptions(): IFileProviderOptionsNative;
          } 
}
/** fileProvider: end */
/** fileProvider: begin */
import type { FileProviderNative } from '../bean/fileProvider.native.ts';
export interface IModuleFileProvider {
  'native': FileProviderNative;
}
/** fileProvider: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleFileNative extends BeanScopeBase {}

export interface ScopeModuleFileNative {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
service: IModuleService;
fileProvider: IModuleFileProvider;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'file-native': ScopeModuleFileNative;
  }

  export interface IBeanScopeContainer {
    fileNative: ScopeModuleFileNative;
  }
  
  export interface IBeanScopeConfig {
    'file-native': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
