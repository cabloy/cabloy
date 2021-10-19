const citiesUSA = require('./dict/citiesUSA.js');

module.exports = app => {
  const dicts = [
    citiesUSA(app), //
  ];
  return dicts;
};
