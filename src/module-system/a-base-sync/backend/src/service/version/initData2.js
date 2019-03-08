// roles
const roles = {
  root: {
    roleName: 'root', leader: 0, catalog: 1, system: 1, sorting: 0, roleIdParent: 'system',
  },
  anonymous: {
    roleName: 'anonymous', leader: 0, catalog: 0, system: 1, sorting: 1, roleIdParent: 'root',
  },
  authenticated: {
    roleName: 'authenticated', leader: 0, catalog: 1, system: 1, sorting: 2, roleIdParent: 'root',
  },
  template: {
    roleName: 'template', leader: 0, catalog: 1, system: 1, sorting: 1, roleIdParent: 'authenticated',
  },
  system: {
    roleName: 'system', leader: 0, catalog: 0, system: 1, sorting: 1, roleIdParent: 'template',
  },
  registered: {
    roleName: 'registered', leader: 0, catalog: 0, system: 1, sorting: 2, roleIdParent: 'authenticated',
  },
  activated: {
    roleName: 'activated', leader: 0, catalog: 0, system: 1, sorting: 3, roleIdParent: 'authenticated',
  },
  superuser: {
    roleName: 'superuser', leader: 0, catalog: 0, system: 1, sorting: 4, roleIdParent: 'authenticated',
  },
  organization: {
    roleName: 'organization', leader: 0, catalog: 1, system: 1, sorting: 5, roleIdParent: 'authenticated',
  },
  internal: {
    roleName: 'internal', leader: 0, catalog: 1, system: 1, sorting: 1, roleIdParent: 'organization',
  },
  external: {
    roleName: 'external', leader: 0, catalog: 1, system: 1, sorting: 2, roleIdParent: 'organization',
  },
};

const users = {
  root: {
    item: {
      userName: 'root',
      realName: 'root',
      email: null,
      mobile: null,
      avatar: null,
      motto: null,
      locale: null,
    },
    roleId: 'superuser',
  },
};

module.exports = {
  roles,
  users,
};
