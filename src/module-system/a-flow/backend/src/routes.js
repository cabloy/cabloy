module.exports = app => {
  const routes = [
    // flow
    { method: 'post', path: 'flow/select', controller: 'flow' },
    { method: 'post', path: 'flow/count', controller: 'flow' },
    // flowDef
    { method: 'post', path: 'flowDef/nodeBases', controller: 'flowDef' },
    { method: 'post', path: 'flowDef/edgeBases', controller: 'flowDef' },
  ];
  return routes;
};
