module.exports = [
  // authOpen
  {
    method: 'post',
    path: 'authOpen/hideClientSecret',
    controller: 'authOpen',
    meta: { right: { type: 'atom', atomClass: 'a-authopen:authOpen', action: 'hideClientSecret' } },
  },
  {
    method: 'post',
    path: 'authOpen/resetClientSecret',
    controller: 'authOpen',
    meta: { right: { type: 'atom', atomClass: 'a-authopen:authOpen', action: 'resetClientSecret' } },
  },
  // auth
  {
    method: 'post',
    path: 'auth/signin',
    controller: 'auth',
    meta: { auth: { enable: false } },
  },
];
