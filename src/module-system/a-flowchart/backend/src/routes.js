module.exports = app => {
  const routes = [
    // flowDef
    { method: 'post', path: 'flowDef/normalizeAssignees', controller: 'flowDef' },
    { method: 'post', path: 'flowDef/roleChildren', controller: 'flowDef' },
  ];
  return routes;
};
