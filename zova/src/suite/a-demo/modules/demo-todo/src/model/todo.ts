import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

import type { ApiTodoIntertBody, ApiTodoUpdateBody } from '../api/todo.js';

export interface IModelOptionsTodo extends IDecoratorModelOptions {}

@Model<IModelOptionsTodo>()
export class ModelTodo extends BeanModelBase {
  findAll() {
    return this.$useStateData({
      queryKey: ['list'],
      queryFn: async () => {
        return this.scope.api.todo.findAll();
      },
    });
  }

  findOne(id?: string) {
    if (!id) return undefined;
    return this.$useStateData({
      queryKey: ['item', id],
      queryFn: async () => {
        return this.scope.api.todo.findOne(id);
      },
    });
  }

  create() {
    return this.$useMutationData<void, ApiTodoIntertBody>({
      mutationKey: ['create'],
      mutationFn: async body => {
        return this.scope.api.todo.create(body);
      },
      onSuccess: () => {
        this.$invalidateQueries({ queryKey: ['list'] });
      },
    });
  }

  update(id: string) {
    return this.$useMutationData<void, ApiTodoUpdateBody>({
      mutationKey: ['update', id],
      mutationFn: async body => {
        return this.scope.api.todo.update(id, body);
      },
      onSuccess: (_data, _params) => {
        this.$invalidateQueries({ queryKey: ['list'] });
        this.$invalidateQueries({ queryKey: ['item', id] });
      },
    });
  }

  delete(id: string) {
    return this.$useMutationData<void>({
      mutationKey: ['delete', id],
      mutationFn: async () => {
        return this.scope.api.todo.delete(id);
      },
      onSuccess: (_data, _params) => {
        this.$invalidateQueries({ queryKey: ['list'] });
        this.$invalidateQueries({ queryKey: ['item', id] });
      },
    });
  }
}
