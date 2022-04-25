const <%=argv.atomClassName%> = require('./model/<%=argv.atomClassName%>.js');

module.exports = app => {
  const models = {
    <%=argv.atomClassName%>,
  };
  return models;
};
