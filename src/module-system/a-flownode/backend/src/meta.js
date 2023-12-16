module.exports = app => {
  const schemas = require('./meta/validation/schemas.js');
  const flowNodes = require('./meta/flow/nodes.js')(app);
  const flowEdges = require('./meta/flow/edges.js')(app);
  const meta = {
    base: {
      atoms: {},
    },
    validation: {
      validators: {},
      schemas,
    },
    flow: {
      nodes: flowNodes,
      edges: flowEdges,
    },
  };
  return meta;
};
