// roles
const roles = {
  builtIn: {
    roleName: 'builtIn',
    leader: 0,
    system: 1,
    sorting: 4, // force before organization
    roleIdParent: 'authenticated',
  },
};

module.exports = {
  roles,
};
