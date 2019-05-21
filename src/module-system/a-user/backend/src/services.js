const user = require('./service/user.js');
const public2 = require('./service/public.js');

module.exports = app => {
  const services = {
    user,
    public: public2,
  };
  return services;
};
