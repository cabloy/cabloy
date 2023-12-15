module.exports = [
  // flow
  { method: 'post', path: 'flow/flowChartProcess', controller: 'flow' },
  // flowDef
  { method: 'post', path: 'flowDef/normalizeAssignees', controller: 'flowDef' },
  { method: 'post', path: 'flowDef/userSelect', controller: 'flowDef' },
];
