module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // tabbar buttons
    {
      atomName: 'Home',
      atomStaticKey: 'tabHome',
      atomRevision: 0,
      atomCategoryId: 'a-layoutmobile:tab.General',
      resourceType: 'a-layoutmobile:tab',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'tabLink',
        icon: { material: 'home' },
        url: '/a/basefront/resource/tree',
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Atom',
      atomStaticKey: 'tabAtom',
      atomRevision: 0,
      atomCategoryId: 'a-layoutmobile:tab.General',
      resourceType: 'a-layoutmobile:tab',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'tabLink',
        icon: { material: 'group_work' },
        url: '/a/basefront/atom/list',
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Mine',
      atomStaticKey: 'tabMine',
      atomRevision: 0,
      atomCategoryId: 'a-layoutmobile:tab.General',
      resourceType: 'a-layoutmobile:tab',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'tabLink',
        icon: { material: 'person' },
        url: '/a/user/user/mine',
      }),
      resourceRoles: 'root',
    },
  ];
  return resources;
};
