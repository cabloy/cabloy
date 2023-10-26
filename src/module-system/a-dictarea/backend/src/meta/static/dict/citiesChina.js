const citiesChina = require('./cities/citiesChina.json');
module.exports = app => {
  const dictItems = citiesChina;
  const dictLocales = {};
  const dict = {
    atomName: 'Cities China',
    atomStaticKey: 'citiesChina',
    atomRevision: 0,
    description: '',
    dictItems: JSON.stringify(dictItems),
    dictLocales: JSON.stringify(dictLocales),
    resourceRoles: 'root',
  };
  return dict;
};
