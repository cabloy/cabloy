module.exports = app => {
  const routes = [
    // flow
    { method: 'post', path: 'flow/data', controller: 'flow' },
    // task
    { method: 'post', path: 'task/select', controller: 'flowTask' },
    { method: 'post', path: 'task/count', controller: 'flowTask' },
    { method: 'post', path: 'task/claim', controller: 'flowTask', middlewares: 'transaction' },
    { method: 'post', path: 'task/complete', controller: 'flowTask', middlewares: 'transaction' },
    { method: 'post', path: 'task/appendHandleRemark', controller: 'flowTask' },
    { method: 'post', path: 'task/assignees', controller: 'flowTask' },
    { method: 'post', path: 'task/assigneesConfirmation', controller: 'flowTask', middlewares: 'transaction' },
    { method: 'post', path: 'task/recall', controller: 'flowTask', middlewares: 'transaction' },
    { method: 'post', path: 'task/cancelFlow', controller: 'flowTask', middlewares: 'transaction' },
    { method: 'post', path: 'task/viewAtom', controller: 'flowTask' },
    { method: 'post', path: 'task/editAtom', controller: 'flowTask' },
    { method: 'post', path: 'task/userSelectForward', controller: 'flowTask' },
    { method: 'post', path: 'task/forward', controller: 'flowTask' },
    { method: 'post', path: 'task/forwardRecall', controller: 'flowTask' },
    { method: 'post', path: 'task/userSelectSubstitute', controller: 'flowTask' },
    { method: 'post', path: 'task/substitute', controller: 'flowTask' },
    { method: 'post', path: 'task/substituteRecall', controller: 'flowTask' },
  ];
  return routes;
};
