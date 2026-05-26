// eslint-disable
/** command: begin */
export * from '../bean/command.alert.jsx';
export * from '../bean/command.confirm.jsx';
export * from '../bean/command.copy.jsx';
export * from '../bean/command.create.jsx';
export * from '../bean/command.delete.jsx';
export * from '../bean/command.edit.jsx';
export * from '../bean/command.setValue.jsx';
export * from '../bean/command.view.jsx';
import { ICommandOptionsAlert } from '../bean/command.alert.jsx';
import { ICommandOptionsConfirm } from '../bean/command.confirm.jsx';
import { ICommandOptionsCopy } from '../bean/command.copy.jsx';
import { ICommandOptionsCreate } from '../bean/command.create.jsx';
import { ICommandOptionsDelete } from '../bean/command.delete.jsx';
import { ICommandOptionsEdit } from '../bean/command.edit.jsx';
import { ICommandOptionsSetValue } from '../bean/command.setValue.jsx';
import { ICommandOptionsView } from '../bean/command.view.jsx';
import 'zova-module-a-command';
declare module 'zova-module-a-command' {
  
    export interface ICommandRecord {
      'basic-commands:alert': ICommandOptionsAlert;
'basic-commands:confirm': ICommandOptionsConfirm;
'basic-commands:copy': ICommandOptionsCopy;
'basic-commands:create': ICommandOptionsCreate;
'basic-commands:delete': ICommandOptionsDelete;
'basic-commands:edit': ICommandOptionsEdit;
'basic-commands:setValue': ICommandOptionsSetValue;
'basic-commands:view': ICommandOptionsView;
    }

  
}
declare module 'zova-module-basic-commands' {
  
        export interface CommandAlert {
          /** @internal */
          get scope(): ScopeModuleBasicCommands;
        }

        export interface CommandAlert {
          get $beanFullName(): 'basic-commands.command.alert';
          get $onionName(): 'basic-commands:alert';
          get $onionOptions(): ICommandOptionsAlert;
        }

        export interface CommandConfirm {
          /** @internal */
          get scope(): ScopeModuleBasicCommands;
        }

        export interface CommandConfirm {
          get $beanFullName(): 'basic-commands.command.confirm';
          get $onionName(): 'basic-commands:confirm';
          get $onionOptions(): ICommandOptionsConfirm;
        }

        export interface CommandCopy {
          /** @internal */
          get scope(): ScopeModuleBasicCommands;
        }

        export interface CommandCopy {
          get $beanFullName(): 'basic-commands.command.copy';
          get $onionName(): 'basic-commands:copy';
          get $onionOptions(): ICommandOptionsCopy;
        }

        export interface CommandCreate {
          /** @internal */
          get scope(): ScopeModuleBasicCommands;
        }

        export interface CommandCreate {
          get $beanFullName(): 'basic-commands.command.create';
          get $onionName(): 'basic-commands:create';
          get $onionOptions(): ICommandOptionsCreate;
        }

        export interface CommandDelete {
          /** @internal */
          get scope(): ScopeModuleBasicCommands;
        }

        export interface CommandDelete {
          get $beanFullName(): 'basic-commands.command.delete';
          get $onionName(): 'basic-commands:delete';
          get $onionOptions(): ICommandOptionsDelete;
        }

        export interface CommandEdit {
          /** @internal */
          get scope(): ScopeModuleBasicCommands;
        }

        export interface CommandEdit {
          get $beanFullName(): 'basic-commands.command.edit';
          get $onionName(): 'basic-commands:edit';
          get $onionOptions(): ICommandOptionsEdit;
        }

        export interface CommandSetValue {
          /** @internal */
          get scope(): ScopeModuleBasicCommands;
        }

        export interface CommandSetValue {
          get $beanFullName(): 'basic-commands.command.setValue';
          get $onionName(): 'basic-commands:setValue';
          get $onionOptions(): ICommandOptionsSetValue;
        }

        export interface CommandView {
          /** @internal */
          get scope(): ScopeModuleBasicCommands;
        }

        export interface CommandView {
          get $beanFullName(): 'basic-commands.command.view';
          get $onionName(): 'basic-commands:view';
          get $onionOptions(): ICommandOptionsView;
        } 
}
/** command: end */
/** command: begin */
import { CommandAlert } from '../bean/command.alert.jsx';
import { CommandConfirm } from '../bean/command.confirm.jsx';
import { CommandCopy } from '../bean/command.copy.jsx';
import { CommandCreate } from '../bean/command.create.jsx';
import { CommandDelete } from '../bean/command.delete.jsx';
import { CommandEdit } from '../bean/command.edit.jsx';
import { CommandSetValue } from '../bean/command.setValue.jsx';
import { CommandView } from '../bean/command.view.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-commands.command.alert': CommandAlert;
'basic-commands.command.confirm': CommandConfirm;
'basic-commands.command.copy': CommandCopy;
'basic-commands.command.create': CommandCreate;
'basic-commands.command.delete': CommandDelete;
'basic-commands.command.edit': CommandEdit;
'basic-commands.command.setValue': CommandSetValue;
'basic-commands.command.view': CommandView;
  }
}
/** command: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleBasicCommands extends BeanScopeBase {}

export interface ScopeModuleBasicCommands {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'basic-commands': ScopeModuleBasicCommands;
  }
  
  

  

  
}
  
/** scope: end */
