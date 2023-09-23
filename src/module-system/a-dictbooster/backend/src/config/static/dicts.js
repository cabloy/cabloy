const countries = require('./dict/countries.js');
const citiesUSA = require('./dict/citiesUSA.js');
const citiesChina = require('./dict/citiesChina.js');
const onlineStatus = require('./dict/onlineStatus.js');
const layoutType = require('./dict/layoutType.js');
const atomStateDefault = require('./dict/atomStateDefault.js');
const atomDisabled = require('./dict/atomDisabled.js');

module.exports = app => {
  const dicts = [
    countries(app), //
    citiesUSA(app),
    citiesChina(app),
    onlineStatus(app),
    layoutType(app),
    atomStateDefault(app),
    atomDisabled(app),
  ];
  return dicts;
};
