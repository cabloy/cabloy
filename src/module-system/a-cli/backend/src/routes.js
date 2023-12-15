module.exports = [
  // cli
  {
    method: 'post',
    path: 'cli/meta',
    controller: 'cli',
    meta: { authOpen: { enableAuthOpen: true, onlyAuthOpen: true } },
  },
  {
    method: 'post',
    path: 'cli/execute',
    controller: 'cli',
    meta: { authOpen: { enableAuthOpen: true, onlyAuthOpen: true } },
  },
];
