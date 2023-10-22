const <%=argv.atomClassName%> = require('./schema/<%=argv.atomClassName%>.js');

module.exports = app => {
  const schemas = {};
  // <%=argv.atomClassName%>
  Object.assign(schemas, <%=argv.atomClassName%>(app));
  // ok
  return schemas;
};
