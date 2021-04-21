module.exports = app => {
  const routes = [
    // flowDef
    { method: 'post', path: 'flowDef/normalizeAssignees', controller: 'flowDef' },
    { method: 'post', path: 'flowDef/roleChildren', controller: 'flowDef' },
    { method: 'post', path: 'flowDef/userSelect', controller: 'flowDef' },
    { method: 'post', path: 'flowDef/flowChartProcess', controller: 'flowDef' },
  ];
  return routes;
};
