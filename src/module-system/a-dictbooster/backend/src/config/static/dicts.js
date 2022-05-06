const countries = require('./dict/countries.js');
const citiesUSA = require('./dict/citiesUSA.js');
const citiesChina = require('./dict/citiesChina.js');
const onlineStatus = require('./dict/onlineStatus.js');
const layoutType = require('./dict/layoutType.js');

module.exports = app => {
  const dicts = [
    countries(app), //
    citiesUSA(app),
    citiesChina(app),
    onlineStatus(app),
    layoutType(app),
  ];
  return dicts;
};
