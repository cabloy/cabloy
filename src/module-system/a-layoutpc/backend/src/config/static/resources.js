module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // panels
    {
      atomName: 'Menu',
      atomStaticKey: 'panelMenu',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:sidebarPanel.General',
      resourceType: 'a-layoutpc:sidebarPanel',
      resourceConfig: JSON.stringify({
        url: '/a/basefront/resource/tree',
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Atom',
      atomStaticKey: 'panelAtom',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:sidebarPanel.General',
      resourceType: 'a-layoutpc:sidebarPanel',
      resourceConfig: JSON.stringify({
        url: '/a/basefront/atom/list',
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Search',
      atomStaticKey: 'panelSearch',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:sidebarPanel.General',
      resourceType: 'a-layoutpc:sidebarPanel',
      resourceConfig: JSON.stringify({
        url: '/a/basefront/atom/searchQuick',
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Mine',
      atomStaticKey: 'panelMine',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:sidebarPanel.General',
      resourceType: 'a-layoutpc:sidebarPanel',
      resourceConfig: JSON.stringify({
        url: '/a/user/user/mine',
      }),
      resourceRoles: 'root',
    },
    // sections
    {
      atomName: 'Copyright',
      atomStaticKey: 'sectionCopyright',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:statusbarSection.General',
      resourceType: 'a-layoutpc:statusbarSection',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'sectionCopyright',
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Clock',
      atomStaticKey: 'sectionClock',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:statusbarSection.General',
      resourceType: 'a-layoutpc:statusbarSection',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'sectionClock',
      }),
      resourceRoles: 'root',
    },
    // header buttons
    {
      atomName: 'Home',
      atomStaticKey: 'buttonHome',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:headerButton.General',
      resourceType: 'a-layoutpc:headerButton',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonHome',
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Dashboard',
      atomStaticKey: 'buttonDashboard',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:headerButton.General',
      resourceType: 'a-layoutpc:headerButton',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonDashboard',
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Fullscreen',
      atomStaticKey: 'buttonFullscreen',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:headerButton.General',
      resourceType: 'a-layoutpc:headerButton',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonFullscreen',
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Mine',
      atomStaticKey: 'buttonMine',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:headerButton.General',
      resourceType: 'a-layoutpc:headerButton',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonMine',
      }),
      resourceRoles: 'root',
    },

  ];
  return resources;
};
