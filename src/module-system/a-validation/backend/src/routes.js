module.exports = app => {
  const routes = [
    { method: 'post', path: 'validation/schema', controller: 'validation' },
    { method: 'post', path: 'validation/validate', controller: 'validation' },
  ];
  return routes;
};
