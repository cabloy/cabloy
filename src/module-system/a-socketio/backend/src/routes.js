module.exports = app => {
  const routes = [
    // io
    { method: 'post', path: 'subscribe', controller: 'io', meta: { auth: { user: true } } },
    { method: 'post', path: 'unsubscribe', controller: 'io', meta: { auth: { user: true } } },
    // messageClass
    { method: 'post', path: 'messageClass/messageClass', controller: 'messageClass', meta: { auth: { user: true } } },
    // message
    { method: 'post', path: 'message/offset', controller: 'message', meta: { auth: { user: true } } },
    { method: 'post', path: 'message/select', controller: 'message', meta: { auth: { user: true } } },
    { method: 'post', path: 'message/count', controller: 'message', meta: { auth: { user: true } } },
    { method: 'post', path: 'message/setRead', controller: 'message', meta: { auth: { user: true } } },
    { method: 'post', path: 'message/delete', controller: 'message', meta: { auth: { user: true } } },
  ];
  return routes;
};
