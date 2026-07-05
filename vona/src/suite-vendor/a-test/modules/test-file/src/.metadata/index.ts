// eslint-disable
/** meta: begin */
export * from '../bean/meta.version.ts';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'test-file:version': never;
    }

  
}
declare module 'vona-module-test-file' {
  
        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleTestFile;
        }

          export interface MetaVersion {
            get $beanFullName(): 'test-file.meta.version';
            get $onionName(): 'test-file:version';
            
          } 
}
/** meta: end */
/** fileScene: begin */
export * from '../bean/fileScene.cloudflareFile.ts';
export * from '../bean/fileScene.privateFile.ts';
export * from '../bean/fileScene.publicFile.ts';

import { type IDecoratorFileSceneOptions } from 'vona-module-a-file';
declare module 'vona-module-a-file' {
  
    export interface IFileSceneRecord {
      'test-file:cloudflareFile': IDecoratorFileSceneOptions;
'test-file:privateFile': IDecoratorFileSceneOptions;
'test-file:publicFile': IDecoratorFileSceneOptions;
    }

  
}
declare module 'vona-module-test-file' {
  
        export interface FileSceneCloudflareFile {
          /** @internal */
          get scope(): ScopeModuleTestFile;
        }

          export interface FileSceneCloudflareFile {
            get $beanFullName(): 'test-file.fileScene.cloudflareFile';
            get $onionName(): 'test-file:cloudflareFile';
            get $onionOptions(): IDecoratorFileSceneOptions;
          }

        export interface FileScenePrivateFile {
          /** @internal */
          get scope(): ScopeModuleTestFile;
        }

          export interface FileScenePrivateFile {
            get $beanFullName(): 'test-file.fileScene.privateFile';
            get $onionName(): 'test-file:privateFile';
            get $onionOptions(): IDecoratorFileSceneOptions;
          }

        export interface FileScenePublicFile {
          /** @internal */
          get scope(): ScopeModuleTestFile;
        }

          export interface FileScenePublicFile {
            get $beanFullName(): 'test-file.fileScene.publicFile';
            get $onionName(): 'test-file:publicFile';
            get $onionOptions(): IDecoratorFileSceneOptions;
          } 
}
/** fileScene: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleTestFile extends BeanScopeBase {}

export interface ScopeModuleTestFile {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'test-file': ScopeModuleTestFile;
  }

  export interface IBeanScopeContainer {
    testFile: ScopeModuleTestFile;
  }
  
  

  

  
}
/** scope: end */
