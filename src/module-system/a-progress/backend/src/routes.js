module.exports = app => {
  const routes = [
    // progress
    { method: 'post', path: 'progress/check', controller: 'progress', meta: { auth: { user: true } } },
    { method: 'post', path: 'progress/abort', controller: 'progress', meta: { auth: { user: true } } },
    { method: 'post', path: 'progress/delete', controller: 'progress', meta: { auth: { user: true } } },
  ];
  return routes;
};
