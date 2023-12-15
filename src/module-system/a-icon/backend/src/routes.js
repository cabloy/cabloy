module.exports = [
  // getIcons
  {
    method: 'post',
    path: 'icon/getIcons',
    controller: 'icon',
    meta: { right: { type: 'resource', module: 'a-icon', name: 'icons' } },
  },
];
