module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resourceMines = require('./mines.js')(app);
  let resources = [
    // function
    {
      atomName: 'Delete Comment',
      atomStaticKey: 'deleteComment',
      atomRevision: 0,
      atomCategoryId: 'a-base:function.Tools',
      resourceType: 'a-base:function',
      resourceConfig: null,
      resourceRoles: 'template.system',
    },
    // menu
    {
      atomName: 'Create Resource',
      atomStaticKey: 'createResource',
      atomRevision: -1,
      atomCategoryId: 'a-base:menu.BasicProfile',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'resource',
        atomAction: 'create',
      }),
      resourceIcon: ':outline:software-resource-outline',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
    },
    {
      atomName: 'GeneralResources',
      atomStaticKey: 'listResource',
      atomRevision: 3,
      atomCategoryId: 'a-base:menu.BasicProfile',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'resource',
        atomAction: 'read',
      }),
      resourceIcon: ':outline:software-resource-outline',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
    },
    {
      atomName: 'Comment List',
      atomStaticKey: 'listComment',
      atomRevision: -1,
      atomCategoryId: 'a-base:menu.Tools',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        actionPath: '/a/basefront/comment/all',
      }),
      resourceIcon: '::comment-dots',
      appKey: 'a-appbooster:appGeneral',
      resourceRoles: 'root',
    },
    {
      atomName: 'Developer Tool',
      atomStaticKey: 'developerTool',
      atomRevision: 4,
      atomCategoryId: 'a-base:menu.Tools',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        actionModule: 'a-basefront',
        actionComponent: 'developerTool',
        name: 'initialize',
      }),
      resourceIcon: '::developer-board',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
    },
  ];
  // mine
  resources = resources.concat(resourceMines);
  // ok
  return resources;
};
