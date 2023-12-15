module.exports = [
  // dashboard
  { method: 'post', path: 'dashboard/itemByKey', controller: 'dashboard' },
  {
    method: 'post',
    path: 'dashboard/item',
    controller: 'dashboard',
    meta: { right: { type: 'resource', useKey: true } },
  },
  { method: 'post', path: 'dashboard/loadItemUser', controller: 'dashboard', meta: { auth: { user: true } } },
  { method: 'post', path: 'dashboard/saveItemUser', controller: 'dashboard', meta: { auth: { user: true } } },
  { method: 'post', path: 'dashboard/changeItemUserName', controller: 'dashboard', meta: { auth: { user: true } } },
  { method: 'post', path: 'dashboard/deleteItemUser', controller: 'dashboard', meta: { auth: { user: true } } },
  {
    method: 'post',
    path: 'dashboard/createItemUser',
    controller: 'dashboard',
    meta: { right: { type: 'resource', useKey: true } },
  },
  {
    method: 'post',
    path: 'dashboard/itemUsers',
    controller: 'dashboard',
    meta: { right: { type: 'resource', useKey: true } },
  },
  {
    method: 'post',
    path: 'dashboard/changeItemUserDefault',
    controller: 'dashboard',
    meta: { right: { type: 'resource', useKey: true } },
  },
];
