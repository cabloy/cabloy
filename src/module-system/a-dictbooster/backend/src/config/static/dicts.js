const countries = require('./dict/countries.js');
const citiesUSA = require('./dict/citiesUSA.js');
const citiesChina = require('./dict/citiesChina.js');

module.exports = app => {
  const dicts = [
    countries(app), //
    citiesUSA(app),
    citiesChina(app),
  ];
  return dicts;
};
