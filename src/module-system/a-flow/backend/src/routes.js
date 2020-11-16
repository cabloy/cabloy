module.exports = app => {
  const routes = [
    // flow
    { method: 'post', path: 'flow/select', controller: 'flow' },
    { method: 'post', path: 'flow/count', controller: 'flow' },
  ];
  return routes;
};
