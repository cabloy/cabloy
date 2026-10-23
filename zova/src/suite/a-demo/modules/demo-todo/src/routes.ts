import type { IModuleRoute } from 'zova-module-a-router';

import { ZPageItem } from './.metadata/page/item.ts';
import { ZPageTodo } from './.metadata/page/todo.ts';

export const routes: IModuleRoute[] = [
  { path: 'todo', component: ZPageTodo, meta: { ssrProfile: 'session' } },
  { name: 'item', path: 'item/:id', component: ZPageItem, meta: { ssrProfile: 'session' } },
];
