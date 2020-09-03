const eventAtomClassValidator = require('./bean/event.atomClassValidator.js');

module.exports = app => {
  const beans = {
    'event.atomClassValidator': {
      mode: 'ctx',
      bean: eventAtomClassValidator,
    },
  };
  return beans;
};
