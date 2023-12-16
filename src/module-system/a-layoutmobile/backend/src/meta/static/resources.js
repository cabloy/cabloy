const moduleInfo = module.info;
module.exports = app => {
  const resources = [
    // tabbar buttons
    {
      atomName: 'WorkplaceTitle',
      atomStaticKey: 'buttonAppMenu',
      atomRevision: 1,
      atomCategoryId: 'a-layoutmobile:button.General',
      resourceType: 'a-layoutmobile:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonAppMenu',
        icon: { f7: ':outline:apps-outline' },
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Home',
      atomStaticKey: 'buttonAppHome',
      atomRevision: 0,
      atomCategoryId: 'a-layoutmobile:button.General',
      resourceType: 'a-layoutmobile:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonAppHome',
        icon: { f7: '::home' },
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Mine',
      atomStaticKey: 'buttonAppMine',
      atomRevision: 0,
      atomCategoryId: 'a-layoutmobile:button.General',
      resourceType: 'a-layoutmobile:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonAppMine',
        icon: { f7: '::person' },
        url: '/a/user/user/mine',
        fixed: true,
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Atom',
      atomStaticKey: 'buttonAtom',
      atomRevision: -1, // 2,
      atomCategoryId: 'a-layoutmobile:button.General',
      resourceType: 'a-layoutmobile:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonLink',
        icon: { f7: '::database' },
        url: '/a/basefront/atom/list',
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Search',
      atomStaticKey: 'buttonSearch',
      atomRevision: -1, // 0,
      atomCategoryId: 'a-layoutmobile:button.General',
      resourceType: 'a-layoutmobile:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonLink',
        icon: { f7: '::search' },
        url: '/a/basefront/atom/searchQuick',
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Mine',
      atomStaticKey: 'buttonMine',
      atomRevision: -1,
      atomCategoryId: 'a-layoutmobile:button.General',
      resourceType: 'a-layoutmobile:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonMine',
        icon: { f7: '::person' },
        url: '/a/user/user/mine',
        fixed: true,
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Home',
      atomStaticKey: 'buttonHome',
      atomRevision: -1,
      atomCategoryId: 'a-layoutmobile:button.General',
      resourceType: 'a-layoutmobile:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonLink',
        icon: { f7: '::home' },
        url: '/a/basefront/resource/tree',
      }),
      resourceRoles: 'root',
    },
  ];
  return resources;
};
