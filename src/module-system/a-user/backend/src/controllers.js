const user = require('./controller/user.js');
const public2 = require('./controller/public.js');

module.exports = app => {
  const controllers = {
    user,
    public: public2,
  };
  return controllers;
};
