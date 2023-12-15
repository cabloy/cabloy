module.exports = [
  {
    method: 'post',
    path: 'share/generate',
    controller: 'share',
    meta: {
      auth: { user: true },
    },
  },
  { method: 'get', path: 'go/:uuid', controller: 'share', action: 'shareGo' },
];
