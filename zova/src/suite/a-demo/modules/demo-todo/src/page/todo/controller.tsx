import { RouterLink } from '@cabloy/vue-router';
import { withModifiers } from 'vue';
import { BeanControllerPageBase, Use, uuid } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { $QueryAutoLoad } from 'zova-module-a-model';
import { ZPage } from 'zova-module-home-base';

import type { ApiTodoEntity } from '../../api/todo.js';

import { ModelTodo } from '../../model/todo.js';

@Controller()
export class ControllerPageTodo extends BeanControllerPageBase {
  @Use()
  $$modelTodo: ModelTodo;

  newTitle: string;
  currentTodoId?: string;

  protected async __init__() {
    await $QueryAutoLoad(() => this.queryTodos);
  }

  get queryTodos() {
    return this.$$modelTodo.findAll();
  }

  get queryTodoCurrent() {
    return this.$$modelTodo.findOne(this.currentTodoId);
  }

  async addTodo() {
    const todo = {
      id: uuid(),
      title: this.newTitle,
      done: false,
    };
    await this.$$modelTodo.create().mutateAsync(todo);
    this.newTitle = '';
  }

  async completeTodo(item: ApiTodoEntity) {
    const todo = { ...item, title: `${item.title}!`, done: true };
    await this.$$modelTodo.update(item.id).mutateAsync(todo);
  }

  async deleteTodo(item: ApiTodoEntity) {
    await this.$$modelTodo.delete(item.id).mutateAsync();
  }

  protected render() {
    const queryTodoCurrent = this.queryTodoCurrent;
    const queryTodos = this.queryTodos;
    return (
      <ZPage>
        {queryTodoCurrent?.data && (
          <div role="alert" class="alert alert-success">
            <div>
              Current:{' '}
              <RouterLink
                to={this.$router.getPagePath('/demo/todo/item/:id', {
                  params: { id: queryTodoCurrent?.data?.id },
                })}
              >
                {queryTodoCurrent?.data?.title}
              </RouterLink>
            </div>
          </div>
        )}
        {!!queryTodoCurrent?.error && (
          <div role="alert" class="alert alert-error">
            <span>{queryTodoCurrent?.error?.message}</span>
          </div>
        )}
        <form>
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body flex-row">
              <input type="text" class="input w-full max-w-xs" v-model={this.newTitle}></input>
              <button
                class="btn btn-primary"
                type="submit"
                onClick={withModifiers(() => {
                  this.addTodo();
                }, ['prevent'])}
              >
                Create
              </button>
            </div>
          </div>
        </form>
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Done</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {queryTodos.data?.map(item => {
                return (
                  <tr>
                    <td>
                      <a
                        class="link link-primary"
                        href="#"
                        onClick={withModifiers(() => {
                          this.currentTodoId = item.id;
                        }, ['prevent'])}
                      >
                        {item.title}
                      </a>
                    </td>
                    <td>
                      {item.done && (
                        <input type="checkbox" checked={true} class="checkbox checkbox-success" />
                      )}
                    </td>
                    <td>
                      <button
                        class="btn btn-error btn-sm"
                        onClick={() => {
                          this.deleteTodo(item);
                        }}
                      >
                        Delete
                      </button>
                      {!item.done && (
                        <button
                          class="btn btn-success btn-sm"
                          onClick={() => {
                            this.completeTodo(item);
                          }}
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ZPage>
    );
  }
}
