const <%=argv.atomClassName%> = require('./schema/<%=argv.atomClassName%>.js');
const <%=argv.atomClassName%>Detail = require('./schema/<%=argv.atomClassName%>Detail.js');

module.exports = app => {
  const schemas = {};
  // <%=argv.atomClassName%>
  Object.assign(schemas, <%=argv.atomClassName%>(app));
  // <%=argv.atomClassName%> detail
  Object.assign(schemas, <%=argv.atomClassName%>Detail(app));
  // ok
  return schemas;
};
