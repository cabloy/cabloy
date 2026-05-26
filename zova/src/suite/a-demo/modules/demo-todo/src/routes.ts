import type { IModuleRoute } from 'zova-module-a-router';

import { ZPageItem } from './.metadata/page/item.js';
import { ZPageTodo } from './.metadata/page/todo.js';

export const routes: IModuleRoute[] = [
  { path: 'todo', component: ZPageTodo },
  { name: 'item', path: 'item/:id', component: ZPageItem },
];
