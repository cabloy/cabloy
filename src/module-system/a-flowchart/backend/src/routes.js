module.exports = app => {
  const routes = [
    // flowDef
    { method: 'post', path: 'flowDef/parseAssignees', controller: 'flowDef' },
  ];
  return routes;
};
