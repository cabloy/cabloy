import { Api, BeanApiBase } from 'zova-module-a-api';

export interface ApiTodoEntity {
  id: string;
  title: string;
  done: boolean;
}

export type ApiTodoIntertBody = ApiTodoEntity;
export type ApiTodoUpdateBody = ApiTodoEntity;

@Api()
export class ApiTodo extends BeanApiBase {
  findAll() {
    return this.$fetch.get<any, ApiTodoEntity[]>('/demo/todo');
  }

  findOne(id: string) {
    return this.$fetch.get<any, ApiTodoEntity>(this.$pathTranslate('/demo/todo/{id}', { id }));
  }

  create(body: ApiTodoIntertBody) {
    return this.$fetch.post<any, void, ApiTodoIntertBody>('/demo/todo', body);
  }

  update(id: string, body: ApiTodoUpdateBody) {
    return this.$fetch.patch<any, void, ApiTodoUpdateBody>(
      this.$pathTranslate('/demo/todo/{id}', { id }),
      body,
    );
  }

  delete(id: string) {
    return this.$fetch.delete<any, void>(this.$pathTranslate('/demo/todo/{id}', { id }));
  }
}
