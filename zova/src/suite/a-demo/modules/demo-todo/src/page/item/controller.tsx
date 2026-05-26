import { z } from 'zod';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZPage } from 'zova-module-home-base';

import { ModelTodo } from '../../model/todo.js';

export const ControllerPageItemSchemaParams = z.object({
  id: z.string(),
});
export const ControllerPageItemSchemaQuery = z.object({});

@Controller()
export class ControllerPageItem extends BeanControllerPageBase {
  @Use()
  $$modelTodo: ModelTodo;

  currentTodoId?: string;

  protected async __init__() {
    this.currentTodoId = this.$computed(() => {
      return this.$params.id;
    });
  }

  protected render() {
    const todoCurrent = this.$$modelTodo.findOne(this.currentTodoId);
    return (
      <ZPage>
        {todoCurrent?.data && (
          <div role="alert" class="alert alert-info">
            <div>
              Current:
              {todoCurrent?.data?.title}
            </div>
          </div>
        )}
        {!!todoCurrent?.error && (
          <div role="alert" class="alert alert-error">
            <span>{todoCurrent?.error?.message}</span>
          </div>
        )}
      </ZPage>
    );
  }
}
