module.exports = app => {
  const routes = [
    // flow
    { method: 'post', path: 'flow/data', controller: 'flow' },
    // task
    { method: 'post', path: 'task/select', controller: 'flowTask' },
    { method: 'post', path: 'task/count', controller: 'flowTask' },
    { method: 'post', path: 'task/claim', controller: 'flowTask', middlewares: 'transaction' },
    { method: 'post', path: 'task/complete', controller: 'flowTask', middlewares: 'transaction' },
    { method: 'post', path: 'task/assignees', controller: 'flowTask' },
    { method: 'post', path: 'task/assigneesConfirmation', controller: 'flowTask', middlewares: 'transaction' },
    { method: 'post', path: 'task/cancelFlow', controller: 'flowTask', middlewares: 'transaction' },
    { method: 'post', path: 'task/actions', controller: 'flowTask' },
    { method: 'post', path: 'task/viewAtom', controller: 'flowTask' },
  ];
  return routes;
};
