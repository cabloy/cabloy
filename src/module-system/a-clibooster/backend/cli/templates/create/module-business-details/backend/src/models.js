const <%=argv.atomClassName%> = require('./model/<%=argv.atomClassName%>.js');
const <%=argv.atomClassName%>Detail = require('./model/<%=argv.atomClassName%>Detail.js');

module.exports = app => {
  const models = {
    <%=argv.atomClassName%>,
    <%=argv.atomClassName%>Detail,
  };
  return models;
};
