module.exports = app => {
  const routes = [
    // resource
    { method: 'post', path: 'resource/read', controller: 'resource' },
  ];
  return routes;
};
