const moduleInfo = module.info;

const resources = [
  // menu
  {
    atomName: 'Create Post',
    atomStaticKey: 'createPost',
    atomRevision: -1,
    atomCategoryId: 'a-base:menu.General',
    resourceType: 'a-base:menu',
    resourceConfig: JSON.stringify({
      module: moduleInfo.relativeName,
      atomClassName: 'post',
      atomAction: 'create',
    }),
    resourceIcon: '::add',
    appKey: 'cms-sitecommunity:appCommunity',
    resourceRoles: 'template.cms-community-writer',
  },
  {
    atomName: 'Post List',
    atomStaticKey: 'listPost',
    atomRevision: -1,
    atomCategoryId: 'a-base:menu.General',
    resourceType: 'a-base:menu',
    resourceConfig: JSON.stringify({
      module: moduleInfo.relativeName,
      atomClassName: 'post',
      atomAction: 'read',
    }),
    resourceIcon: ':outline:data-list-outline',
    appKey: 'cms-sitecommunity:appCommunity',
    resourceRoles: 'root',
  },
];
module.exports = resources;
