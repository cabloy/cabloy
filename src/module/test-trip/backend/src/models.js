const trip = require('./model/trip.js');

module.exports = app => {
  const models = {
    trip,
  };
  return models;
};
