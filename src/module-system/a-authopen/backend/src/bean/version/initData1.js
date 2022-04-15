// roleScopes
const roleScopes = [
  {
    atomName: 'OpenAuthScope',
    atomStaticKey: 'roleScope_openAuthScope',
    atomRevision: 0,
    description: '',
    system: 1,
    sorting: 0,
    roleTypeCode: 6,
    roleIdParent: 'authenticated',
    _roleRights: 'template.system',
  },
  {
    atomName: 'RoleScopeFull',
    atomStaticKey: 'roleScope_full',
    atomRevision: 0,
    description: '',
    system: 1,
    sorting: 0,
    roleTypeCode: 6,
    roleIdParent: 'OpenAuthScope',
    _roleRights: 'authenticated',
  },
  {
    atomName: 'RoleScopeCliDevelopment',
    atomStaticKey: 'roleScope_cli',
    atomRevision: 0,
    description: '',
    system: 1,
    sorting: 1,
    roleTypeCode: 6,
    roleIdParent: 'OpenAuthScope',
  },
];

module.exports = {
  roleScopes,
};
