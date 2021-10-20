const citiesCountry = require('./cities/citiesCountry.json');
module.exports = app => {
  const dictItems = citiesCountry;
  const dictLocales = {};
  const definition = {
    atomName: 'Countries',
    atomStaticKey: 'countries',
    atomRevision: 0,
    description: '',
    dictItems: JSON.stringify(dictItems),
    dictLocales: JSON.stringify(dictLocales),
    resourceRoles: 'root',
  };
  return definition;
};
