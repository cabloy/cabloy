import { defineFakeRoute } from 'vite-plugin-fake-server-turbo/client';

let todos = [
  { id: 'xxx', title: 'Coding', done: false },
  { id: 'yyy', title: 'Running', done: true },
];

export default defineFakeRoute([
  {
    url: '/demo/todo',
    method: 'get',
    response: _req => {
      return {
        code: 0,
        message: 'Success',
        data: todos,
      };
    },
  },
  {
    url: '/demo/todo/{:id}',
    method: 'get',
    response: req => {
      const data = todos.find(item => item.id === req.params.id);
      if (!data) return { code: 404, message: 'Not Found' };
      return {
        code: 0,
        message: 'Success',
        data,
      };
    },
  },
  {
    url: '/demo/todo',
    method: 'post',
    response: req => {
      todos = [req.body as any].concat(todos);
      return {
        code: 0,
        message: 'Success',
      };
    },
  },
  {
    url: '/demo/todo/{:id}',
    method: 'patch',
    response: req => {
      todos = todos.concat();
      const index = todos.findIndex(item => item.id === req.params.id);
      if (index > -1) {
        todos.splice(index, 1, req.body as any);
      }
      return {
        code: 0,
        message: 'Success',
      };
    },
  },
  {
    url: '/demo/todo/{:id}',
    method: 'delete',
    response: req => {
      todos = todos.concat();
      const index = todos.findIndex(item => item.id === req.params.id);
      if (index > -1) {
        todos.splice(index, 1);
      }
      return {
        code: 0,
        message: 'Success',
      };
    },
  },
]);
