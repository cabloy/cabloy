// eslint-disable
/** model: begin */
export * from '../model/todo.js';
import { IModelOptionsTodo } from '../model/todo.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {
  
    export interface IModelRecord {
      'demo-todo:todo': IModelOptionsTodo;
    }

  
}
declare module 'zova-module-demo-todo' {
  
        export interface ModelTodo {
          /** @internal */
          get scope(): ScopeModuleDemoTodo;
        }

        export interface ModelTodo {
          get $beanFullName(): 'demo-todo.model.todo';
          get $onionName(): 'demo-todo:todo';
          get $onionOptions(): IModelOptionsTodo;
        } 
}
/** model: end */
/** model: begin */
import { ModelTodo } from '../model/todo.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'demo-todo.model.todo': ModelTodo;
  }
}
/** model: end */
/** api: begin */
export * from '../api/todo.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-demo-todo' {
  
        export interface ApiTodo {
          /** @internal */
          get scope(): ScopeModuleDemoTodo;
        }

        export interface ApiTodo {
          get $beanFullName(): 'demo-todo.api.todo';
          get $onionName(): 'demo-todo:todo';
          
        } 
}
/** api: end */
/** api: begin */
import { ApiTodo } from '../api/todo.js';
export interface IModuleApi {
  'todo': ApiTodo;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'demo-todo.api.todo': ApiTodo;
  }
}
/** api: end */
/** openapi: begin */

/** openapi: end */
/** controller: begin */
export * from '../page/item/controller.jsx';
export * from '../page/todo/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-demo-todo' {
  
        export interface ControllerPageItem {
          /** @internal */
          get scope(): ScopeModuleDemoTodo;
        }

        export interface ControllerPageTodo {
          /** @internal */
          get scope(): ScopeModuleDemoTodo;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerPageItem } from '../page/item/controller.jsx';
import { ControllerPageTodo } from '../page/todo/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'demo-todo.controller.pageItem': ControllerPageItem;
'demo-todo.controller.pageTodo': ControllerPageTodo;
  }
}
/** controller: end */
/** pages: begin */
export * from './page/item.js';
import { NSControllerPageItem } from './page/item.js';
export * from './page/todo.js';
export * from '../routes.js';
import { TypePagePathSchema } from 'zova-module-a-router';
import 'zova';
declare module 'zova-module-a-router' {
export interface IPagePathRecord {
  '/demo/todo/item/:id': TypePagePathSchema<NSControllerPageItem.ParamsInput,NSControllerPageItem.QueryInput>;
'/demo/todo/todo': TypePagePathSchema<undefined,undefined>;
}
export interface IPageNameRecord {
  'demo-todo:item': undefined;
}
}
export const pagePathSchemas = {

};
export const pageNameSchemas = {
'demo-todo:item': {
          params: NSControllerPageItem.paramsSchema,
          query: NSControllerPageItem.querySchema,
        },
};
declare module 'zova-module-demo-todo' {
  export interface ControllerPageItem {
        $params: NSControllerPageItem.ParamsOutput;
$query: NSControllerPageItem.QueryOutput;
      }
}
/** pages: end */

/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleDemoTodo extends BeanScopeBase {}

export interface ScopeModuleDemoTodo {
  util: BeanScopeUtil;
api: IModuleApi;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'demo-todo': ScopeModuleDemoTodo;
  }
  
  

  

  
}
  
/** scope: end */
