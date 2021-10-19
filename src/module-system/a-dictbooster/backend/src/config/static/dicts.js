const citiesUSA = require('./dict/citiesUSA.js');
const citiesChina = require('./dict/citiesChina.js');

module.exports = app => {
  const dicts = [
    citiesUSA(app), //
    citiesChina(app),
  ];
  return dicts;
};
