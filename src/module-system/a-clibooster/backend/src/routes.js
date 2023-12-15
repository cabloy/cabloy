module.exports = [
  {
    method: 'get',
    path: 'tools/demo',
    controller: 'tools',
    action: 'demo',
    meta: {
      right: { type: 'resource', module: 'a-clibooster', name: 'cliTools' },
      gate: { env: 'local' },
    },
  },
  {
    method: 'get',
    path: 'tools/demo/:method',
    controller: 'tools',
    action: 'demo',
    meta: {
      right: { type: 'resource', module: 'a-clibooster', name: 'cliTools' },
      gate: { env: 'local' },
    },
  },
];
