module.exports = {
  name: {
    desc: 'module name',
  },
  description: {
    desc: 'module description',
  },
  author: {
    desc: 'module author',
  },
  providerId: {
    desc: 'providerId',
    default(vars) {
      return vars.name.split('-')[0];
    },
  },
  atomClassName: {
    desc: 'atomClassName',
    default(vars) {
      return vars.name.split('-')[1];
    },
  },
  atomClassNameCapitalize: {
    desc: 'atomClassNameCapitalize',
    default(vars) {
      return vars.atomClassName.replace(/^\S/,function(s){return s.toUpperCase();});
    },
  },
};
