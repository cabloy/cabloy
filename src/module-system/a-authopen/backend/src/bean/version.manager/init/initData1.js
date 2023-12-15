// roleScopes
const roleScopes = [
  {
    atomName: 'OpenAuthScope',
    atomStaticKey: 'roleOpenAuthScope',
    atomRevision: 0,
    description: '',
    system: 1,
    sorting: 0,
    roleTypeCode: 6,
    roleIdParent: 0, // 'authenticated',
    _roleRightsRead: null,
  },
  {
    atomName: 'RoleScopeFull',
    atomStaticKey: 'roleScopeFull',
    atomRevision: 0,
    description: '',
    system: 1,
    sorting: 0,
    roleTypeCode: 6,
    roleIdParent: 'OpenAuthScope',
    _roleRightsRead: 'authenticated',
  },
  {
    atomName: 'RoleScopeCliDevelopment',
    atomStaticKey: 'roleScopeCliDevelopment',
    atomRevision: 0,
    description: '',
    system: 1,
    sorting: 1,
    roleTypeCode: 6,
    roleIdParent: 'OpenAuthScope',
    _roleRightsRead: null,
  },
];

module.exports = {
  roleScopes,
};
