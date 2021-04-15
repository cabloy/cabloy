module.exports = app => {
  const routes = [
    // flowDef
    { method: 'post', path: 'flowDef/normalizeAssignees', controller: 'flowDef' },
  ];
  return routes;
};
