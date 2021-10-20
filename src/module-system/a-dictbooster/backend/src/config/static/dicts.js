const citiesCountry = require('./dict/citiesCountry.js');
const citiesUSA = require('./dict/citiesUSA.js');
const citiesChina = require('./dict/citiesChina.js');

module.exports = app => {
  const dicts = [
    citiesCountry(app), //
    citiesUSA(app),
    citiesChina(app),
  ];
  return dicts;
};
