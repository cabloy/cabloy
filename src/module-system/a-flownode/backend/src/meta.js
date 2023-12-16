const schemas = require('./meta/validation/schemas.js');
const flowNodes = require('./meta/flow/nodes.js');
const flowEdges = require('./meta/flow/edges.js');
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
module.exports = meta;
