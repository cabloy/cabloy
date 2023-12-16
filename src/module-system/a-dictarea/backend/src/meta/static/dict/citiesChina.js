const citiesChina = require('./cities/citiesChina.json');

const dictItems = citiesChina;
const dictLocales = {};
const dict = {
  atomName: 'Cities China',
  atomStaticKey: 'citiesChina',
  atomRevision: 3,
  description: '',
  dictMode: 1, // tree
  dictItems: JSON.stringify(dictItems),
  dictLocales: JSON.stringify(dictLocales),
  resourceRoles: 'root',
};
module.exports = dict;
