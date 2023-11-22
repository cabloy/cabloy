const citiesUSA = require('./cities/citiesUSA.json');
module.exports = app => {
  const dictItems = citiesUSA;
  const dictLocales = {};
  const dict = {
    atomName: 'Cities USA',
    atomStaticKey: 'citiesUSA',
    atomRevision: 1,
    description: '',
    dictMode: 1, // tree
    dictItems: JSON.stringify(dictItems),
    dictLocales: JSON.stringify(dictLocales),
    resourceRoles: 'root',
  };
  return dict;
};
