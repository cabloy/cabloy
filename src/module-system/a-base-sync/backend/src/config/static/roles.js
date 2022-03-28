module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const __rolesAll = [
    { atomName: 'root', roleTypeCode: 0 },
    { atomName: 'anonymous', roleTypeCode: 0 },
    { atomName: 'authenticated', roleTypeCode: 0 },
    { atomName: 'template', roleTypeCode: 5 },
    { atomName: 'system', roleTypeCode: 5 },
    { atomName: 'registered', roleTypeCode: 0 },
    { atomName: 'activated', roleTypeCode: 0 },
    { atomName: 'superuser', roleTypeCode: 0 },
    { atomName: 'organization', roleTypeCode: 1 },
    { atomName: 'internal', roleTypeCode: 1 },
    { atomName: 'external', roleTypeCode: 1 },
  ];
  const roles = [];
  for (const __role of __rolesAll) {
    roles.push({
      atomName: __role.atomName,
      atomStaticKey: `role_${__role.atomName}`,
      atomRevision: 1,
      description: '',
      roleTypeCode: __role.roleTypeCode,
      resourceRoles: 'template.system',
    });
  }
  // ok
  return roles;
};
