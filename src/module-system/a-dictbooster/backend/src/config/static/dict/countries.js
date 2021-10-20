const countries = require('./cities/countries.json');
module.exports = app => {
  const dictItems = countries;
  const dictLocales = {
    'zh-cn': {
      USA: '美国',
      China: '中国',
    },
  };
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
