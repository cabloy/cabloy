// eslint-disable
/** service: begin */
export * from '../service/fileCloudflare.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'file-cloudflare:fileCloudflare': never;
    }

  
}
declare module 'vona-module-file-cloudflare' {
  
        export interface ServiceFileCloudflare {
          /** @internal */
          get scope(): ScopeModuleFileCloudflare;
        }

          export interface ServiceFileCloudflare {
            get $beanFullName(): 'file-cloudflare.service.fileCloudflare';
            get $onionName(): 'file-cloudflare:fileCloudflare';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceFileCloudflare } from '../service/fileCloudflare.ts';
export interface IModuleService {
  'fileCloudflare': ServiceFileCloudflare;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'file-cloudflare.service.fileCloudflare': ServiceFileCloudflare;
  }
}
/** service: end */
/** fileProvider: begin */
export * from '../bean/fileProvider.cloudflare.ts';
import type { IFileProviderOptionsCloudflare } from '../bean/fileProvider.cloudflare.ts';
import 'vona-module-a-file';
declare module 'vona-module-a-file' {
  
    export interface IFileProviderRecord {
      'file-cloudflare:cloudflare': IFileProviderOptionsCloudflare;
    }

  
}
declare module 'vona-module-file-cloudflare' {
  
        export interface FileProviderCloudflare {
          /** @internal */
          get scope(): ScopeModuleFileCloudflare;
        }

          export interface FileProviderCloudflare {
            get $beanFullName(): 'file-cloudflare.fileProvider.cloudflare';
            get $onionName(): 'file-cloudflare:cloudflare';
            get $onionOptions(): IFileProviderOptionsCloudflare;
          } 
}
/** fileProvider: end */
/** fileProvider: begin */
import type { FileProviderCloudflare } from '../bean/fileProvider.cloudflare.ts';
export interface IModuleFileProvider {
  'cloudflare': FileProviderCloudflare;
}
/** fileProvider: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleFileCloudflare extends BeanScopeBase {}

export interface ScopeModuleFileCloudflare {
  util: BeanScopeUtil;
service: IModuleService;
fileProvider: IModuleFileProvider;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'file-cloudflare': ScopeModuleFileCloudflare;
  }

  export interface IBeanScopeContainer {
    fileCloudflare: ScopeModuleFileCloudflare;
  }
  
  

  

  
}
/** scope: end */
