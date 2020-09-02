const eventAtomClassValidator = require('./bean/eventAtomClassValidator.js');

module.exports = app => {
  const beans = {
    'event.atomClassValidator': {
      mode: 'ctx',
      bean: eventAtomClassValidator,
    },
  };
  return beans;
};
