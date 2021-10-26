module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // tabbar buttons
    {
      atomName: 'Test',
      description: 'Tabbar Button: Test(Dingtalk)',
      atomStaticKey: 'buttonTest',
      atomRevision: 0,
      atomCategoryId: 'a-layoutmobile:button.General',
      resourceType: 'a-layoutmobile:button',
      resourceConfig: JSON.stringify({
        module: 'a-layoutmobile',
        component: 'buttonLink',
        icon: { material: 'group_work' },
        url: '/test/dingtalk/test/index',
      }),
      resourceRoles: 'root',
    },
  ];
  return resources;
};
