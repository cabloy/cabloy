module.exports = app => {
  const routes = [
    // flowDef
    { method: 'post', path: 'flowDef/enable', controller: 'flowDef',
      meta: { right: { type: 'atom', action: 101 } },
    },
    { method: 'post', path: 'flowDef/disable', controller: 'flowDef',
      meta: { right: { type: 'atom', action: 102 } },
    },
    // flow
    { method: 'post', path: 'flow/select', controller: 'flow' },
    { method: 'post', path: 'flow/count', controller: 'flow' },
  ];
  return routes;
};
